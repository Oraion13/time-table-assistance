const subject_allocation_form = document.getElementById(
  "subject_allocation_form"
);
const subject = document.getElementById("subject");
const faculty = document.getElementById("faculty");
const allocate = document.getElementById("allocate");
const allocated = document.getElementById("allocated");
const clear_all = document.getElementById("clear_all");
const alert = document.querySelector(".alert");

// edit option
let edit_element;
let edit_tag;
let edit_sub;
let edit_fac;
let edit_sub_index;
let edit_fac_index;
let edit_flag = false;
let edit_id = "";

// setup subject list and faculty list
window.addEventListener("DOMContentLoaded", setup_subject_faculty);
// add another subject
allocate.addEventListener("click", add_item);
// clear all allocated subjects
clear_all.addEventListener("click", clear_items);
// form submitted
subject_allocation_form.addEventListener("submit", subject_allocation);

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
          append_subject(
            element.subject_id,
            element.subject_code,
            element.subject
          );
        });
      }
    }
  };

  xhr.send();
};

// append a child element in the document list
const append_subject = (id, code, value) => {
  const element = document.createElement("option");
  let attr = document.createAttribute("value");
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
          append_faculty(
            element.faculty_id,
            element.faculty_code,
            element.faculty
          );
        });
      }
    }
  };

  xhr.send();
};

// append a child element in the document list
const append_faculty = (id, code, value) => {
  const element = document.createElement("option");
  let attr = document.createAttribute("value");
  attr.value = id;
  element.setAttributeNode(attr);
  element.innerHTML = `${code} - ${value}`;

  faculty.appendChild(element);
};

// setup faculties and subjects
async function setup_subject_faculty() {
  setup_subject();
  setup_faculty();
  setTimeout(() => {
    db_data();
  }, 2000);
}

// ------------------------------------------  Create, Delete, Update  --------------------------------- //

// Generate unique ID
function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
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

// clear items
function clear_items() {
  window.localStorage.removeItem("subject_allocation");
  const items = document.querySelectorAll(".subject-faculty");
  if (items.length > 0) {
    items.forEach(function (item) {
      allocated.removeChild(item);
    });
  }
  display_alert("removed all allocations", "danger");
  set_back_to_default();
}

// delete an item
function delete_item(e) {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;

  allocated.removeChild(element);
  display_alert("item removed", "danger");

  set_back_to_default();
  // remove from local storage
  remove_from_local_storage(id);
}

// edit an item
function edit_item(e) {
  const element = e.currentTarget.parentElement.parentElement;
  // set edit item
  edit_tag = element;
  edit_element = e.currentTarget.previousElementSibling;
  edit_sub = element.dataset.sub;
  edit_fac = element.dataset.fac;
  edit_sub_index = element.dataset.sub_index;
  edit_fac_index = element.dataset.fac_index;
  // set form value
  subject.value = edit_sub;
  faculty.value = edit_fac;
  edit_flag = true;
  edit_id = element.dataset.id;
  //
  allocate.textContent = "Edit";
}

// set backt to defaults
function set_back_to_default() {
  subject.value = "default";
  faculty.value = "default";
  edit_flag = false;
  edit_id = "";
  allocate.textContent = "Allocate";
}

// check for duplicates
function check_for_duplicates(sub, fac) {
  const items = get_local_storage();
  console.log(items);
  // traverse and find a combo
  return items && items.find((item) => sub == item.sub && fac == item.fac);
}

