var running = false,
    sessionMode = true,
    sessionLength = 25,
    breakLength = 5,
    timeMinutes,
    timeSeconds,
    intervalIDTimer,
    oneSecondTimeout,

    // progress bar variables
    timeTotalMS = 1500000,
    timeCurrentMS,
    intervalIDProgressBar,
    amountLoaded = 0,
    ctx = document.querySelector('canvas').getContext('2d'),
    cw = ctx.canvas.width,
    ch = ctx.canvas.height;

/***** CONTROL *****/

// Event listeners
pomodoroUI.onclick = timerControl;
main.oninput = inputControl;

function inputControl(e) {

  // Clear mode message
  modeMessage.innerText = '';

  // Get input from sliders
  breakInput.oninput = function() {
    breakOutput.innerHTML = this.value; // this = input element
  }
  sessionInput.oninput = function() {
    sessionOutput.innerHTML = this.value;
    // console.log(e)
  }

  // Set session time
  if (e.target.id === 'sessionInput') {
    sessionLength = e.target.value;
  }

  setSessionTime(sessionLength);
}

// Timer start and pause function controls
function timerControl() {
   if (running === false) {
     startTimer();
   } else {
     pauseTimer();
   }
}

/***** MODEL *****/

// Initiates timer or restarts from paused state
function startTimer() {
  running = true;

  introMessage.innerText = '';

  // Disable inputs when running
  breakInput.disabled = true;
  sessionInput.disabled = true;

  // Set times
  timeMinutes = parseInt(currentMinutes.innerHTML);
  timeSeconds = parseInt(currentSeconds.innerHTML);

  // Play sound based on mode
  if (sessionMode) {
    playSound.session();
  } else {
    playSound.break();
  }

  timerInterval();
}

function timerInterval() {
  intervalIDTimer = setInterval(timer, 1000);
  intervalIDProgressBar = setInterval(progressBar, 1000);
}

// Core logic for running timer
function timer() {

  // If timer ends clear timers, switch modes, and restart
  if (timeMinutes === 0 && timeSeconds < 0) {
    clearInterval(intervalIDTimer);
    clearInterval(intervalIDProgressBar);

    toggleMode();
    startTimer();
  }

  // If time remains subtract one minute when seconds = 00
  if (timeMinutes > 0 && timeSeconds < 0) {
    timeMinutes = currentMinutes.innerHTML - 1;
    timeSeconds = 59;
  }

  // Prepend zeros to single digits
  if (timeSeconds < 10) {
    timeSeconds = '0' + timeSeconds;
  }

  displayTime(timeMinutes, timeSeconds);

  timeSeconds--;
}

function pauseTimer() {
  running = false;

  // Activate inputs
  breakInput.disabled = false;
  sessionInput.disabled = false;

  clearInterval(intervalIDTimer);
  clearInterval(intervalIDProgressBar);
}

function progressBar() {
  var start = 4.72, /* start circle at 12:00 north */
      diff;

  // Subtracted 1000 at the end to account for 1 second lapse in starting
  timeCurrentMS = (parseInt(currentMinutes.innerHTML) * 60 * 1000) +
                  (parseInt(currentSeconds.innerHTML) * 1000) - 1000;

  // amountLoaded is % difference relative to pi * 2 * 10 (62.80)
  diff = ((amountLoaded / 100) * Math.PI * 2 * 10).toFixed(2);

  // Converts elapsed time to percentage
  amountLoaded = 100 - ((timeCurrentMS / timeTotalMS) * 100);

  ctx.clearRect(0, 0, cw, ch); // starts at x, y, and clears to width, height
  ctx.lineWidth = 12;
  ctx.strokeStyle = 'palegreen';
  ctx.beginPath(); // starts drawing progress bar

  // ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise); size controls
  ctx.arc(125, 125, 112, start, diff / 10 + start, false);
  ctx.stroke();
}

// Clears canvas and resets progress bar
function progressBarReset() {
  ctx.clearRect(0, 0, cw, ch);
  amountLoaded = 0;
  timeTotalMS = parseInt(currentMinutes.innerHTML) * 60 * 1000;
}

var playSound = {
  session: function() {
    var sessionSound = new Audio ('sounds/20780_djgriffin_zen-gong(online-audio-converter.com).mp3');
    sessionSound.play();
  },
  break: function() {
    var breakSound = new Audio ('sounds/51713__bristolstories__u-chimes-short1.mp3');
    breakSound.play();
  }
};

/***** VIEW *****/

// Intro message
introMessage.innerHTML = 'Set timer and click tomato <br> to start or stop session';

// Display the updated session time when set
function setSessionTime(sessionLength) {
  currentMinutes.innerHTML = sessionLength;
  currentSeconds.innerHTML = '00';

  sessionMode = true;

  // Clear any previous progress
  progressBarReset();
}

// Display running timer
function displayTime(min, sec) {

  // console.log(min, sec);
  if (sessionMode) modeMessage.innerText = 'Work!';
  currentMinutes.innerHTML = min;
  currentSeconds.innerHTML = sec;
}

// Toggle between break and session modes
function toggleMode() {

  // Change to break mode
  if (sessionMode) {
    modeMessage.innerText = 'Break!';
    currentMinutes.innerHTML = breakInput.value;
    progressBarReset();

    // Change to session mode
  } else {
    modeMessage.innerText = 'Work!';
    currentMinutes.innerHTML = sessionInput.value;
    progressBarReset();
  }
  sessionMode = !sessionMode;
}
