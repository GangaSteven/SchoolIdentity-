document.getElementById("year").textContent = new Date().getFullYear();

const menuButton = document.getElementById("menuButton");
const topbar = document.querySelector(".topbar");
menuButton.addEventListener("click", () => topbar.classList.toggle("nav-open"));

document.querySelectorAll("#mainNav a").forEach(link => {
  link.addEventListener("click", () => topbar.classList.remove("nav-open"));
});

document.getElementById("demoForm").addEventListener("submit", event => {
  event.preventDefault();
  document.getElementById("formMessage").textContent =
    "Démonstration uniquement : connectez Supabase avant d'activer les comptes réels.";
});