// add item to the list
function add_item(e) {
  e.preventDefault();

  // ------------------- create -------------------- //
  if (!isNaN(subject.value) && !isNaN(faculty.value) && !edit_flag) {
    // check for duplicates
    if (check_for_duplicates(subject.value, faculty.value)) {
      display_alert("subject already allocated", "warning");
      return;
    }

    const id = uuid();
    const element = document.createElement("article");
    let attr = document.createAttribute("data-id");
    attr.value = id;
    let sub = document.createAttribute("data-sub");
    sub.value = subject.value;
    let fac = document.createAttribute("data-fac");
    fac.value = faculty.value;
    let sub_index = document.createAttribute("data-sub_index");
    sub_index.value = subject.selectedIndex;
    let fac_index = document.createAttribute("data-fac_index");
    fac_index.value = faculty.selectedIndex;

    element.setAttributeNode(attr);
    element.setAttributeNode(sub);
    element.setAttributeNode(fac);
    element.setAttributeNode(sub_index);
    element.setAttributeNode(fac_index);
    element.classList.add("subject-faculty");

    element.innerHTML = `
    <p class="sub-fac"><span><b>${
      subject.options[subject.selectedIndex].text
    }</b> allocated for <b>${
      faculty.options[faculty.selectedIndex].text
    }</b></span>
    &ensp;
              <button type="button" class="edit-btn btn btn-warning">
                <i class="fas fa-edit"></i>
              </button>
              <button type="button" class="delete-btn btn btn-danger">
                <i class="fas fa-trash"></i>
              </button></p>
          `;
    // add event listeners to both buttons;
    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", delete_item);
    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", edit_item);

    // append child
    allocated.appendChild(element);
    // display alert
    display_alert("subject allocated", "success");
    // set local storage
    add_to_local_storage(
      id,
      subject.value,
      faculty.value,
      subject.selectedIndex,
      faculty.selectedIndex
    );
    // // set back to default
    set_back_to_default();
    // -------------- Edit ------------------- //
  } else if (!isNaN(subject.value) && !isNaN(faculty.value) && edit_flag) {
    // check for duplicates
    if (check_for_duplicates(subject.value, faculty.value)) {
      display_alert("subject already allocated", "warning");
    }

    edit_tag.dataset.sub = subject.value;
    edit_tag.dataset.fac = faculty.value;
    edit_tag.dataset.sub_index = subject.selectedIndex;
    edit_tag.dataset.fac_index = faculty.selectedIndex;

    edit_element.innerHTML = `<b>${
      subject.options[subject.selectedIndex].text
    }</b> allocated for <b>${faculty.options[faculty.selectedIndex].text}</b>`;
    display_alert("values changed", "success");

    // edit  local storage
    edit_local_storage(
      edit_id,
      subject.value,
      faculty.value,
      subject.selectedIndex,
      faculty.selectedIndex
    );
    set_back_to_default();
  } else {
    display_alert("please select both subject and faculty", "danger");
  }
}

// ------------------------------------------ Local Storage ------------------------------------------ //

// add to local storage
function add_to_local_storage(id, sub, fac, sub_index, fac_index) {
  const grocery = { id, sub, fac, sub_index, fac_index };
  let items = get_local_storage();
  items.push(grocery);
  window.localStorage.setItem("subject_allocation", JSON.stringify(items));
}

// get the allocated subjects
function get_local_storage() {
  return window.localStorage.getItem("subject_allocation")
    ? JSON.parse(window.localStorage.getItem("subject_allocation"))
    : [];
}

// remove from local storage
function remove_from_local_storage(id) {
  let items = get_local_storage();

  items = items.filter(function (item) {
    if (item.id != id) {
      return item;
    }
  });

  window.localStorage.setItem("subject_allocation", JSON.stringify(items));
}

// edit an element in local storage
function edit_local_storage(id, sub, fac, sub_index, fac_index) {
  let items = get_local_storage();

  items = items.map(function (item) {
    if (item.id == id) {
      item.sub = sub;
      item.fac = fac;
      item.sub_index = sub_index;
      item.fac_index = fac_index;
    }
    return item;
  });
  window.localStorage.setItem("subject_allocation", JSON.stringify(items));
  return;
}

// --------------------------------------- Setup Items after refresh ------------------------------------ //

// get from local storage
function setup_items() {
  let items = get_local_storage();

  if (items.length > 0) {
    items.forEach(function (item) {
      create_list_item(
        item.id,
        item.sub,
        item.fac,
        item.sub_index,
        item.fac_index
      );
    });
  }

  set_back_to_default();
}

