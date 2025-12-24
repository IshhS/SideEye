import anime from 'animejs/lib/anime.es.js';
import { loadApp } from './app1.js'; // <--- IMPORT THE DESTINATION

// --- CONFIGURATION ---
const QUESTIONS = [
  {
    text: "Serious Question: Why are you here?",
    options: [
      { text: "I want to be productive.", identity: "DELUSIONAL OPTIMIST", roast: "Cute. You think an app can fix you." },
      { text: "I have 5 minutes to kill.", identity: "DOOMSCROLLER CLASS C", roast: "5 minutes becomes 5 hours. We know." },
      { text: "I just want to break things.", identity: "AGENT OF CHAOS", roast: "Finally, an honest user." },
      { text: "My boss is looking.", identity: "CORPORATE FUGITIVE", roast: "Alt-Tab won't save you forever." }
    ]
  }
];

// --- STATE ---
let userSession = {
    name: "Unknown",
    identity: "Unknown",
    roast: ""
};

// --- INIT ---
export function initHome() {
    const app = document.querySelector('#app');
    app.innerHTML = `
        <div class="home-container" style="padding: 50px; text-align: center;">
            <div id="quiz-layer"></div>
        </div>
    `;
    renderQuestion(0);
}

// --- STEP 1: RENDER QUESTION ---
function renderQuestion(index) {
    const layer = document.querySelector('#quiz-layer');
    const q = QUESTIONS[index];

    const optionsHTML = q.options.map((opt, i) => 
        `<button class="option-btn" data-idx="${i}">[${i+1}] ${opt.text}</button>`
    ).join('');

    layer.innerHTML = `
        <h2 class="quiz-question" style="opacity:0">${q.text}</h2>
        <div class="options-grid" style="opacity:0">${optionsHTML}</div>
        
        <div class="custom-input-wrapper" style="opacity:0; margin-top: 40px; border-top: 1px dashed #333; padding-top: 20px;">
            <p style="font-size: 0.8rem; color: #666; margin-bottom: 10px;">OR TYPE YOUR OWN EXCUSE:</p>
            <div style="display: flex; justify-content: center; gap: 10px; max-width: 500px; margin: 0 auto;">
                <input type="text" id="custom-answer" placeholder="I refuse to click buttons..."
                    style="background: rgba(255,255,255,0.05); border: 1px solid #333; color: #fff; padding: 15px; font-family: monospace; flex-grow: 1; outline: none;">
                <button id="submit-custom-btn" class="sleek-btn" style="padding: 10px 25px;">⏎</button>
            </div>
        </div>
    `;

    // Animation
    anime.timeline()
        .add({ targets: '.quiz-question', opacity: [0, 1], translateY: [-20, 0], duration: 800, easing: 'easeOutExpo' })
        .add({ targets: '.option-btn', opacity: [0, 1], translateX: [-20, 0], delay: anime.stagger(100), duration: 600, easing: 'easeOutExpo' })
        .add({ targets: '.custom-input-wrapper', opacity: [0, 1], translateY: [20, 0], duration: 800, easing: 'easeOutExpo' }, '-=200');

    // Listeners
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = e.target.dataset.idx;
            userSession.identity = q.options[idx].identity;
            userSession.roast = q.options[idx].roast;
            transitionToNameInput();
        });
    });

    const handleCustomSubmit = () => {
        const input = document.getElementById('custom-answer');
        if(input.value.trim().length > 0) {
            userSession.identity = "THE ANOMALY";
            userSession.roast = "Too good for buttons? Typical main character syndrome.";
            transitionToNameInput();
        } else {
            anime({ targets: '#custom-answer', translateX: [0, 10, -10, 0], duration: 400, easing: 'easeInOutSine' });
        }
    };
    document.getElementById('submit-custom-btn').addEventListener('click', handleCustomSubmit);
    document.getElementById('custom-answer').addEventListener('keypress', (e) => { if(e.key === 'Enter') handleCustomSubmit(); });
}

// --- STEP 2: NAME INPUT ---
function transitionToNameInput() {
    const layer = document.querySelector('#quiz-layer');
    anime({
        targets: layer, opacity: 0, translateY: -20, duration: 400, easing: 'easeInQuad',
        complete: () => {
            layer.innerHTML = `
                <h2 class="quiz-question" style="opacity:0">And who do we blame for this?</h2>
                <div class="input-wrapper" style="opacity:0; margin-top: 20px;">
                    <input type="text" id="username-input" placeholder="Type your name..." 
                        style="background: transparent; border: none; border-bottom: 2px solid #ff0055; 
                               color: #fff; font-size: 1.5rem; text-align: center; padding: 10px; width: 80%; outline: none; font-family: monospace;">
                    <button id="confirm-name-btn" class="sleek-btn" style="margin-top: 30px;">Submit</button>
                </div>
            `;
            layer.style.opacity = 1; 
            layer.style.transform = 'translateY(0)';
            anime.timeline()
                .add({ targets: '.quiz-question', opacity: [0, 1], translateY: [20, 0], duration: 800, easing: 'easeOutExpo' })
                .add({ targets: '.input-wrapper', opacity: [0, 1], translateY: [20, 0], duration: 800, easing: 'easeOutExpo' }, '-=600');

            document.getElementById('confirm-name-btn').addEventListener('click', submitName);
            document.getElementById('username-input').addEventListener('keypress', (e) => { if (e.key === 'Enter') submitName(); });
            document.getElementById('username-input').focus();
        }
    });
}

// --- STEP 3: SUBMIT & REDIRECT ---
function submitName() {
    const input = document.getElementById('username-input');
    const name = input.value.trim();

    if (name.length > 0) {
        userSession.name = name;
        
        // FADE OUT HOME.JS
        const layer = document.querySelector('#quiz-layer');
        anime({
            targets: layer,
            opacity: 0,
            translateY: -20,
            duration: 400,
            easing: 'easeInQuad',
            complete: () => {
                // *** REDIRECT TO APP1.JS ***
                loadApp(userSession); 
            }
        });
    } else {
        anime({ targets: '#username-input', translateX: [0, 10, -10, 0], duration: 400, easing: 'easeInOutSine' });
    }
}