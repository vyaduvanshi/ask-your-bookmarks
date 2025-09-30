import * as db from "./db.js";

export async function handleRemoved(id, removeInfo) {
  await db.remove(id);
  console.log("Removed bookmark from DB:", id);
}