// append te child element to html
function create_list_item(id, subval, facval, sub_indexval, fac_indexval) {
  const element = document.createElement("article");
  let attr = document.createAttribute("data-id");
  attr.value = id;
  let sub = document.createAttribute("data-sub");
  sub.value = subval;
  let fac = document.createAttribute("data-fac");
  fac.value = facval;
  let sub_index = document.createAttribute("data-sub_index");
  sub_index.value = sub_indexval;
  let fac_index = document.createAttribute("data-fac_index");
  fac_index.value = fac_indexval;

  element.setAttributeNode(attr);
  element.setAttributeNode(sub);
  element.setAttributeNode(fac);
  element.setAttributeNode(sub_index);
  element.setAttributeNode(fac_index);
  element.classList.add("subject-faculty");

  element.innerHTML = `
    <p class="sub-fac"><span><b>${subject.options[sub_indexval].text}</b> allocated for <b>${faculty.options[fac_indexval].text}</b></span>
    &ensp;
              <button type="button" class="edit-btn btn btn-warning">
                <i class="fas fa-edit"></i>
              </button>
              <button type="button" class="delete-btn btn btn-danger">
                <i class="fas fa-trash"></i>
              </button></p>
          `;
  // add event listeners to both buttons;
  const deleteBtn = element.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", delete_item);
  const editBtn = element.querySelector(".edit-btn");
  editBtn.addEventListener("click", edit_item);

  // append child
  allocated.appendChild(element);
}

// -------------------------------------------- submit form -------------------------------------------- //

function subject_allocation(e) {
  e.preventDefault();

  let subject_allocations = [];

  const sub_fac = JSON.parse(window.localStorage.getItem("subject_allocation"));
  const timetable = JSON.parse(window.localStorage.getItem("timetable"));

  if (sub_fac.length <= 0) {
    display_alert("please allocate subjects", "danger");
    return;
  }

  sub_fac.forEach((elem) => {
    subject_allocations.push({
      subject_allocation_id: isNaN(elem.id) ? 0 : elem.id,
      subject_id: elem.sub,
      faculty_id: elem.fac,
    });
  });

  const xhr = new XMLHttpRequest();

  xhr.open(
    "POST",
    `../../../api/timetable/subject_allocation.php?ID=${timetable.timetable_id}`,
    true
  );

  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      const got = JSON.parse(xhr.responseText);

      if (got.error) {
        display_alert(got.error, "danger");
      } else {
        if (got.length !== 0) {
          db_data();
        }
        window.location.replace("./timetable.html");
      }
    }
  };

  xhr.send(JSON.stringify(subject_allocations));
}

// ------------------------------------------- Data from DB ---------------------------------------------- //

const db_data = () => {
  const timetable = JSON.parse(window.localStorage.getItem("timetable"));

  const xhr = new XMLHttpRequest();

  xhr.open(
    "GET",
    `../../../api/timetable/subject_allocation.php?ID=${timetable.timetable_id}`,
    true
  );

  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      const got = JSON.parse(xhr.responseText);

      if (got.error) {
        display_alert(got.error, "danger");
      } else {
        let items = [];
        if (got.length !== 0) {
          got.forEach((elem) => {
            let sub_index = 0;
            let fac_index = 0;

            for (i in subject.options) {
              if (subject.options[i].value == elem.subject_id) {
                sub_index = i;
              }
            }

            for (i in faculty.options) {
              if (faculty.options[i].value == elem.faculty_id) {
                fac_index = i;
              }
            }

            items.push({
              id: elem.subject_allocation_id,
              sub: elem.subject_id,
              fac: elem.faculty_id,
              sub_index: Number(sub_index),
              fac_index: Number(fac_index),
            });
          });
          window.localStorage.setItem(
            "subject_allocation",
            JSON.stringify(items)
          );
        }
      }
    }
  };

  setup_items();
  xhr.send();
};
