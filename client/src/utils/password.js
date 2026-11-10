// Mirrors server/src/utils/validation.js#getPasswordProblems so users see the rules before submitting
export function getPasswordRules(password, email = '') {
  const emailName = email.trim().toLowerCase().split('@')[0];

  return [
    { label: 'At least 8 characters', ok: password.length >= 8 },
    { label: 'One lowercase letter', ok: /[a-z]/.test(password) },
    { label: 'One uppercase letter', ok: /[A-Z]/.test(password) },
    { label: 'One digit', ok: /\d/.test(password) },
    { label: 'No spaces', ok: password.length > 0 && !/\s/.test(password) },
    {
      label: 'Doesn’t contain your email name',
      ok: password.length > 0 && !(emailName.length >= 3 && password.toLowerCase().includes(emailName)),
    },
    { label: 'At most 72 bytes', ok: new TextEncoder().encode(password).length <= 72, hidden: true },
  ];
}
