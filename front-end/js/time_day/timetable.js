const subjects = document.querySelectorAll(".subjects");
const submit = document.getElementById("submit");
const generate_pdf = document.getElementById("generate_pdf");
const error_msg = document.getElementById("error_msg");
const home = document.getElementById("home");
const this_timetable = document.getElementById("this_timetable");

// fill data available from DB
const fill_time_day = (time_day) => {
  return new Promise(async (resolve, reject) => {
    // console.log(time_day);
    let sub_alloc = get_subject_allocation();
    time_day.forEach((item, index, array) => {
      // get the correct position in time table
      const e = subjects[(item.day - 1) * 8 + (item.time - 1)];
      const element = e.nextElementSibling;

      // -1 contact periods
      sub_alloc = modify_subject_allocation(
        sub_alloc,
        item.subject_allocation_id,
        -1
      );
      // set the modified subject_allocation array
      window.localStorage.setItem(
        "subject_allocation_2",
        JSON.stringify(sub_alloc)
      );

      // set all the required IDs
      let sid = document.createAttribute("data-sid");
      sid.value = item.subject_allocation_id;
      element.setAttributeNode(sid);

      let scode = document.createAttribute("data-scode");
      scode.value = item.subject_code;
      element.setAttributeNode(scode);

      let tdid = document.createAttribute("data-tdid");
      tdid.value = item.time_day_id;
      element.setAttributeNode(tdid);

      element.value = item.faculty;
      e.options[0].innerHTML = item.subject_code;

      if (index + 1 == array.length) {
        resolve();
      }
    });

    // recall the subject filler
    await clear_subjects().then(() => {
      fill_subjects();
    });
  });
};

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
          got.forEach(
            (item) => (item.contact_periods = Number(item.contact_periods))
          );
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
    // fill clear option
    subjects.forEach((item) => {
      const element = document.createElement("option");
      let attr = document.createAttribute("value");
      attr.value = "clear";
      element.setAttributeNode(attr);
      element.innerHTML = `Clear Period`;

      item.appendChild(element);

      item.addEventListener("change", fill_faculty);
    });
    // allocate the subjects
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

    // set the selected subject code
    subjects.forEach((item) => {
      if (item.nextElementSibling.dataset.scode) {
        item.options[0].innerHTML = item.nextElementSibling.dataset.scode;
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
  await db_data();
}

// initialize
window.addEventListener("DOMContentLoaded", initialize);
// submit form
submit.addEventListener("click", submit_form);
/// return to home page
home.addEventListener("click", () => {
  window.localStorage.removeItem("timetable");
  window.localStorage.removeItem("subject_allocation");
  window.localStorage.removeItem("subject_allocation_2");
  window.location.replace("./homepage.html");
});
// redirect to generate pdf
generate_pdf.addEventListener("click", () => {
  window.location.replace("./generatepdf.html");
});

// ------------------------------------- modify/change subject allocation ------------------------------------- //

// modify the subject allocation array
const modify_subject_allocation = (arr, value, num) => {
  return arr.filter((item) => {
    // console.log(item);
    if (item.subject_allocation_id == value) {
      item.contact_periods += num;
    }
    return item;
  });
};

// clear item
const clear_item = async (e, element) => {
  if (element.dataset.sid) {
    const attr = element.getAttributeNode("data-sid");
    element.removeAttributeNode(attr);
  }
  if (element.dataset.scode) {
    const attr = element.getAttributeNode("data-scode");
    element.removeAttributeNode(attr);
  }

  e.currentTarget.value = "default";
  e.currentTarget.options[0].innerHTML = "Sub-code";
  element.value = "";

  // console.log(element);

  // recall the subject filler
  await clear_subjects().then(() => {
    fill_subjects();
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
      // console.log("sid");
      sub_alloc = modify_subject_allocation(sub_alloc, element.dataset.sid, 1);
    }

    // if default value is selected
    if (e.currentTarget.value == "clear") {
      // console.log("clear");
      // set the modified subject_allocation array
      window.localStorage.setItem(
        "subject_allocation_2",
        JSON.stringify(sub_alloc)
      );

      // clear item
      clear_item(e, element);
      return;
    }

    // -1 contact periods
    sub_alloc = modify_subject_allocation(sub_alloc, e.currentTarget.value, -1);

    // console.log(sub_alloc);

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

    // set the subject code in the input tag for later purpose
    if (!element.dataset.scode) {
      let scode = document.createAttribute("data-scode");
      scode.value = e.currentTarget.options[e.currentTarget.selectedIndex].text;
      element.setAttributeNode(scode);
    } else {
      element.dataset.scode =
        e.currentTarget.options[e.currentTarget.selectedIndex].text;
    }

    // set the time_day_id only for new period
    if (!element.dataset.tdid) {
      let tdid = document.createAttribute("data-tdid");
      tdid.value = 0;
      element.setAttributeNode(tdid);
    }

    // console.log(element);

    element.value = faculty;

    // recall the subject filler
    await clear_subjects().then(() => {
      resolve(fill_subjects());
    });
  });
}

// ------------------------------------------------ submit form ------------------------------------------------ //

function submit_form(e) {
  e.preventDefault();

  let day = 0;
  let time = 0;

  let time_day = [];

  // traverse the days
  subjects.forEach((item, index) => {
    time = (time + 1) % 8 == 0 ? 8 : (time + 1) % 8;
    day = time == 1 ? day + 1 : day;

    // console.table("day", day, "time", time);
    // console.log("item", item);
    // console.log("sibling", item.nextElementSibling);
    // console.log("sibling sid", item.nextElementSibling.dataset.sid);
    // console.log("sibling sid", item.nextElementSibling.dataset.tdid);

    // push the allocated periods
    if (item.nextElementSibling.dataset.sid) {
      time_day.push({
        time_day_id: item.nextElementSibling.dataset.tdid,
        day,
        time,
        subject_allocation_id: item.nextElementSibling.dataset.sid,
      });
    }
  });

  // console.log(time_day);

  // submit
  const timetable = get_timetable();
  const xhr = new XMLHttpRequest();
  // post data
  xhr.open(
    "POST",
    `../../../api/timetable/time_day.php?ID=${timetable.timetable_id}`,
    true
  );

  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      const got = JSON.parse(xhr.responseText);

      if (got.error) {
        // alert(got.error);
        error_msg.innerHTML = got.error;
      } else {
        window.alert("updated successfully");
        error_msg.innerHTML = "";
        // console.log("allocated");
        if (!window.confirm("Redirect to homepage?")) {
          return;
        }

        window.localStorage.removeItem("timetable");
        window.localStorage.removeItem("subject_allocation_2");

        window.location.replace("./homepage.html");
      }
    }
  };

  xhr.send(JSON.stringify(time_day));
}

// ------------------------------------------- Get data from DB ------------------------------------------- //

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
