import './style.css' // Keep your styles
import * as THREE from 'three';
import anime from 'animejs/lib/anime.es.js'; // Using the ES module version for safety

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

// --- 2. SELECT ELEMENTS (Now that they exist in DOM) ---
const tickerElement = document.getElementById('roast-ticker');
const startBtn = document.getElementById('start-btn');

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

// A. The Entrance (Letters dropping in)
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

// C. The Rapid Shuffle (The Matrix/Glitch Effect)
async function rapidShuffle(duration, speed) {
  const endTime = Date.now() + duration;
  
  while (Date.now() < endTime) {
    tickerElement.innerText = getRandomRoast();
    // 20% chance to glitch to white text
    tickerElement.style.color = Math.random() > 0.8 ? '#ffffff' : '#ff0055';
    await wait(speed);
  }
  // Reset color to Pink/Red at end of shuffle
  tickerElement.style.color = '#ff0055';
}

// D. The Master Ticker Loop (Your specific pattern)
async function runTickerCycle() {
  while (true) {
    // 1. Rapid Change (1 second)
    await rapidShuffle(1000, 50); 
    
    // 2. STOP for 2 seconds (Readability)
    tickerElement.innerText = getRandomRoast(); 
    await wait(2000);

    // 3. Rapid Change (4 seconds - Chaos Mode)
    await rapidShuffle(4000, 50);

    // 4. STOP for 2 seconds
    tickerElement.innerText = getRandomRoast();
    await wait(2000);
    
    // Loop repeats...
  }
}

// --- 5. INTERACTION ---
startBtn.addEventListener('click', () => {
    console.log("User attempted to start.");
    
    // Anti-UX: Shake head "No"
    anime({
        targets: '#start-btn',
        translateX: [0, 10, -10, 0], 
        duration: 400,
        easing: 'easeInOutSine'
    });
    
    tickerElement.innerText = "ACCESS DENIED (JK)";
    tickerElement.style.color = '#ff0055';
});

// --- 6. START EVERYTHING ---
// We start immediately since we injected the HTML manually above
animateEntrance();
runTickerCycle();