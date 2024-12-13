/* global chrome */
chrome.alarms.create("pauseCycle", { periodInMinutes: 5 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "pauseCycle") {
    chrome.tabs.query({ url: ["*://*.instagram.com/*", "*://*.youtube.com/*"] }, (tabs) => {
      tabs.forEach((tab) => {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: pauseContent,
        });
      });
    });
  }
});

function pauseContent() {
  const pauseDuration = 60 * 1000; // 1 minute
  const videos = document.querySelectorAll("video");

  videos.forEach((video) => video.pause());

  setTimeout(() => {
    videos.forEach((video) => video.play());
  }, pauseDuration);
}
