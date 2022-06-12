const subjects = document.querySelectorAll(".subjects");
const submit = document.getElementById("submit");

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

async function initially() {
  await db_data();
}
// initial setup
window.addEventListener("DOMContentLoaded", initially);
// generate pdf from table
submit.addEventListener("click", () => {
  if (window.confirm("Sure you need to generate a pdf?")) {
    window.jsPDF = window.jspdf.jsPDF;
    const doc = new window.jspdf.jsPDF({ orientation: "landscape" });

    doc.autoTable({ html: "#this_timetable" });
    doc.save("table.pdf");
  }
});
