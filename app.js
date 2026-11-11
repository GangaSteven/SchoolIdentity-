
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

(async () => {
  const SUPABASE_URL = "https://fcdbmrzmgcvwhhbgavxb.supabase.co";

  // Remplacer par la clé Publishable déjà utilisée dans l'ancien app.js
  const SUPABASE_PUBLISHABLE_KEY = "REMPLACER_PAR_VOTRE_CLE_PUBLISHABLE";

  const status = document.getElementById("authStatus");
  const signupForm = document.getElementById("signupForm");
  const loginForm = document.getElementById("loginForm");
  const accountPanel = document.getElementById("accountPanel");
  const accountEmail = document.getElementById("accountEmail");
  const logoutButton = document.getElementById("logoutButton");

  function showMessage(message) {
    if (status) status.textContent = message;
  }

  try {
    if (SUPABASE_PUBLISHABLE_KEY.startsWith("REMPLACER_")) {
      throw new Error("Clé publique non configurée.");
    }

    const { createClient } = await import(
      "https://esm.sh/@supabase/supabase-js@2"
    );

    const supabase = createClient(
      SUPABASE_URL,
      SUPABASE_PUBLISHABLE_KEY
    );

    window.schoolIdentitySupabase = supabase;

    async function updateInterface() {
      const { data, error } = await supabase.auth.getSession();

      if (error) throw error;

      const session = data.session;

      if (session) {
        accountEmail.textContent = session.user.email;
        accountPanel.hidden = false;
        signupForm.hidden = true;
        loginForm.hidden = true;
        showMessage("Vous êtes connecté à SchoolIdentity.");
      } else {
        accountPanel.hidden = true;
        signupForm.hidden = false;
        loginForm.hidden = false;
        showMessage("Vous pouvez créer un compte ou vous connecter.");
      }
    }

    signupForm.addEventListener("submit", async event => {
      event.preventDefault();

      const fullName = document.getElementById("signupName").value.trim();
      const phone = document.getElementById("signupPhone").value.trim();
      const email = document.getElementById("signupEmail").value.trim();
      const password = document.getElementById("signupPassword").value;

      showMessage("Création du compte en cours...");

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone
          }
        }
      });

      if (error) {
        showMessage("Erreur d'inscription : " + error.message);
        return;
      }

      if (data.session) {
        showMessage("Compte créé et connexion établie.");
      } else {
        showMessage(
          "Compte créé. Consultez votre boîte e-mail pour confirmer votre adresse."
        );
      }

      await updateInterface();
    });

    loginForm.addEventListener("submit", async event => {
      event.preventDefault();

      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value;

      showMessage("Connexion en cours...");

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        showMessage("Erreur de connexion : " + error.message);
        return;
      }

      await updateInterface();
    });

    logoutButton.addEventListener("click", async () => {
      const { error } = await supabase.auth.signOut();

      if (error) {
        showMessage("Erreur de déconnexion.");
        return;
      }

      showMessage("Vous êtes déconnecté.");
      await updateInterface();
    });

    supabase.auth.onAuthStateChange(() => {
      updateInterface().catch(error => {
        console.error(error);
        showMessage("Impossible de vérifier la session.");
      });
    });

    await updateInterface();

  } catch (error) {
    console.error("SchoolIdentity :", error);
    showMessage("Configuration impossible : vérifiez la connexion Supabase et la clé publique.");
  }
})();
