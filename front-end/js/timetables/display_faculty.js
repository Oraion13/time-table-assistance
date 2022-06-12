const departments = document.getElementById("departments");
const faculty = document.getElementById("faculty");

// *************************************** Setup Departments List ******************************************* //

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

// ****************************************** Setup Faculties List ******************************************* //

// get faculty
const get_faculties = (id) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    // get faculties
    xhr.open("GET", `../../../../api/info/faculties.php?dept=${id}`, true);

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
};

// Clena the faculty list
const clean_faculty = () => {
  return new Promise((resolve, reject) => {
    faculty.innerHTML =
      '<option value="default" selected>Choose Faculty...</option>';
    resolve();
  });
};

// setup faculties
const setup_faculty = () => {
  select_faculty(departments.value);
};

// select faculties by department
const select_faculty = (id) => {
  return new Promise(async (resolve, reject) => {
    // clean faculty
    await clean_faculty()
      .then(() => {
        return get_faculties(id);
      })
      .then((faculties) => {
        faculties.forEach((element, index, array) => {
          append_faculty(
            element.faculty_id,
            element.faculty_code,
            element.faculty
          );

          if (index + 1 === array.length) {
            resolve();
          }
        });
      });
  });
};

// append a child element in the document list
const append_faculty = (id, code, value) => {
  return new Promise((resolve, reject) => {
    const element = document.createElement("option");
    let attr = document.createAttribute("value");
    attr.value = id;
    element.setAttributeNode(attr);
    element.classList.add("faculty-dep");
    element.innerHTML = `${value}`;

    resolve(faculty.appendChild(element));
  });
};

// ***************************************** Initally ******************************************* //

// setup faculties and subjects
async function setup_subject_faculty() {
  await setup_departments();
}
window.addEventListener("DOMContentLoaded", setup_subject_faculty);

//choose department
departments.addEventListener("change", setup_faculty);
// fill faculties
document.getElementById("fill_faculty").addEventListener("click", () => {
    if(isNaN(Number(faculty.value))){
        window.alert("Choose a faculty!");
        return;
    }

    window.localStorage.setItem("faculty", JSON.stringify({
        faculty_id: Number(faculty.value),
        faculty_name: faculty.options[faculty.selectedIndex].text,
        department: departments.options[departments.selectedIndex].text,
    }));
    window.location.replace("../generatefacultypdf.html");
})