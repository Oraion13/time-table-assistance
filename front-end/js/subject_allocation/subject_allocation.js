const subject_allocation_form = document.getElementById(
  "subject_allocation_form"
);
const subject = document.getElementById("subject");
const faculty = document.getElementById("faculty");
const add_another = document.ge

// setup subject list and faculty list
window.addEventListener("DOMContentLoaded", setup_subject_faculty);

// get timetable from local storage
const get_timetable = () => {
  return window.localStorage.getItem("timetable")
    ? JSON.parse(window.localStorage.getItem("timetable"))
    : [];
};

// setup subjects
const setup_subject = (subjects) => {
  const timetable = get_timetable();

  const xhr = new XMLHttpRequest();

  // get subjects
  xhr.open(
    "GET",
    `../../../api/info/subjects.php?dept=${timetable.department_id}&sem=${timetable.semester}`,
    true
  );

  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      const got = JSON.parse(xhr.responseText);

      if (got.error) {
        alert(got.error);
      } else {
        got.forEach((element) => {
          append_subject(element.subject_id, element.subject_code, element.subject);
        });
      }
    }
  };

  xhr.send();
};

// append a child element in the document list
const append_subject = (id, code, value) => {
  const element = document.createElement("option");
  let attr = document.createAttribute("id");
  attr.value = id;
  element.setAttributeNode(attr);
  element.innerHTML = `${code} - ${value}`;

  subject.appendChild(element);
};

// setup faculties
const setup_faculty = (faculties) => {
  const timetable = get_timetable();

  const xhr = new XMLHttpRequest();
  // get faculties
  xhr.open(
    "GET",
    `../../../api/info/faculties.php?dept=${timetable.department_id}`,
    true
  );

  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      const got = JSON.parse(xhr.responseText);

      if (got.error) {
        alert(got.error);
      } else {
        got.forEach((element) => {
          append_faculty(element.faculty_id, element.faculty_code, element.faculty);
        });
      }
    }
  };

  xhr.send();
};

// append a child element in the document list
const append_faculty = (id, code, value) => {
  const element = document.createElement("option");
  let attr = document.createAttribute("id");
  attr.value = id;
  element.setAttributeNode(attr);
  element.innerHTML = `${code} - ${value}`;

  faculty.appendChild(element);
};

// setup faculties and subjects
function setup_subject_faculty() {
  setup_subject();
  setup_faculty();
}
