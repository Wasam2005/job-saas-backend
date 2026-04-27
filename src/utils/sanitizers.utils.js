export const sanitizeString = (value) => {
  if (typeof value !== "string") return "";

  let sanitizedValue = value.trim();

  sanitizedValue = sanitizedValue.replace(/\s+/g, " ");

  sanitizedValue = sanitizedValue.replace(/<[^>]*>/g, "");

  return sanitizedValue;
};