const subjects = document.querySelectorAll(".subjects");
const submit = document.getElementById("submit");

// get timetable from local storage
const get_timetable = () => {
  return window.localStorage.getItem("timetable")
    ? JSON.parse(window.localStorage.getItem("timetable"))
    : [];
};

// get subject_allocation from local storage
const get_subject_allocation = () => {
  return window.localStorage.getItem("subject_allocation_2")
    ? JSON.parse(window.localStorage.getItem("subject_allocation_2"))
    : [];
};

// set the subject allocation array in local storage
function set_subject_allocation() {
  return new Promise((resolve, reject) => {
    const timetable = get_timetable();

    const xhr = new XMLHttpRequest();

    // get subjects
    xhr.open(
      "GET",
      `../../../api/timetable/subject_allocation.php?ID=${timetable.timetable_id}`,
      true
    );

    xhr.onreadystatechange = async function () {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        const got = JSON.parse(xhr.responseText);

        if (got.error) {
          reject(alert(got.error));
        } else {
          window.localStorage.setItem(
            "subject_allocation_2",
            JSON.stringify(got)
          );

          await clear_subjects().then(() => {
            resolve(fill_subjects());
          });
        }
      }
    };

    xhr.send();
  });
}

// clear the select tag
const clear_subjects = () => {
  return new Promise((resolve, reject) => {
    subjects.forEach((subject, index, array) => {
      subject.innerHTML = `<option value="default" selected>Sub-code</option>`;

      if (index + 1 == array.length) {
        resolve();
      }
    });
  });
};

// fill the subject code in select tag
const fill_subjects = () => {
  return new Promise((resolve, reject) => {
    const sub_alloc = get_subject_allocation();
    sub_alloc.forEach((item, index, array) => {
      // check if there is contact periods available, if not then don't given an option to that subject
      if (item.contact_periods != 0) {
        append_subject(
          item.subject_allocation_id,
          item.subject_code,
          item.subject
        );
      }

      if (index + 1 === array.length) {
        resolve();
      }
    });
  });
};

// append a child element in the document list
const append_subject = (id, code, value) => {
  return new Promise((resolve, reject) => {
    subjects.forEach((item, index, array) => {
      const element = document.createElement("option");
      let attr = document.createAttribute("value");
      attr.value = id;
      element.setAttributeNode(attr);
      element.innerHTML = `${code}`;

      item.appendChild(element);

      item.addEventListener("change", fill_faculty);

      if (index + 1 == array.length) {
        resolve();
      }
    });
  });
};

// initially
async function initialize() {
  await set_subject_allocation();
}

// initialize
window.addEventListener("DOMContentLoaded", initialize);
// submit form
submit.addEventListener("click", submit_form);

// --------------------------------------------- modify/change subject allocation ------------------------- //

// modify the subject allocation array
const modify_subject_allocation = (arr, value, num) => {
  return arr.filter((item) => {
    console.log(item);
    if (item.subject_allocation_id == value) {
      item.contact_periods += num;
    }
    return item;
  });
};

// fill faculty name after selecting subject
function fill_faculty(e) {
  e.preventDefault();
  return new Promise(async (resolve, reject) => {
    // get the input tag near the selected subject tag
    const element = e.currentTarget.nextElementSibling;

    let sub_alloc = get_subject_allocation();

    // check if a subject is already present in the select tag (+1 contact periods)
    if (element.dataset.sid) {
      sub_alloc = modify_subject_allocation(sub_alloc, element.dataset.sid, 1);
    }

    // -1 contact periods
    sub_alloc = modify_subject_allocation(sub_alloc, e.currentTarget.value, -1);

    console.log(sub_alloc);

    const faculty = sub_alloc.find(
      (item) => item.subject_allocation_id == e.currentTarget.value
    ).faculty;

    // set the modified subject_allocation array
    window.localStorage.setItem(
      "subject_allocation_2",
      JSON.stringify(sub_alloc)
    );

    // set the subject_allocation_id in the input tag for later purpose
    if (!element.dataset.sid) {
      let sid = document.createAttribute("data-sid");
      sid.value = e.currentTarget.value;
      element.setAttributeNode(sid);
    } else {
      element.dataset.sid = e.currentTarget.value;
    }

    element.value = faculty;

    // recall the subject filler
    await clear_subjects().then(() => {
      resolve(fill_subjects());
    });
  });
}

// ------------------------------------------- submit form ----------------------------------------- //

function submit_form(e){
  e.preventDefault();

  let day = 0;
  let time = 0;

  let time_day = [];
}