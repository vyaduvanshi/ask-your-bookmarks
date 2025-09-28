console.log("popup.js is running");



// Import Transformers.js from CDN
import { pipeline } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers/dist/transformers.min.js';

// Example bookmarks JSON (just titles for now)
const bookmarks = [
  { title: "ChatGPT OpenAI" },
  { title: "MDN Web Docs" },
  { title: "Stack Overflow" },
  { title: "Hacker News" },
  { title: "GitHub" }
];

let embedder;
let bookmarkEmbeddings = [];

// Load the embedding model
async function loadEmbedder() {
  embedder = await pipeline(
    "feature-extraction",
    "Xenova/all-MiniLM-L6-v2"
  );
  console.log("Model loaded!");
}

// Precompute embeddings for bookmark titles
async function computeBookmarkEmbeddings() {
  if (!embedder) await loadEmbedder();

  bookmarkEmbeddings = [];
  for (let b of bookmarks) {
    const emb = await embedder(b.title, {pooling: "mean", normalize: true});
    bookmarkEmbeddings.push({ title: b.title, embedding: emb[0] });
  }
  console.log("Bookmark embeddings ready!");
}

// Cosine similarity helper
function cosineSim(a, b) {
  console.log('a')
  console.log(a.dims)
  console.log('b')
  console.log(b.dims)
  const dataA = a.data;
  const dataB = b.data;
  let dot = 0;
  for (let i = 0; i < dataA.length; i++) {
    dot += dataA[i] * dataB[i];
  }
  return dot; // since vectors are normalized, dot product == cosine similarity
}

// Search function
async function searchBookmarks(query) {
  if (!embedder) await loadEmbedder();
  if (bookmarkEmbeddings.length === 0) await computeBookmarkEmbeddings();

  const queryEmb = (await embedder(query, {pooling: "mean", normalize: true}))[0];

  const results = bookmarkEmbeddings.map(b => ({
    title: b.title,
    similarity: cosineSim(queryEmb, b.embedding)
  }));

  results.sort((a, b) => b.similarity - a.similarity);
  return results.slice(0, 5); // top 5
}

// Hook search to UI
document.getElementById("searchBtn").addEventListener("click", async () => {
  const query = document.getElementById("query").value;
  const results = await searchBookmarks(query);

  const ul = document.getElementById("results");
  ul.innerHTML = "";
  for (let r of results) {
    const li = document.createElement("li");
    li.textContent = `${r.title} (score: ${r.similarity.toFixed(2)})`;
    ul.appendChild(li);
  }
});

// Precompute embeddings on popup load
computeBookmarkEmbeddings();
