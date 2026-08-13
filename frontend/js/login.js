import { ApiClient } from "./api/ApiClient.js";

const api = new ApiClient("/api");
const form = document.getElementById("login-form");
const errorBox = document.getElementById("login-error");

// Si ya hay sesión válida, no tiene sentido ver el login
fetch("/api/auth/me", { credentials: "include" }).then((r) => {
  if (r.ok) window.location.href = "/index.html";
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
    const data = await res.json();

    if (!res.ok) {
      errorBox.textContent = data.error || "No se pudo iniciar sesión";
      errorBox.hidden = false;
      return;
    }

    window.location.href = "/index.html";
  } catch (_err) {
    errorBox.textContent = "No se pudo conectar con el servidor";
    errorBox.hidden = false;
  } finally {
    boton.disabled = false;
    boton.textContent = "Entrar";
  }
});
