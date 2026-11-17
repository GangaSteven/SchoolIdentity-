

// ==========================================
// SchoolIdentity — Connexion Supabase
// ==========================================

const SUPABASE_URL = "https://fcdbmrzmgcvwhhbgavxb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_-03TQGVhIKrus5ZwsTEbCw_IJ_CmsCN";

// Vérification de la configuration
if (
  !window.supabase ||
  SUPABASE_PUBLISHABLE_KEY === "COLLE_ICI_TA_PUBLISHABLE_KEY"
) {
  console.error("Configuration Supabase incomplète.");
} else {
  const client = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );

  // Menu mobile
  const menuButton = document.getElementById("menuButton");
  const topbar = document.querySelector(".topbar");

  if (menuButton && topbar) {
    menuButton.addEventListener("click", () => {
      topbar.classList.toggle("nav-open");
    });

    document.querySelectorAll("#mainNav a").forEach(link => {
      link.addEventListener("click", () => {
        topbar.classList.remove("nav-open");
      });
    });
  }

  // Année du pied de page
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Formulaire de connexion
  const form = document.getElementById("demoForm");
  const emailInput = document.getElementById("email");
  const message = document.getElementById("formMessage");
  const submitButton = form?.querySelector('button[type="submit"]');

  // Le rôle ne doit pas être choisi par l'utilisateur.
  const roleSelect = document.getElementById("role");
  if (roleSelect) {
    roleSelect.hidden = true;
    if (roleSelect.previousElementSibling) {
      roleSelect.previousElementSibling.hidden = true;
    }
  }

  if (form && emailInput && message) {
    message.textContent =
      "Entrez votre adresse e-mail. Nous vous enverrons un lien sécurisé de connexion.";

    form.addEventListener("submit", async event => {
      event.preventDefault();

      const email = emailInput.value.trim();

      if (!email) {
        message.textContent = "Veuillez saisir votre adresse e-mail.";
        return;
      }

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Envoi en cours...";
      }

      message.textContent = "Connexion en cours...";

      try {
        const { error } = await client.auth.signInWithOtp({
          email,
          options: {
            shouldCreateUser: false,
            emailRedirectTo: window.location.href.split("#")[0]
          }
        });

        if (error) throw error;

        message.textContent =
          "Un lien de connexion vient d'être envoyé à votre adresse e-mail. Consultez votre boîte de réception.";
      } catch (error) {
        console.error("Erreur de connexion :", error);
        message.textContent =
          "Impossible d'envoyer le lien : " + error.message;
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = "Envoyer le lien de connexion";
        }
      }
    });
  }

  // Gestion de la session
  async function updateSession() {
    const { data, error } = await client.auth.getSession();

    if (error) {
      console.error("Erreur de session :", error);
      return;
    }

    if (data.session && message) {
      message.textContent =
        "Vous êtes connecté à SchoolIdentity : " +
        data.session.user.email;
    }
  }

  client.auth.onAuthStateChange((event, session) => {
    if (message && session) {
      message.textContent =
        "Vous êtes connecté à SchoolIdentity : " +
        session.user.email;
    }
  });

  updateSession();
}
