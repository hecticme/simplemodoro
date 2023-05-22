export function getTime() {
  const storageSessionTime = localStorage.getItem("sessionTime");
  const storageBreakTime = localStorage.getItem("breakTime");
  return {
    sessionTime: storageSessionTime ? storageSessionTime : 25 * 60,
    breakTime: storageBreakTime ? storageBreakTime : 5 * 60,
    displayTime: storageSessionTime ? storageSessionTime : 25 * 60,
  };
}

export function getGoal() {
  const storageGoal = localStorage.getItem("goal");
  return storageGoal ? storageGoal : 1;
}

export function getProgress() {
  const localProgress = JSON.parse(localStorage.getItem("progress"));
  if (localProgress) {
    return localProgress.progress;
  } else {
    return 0;
  }
}

export function formatTime(time) {
  let minutes;
  let seconds;
  if (time < 0) {
    // Prevent flickering.
    minutes = 0;
    seconds = 0;
  } else {
    minutes = Math.floor(time / 60);
    seconds = time % 60;
  }
  return (
    (minutes < 10 ? "0" + minutes : minutes) +
    ":" +
    (seconds < 10 ? "0" + seconds : seconds)
  );
}

export function playNotification(sound) {
  sound.currentTime = 0;
  sound.play();
}

export function changeDocumentIcon(suffix) {
  let faviconLight = document.querySelector(
    'link[rel="icon"][media="(prefers-color-scheme: light)"]'
  );
  let faviconDark = document.querySelector(
    'link[rel="icon"][media="(prefers-color-scheme: dark)"]'
  );
  faviconLight.href = `/favicon-light${suffix}.svg`;
  faviconDark.href = `/favicon-dark${suffix}.svg`;
}
