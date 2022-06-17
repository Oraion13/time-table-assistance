const subjects = document.querySelectorAll(".subjects");
const table_footer_body = document.getElementById("table_footer_body");
const submit = document.getElementById("submit");

// get department from local storage
const get_department = () => {
  return window.localStorage.getItem("department")
    ? JSON.parse(window.localStorage.getItem("department"))
    : {};
};

let alloc_subjects = [];

function strcmp(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

// fill data available from DB
const fill_time_day = (time_day) => {
  return new Promise(async (resolve, reject) => {
    time_day.forEach((item, index, array) => {
      // allocate subjects array
      alloc_subjects.find(
        (obj) => strcmp(obj.subject_code, item.subject_code) == 0
      )
        ? alloc_subjects
        : alloc_subjects.push(item);
      // get the correct position in time table
      const e = subjects[(item.day - 1) * 8 + (item.time - 1)];

      e.options[0].innerHTML = `${item.subject_code} - ${item.subject}`;

      if (index + 1 == array.length) {
        document.getElementById("academic_year").innerHTML = `${
          alloc_subjects[0].academic_year_from
        } - ${alloc_subjects[0].academic_year_from}
                                                                (${
                                                                  Number(
                                                                    alloc_subjects[0]
                                                                      .semester
                                                                  ) %
                                                                    2 ==
                                                                  0
                                                                    ? "Even Sem"
                                                                    : "Odd Sem"
                                                                })`;
        resolve(alloc_subjects);
      }
    });
  });
};

// get db
function db_data() {
  return new Promise((resolve, reject) => {
    const department = get_department();
    const xhr = new XMLHttpRequest();
    // get time_day
    xhr.open(
      "GET",
      `../../../api/info/lab_table.php?dept=${department.department_id}&cat=${department.category_id}`,
      true
    );

    xhr.onreadystatechange = function () {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        const got = JSON.parse(xhr.responseText);
        let labs = [];

        if (got.error) {
          reject(alert(got.error));
        } else {
          got.forEach((item, index, array) => {
            if (
              item.subject.toLowerCase().includes("laboratory") ||
              item.subject.toLowerCase().includes("project")
            ) {
              labs.push(item);
            }
            if (index + 1 == array.length) {
              resolve(labs);
            }
          });
        }
      }
    };

    xhr.send();
  });
}

// header
function setup_header() {
  const department = get_department();

  document.getElementById("department").innerHTML = department.department;
  //   document.getElementById("faculty_name").innerHTML = faculty.faculty_name;
}

function ordinal(n) {
  var s = ["th", "st", "nd", "rd"];
  var v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// get subject allocation table
function setup_footer(got) {
  table_footer_body.innerHTML = `
  <th>S.No.</th>
                <th>Course Code</th>
                <th>Course Title</th>
                <th>Class</th>
                <th>Name of the Faculty Member</th>`;
  got.forEach((item, index) => {
    const element = document.createElement("tr");
    element.innerHTML = `
     <th>${index + 1}</th>
                <td>${item.subject_code}</td>
                <td>${item.subject}</td>
                <td>${ordinal(Number(item.semester))} semester</td>
                <td>${item.faculty}</td>
     `;

    table_footer_body.appendChild(element);
  });
}

async function initial_setup() {
  if (!get_department().department_id) {
    window.location.replace("./timetables/displaylabtimetable.html");
  }

  setup_header();

  await db_data()
    .then((got) => fill_time_day(got))
    .then((got) => setup_footer(got));
}

// initially
window.addEventListener("DOMContentLoaded", initial_setup);
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
      bodyStyles: { lineColor: [255, 255, 255], valign: "middle", halign: "center", fontStyle: "bold" },
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
