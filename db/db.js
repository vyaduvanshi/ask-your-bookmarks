
const STORAGE_KEY = "bookmarkEmbeddings";

// Fetch all embeddings
export async function getAll() {
  const data = await browser.storage.local.get(STORAGE_KEY);
  return data[STORAGE_KEY] || {};
}

// Fetch all IDs
export async function getAllIds() {
  const db = await getAll();
  return Object.keys(db);
}

// Add or update a bookmark embedding
export async function add(bookmark) {
  const db = await getAll();
  db[bookmark.id] = bookmark;
  await browser.storage.local.set({ [STORAGE_KEY]: db });
}

// Remove a bookmark embedding
export async function remove(id) {
  const db = await getAll();
  delete db[id];
  await browser.storage.local.set({ [STORAGE_KEY]: db });
}

// Get one bookmark by id
export async function getById(id) {
  const db = await getAll();
  return db[id] || null;
}
