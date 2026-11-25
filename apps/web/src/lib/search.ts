export const normalizeText = (text: string) =>
  text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[’`]/g, "'")
    .toLowerCase()
    .trim();

export const matchesSearch = (texts: string[], query: string) => {
  const normalizedQuery = normalizeText(query);
  return texts.some((text) => normalizeText(text).includes(normalizedQuery));
};
