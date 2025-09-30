import { getEmbedding } from "../utils/embedding.js";
import * as db from "../db/db.js";

export async function handleChanged(id, changeInfo) {
  if (!changeInfo.title) return;

  const emb = await getEmbedding(changeInfo.title);

  await db.update(id, {
    title: changeInfo.title,
    embedding: emb,
  });

  console.log("Bookmark changed:", id, "→", changeInfo.title);
}
