// Landing page JavaScript
// Navigation is handled by normal links so the landing page stays lightweight.

document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".hamburger-btn");

  if (menuButton) {
    menuButton.addEventListener("click", () => {
      document.body.classList.toggle("menu-open");
    });
  }
});