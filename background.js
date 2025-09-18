import { getAllBookmarks } from "./bookmarks/fetch.js";

// Call once background starts
getAllBookmarks();



async function saveBookmarksToFile() {
  const bookmarks = await getAllBookmarks();
  const json = JSON.stringify(bookmarks, null, 2);

  // Create a Blob and a URL
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  // Trigger download
  const b = window.browser || window.chrome;
  b.downloads.download({
    url: url,
    filename: "bookmarks.json",
    saveAs: true   // lets user choose location
  });
}

// Run once when background starts
saveBookmarksToFile();