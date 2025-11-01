const courses = [
  { code: "WDD130", name: "Web Fundamentals", credits: 2, type: "wdd", completed: true },
  { code: "WDD131", name: "Web Frontend I Basics", credits: 2, type: "wdd", completed: true },
  { code: "CSE110", name: "Intro to Programming", credits: 2, type: "cse", completed: true },
  { code: "WDD231", name: "Web Frontend Development I", credits: 3, type: "wdd", completed: false }
];

const container = document.getElementById("course-container");
const totalCreditsEl = document.getElementById("total-credits");

function renderCourseCard(course) {
  const card = document.createElement("div");
  card.className = `course-card${course.completed ? " completed" : ""}`;

  const left = document.createElement("div");
  left.className = "left";
  const code = document.createElement("span");
  code.className = "code";
  code.textContent = course.code;

  const name = document.createElement("span");
  name.className = "name";
  name.textContent = ` — ${course.name}`;

  left.append(code, name);

  const right = document.createElement("span");
  right.className = "meta";
  right.textContent = `${course.credits} credits`;

  card.append(left, right);
  return card;
}

function displayCourses(list) {
  if (!container || !totalCreditsEl) return;

  container.innerHTML = "";
  list.forEach(c => container.appendChild(renderCourseCard(c)));

  const total = list.reduce((sum, c) => sum + c.credits, 0);
  totalCreditsEl.textContent = String(total);

  // Notify footer to mirror credits
  document.dispatchEvent(new Event("creditsUpdated"));
}

// Initial render
displayCourses(courses);

// Filters
document.querySelectorAll(".filters .filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const filter = btn.dataset.filter;
    if (filter === "all") displayCourses(courses);
    else displayCourses(courses.filter(c => c.type === filter));
  });
});
