import * as db from "./db.js";

export async function handleMoved(id, moveInfo) {
  const [bookmark] = await browser.bookmarks.get(id);

  if (!bookmark?.url) return; // skip folders

  // Update folder
  await db.update(id, { folder: moveInfo.parentId });

  console.log("Bookmark moved:", bookmark.title, "→", moveInfo.parentId);
}
