/* global chrome */
function pauseYouTube() {
    const videos = document.querySelectorAll('video');
    videos.forEach((video) => video.pause());
  }
  
  function resumeYouTube() {
    const videos = document.querySelectorAll('video');
    videos.forEach((video) => video.play());
  }
  
  function pauseInstagram() {
    document.body.style.overflow = "hidden";
  }
  
  function resumeInstagram() {
    document.body.style.overflow = "";
  }
  
  function showOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'pause-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    overlay.style.color = 'white';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '9999';
    overlay.innerText = 'Take a break for 1 minute!';
    document.body.appendChild(overlay);
  }
  
  function removeOverlay() {
    const overlay = document.getElementById('pause-overlay');
    if (overlay) {
      document.body.removeChild(overlay);
    }
  }
  
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "PAUSE_WEBSITE") {
      const hostname = window.location.hostname;
      showOverlay();
  
      if (hostname.includes("youtube.com")) {
        pauseYouTube();
      } else if (hostname.includes("instagram.com")) {
        pauseInstagram();
      }
  
      setTimeout(() => {
        removeOverlay();
        if (hostname.includes("youtube.com")) {
          resumeYouTube();
        } else if (hostname.includes("instagram.com")) {
          resumeInstagram();
        }
      }, 60000); // 1 minute
    }
  });
  