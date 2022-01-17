function openDropdown() {
  $(".dropdown").toggle();
}

function redirectLogin(key) {
  if (key === "LOGIN") {
    fetch("/login", { method: "GET" }).then(() => {
      window.location.replace("/login");
    });
  } else {
    fetch("/register", { method: "GET" }).then(() => {
      window.location.replace("/register");
    });
  }
}

function handleEditProfile() {
  $(".box-button").toggle();
  $(".input-edit").toggle();
  $(".button-edit-profile").toggle();
  $(".value-profile").toggle();
}
