const departments = document.getElementById("departments");
const category = document.getElementById("category");

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

// ************************************* Setup Categories List ****************************************** //

// setup the category selection list
const setup_categories = () => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
  
      xhr.open("GET", "../../../../api/info/categories.php", true);
  
      xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
          const got = JSON.parse(xhr.responseText);
  
          if (got.error) {
            reject(window.alert(got.error));
          } else {
            resolve(fill_categories(got));
          }
        }
      };
      xhr.send();
    });
  };
  
  // Fill the categories select tag
  const fill_categories = async (got) => {
    await got.forEach((element) => {
      create_categories(
        element.category_id,
        element.category,
        element.category_name
      );
    });
  };
  
  // Options for categories select tag
  const create_categories = (id, cat, cat_name) => {
    return new Promise((resolve, reject) => {
      const element = document.createElement("option");
      let attr = document.createAttribute("value");
      attr.value = id;
      element.setAttributeNode(attr);
      element.innerHTML = `${cat_name} (${cat})`;
  
      resolve(category.appendChild(element));
    });
  };
  

// ***************************************** Initally ******************************************* //

// setup faculties and subjects
async function setup_subject_faculty() {
  await setup_departments();
  await setup_categories();
}
window.addEventListener("DOMContentLoaded", setup_subject_faculty);

// fill faculties
document.getElementById("fill_faculty").addEventListener("click", () => {
  if (isNaN(Number(departments.value)) || isNaN(Number(category.value))) {
    window.alert("Choose a department!");
    return;
  }

  window.localStorage.setItem(
    "department",
    JSON.stringify({
      department_id: Number(departments.value),
      department: departments.options[departments.selectedIndex].text,
      category_id: Number(category.value),
      category: category.options[category.selectedIndex].text,
    })
  );
  window.location.replace("../generatelabpdf.html");
});
