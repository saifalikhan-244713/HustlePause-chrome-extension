/* global chrome */
function logWithTimestamp(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}

// Clear alarms on installation and initialize state
chrome.runtime.onInstalled.addListener(() => {
  logWithTimestamp("Extension installed. Clearing existing alarms and resetting state.");
  chrome.alarms.clearAll();
  chrome.storage.local.set({ isActive: false }); // Set initial state to inactive
});

// Handle extension icon clicks to toggle state
chrome.action.onClicked.addListener(() => {
  chrome.storage.local.get("isActive", (data) => {
    const isActive = data.isActive || false;

    if (isActive) {
      // Stop the extension
      logWithTimestamp("Disabling pause cycle.");
      chrome.alarms.clearAll();
      chrome.storage.local.set({ isActive: false });
    } else {
      // Start the extension
      logWithTimestamp("Enabling pause cycle.");
      chrome.alarms.create("pauseCycle", { delayInMinutes: 1, periodInMinutes: 1 });
      chrome.storage.local.set({ isActive: true });
    }
  });
});

// Handle alarms
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "pauseCycle") {
    logWithTimestamp("Alarm triggered: pauseCycle");
    chrome.tabs.query(
      { url: ["*://*.instagram.com/*", "*://*.youtube.com/*"] },
      (tabs) => {
        if (tabs.length === 0) {
          logWithTimestamp("No matching tabs found.");
          return;
        }
        tabs.forEach((tab) => {
          logWithTimestamp(`Executing pauseContent on tab ID: ${tab.id}`);
          chrome.scripting.executeScript(
            {
              target: { tabId: tab.id },
              func: pauseContent,
            },
            () => {
              if (chrome.runtime.lastError) {
                logWithTimestamp(`Error executing script: ${chrome.runtime.lastError.message}`);
              } else {
                logWithTimestamp(`pauseContent executed on tab ID: ${tab.id}`);
              }
            }
          );
        });
      }
    );
  }
});

// Content script function
function pauseContent() {
  const pauseDuration = 60000; // 1 minute
  const overlayId = "pause-overlay";
  const hostname = window.location.hostname;

  if (document.getElementById(overlayId)) {
    return; // Prevent duplicate overlays
  }

  // Create the overlay
  const overlay = document.createElement("div");
  overlay.id = overlayId;
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  overlay.style.color = "white";
  overlay.style.display = "flex";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.zIndex = "9999";
  overlay.innerText = "Take a break for 1 minute!";
  document.body.appendChild(overlay);

  // Pause videos on YouTube
  if (hostname.includes("youtube.com")) {
    const videos = document.querySelectorAll("video");
    videos.forEach((video) => video.pause());
    setTimeout(() => {
      videos.forEach((video) => video.play());
    }, pauseDuration);
  }

  // Disable scrolling on Instagram
  if (hostname.includes("instagram.com")) {
    document.body.style.overflow = "hidden";
    setTimeout(() => {
      document.body.style.overflow = "";
    }, pauseDuration);
  }

  // Remove overlay after the pause duration
  setTimeout(() => {
    const overlay = document.getElementById(overlayId);
    if (overlay) {
      document.body.removeChild(overlay);
    }
  }, pauseDuration);
}
