const subjects = document.querySelectorAll(".subjects");

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

const fill_subjects = () => {
  return new Promise((resolve, reject) => {
    const timetable = get_timetable();

    const xhr = new XMLHttpRequest();

    // get subjects
    xhr.open(
      "GET",
      `../../../api/timetable/subject_allocation.php?ID=${timetable.timetable_id}`,
      true
    );

    xhr.onreadystatechange = function () {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        const got = JSON.parse(xhr.responseText);

        if (got.error) {
          reject(alert(got.error));
        } else {
          window.localStorage.setItem("subject_allocation_2", JSON.stringify(got));
          got.forEach((element, index, array) => {
            append_subject(
              element.subject_allocation_id,
              element.subject_code,
              element.subject
            );

            if (index + 1 === array.length) {
              resolve();
            }
          });
        }
      }
    };

    xhr.send();
  });
}

// fille faculty name after selecting subject
function fill_faculty(e){
  e.preventDefault();

  const element = e.currentTarget.nextElementSibling;

  const sub_alloc = get_subject_allocation();

  const faculty = sub_alloc.find(item => item.subject_allocation_id == e.currentTarget.value).faculty;
  
  element.value = faculty;
}

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

      if(index + 1 == array.length){
        resolve();
      }
    });
  });
};

// initially
async function initialize(){
  await fill_subjects();
}

window.addEventListener("DOMContentLoaded", initialize);
