
//Recursively walks the bookmarks tree
function traverse(nodes, folderPath = []) {
  let results = [];

  for (const node of nodes) {
    if (node.url) {
      if (isValidUrl(node.url)) {
        results.push({
          title: node.title,
          url: node.url,
          folder: cleanFolder(folderPath.join("/"))
        });
      }
    } else if (node.children) {
      results = results.concat(
        traverse(node.children, [...folderPath, node.title])
      );
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
  }
}
