const logout_form = document.getElementById("logout_form");

logout_form.addEventListener("click", logout);

function logout() {
  const xhr = new XMLHttpRequest();

  xhr.open("GET", "../../../api/login/logout.php", true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      const got = JSON.parse(xhr.responseText);
      if (got.error) {
        window.alert(got.error);
      } else {
        window.localStorage.removeItem("user");
        window.alert("admin logged out");
        window.location.replace("./login.html");
      }
    }
  };

  xhr.send();
}
