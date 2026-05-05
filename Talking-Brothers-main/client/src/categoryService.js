const API_BASE = 'http://localhost:5000';

export const normalizeCategories = (data) => {
  if (!Array.isArray(data)) return [];

  const seenIds = new Set();
  return data
    .filter((item) => item && item.id != null && typeof item.name === 'string' && item.name.trim() !== '')
    .filter((item) => {
      if (seenIds.has(item.id)) return false;
      seenIds.add(item.id);
      return true;
    })
    .map((item) => ({ id: item.id, name: item.name.trim() }))
    .sort((a, b) => a.name.localeCompare(b.name));
};

export const fetchCategoriesFromApi = async () => {
  const res = await fetch(`${API_BASE}/api/categories`);
  if (!res.ok) {
    throw new Error('Unable to load categories');
  }

  const data = await res.json();
  return normalizeCategories(data);
};
