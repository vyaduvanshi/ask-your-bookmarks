//Known system prefixes (Chrome + Firefox)

export const SYSTEM_PREFIXES = [
  "/Bookmarks Toolbar",
  "/Bookmarks Bar",
  "/Bookmarks Menu",
  "/Other Bookmarks", // chrome and firefox
  "/Mobile Bookmarks", // chrome and firefox
  "/Mozilla Firefox",
  "/Bookmarks Bar" // for chrome
];

// Skip these folders
export const EXCLUDE_FOLDERS = [
  "Mozilla Firefox",   // skip everything inside
];

// Mark the tag as 'none' for bookmarks directly inside these folders
export const NONE_FOLDERS = [
  "Other Bookmarks", 
  "Bookmarks Toolbar"
];