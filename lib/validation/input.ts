export function normalizeWord(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const word = value.trim().replace(/\s+/g, " ");
  if (word.length < 1 || word.length > 80 || !/^[\p{L}\p{M}]+(?:[’'-][\p{L}\p{M}]+)*(?: [\p{L}\p{M}]+(?:[’'-][\p{L}\p{M}]+)*)*$/u.test(word)) return null;
  return word.toLocaleLowerCase("en-US");
}

export function normalizeLetters(value: unknown, max = 32): string | null {
  if (typeof value !== "string") return null;
  const letters = value.trim().toLocaleLowerCase("en-US");
  if (letters.length < 1 || letters.length > max || !/^[a-z]+$/.test(letters)) return null;
  return letters;
}

export function normalizeText(value: unknown, maxLength = 20000): string | null {
  if (typeof value !== "string") return null;
  const text = value.replace(/\u0000/g, "").trim();
  if (text.length > maxLength) return null;
  return text;
}
