// Menu toggle
const hamburger = document.getElementById("hamburger");
const menuPanel = document.getElementById("menu-panel");

hamburger.addEventListener("click", () => {
  const isOpen = menuPanel.classList.toggle("open");
  hamburger.setAttribute("aria-expanded", isOpen);
  hamburger.textContent = isOpen ? "✖" : "☰";
});

async function loadMembers() {
  try {
    const response = await fetch("data/members.json");
    const data = await response.json();
    window.membersData = data.members; 
    displayMembers(window.membersData, "grid"); 
  } catch (error) {
    console.error("Error loading members:", error);
  }
}

function displayMembers(members, view = "grid") {
  const container = document.getElementById("members-container");
  container.innerHTML = "";

  if (view === "list") {
    container.setAttribute("role", "list");
  } else {
    container.removeAttribute("role");
  }

  members.forEach(member => {
    const card = document.createElement("section");
    card.classList.add("member-card");

    if (view === "list") {
      card.setAttribute("role", "listitem");
    }

    
    let html = `
      <h3>${member.name}</h3>
      <p>${member.address}</p>
      <p>${member.phone}</p>
      <a href="${member.website}" target="_blank" rel="noopener noreferrer" aria-label="Visit ${member.name} website">${member.website}</a>
      <p class="membership">Membership: ${getMembershipLevel(member.membershipLevel)}</p>
      <p>${member.info}</p>
    `;

    // Image only for grid view
    if (view === "grid") {
      html = `<img src="${member.image}" alt="${member.name} logo">` + html;
    }

    card.innerHTML = html;
    container.appendChild(card);
  });
}

// Membership level mapping
function getMembershipLevel(level) {
  switch (level) {
    case 1: return "Member";
    case 2: return "Silver";
    case 3: return "Gold";
    default: return "Unknown";
  }
}

// Toggle buttons
document.getElementById("grid-view").addEventListener("click", () => {
  const container = document.getElementById("members-container");
  container.classList.add("grid");
  container.classList.remove("list");
  displayMembers(window.membersData, "grid");
});

document.getElementById("list-view").addEventListener("click", () => {
  const container = document.getElementById("members-container");
  container.classList.add("list");
  container.classList.remove("grid");
  displayMembers(window.membersData, "list");
});

loadMembers();
