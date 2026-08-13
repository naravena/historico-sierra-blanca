/**
 * Traduce HTTP <-> AuthService. La cookie se pone httpOnly + secure +
 * sameSite=lax: el JavaScript del navegador nunca puede leer el token
 * (protege contra robo vía XSS), solo viaja por HTTPS, y no se envía
 * en peticiones cross-site de terceros (protege contra CSRF básico).
 */
function crearAuthController(authService, config) {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días, igual que el token
  };

  return {
    login: async (req, res, next) => {
      try {
        const { username, password } = req.body || {};
        if (!username || !password) {
          return res.status(400).json({ error: "Usuario y contraseña son obligatorios" });
        }

        const valido = await authService.verificarCredenciales(username, password);
        if (!valido) {
          // Mensaje deliberadamente genérico: no revela si el usuario existe o no
          return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
        }

        const token = authService.emitirToken(username);
        res.cookie(config.cookieName, token, cookieOptions);
        res.json({ ok: true, username });
      } catch (err) {
        next(err);
      }
    },

    logout: (_req, res) => {
      res.clearCookie(config.cookieName, cookieOptions);
      res.json({ ok: true });
    },

    yo: (req, res) => {
      res.json({ username: req.usuario.sub });
    },
  };
}

module.exports = crearAuthController;
