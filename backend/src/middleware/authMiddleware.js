/**
 * Responsabilidad única: comprobar que la petición trae una cookie de
 * sesión válida antes de dejarla pasar. No verifica credenciales (eso es
 * AuthService) ni gestiona el login (eso es authController) - solo hace
 * de guardia en la puerta.
 */
function crearAuthMiddleware(authService, cookieName) {
  return function authMiddleware(req, res, next) {
    const token = req.cookies?.[cookieName];
    if (!token) {
      return res.status(401).json({ error: "No autenticado" });
    }
    try {
      req.usuario = authService.verificarToken(token);
      next();
    } catch (_err) {
      res.status(401).json({ error: "Sesión inválida o caducada" });
    }
  };
}

module.exports = crearAuthMiddleware;
