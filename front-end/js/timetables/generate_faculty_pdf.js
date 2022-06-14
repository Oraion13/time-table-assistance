const subjects = document.querySelectorAll(".subjects");
const table_footer_body = document.getElementById("table_footer_body");
const submit = document.getElementById("submit");

// get faculty from local storage
const get_faculty = () => {
  return window.localStorage.getItem("faculty")
    ? JSON.parse(window.localStorage.getItem("faculty"))
    : {};
};

let alloc_subjects = [];

// fill data available from DB
const fill_time_day = (time_day) => {
  return new Promise(async (resolve, reject) => {
    time_day.forEach((item, index, array) => {
      // allocate subjects array
      alloc_subjects.find((obj) => obj.subject_code == item.subject_code)
        ? alloc_subjects
        : alloc_subjects.push(item);
      // get the correct position in time table
      const e = subjects[(item.day - 1) * 8 + (item.time - 1)];

      e.options[0].innerHTML = item.subject_code;

      if (index + 1 == array.length) {
        resolve(alloc_subjects);
      }
    });
  });
};

// get db
function db_data() {
  return new Promise((resolve, reject) => {
    const faculty = get_faculty();
    const xhr = new XMLHttpRequest();
    // get time_day
    xhr.open(
      "GET",
      `../../../api/info/faculty_table.php?faculty=${faculty.faculty_id}`,
      true
    );

    xhr.onreadystatechange = function () {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        const got = JSON.parse(xhr.responseText);

        if (got.error) {
          reject(alert(got.error));
        } else {
          resolve(got);
        }
      }
    };

    xhr.send();
  });
}

// header
function setup_header() {
  const faculty = get_faculty();

  document.getElementById("department").innerHTML = faculty.department;
  document.getElementById("faculty_name").innerHTML = faculty.faculty_name;
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
                <th>Contact Periods</th>
                <th>Name of the Faculty Member</th>`;
  got.forEach((item, index) => {
    const element = document.createElement("tr");
    element.innerHTML = `
     <th>${index + 1}</th>
                <td>${item.subject_code}</td>
                <td>${item.subject}</td>
                <td>${item.contact_periods}</td>
                <td>${ordinal(Number(item.semester))} semester - ${
      item.department
    }</td>
     `;

    table_footer_body.appendChild(element);
  });
}

async function initial_setup() {
  if (!get_faculty().faculty_id) {
    window.location.replace("./timetables/displayfacultytimetable.html");
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
      doc.save("table.pdf");
    }
  });