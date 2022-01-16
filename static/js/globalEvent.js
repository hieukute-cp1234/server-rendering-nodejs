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
