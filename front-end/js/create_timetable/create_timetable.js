const create_timetable_form = document.getElementById("create_timetable_form");
const academic_year_from = document.getElementById("academic_year_from");
const academic_year_to = document.getElementById("academic_year_to");
const semester = document.getElementById("semester");
const departments = document.getElementById("departments");
const alert = document.querySelector(".alert");
const finish_later = document.getElementById("finish_later");
let department = 0;

// declare event listener for form
create_timetable_form.addEventListener("submit", create_timetable);
// event listener to fill the department selection list
window.addEventListener("DOMContentLoaded", setup_timetable);
// Finish later functionality
finish_later.addEventListener("click", finish_later_timetable);

// Setup the page
async function setup_timetable() {
  await setup_departments().then(() => {
    setup_items();
  });
}

// !!!Alert!!!
function display_alert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);
  // remove alert
  setTimeout(function () {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 4000);
}

// --------------------------------------- Local storage --------------------------------- //

// get the time table
function get_local_storage() {
  return window.localStorage.getItem("timetable")
    ? JSON.parse(window.localStorage.getItem("timetable"))
    : [];
}

// --------------------------------------- Initial setup ---------------------------------//

// get from local storage
function setup_items() {
  let item = get_local_storage();

  if (item.timetable_id) {
    fill_the_tags(
      item.timetable_id,
      item.academic_year_from,
      item.academic_year_to,
      item.department_id,
      item.semester
    );
  }
}

// Fill all the tags with existing data
const fill_the_tags = (
  timetable_id,
  academic_year_from_val,
  academic_year_to_val,
  department_id,
  semester_val
) => {
  academic_year_from.value = academic_year_from_val;
  academic_year_to.value = academic_year_to_val;
  semester.value = semester_val;
  departments.value = department_id;
};

// setup the department selection list
const setup_departments = () => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open("GET", "../../../api/info/departments.php", true);

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
const fill_departments = (got) => {
  return new Promise((resolve, reject) => {
    got.forEach((element, index, array) => {
      create_dept(element.department_id, element.department);

      if (index + 1 === array.length) {
        resolve();
      }
    });
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

// ----------------------------------------- Create/Edit time table ---------------------------- //

// POST a xhr req to create a time table
function create_timetable(e) {
  e.preventDefault();

  if (
    !academic_year_from.value ||
    !academic_year_to.value ||
    isNaN(departments.value) ||
    isNaN(semester.value)
  ) {
    display_alert("please fill all the fields", "danger");
    return;
  }

  const tt = get_local_storage();
  if (tt.timetable_id) {
    edit_timetable();
    return;
  }

  const timetable = {
    academic_year_from: academic_year_from.value,
    academic_year_to: academic_year_to.value,
    department_id: departments.value,
    semester: semester.value,
  };

  const xhr = new XMLHttpRequest();

  xhr.open("POST", "../../../api/timetable/timetable.php", true);

  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      const got = JSON.parse(xhr.responseText);

      if (got.error) {
        window.alert(got.error);
      } else {
        window.localStorage.setItem("timetable", JSON.stringify(got));
        window.location.replace("./subjectallocation.html");
      }
    }
  };

  xhr.send(JSON.stringify(timetable));
}

// PUT (UPDATE) an existing time table
const edit_timetable = () => {
  const tt = get_local_storage();
  // setup items
  const timetable = {
    timetable_id: tt.timetable_id,
    academic_year_from: academic_year_from.value,
    academic_year_to: academic_year_to.value,
    department_id: departments.options[departments.selectedIndex].value,
    semester: semester.value,
  };
  const xhr = new XMLHttpRequest();

  xhr.open(
    "PUT",
    `../../../api/timetable/timetable.php?ID=${tt.timetable_id}`,
    true
  );

  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      const got = JSON.parse(xhr.responseText);

      if (got.error) {
        window.alert(got.error);
      } else {
        window.localStorage.setItem("timetable", JSON.stringify(got));
        window.location.replace("./subjectallocation.html");
      }
    }
  };

  xhr.send(JSON.stringify(timetable));
};

// finish later functionality
function finish_later_timetable(e) {
  e.preventDefault();

  const tt = get_local_storage();

  const xhr = new XMLHttpRequest();

  if (tt.timetable_id) {
    xhr.open(
      "PUT",
      `../../../api/timetable/timetable.php?ID=${tt.timetable_id}`,
      true
    );
  } else {
    xhr.open("POST", `../../../api/timetable/timetable.php`, true);
  }

  const timetable = {
    academic_year_from: academic_year_from.value,
    academic_year_to: academic_year_to.value,
    department_id: departments.value,
    semester: semester.value,
  };

  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      const got = JSON.parse(xhr.responseText);

      if (got.error) {
        window.alert(got.error);
      } else {
        if (tt.timetable_id) {
          window.localStorage.removeItem("timetable");
        }

        window.location.replace("./homepage.html");
      }
    }
  };

  xhr.send(JSON.stringify(timetable));
}
