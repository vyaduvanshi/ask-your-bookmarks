console.log("Processor page running");

import { handleAdded } from "../bookmarks/added.js";
import { handleChanged } from "../bookmarks/changed.js";


let extractor = null;

async function initModel() {
  if (!extractor) {
    const { pipeline } = window.transformers;
    extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    console.log("Embedding model loaded in processor");
  }
}

browserApi.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === "INIT_BOOKMARKS") {
    await initializeBookmarks(); // safe here (can use transformers)
    sendResponse({ status: "ok" });
  }
  return true; // keep sendResponse alive for async
});


// Handle messages from background
browserApi.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === "INIT_BOOKMARKS") {
    await initModel();
    await initializeBookmarks(); // embedding all bookmarks
    sendResponse({ status: "ok" });
  }

  if (message.type === "SYNC_BOOKMARKS") {
    await initModel();
    await syncBookmarks();
    sendResponse({ status: "ok" });
  }

  if (message.type === "ADD_BOOKMARK") {
    await initModel();
    await handleAdded();
    sendResponse({ status: "ok" });
  }

  if (message.type === "CHANGE_BOOKMARK") {
    await initModel();
    await handleChanged();
    sendResponse({ status: "ok" });
  }

  return true; // keep sendResponse alive for async
});