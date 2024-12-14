/* global chrome */
chrome.alarms.create("pauseCycle", { periodInMinutes: 1 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "pauseCycle") {
    chrome.tabs.query(
      { url: ["*://*.instagram.com/*", "*://*.youtube.com/*"] },
      (tabs) => {
        tabs.forEach((tab) => {
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: pauseContent,
          });
        });
      }
    );
  }
});

function pauseContent() {
  const pauseDuration = 60 * 1000; // 1 minute
  const hostname = window.location.hostname;

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
  }, pauseDuration);
}
