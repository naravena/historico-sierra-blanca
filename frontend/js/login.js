import { ApiClient } from "./api/ApiClient.js";

const api = new ApiClient("/api");
const form = document.getElementById("login-form");
const errorBox = document.getElementById("login-error");

// Si ya hay sesión válida, no tiene sentido ver el login
fetch("/api/auth/me", { credentials: "include" }).then((r) => {
  if (r.ok) window.location.href = "/index.html";
}).catch(() => {
  // El error se mostrará al intentar iniciar sesión.
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorBox.hidden = true;

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  const boton = form.querySelector("button");
  boton.disabled = true;
  boton.textContent = "Entrando…";

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const body = await res.text();
    let data = {};
    try {
      data = body ? JSON.parse(body) : {};
    } catch {
      // Vercel puede devolver una página de error HTML si la función no arranca.
    }

    if (!res.ok) {
      errorBox.textContent = data.error ||
        `El servidor respondió con HTTP ${res.status}. Revisa las variables de entorno y los logs de Vercel.`;
      errorBox.hidden = false;
      return;
    }

    if (!body || typeof data !== "object") {
      errorBox.textContent = "El servidor devolvió una respuesta no válida. Revisa los logs de Vercel.";
      errorBox.hidden = false;
      return;
    }

    window.location.href = "/index.html";
  } catch (_err) {
    errorBox.textContent = "No se pudo contactar con la API. Comprueba el despliegue de Vercel y la ruta /api/auth/login.";
    errorBox.hidden = false;
  } finally {
    boton.disabled = false;
    boton.textContent = "Entrar";
  }
});
