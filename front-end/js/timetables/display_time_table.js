const timetables = document.getElementById("timetables");
const departments = document.getElementById("departments");
const semester = document.getElementById("semester");

// setup the department selection list
const setup_departments = () => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open("GET", "../../../../api/info/departments.php", true);

    xhr.onreadystatechange = function () {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        const got = JSON.parse(xhr.responseText);

        if (got.error) {
          reject(window.alert(got.error));
        } else {
          resolve(fill_departments(got));
        }
      }
    };
    xhr.send();
  });
};

// Fill the departments select tag
const fill_departments = async (got) => {
  await got.forEach((element) => {
    create_dept(element.department_id, element.department);
  });
};

// Options for departments select tag
const create_dept = (id, department) => {
  return new Promise((resolve, reject) => {
    const element = document.createElement("option");
    let attr = document.createAttribute("value");
    attr.value = id;
    element.setAttributeNode(attr);
    element.innerHTML = `${department}`;

    resolve(departments.appendChild(element));
  });
};

function setup_timetable(e) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    if (isNaN(Number(departments.value)) && isNaN(Number(semester.value))) {
      xhr.open("GET", "../../../../api/timetable/timetable.php", true);
    } else if (isNaN(Number(departments.value))) {
      xhr.open(
        "GET",
        `../../../../api/timetable/timetable.php?sem=${semester.value}`,
        true
      );
    } else if (isNaN(Number(semester.value))) {
      xhr.open(
        "GET",
        `../../../../api/timetable/timetable.php?dept=${departments.value}`,
        true
      );
    } else {
      xhr.open(
        "GET",
        `../../../../api/timetable/timetable.php?sem=${semester.value}&dept=${departments.value}`,
        true
      );
    }

    xhr.onreadystatechange = function () {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        const got = JSON.parse(xhr.responseText);

        if (got.error) {
          reject(window.alert(got.error));
        } else {
          resolve(fill_timetable(got));
        }
      }
    };
    xhr.send();
  });
}

const fill_timetable = (arr) => {
  timetables.innerHTML = "";
  arr.forEach((item) => {
    const element = document.createElement("div");

    element.classList.add("shadow-lg");
    element.classList.add("p-3");
    element.classList.add("mb-5");
    element.classList.add("bg-white");
    element.classList.add("rounded");

    let attr = document.createAttribute("data-id");
    attr.value = item.timetable_id;

    element.setAttributeNode(attr);

    element.innerHTML = `${item.academic_year_from} - ${item.academic_year_to}, ${item.department} - semester
    - ${item.semester}
    <button type="button" class="edit-btn btn btn-warning">
                View
                </button>`;

    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", view_item);

    timetables.appendChild(element);
  });
};

function view_item(e) {
  e.preventDefault();
  const element = e.currentTarget.parentElement;

  const xhr = new XMLHttpRequest();

  xhr.open(
    "GET",
    `../../../../api/timetable/timetable.php?ID=${element.dataset.id}`,
    true
  );

  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      const got = JSON.parse(xhr.responseText);

      if (got.error) {
        reject(window.alert(got.error));
      } else {
        window.localStorage.setItem("timetable", JSON.stringify(got));
        window.location.replace("../generatepdf.html");
      }
    }
  };
  xhr.send();
}

function initialize() {
  setup_departments();
  setup_timetable();
}

departments.addEventListener("change", setup_timetable);
semester.addEventListener("change", setup_timetable);
//
window.addEventListener("DOMContentLoaded", initialize);
