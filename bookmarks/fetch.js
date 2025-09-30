import { isValidUrl } from "./preprocessing.js";
import { EXCLUDE_FOLDERS, NONE_FOLDERS } from "./config.js";



export function traverse(nodes, parentFolder = null) {
  let results = [];

  for (const node of nodes) {
    if (node.url) {
      if (isValidUrl(node.url)) {
        // skip if parent is excluded
        if (EXCLUDE_FOLDERS.includes(parentFolder)) {
          continue;
        }

        let folderTag = "none";
        if (parentFolder && !NONE_FOLDERS.includes(parentFolder)) {
          folderTag = parentFolder; // user-created folder
        }

        results.push({
          id: node.id,
          title: node.title || "(untitled)",
          url: node.url,
          folder: folderTag
        });
      }
    }
    else if (node.children) {
      results = results.concat(traverse(node.children, node.title));
    }
  }

  return results;
}

export async function getAllBookmarks() {
  try {
    let tree = await browser.bookmarks.getTree();
    // Flatten tree into simple JSON
    const bookmarks = traverse(tree);
    console.log("Processed Bookmarks:", bookmarks.length);
    return bookmarks;
  } catch (err) {
    console.error("Error fetching bookmarks:", err);
    return [];
  }
}


// ---- First-time setup handler ----
export async function initializeBookmarks() {
  try {
    const { dbInitialized } = await browser.storage.local.get("dbInitialized");

    if (!dbInitialized) {
      console.log("First run: fetching all bookmarks...");
      const bookmarks = await getAllBookmarks();

      // embed each bookmark (placeholder for now)
      const withEmbeddings = [];
      for (const bm of bookmarks) {
        const emb = await createEmbedding(bm);
        withEmbeddings.push(emb);
      }

      // store flag that initialization is done
      await browser.storage.local.set({ dbInitialized: true });

      console.log("Initialization complete. Total:", withEmbeddings.length);
      return withEmbeddings;
    } else {
      console.log("Bookmarks already initialized. Skipping fetch.");
      return [];
    }
  } catch (err) {
    console.error("Error in initialization:", err);
    return [];
  }
}