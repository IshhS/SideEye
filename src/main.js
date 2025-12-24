import './style.css' // Keep your styles
import * as THREE from 'three';
import anime from 'animejs/lib/anime.es.js';
import { initHome } from './Home.js'; // <--- IMPORT THE NEW PAGE

// --- 1. INJECT HTML (Replace Vite Boilerplate) ---
document.querySelector('#app').innerHTML = `
  <div id="roast-ticker" class="ticker">INITIALIZING JUDGMENT...</div>

  <div class="center-stage">
    <h1 class="side-eye-title">
      <span class="letter">S</span>
      <span class="letter">i</span>
      <span class="letter">d</span>
      <span class="letter">e</span>
      <span class="letter">E</span>
      <span class="letter">y</span>
      <span class="letter">e</span>
    </h1>
    <button id="start-btn" class="sleek-btn">Get Started</button>
  </div>
`;

// --- 2. SELECT ELEMENTS ---
const tickerElement = document.getElementById('roast-ticker');
const startBtn = document.getElementById('start-btn');
const titleElements = document.querySelectorAll('.side-eye-title .letter');

// --- 3. CONFIGURATION & DATA ---
const ROASTS = [
  "Loading bad decisions...",
  "Judging your browser history...",
  "Oh, you're actually clicking that?",
  "Calculating your wasted potential...",
  "Initializing sarcasm module...",
  "Why are you here?",
  "Optimizing for disappointment...",
  "Scanning for intelligence... none found.",
  "Preparing to reject your input...",
  "SideEye is watching you."
];

// --- 4. ANIMATION LOGIC ---

// A. The Entrance
function animateEntrance() {
  anime.timeline({loop: false})
    .add({
      targets: '.side-eye-title .letter',
      translateY: ["1.1em", 0],
      translateZ: 0,
      duration: 750,
      delay: (el, i) => 50 * i,
      easing: "easeOutExpo"
    })
    .add({
      targets: '#start-btn',
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 800,
      easing: "easeOutExpo"
    }, '-=400');
}

// B. The Ticker Helpers
const getRandomRoast = () => ROASTS[Math.floor(Math.random() * ROASTS.length)];
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// C. The Rapid Shuffle Loop
// We need a variable to stop the loop when we leave the page
let isLandingPageActive = true; 

async function rapidShuffle(duration, speed) {
  const endTime = Date.now() + duration;
  while (Date.now() < endTime && isLandingPageActive) {
    tickerElement.innerText = getRandomRoast();
    tickerElement.style.color = Math.random() > 0.8 ? '#ffffff' : '#ff0055';
    await wait(speed);
  }
  if(isLandingPageActive) tickerElement.style.color = '#ff0055';
}

async function runTickerCycle() {
  while (isLandingPageActive) {
    await rapidShuffle(1000, 50); 
    if(!isLandingPageActive) break;
    
    tickerElement.innerText = getRandomRoast(); 
    await wait(2000);
    if(!isLandingPageActive) break;

    await rapidShuffle(4000, 50);
    if(!isLandingPageActive) break;

    tickerElement.innerText = getRandomRoast();
    await wait(2000);
  }
}

// --- 5. INTERACTION (THE TRANSITION) ---
startBtn.addEventListener('click', async () => {
    console.log("User attempted to start.");

    // STEP A: The Anti-UX Shake (First they think it failed)
    await anime({
        targets: '#start-btn',
        translateX: [0, 10, -10, 10, -10, 0], // Shake head "No"
        duration: 500,
        easing: 'easeInOutSine'
    }).finished;
    
    tickerElement.innerText = "FINE. ENTERING...";
    tickerElement.style.color = '#ff0055';
    startBtn.innerText = "Loading Regret...";

    // STEP B: The Exit Animation (Fade out elements)
    await anime({
        targets: ['.center-stage', '#roast-ticker'],
        opacity: 0,
        scale: 0.9,
        duration: 800,
        easing: 'easeInExpo',
        delay: 500 // Wait a moment for them to read "Fine"
    }).finished;

    // STEP C: Switch to Home Page
    isLandingPageActive = false; // Stop the ticker loop
    initHome(); // Load the new file logic
});

// --- 6. START EVERYTHING ---
animateEntrance();
runTickerCycle();