// Import Transformers.js from CDN
import { pipeline } from '../libs/transformers.min.js';


// Load the embedding model
async function loadEmbedder() {
  embedder = await pipeline(
    "feature-extraction",
    "Xenova/all-MiniLM-L6-v2"
  );
  console.log("Model loaded!");
}


export async function getEmbedding(text) {
  if (!embedder) await loadEmbedder();
  const [emb] = await embedder(text, { pooling: "mean", normalize: true });
  return emb;
}


// ---- Precompute embeddings for bookmarks ----
async function computeBookmarkEmbeddings(bookmarks) {
  bookmarkEmbeddings = [];
  for (let b of bookmarks) {
    const emb = await getEmbedding(b.title);
    bookmarkEmbeddings.push({ id: b.id, title: b.title, embedding: emb });
  }
  console.log("Bookmark embeddings ready!");
}