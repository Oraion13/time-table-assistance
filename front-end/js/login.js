const login_form = document.getElementById("login_form");
const staffId = document.getElementById("staffId");
const password = document.getElementById("password");

login_form.addEventListener("submit", login);

function login(e) {
  e.preventDefault();

  const Login = {
    admin_name: staffId.value,
    password: password.value,
  };

  // console.log(Login);

  const xhr = new XMLHttpRequest();
  xhr.open("POST", "../../../api/login/login.php", true);

  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      const got = JSON.parse(xhr.responseText);

      if (got.error) {
        window.alert(got.error);
      } else {
        window.localStorage.setItem("user", JSON.stringify(got));
        window.location.replace("./homepage.html");
      }
    }
  };
  xhr.send(JSON.stringify(Login));
}

// initially
function initialize() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", `../../../api/login/login.php`, true);

  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      const got = JSON.parse(xhr.responseText);

      if (
        got.error.includes("already logged in") &&
        JSON.parse(window.localStorage.getItem("user")).admin_id
      ) {
        window.location.replace("./homepage.html");
      }
    }
  };
  xhr.send();
}

window.addEventListener("DOMContentLoaded", initialize);
