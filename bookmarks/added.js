import { getEmbedding } from "../utils/embedding.js";
import * as db from "../db/db.js";

// Only the handler, no addListener here
export async function handleAdded(id, node) {
  if (!node.url) return; // skip folders

  const emb = await getEmbedding(node.title || "(untitled)");

  await db.add({
    id: node.id,
    title: node.title || "(untitled)",
    url: node.url,
    folder: node.parentId, // you can resolve to folder title if needed
    embedding: emb,
  });

  console.log("Added new bookmark to DB:", node.title);
}
