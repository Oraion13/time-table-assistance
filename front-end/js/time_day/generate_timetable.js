const subjects = document.querySelectorAll(".subjects");
const submit = document.getElementById("submit");
const department = document.getElementById("department");
const table_footer_body = document.getElementById("table_footer_body");

// ------------------------------------------- Get data from DB ------------------------------------------- //
// get timetable from local storage
const get_timetable = () => {
  return window.localStorage.getItem("timetable")
    ? JSON.parse(window.localStorage.getItem("timetable"))
    : [];
};

// fill data available from DB
const fill_time_day = (time_day) => {
  return new Promise(async (resolve, reject) => {
    time_day.forEach((item, index, array) => {
      // get the correct position in time table
      const e = subjects[(item.day - 1) * 8 + (item.time - 1)];

      e.options[0].innerHTML = item.subject_code;

      if (index + 1 == array.length) {
        resolve();
      }
    });
  });
};

// get db
function db_data() {
  return new Promise((resolve, reject) => {
    const timetable = get_timetable();
    const xhr = new XMLHttpRequest();
    // get time_day
    xhr.open(
      "GET",
      `../../../api/timetable/time_day.php?ID=${timetable.timetable_id}`,
      true
    );

    xhr.onreadystatechange = function () {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        const got = JSON.parse(xhr.responseText);

        if (got.error) {
          reject(alert(got.error));
        } else {
          resolve(fill_time_day(got));
        }
      }
    };

    xhr.send();
  });
}

// ------------------------------- Header ------------------------------------- //

function integer_to_roman(num) {
  if (typeof num !== "number") return false;

  var digits = String(+num).split(""),
    key = [
      "",
      "C",
      "CC",
      "CCC",
      "CD",
      "D",
      "DC",
      "DCC",
      "DCCC",
      "CM",
      "",
      "X",
      "XX",
      "XXX",
      "XL",
      "L",
      "LX",
      "LXX",
      "LXXX",
      "XC",
      "",
      "I",
      "II",
      "III",
      "IV",
      "V",
      "VI",
      "VII",
      "VIII",
      "IX",
    ],
    roman_num = "",
    i = 3;
  while (i--) roman_num = (key[+digits.pop() + i * 10] || "") + roman_num;
  return Array(+digits.join("") + 1).join("M") + roman_num;
}

function setup_header() {
  const timetable = get_timetable();

  department.innerHTML = timetable.department;

  document.getElementById(
    "academic_year"
  ).innerHTML = `${timetable.academic_year_from} - ${timetable.academic_year_to}`;

  document.getElementById("department1").innerHTML = `${timetable.department}`;

  document.getElementById("semester").innerHTML = `${integer_to_roman(
    timetable.semester
  )}`;

  document.getElementById("regulation").innerHTML = `${timetable.regulation}`;

  document.getElementById("room_no").innerHTML = `${timetable.room_no}`;

  document.getElementById("period").innerHTML = `${timetable.period}`;

  document.getElementById(
    "with_effect_from"
  ).innerHTML = `${timetable.with_effect_from}`;

  document.getElementById(
    "faculty_name"
  ).innerHTML = `${timetable.class_advisor}`;

  document.getElementById(
    "class_committee_chairperson"
  ).innerHTML = `${timetable.class_committee_chairperson}`;

  document.getElementById("semester").innerHTML = `${integer_to_roman(
    Number(timetable.semester)
  )}`;
}

// fill subject allocation table at footer
const fill_table_footer_body = (got) => {
  table_footer_body.innerHTML = `
  <th>S.No.</th>
                <th>Course Code</th>
                <th>Course Title</th>
                <th>Contact Periods</th>
                <th>Name of the Faculty Member</th>`;
  got.forEach((item, index) => {
    const element = document.createElement("tr");
    element.innerHTML = `
     <th>${index + 1}</th>
                <td>${item.subject_code}</td>
                <td>${item.subject}</td>
                <td>${item.contact_periods}</td>
                <td>${item.faculty}</td>
     `;

    table_footer_body.appendChild(element);
  });
};

// get subject allocation table
function setup_footer() {
  const timetable = get_timetable();
  const xhr = new XMLHttpRequest();
  // get time_day
  xhr.open(
    "GET",
    `../../../api/timetable/subject_allocation.php?ID=${timetable.timetable_id}`,
    true
  );

  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      const got = JSON.parse(xhr.responseText);

      if (got.error) {
        alert(got.error);
      } else {
        fill_table_footer_body(got);
      }
    }
  };

  xhr.send();
}

// initial setup
async function initially() {
  await db_data();
  setup_header();
  setup_footer();
}

// initial setup
window.addEventListener("DOMContentLoaded", initially);
// generate pdf from table
submit.addEventListener("click", () => {
  if (window.confirm("Sure you need to generate a pdf?")) {
    window.jsPDF = window.jspdf.jsPDF;
    const doc = new window.jspdf.jsPDF({ orientation: "landscape" });

    // Header
    doc.autoTable({
      html: "#timetable_header",
      theme: "grid",
      bodyStyles: { lineColor: [0, 0, 0], valign: "middle", halign: "center" },
      headStyles: {
        valign: "middle",
        halign: "center",
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
      },
    });

    // Body
    doc.autoTable({
      html: "#this_timetable",
      theme: "grid",
      bodyStyles: { lineColor: [0, 0, 0], valign: "middle", halign: "center" },
    });

    // Footer
    doc.autoTable({
      html: "#timetable_footer",
      theme: "grid",
      bodyStyles: { lineColor: [0, 0, 0], valign: "middle", halign: "center" },
    });

    // Footer
    doc.autoTable({
      html: "#sign_footer",
      theme: "grid",
      bodyStyles: { lineColor: [255, 255, 255], valign: "middle", halign: "center" },
      columnStyles: {
        0: { cellPadding: 13 },
        1: { cellPadding: 13  },
        2: { cellPadding: 13  },
        3: { cellPadding: 13  },
        4: { cellPadding: 13  },
      },
    });

    doc.save("table.pdf");
  }
});
