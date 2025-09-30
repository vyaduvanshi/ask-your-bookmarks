import { traverse } from "../bookmarks/fetch.js";   // reuse your traverse()
import { getEmbedding } from "../utils/embedding.js";
import * as db from "./db.js";  // your DB wrapper (to be implemented)


// Sync local DB with actual bookmarks
export async function syncBookmarks() {
  try {
    const tree = await browser.bookmarks.getTree();
    const current = traverse(tree);

    // Get all IDs in DB
    const dbIds = await db.getAllIds();

    // Add missing bookmarks
    for (const bm of current) {
      if (!dbIds.includes(bm.id)) {
        console.log("New bookmark found:", bm.title);
        const emb = await getEmbedding(bm.title);
        await db.add({ ...bm, embedding: emb });
      }
    }

    // Remove deleted bookmarks
    for (const id of dbIds) {
      if (!current.find(b => b.id === id)) {
        console.log("Bookmark deleted:", id);
        await db.remove(id);
      }
    }

    console.log("Sync complete ✅");
  } catch (err) {
    console.error("Error during sync:", err);
  }
}
