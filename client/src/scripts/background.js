/* global chrome */
function logWithTimestamp(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}

chrome.runtime.onInstalled.addListener(() => {
  logWithTimestamp("Extension installed. Clearing existing alarms and creating new alarm.");
  chrome.alarms.clearAll(() => {
    chrome.alarms.create("pauseCycle", { periodInMinutes: 1 });
  });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "pauseCycle") {
    logWithTimestamp("Alarm triggered: pauseCycle");
    chrome.tabs.query(
<<<<<<< HEAD
      { url: ["*://*.instagram.com/*", "*://*.youtube.com/*"] },
=======
      { url: ["*://*.instagram.com/*", "*://*.youtube.com/*"] }, // Removed `active` filter
>>>>>>> 16c2bfb (alarm precision solved)
      (tabs) => {
        if (tabs.length === 0) {
          logWithTimestamp("No matching tabs found. Skipping.");
          return;
        }
        tabs.forEach((tab) => {
<<<<<<< HEAD
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: pauseContent,
          });
=======
          logWithTimestamp(`Sending pauseContent script to tab ID: ${tab.id}`);
          chrome.scripting.executeScript(
            {
              target: { tabId: tab.id },
              func: pauseContent,
            },
            () => {
              if (chrome.runtime.lastError) {
                logWithTimestamp(`Error executing script: ${chrome.runtime.lastError.message}`);
              } else {
                logWithTimestamp(`pauseContent script executed successfully for tab ID: ${tab.id}`);
              }
            }
          );
>>>>>>> 16c2bfb (alarm precision solved)
        });
      }
    );
  }
});

function pauseContent() {
  const pauseDuration = 60000; // 1 minute
  const overlayId = "pause-overlay";
  const hostname = window.location.hostname;

<<<<<<< HEAD
  // Pause videos on YouTube
=======
  console.log(`[${new Date().toISOString()}] Starting pauseContent on ${hostname}.`);

  if (document.getElementById(overlayId)) {
    console.log(`[${new Date().toISOString()}] Overlay already exists, skipping.`);
    return;
  }

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

  console.log(`[${new Date().toISOString()}] Overlay displayed.`);

>>>>>>> 16c2bfb (alarm precision solved)
  if (hostname.includes("youtube.com")) {
    const videos = document.querySelectorAll("video");
    videos.forEach((video) => video.pause());
    console.log(`[${new Date().toISOString()}] Paused all videos on YouTube.`);
    setTimeout(() => {
      videos.forEach((video) => video.play());
      console.log(`[${new Date().toISOString()}] Resumed all videos on YouTube.`);
    }, pauseDuration);
  }

  if (hostname.includes("instagram.com")) {
    document.body.style.overflow = "hidden";
    console.log(`[${new Date().toISOString()}] Disabled scrolling on Instagram.`);
    setTimeout(() => {
      document.body.style.overflow = "";
      console.log(`[${new Date().toISOString()}] Re-enabled scrolling on Instagram.`);
    }, pauseDuration);
  }

<<<<<<< HEAD
  // Show overlay
  const overlay = document.createElement("div");
  overlay.id = "pause-overlay";
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

  // Remove overlay after pause duration
  setTimeout(() => {
    document.body.removeChild(overlay);
=======
  setTimeout(() => {
    const overlay = document.getElementById(overlayId);
    if (overlay) {
      document.body.removeChild(overlay);
      console.log(`[${new Date().toISOString()}] Overlay removed.`);
    }
>>>>>>> 16c2bfb (alarm precision solved)
  }, pauseDuration);
}
