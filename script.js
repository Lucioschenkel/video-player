const video = document.querySelector('video');
const player = document.querySelector('.player');
const progressRange = document.querySelector('.progress-range');
const progressBar = document.querySelector('.progress-bar');
const playButton = document.getElementById('play-btn');
const volumeIcon = document.getElementById('volume-icon');
const volumeRange = document.querySelector('.volume-range');
const volumeBar = document.querySelector('.volume-bar');
const currentTime = document.querySelector('.time-elapsed');
const duration = document.querySelector('.time-duration');
const fullscreenBtn = document.querySelector('.fullscreen');
const speed = document.querySelector('.player-speed');

// Play & Pause ----------------------------------- //
function showPlayIcon() {
  playButton.classList.replace('fa-pause', 'fa-play');
  playButton.setAttribute('title', 'Play');
}

function togglePlay() {
  if (video.paused) {
    video.play();
    playButton.classList.replace('fa-play', 'fa-pause');
    playButton.setAttribute('title', 'Pause');
    return
  }

  showPlayIcon();
  video.pause();
}


// Progress Bar ---------------------------------- //

// Calculate time format
function displayTime(time) {
  const minutes = Math.floor(time / 60);
  let seconds = Math.floor(time % 60);

  seconds = seconds < 10 ? `0${seconds}` : seconds;
  
  return `${minutes}:${seconds}`;
}

// Updates the progress bar
function updateProgress() {
  progressBar.style.width = `${(video.currentTime / video.duration) * 100}%`;
  currentTime.textContent = `${displayTime(video.currentTime)} / `;
  duration.textContent = `${displayTime(video.duration)}`;
}

// Click to seek the video
function setProgress(event) {
  const newTime = event.offsetX / progressRange.offsetWidth;

  progressBar.style.width = `${newTime * 100}%`;
  video.currentTime = newTime * video.duration;
}

// Volume Controls --------------------------- //
let lastVolume = 1;

function changeVolume(event) {
  let volume = event.offsetX / volumeRange.offsetWidth;

  // Rounding volume up or down
  if (volume < 0.1) {
    volume = 0;
  }

  if (volume > 0.9) {
    volume = 1;
  }

  volumeBar.style.width = `${volume * 100}%`;

  video.volume = volume;
  lastVolume = volume;

  // Change icon depending on the volume
  volumeIcon.className = '';

  if (volume > 0.7) {
    volumeIcon.classList.add('fas', 'fa-volume-up');
  } else if (volume < 0.7 && volume > 0) {
    volumeIcon.classList.add('fas', 'fa-volume-down');
  } else if (volume === 0) {
    volumeIcon.classList.add('fas', 'fa-volume-off');
  }
}

// Mute/unmute
function toggleMute() {
  volumeIcon.className = '';

  if (video.volume) {
    lastVolume = video.volume;
    video.volume = 0;
    volumeBar.style.width = '0%';
    volumeIcon.classList.add('fas', 'fa-volume-mute');
    volumeIcon.setAttribute('title', 'Unmute');
  } else {
    video.volume = lastVolume;
    volumeBar.style.width = `${lastVolume * 100}%`;

    if (lastVolume > 0.7) {
      volumeIcon.classList.add('fas', 'fa-volume-up');
    } else if (lastVolume < 0.7 && lastVolume > 0) {
      volumeIcon.classList.add('fas', 'fa-volume-down');
    }


    volumeIcon.setAttribute('title', 'Mute');
  }
}


// Change Playback Speed -------------------- //
function changeSpeed() {
  video.playbackRate = speed.value;
}


// Fullscreen ------------------------------- //
let fullscreen = false;

// View in fullscreen
function openFullScreen(elem) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { // Firefox
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { // Chrome, Safari, Opera
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { // IE Edge
    elem.msRequestFullscreen();
  }

  video.classList.add('video-fullscreen');
}

function closeFullScreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozRequestFullScreen) {
    document.mozExitFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitRequestFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }

  video.classList.remove('video-fullscreen');
}

function toggleFullScreen() {
  if (!fullscreen) {
    openFullScreen(player);
  } else {
    closeFullScreen();
  }

  fullscreen = !fullscreen;
}


// Event listeners
playButton.addEventListener('click', togglePlay);
video.addEventListener('click', togglePlay);
video.addEventListener('timeupdate', updateProgress);
video.addEventListener('canplay', updateProgress)
progressRange.addEventListener('click', setProgress);
volumeRange.addEventListener('click', changeVolume);
volumeIcon.addEventListener('click', toggleMute);
speed.addEventListener('change', changeSpeed);
fullscreenBtn.addEventListener('click', toggleFullScreen);
window.addEventListener('keyup', (e) => {
  e.preventDefault();
})

// On video end, show play icon
video.addEventListener('ended', showPlayIcon);
