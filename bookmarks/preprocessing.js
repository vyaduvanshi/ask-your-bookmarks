import { SYSTEM_PREFIXES } from "./config.js";


function isValidUrl(url) {
  try {
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}

function cleanFolder(path) {
  if (!path || path.trim() === "") return "none";

  for (const prefix of SYSTEM_PREFIXES) {
    if (path.startsWith(prefix)) {
      const parts = path.split("/");
      if (parts.length <= 2) {
        return "none"; // it's only the root system folder
      } else {
        return parts[parts.length - 1]; // last subfolder = user folder
      }
    }
  }

  // Not matching a system prefix → user folder
  return path.split("/").pop();
}