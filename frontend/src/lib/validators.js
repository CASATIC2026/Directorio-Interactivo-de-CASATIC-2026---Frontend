/**
 * ═══════════════════════════════════════════════════════════════
 * VALIDATORS — Validaciones senior-level reutilizables
 * 
 * Centraliza lógica de validación para garantizar coherencia
 * entre frontend y backend.
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * CASATIC Password Strength Requirements
 * 
 * ✅ Mínimo 8 caracteres
 * ✅ Al menos 1 mayúscula (A-Z)
 * ✅ Al menos 1 número (0-9)
 * ✅ Al menos 1 carácter especial (!@#$%^&*...)
 * 
 * Justificación:
 * - 8+ chars: Previene ataques de fuerza bruta
 * - Mayúscula: Aumenta entropy de contraseñas
 * - Número: Típicamente requerido en sistemas
 * - Especial: Cumple OWASP, previene diccionarios
 */
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;

const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  requireUppercase: true,
  requireNumber: true,
  requireSpecialChar: true,
};

const PASSWORD_ERROR_MESSAGES = {
  tooShort: 'La contraseña debe tener al menos 8 caracteres',
  noUppercase: 'Debe contener al menos 1 mayúscula (A-Z)',
  noNumber: 'Debe contener al menos 1 número (0-9)',
  noSpecialChar: 'Debe contener al menos 1 carácter especial (!@#$%^&*...)',
  generic: 'La contraseña no cumple los requisitos de seguridad',
};

/**
 * Valida que una contraseña cumpla con los requisitos de CASATIC
 * 
 * @param {string} password - Contraseña a validar
 * @returns {object} { isValid: boolean, errors: string[] }
 * 
 * @example
 * const result = validatePassword('MyP@ssw0rd');
 * console.log(result.isValid); // true
 * console.log(result.errors);  // []
 * 
 * @example
 * const result = validatePassword('weak');
 * console.log(result.isValid); // false
 * console.log(result.errors);  
 * // ['La contraseña debe tener...', 'Debe contener al menos 1 mayúscula...']
 */
export function validatePassword(password) {
  const errors = [];

  if (!password) {
    return {
      isValid: false,
      errors: ['La contraseña es requerida'],
    };
  }

  if (password.length < PASSWORD_REQUIREMENTS.minLength) {
    errors.push(PASSWORD_ERROR_MESSAGES.tooShort);
  }

  if (!(/[A-Z]/.test(password))) {
    errors.push(PASSWORD_ERROR_MESSAGES.noUppercase);
  }

  if (!(/\d/.test(password))) {
    errors.push(PASSWORD_ERROR_MESSAGES.noNumber);
  }

  if (!(/[^a-zA-Z0-9]/.test(password))) {
    errors.push(PASSWORD_ERROR_MESSAGES.noSpecialChar);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Verifica si una contraseña es válida usando regex (más rápido)
 * Útil para validaciones inline/en tiempo real
 * 
 * @param {string} password - Contraseña a verificar
 * @returns {boolean} true si es válida
 */
export function isPasswordStrong(password) {
  return PASSWORD_REGEX.test(password);
}

/**
 * Genera sugerencias de contraseña fuerte
 * Útil para UX: mostrar feedback al usuario mientras escribe
 * 
 * @param {string} password - Contraseña parcial o incompleta
 * @returns {object} { strength: 'weak'|'medium'|'strong', suggestions: string[] }
 */
export function getPasswordStrengthFeedback(password) {
  if (!password) {
    return {
      strength: 'weak',
      suggestions: ['Por favor ingresa una contraseña', 'Debe cumplir todos los requisitos'],
    };
  }

  const { errors } = validatePassword(password);
  
  if (errors.length === 0) {
    return {
      strength: 'strong',
      suggestions: ['✅ Contraseña muy segura'],
    };
  }

  if (errors.length === 1) {
    return {
      strength: 'medium',
      suggestions: errors,
    };
  }

  return {
    strength: 'weak',
    suggestions: errors,
  };
}

/**
 * Valida email (RFC 5322 simplificado)
 * 
 * @param {string} email - Email a validar
 * @returns {boolean} true si es válido
 */
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida que dos contraseñas coincidan
 * 
 * @param {string} password - Contraseña
 * @param {string} confirmPassword - Confirmación
 * @returns {object} { match: boolean, message: string }
 */
export function validatePasswordMatch(password, confirmPassword) {
  if (password !== confirmPassword) {
    return {
      match: false,
      message: 'Las contraseñas no coinciden',
    };
  }
  return {
    match: true,
    message: 'Las contraseñas coinciden ✅',
  };
}

/**
 * Exporta requirements para UI (mostrar requisitos al usuario)
 */
export function getPasswordRequirements() {
  return {
    requirements: PASSWORD_REQUIREMENTS,
    messages: PASSWORD_ERROR_MESSAGES,
    regex: PASSWORD_REGEX,
  };
}
