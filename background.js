import { handleRemoved } from "../db/removed.js";
import { handleMoved } from "../db/moved.js";


// First run (installation of addon)
browser.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === "install") {
    console.log("Extension installed → Sending init message to processor");

    // Tell processor to initialize and embed all bookmarks
    browser.runtime.sendMessage(
      { type: "INIT_BOOKMARKS" },
      (response) => {
        console.log("Processor finished first-run embeddings:", response);
      }
    );
  }
});


// Every browser restart (e.g. re-sync, lightweight checks)
browser.runtime.onStartup.addListener(async () => {
  console.log("Browser restarted → Sending sync message to processor");

  browser.runtime.sendMessage(
    { type: "SYNC_BOOKMARKS" },
    (response) => {
      console.log("Processor finished sync:", response);
    }
  );
});


// When bookmark is added
browser.bookmarks.onCreated.addListener(async () => {
  console.log("Bookmark added → Sending add message to processor");

  browser.runtime.sendMessage(
    { type: "ADD_BOOKMARK" },
    (response) => {
      console.log("Processor finished adding bookmark:", response);
    }
  );
});


// When bookmark is changed
browser.bookmarks.onChanged.addListener(async () => {
  console.log("Bookmark changed → Sending change message to processor");

  browser.runtime.sendMessage(
    { type: "CHANGE_BOOKMARK" },
    (response) => {
      console.log("Processor finished changing bookmark:", response);
    }
  );
});


// Bookmark db functions (message sending not required as model is not invoked, so passes through CSP)
browser.bookmarks.onRemoved.addListener(handleRemoved);
browser.bookmarks.onMoved.addListener(handleMoved);