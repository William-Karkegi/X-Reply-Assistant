import { setupClickListener } from "./utils.js";

// Run the setup function when the page is loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupClickListener);
} else {
  setupClickListener();
}
