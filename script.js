const bells = new Audio("bells.wav");

const modeTextHeader = document.querySelector(".mode-title");
const currentMinutes = document.getElementById("minutes");
const currentSeconds = document.getElementById("seconds");

const switchModeBtn = document.querySelector(".switch-mode-btn");
const playbackBtn = document.querySelector("#playback-btn");
const resetBtn = document.querySelector("#reset-btn");
const volumeBtn = document.querySelector(".volume-btn");
const volumeRange = document.querySelector(".volume-range");

const playIcon = playbackBtn.querySelector("#play-svg");
const pauseIcon = playbackBtn.querySelector("#pause-svg");

let intervalId;
let totalSeconds;

// The number of minutes for a work/break session
const WORK_MINUTES = 25;
const BREAK_MINUTES = 5;

/**
 * Formats a given string or number by adding leading zeros to ensure it has at least two digits.
 */
function formatTimeWithLeadingZeros(str) {
  return str.toString().padStart(2, "0");
}

/**
 * Initializes the timer with default values for a work session.
 */
function onInit() {
  const modeTextBtn = switchModeBtn.querySelector(".mode-text");

  modeTextHeader.innerText = "Work";
  currentMinutes.innerText = formatTimeWithLeadingZeros(WORK_MINUTES);
  currentSeconds.innerText = "00";
  modeTextBtn.innerText = "Break";
}

onInit();

/**
 * Restores the playback icons to their default values.
 * Play-Icon shown and Pause-Icon hidden.
 */
function restorePlaybackIcons() {
  playIcon.classList.remove("hidden");
  pauseIcon.classList.add("hidden");
}

/**
 * Helper function to check if current mode is 'Work'
 */
function isWorkMode() {
  return modeTextHeader.innerText === "Work";
}

function clearTimer() {
  clearInterval(intervalId);

  intervalId = null;
}

function resetTimer() {
  clearTimer();

  const modeMinutes = isWorkMode() ? WORK_MINUTES : BREAK_MINUTES;

  currentMinutes.innerText = formatTimeWithLeadingZeros(modeMinutes);
  currentSeconds.innerText = "00";
}

function handlePlaybackBtnClick() {
  playIcon.classList.toggle("hidden");
  pauseIcon.classList.toggle("hidden");

  if (playIcon.classList.contains("hidden")) {
    totalSeconds =
      parseInt(currentMinutes.innerText) * 60 +
      parseInt(currentSeconds.innerText);

    if (totalSeconds <= 0) {
      resetTimer();
    }

    intervalId = setInterval(updateTimer, 1000);
  } else {
    clearTimer();
  }
}

function handleSwitchModeClick(autoStart = false) {
  clearTimer();

  const modeTextBtn = switchModeBtn.querySelector(".mode-text");

  const modeText = isWorkMode() ? "Break" : "Work";
  const modeMinutes = isWorkMode() ? BREAK_MINUTES : WORK_MINUTES;

  modeTextHeader.innerText = modeText;
  modeTextBtn.innerText = modeText;

  currentMinutes.innerText = formatTimeWithLeadingZeros(modeMinutes);
  currentSeconds.innerText = "00";

  restorePlaybackIcons();

  if (autoStart) {
    handlePlaybackBtnClick();
  }
}

function updateTimer() {
  totalSeconds--;

  if (totalSeconds == 0) {
    const toggleAutoStart =
      document.getElementById("auto-start-toggle").checked;

    bells.play();
    handleSwitchModeClick(toggleAutoStart);

    return;
  }

  const minutesLeft = Math.floor(totalSeconds / 60);
  const secondsLeft = totalSeconds % 60;

  currentSeconds.innerHTML = formatTimeWithLeadingZeros(secondsLeft);
  currentMinutes.innerHTML = formatTimeWithLeadingZeros(minutesLeft);
}

function calculateVolume() {
  bells.volume = volumeRange.value / 100;
}

switchModeBtn.addEventListener("click", () => {
  handleSwitchModeClick();
});

playbackBtn.addEventListener("click", () => {
  handlePlaybackBtnClick();
});

resetBtn.addEventListener("click", () => {
  restorePlaybackIcons();
  resetTimer();
});

volumeBtn.addEventListener("click", () => {
  const volumeUpIcon = volumeBtn.querySelector("#volume-up-svg");
  const volumeMuteIcon = volumeBtn.querySelector("#volume-mute-svg");

  volumeUpIcon.classList.toggle("hidden");
  volumeMuteIcon.classList.toggle("hidden");

  if (volumeUpIcon.classList.contains("hidden")) {
    bells.volume = 0;
  } else {
    calculateVolume();
  }
});

volumeRange.addEventListener("change", () => {
  calculateVolume();
});
