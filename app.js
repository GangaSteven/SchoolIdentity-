const yearElement = document.getElementById("year");
if (yearElement) yearElement.textContent = new Date().getFullYear();

const menuButton = document.getElementById("menuButton");
const topbar = document.querySelector(".topbar");

menuButton?.addEventListener("click", () => {
  topbar?.classList.toggle("nav-open");
});

document.querySelectorAll("#mainNav a").forEach(link => {
  link.addEventListener("click", () => {
    topbar?.classList.remove("nav-open");
  });
});

// Connexion Supabase
(async () => {
  const SUPABASE_URL = "https://fcdbmrzmgcvwhhbgavxb.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_-03TQGVhIKrus5ZwsTEbCw_IJ_CmsCN";

  const status = document.createElement("p");
  status.id = "supabaseStatus";
  status.textContent = "Vérification de la connexion...";
  document.body.appendChild(status);

  try {
    if (SUPABASE_PUBLISHABLE_KEY === "COLLER_ICI_LA_CLE_PUBLISHABLE") {
      status.textContent = "La clé publique Supabase doit encore être configurée.";
      return;
    }

    const { createClient } = await import(
      "https://esm.sh/@supabase/supabase-js@2"
    );

    const supabase = createClient(
      SUPABASE_URL,
      SUPABASE_PUBLISHABLE_KEY
    );

    window.schoolIdentitySupabase = supabase;

    const { error } = await supabase.auth.getSession();

    if (error) throw error;

    status.textContent = "Connexion Supabase établie.";
    console.log("SchoolIdentity : connexion Supabase réussie.");

  } catch (error) {
    status.textContent = "Connexion Supabase impossible. Vérifiez la configuration.";
    console.error("Erreur Supabase :", error);
  }
})();

// Le formulaire reste en démonstration pour le moment.
document.getElementById("demoForm")?.addEventListener("submit", event => {
  event.preventDefault();
  document.getElementById("formMessage").textContent =
    "Le formulaire réel sera activé après la configuration des comptes et de la base de données.";
});
