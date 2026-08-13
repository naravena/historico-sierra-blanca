const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * Responsabilidad única: verificar credenciales y emitir/validar tokens
 * de sesión. No sabe nada de HTTP, cookies ni rutas - eso es trabajo
 * del middleware y del controlador.
 */
class AuthService {
  constructor(authConfig) {
    this.config = authConfig;
  }

  async verificarCredenciales(username, password) {
    if (username !== this.config.adminUsername) return false;
    return bcrypt.compare(password, this.config.adminPasswordHash);
  }

  emitirToken(username) {
    return jwt.sign({ sub: username }, this.config.jwtSecret, {
      expiresIn: this.config.tokenExpiresIn,
    });
  }

  /** @returns {object} payload si es válido @throws si el token es inválido o ha expirado */
  verificarToken(token) {
    return jwt.verify(token, this.config.jwtSecret);
  }
}

module.exports = AuthService;
