const menuButton = document.querySelector("#menu");
const navList = document.querySelector(".navigation");

menuButton?.addEventListener("click", () => {
  const isOpen = navList.classList.toggle("show");
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.innerHTML = isOpen ? "&times;" : "&#9776;"
});
