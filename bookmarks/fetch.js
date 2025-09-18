import { isValidUrl, cleanFolder } from "./preprocessing.js";
import { EXCLUDE_FOLDERS, NONE_FOLDERS } from "./config.js";



function traverse(nodes, parentFolder = null) {
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
          title: node.title || "(untitled)",
          url: node.url,
          folder: folderTag
        });
      }
    } else if (node.children) {
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
    console.log("Processed Bookmarks:", bookmarks);
    console.log("Unprocessed Bookmarks:", tree);
    return bookmarks;
  } catch (err) {
    console.error("Error fetching bookmarks:", err);
    return [];
  }
}
