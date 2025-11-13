const hamburger = document.getElementById("hamburger");
const menuPanel = document.getElementById("menu-panel");
hamburger.addEventListener("click", () => {
  const open = menuPanel.classList.toggle("open");
  hamburger.textContent = open ? "✖" : "☰";
});

// Membership Level Mapping
function getMembershipLevel(level) {
  switch (level) {
    case 1: return "Member";
    case 2: return "Silver";
    case 3: return "Gold";
    default: return "Unknown";
  }
}
