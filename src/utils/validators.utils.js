export const isNonEmptyString = (value) => {
  if (typeof value !== "string") return false;

  if (value.trim() === "") return false;

  return true;
};

export const isValidEmail = (email) => {
  if (!isNonEmptyString(email)) return false;

  const normalizedEmail = email.trim().toLowerCase();

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  return emailRegex.test(normalizedEmail);
};

export const isValidPassword = (password) => {
  if (typeof password !== "string") return false;

  if (password.length < 8 || password.length > 128) return false;

  return true;
};