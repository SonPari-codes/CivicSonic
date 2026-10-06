// Home page JavaScript
// Page navigation uses normal links; JS only handles the hamburger and the temporary profile action.

document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".hamburger-btn");

  if (menuButton) {
    menuButton.addEventListener("click", () => {
      document.body.classList.toggle("menu-open");
    });
  }

  document.querySelectorAll(".profile-link").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      alert("Profile page will be connected here.");
    });
  });
});