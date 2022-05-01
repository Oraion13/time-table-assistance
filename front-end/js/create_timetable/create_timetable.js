const create_timetable_form = document.getElementById("create_timetable_form");
const academic_year_from = document.getElementById("academic_year_from");
const academic_year_to = document.getElementById("academic_year_to");
const semester = document.getElementById("semester");
const departments = document.getElementById('departments');
let department = 0;

// declare event listener for form
create_timetable_form.addEventListener("submit", create_timetable);
// event listener to fill the department selection list
window.addEventListener("DOMContentLoaded", setup_departments);

// setup the department selection list
function setup_departments() {
  const xhr = new XMLHttpRequest();

  xhr.open("GET", "../../../api/info/departments.php", true);

  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      const got = JSON.parse(xhr.responseText);

      if (got.error) {
        alert(got.error);
      } else {
        fill_departments(got);
      }
    }
  };
  xhr.send();
}

const fill_departments = (got) => {
  got.forEach((element) => {
    create_dept(
      element.department_id,
      element.department_id,
      element.department
    );
  });
};

// listener for the selected department
const clicked = (value) => {
  department = value;
}

const create_dept = (id, value, department) => {
  const element = document.createElement("div");
  element.classList.add("form-check");
  element.innerHTML = `
    <input
        class="form-check-input"
        type="radio"
        name="flexRadioDefault"
        id="dept-${id}"
        value="${value}"
        onclick="clicked(${value})"
    />
    <label class="form-check-label" for="dept-${id}">
        ${department} 
    </label>
`;

  departments.appendChild(element);
};

// POST a xhr req to create a time table
function create_timetable(e) {
  e.preventDefault();

  const timetable = {
    academic_year_from: academic_year_from.value,
    academic_year_to: academic_year_to.value,
    department_id: department,
    semester: semester.value,
  };

  const xhr = new XMLHttpRequest();

  xhr.open("POST", "../../../api/timetable/timetable.php", true);

  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      const got = JSON.parse(xhr.responseText);

      if (got.error) {
        alert(got.error);
      } else {
        window.localStorage.setItem('timetable', JSON.stringify(got));
        window.location.replace("./subjectallocation.html");
      }
    }
  };
  
  xhr.send(JSON.stringify(timetable));
}
