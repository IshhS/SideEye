import anime from 'animejs/lib/anime.es.js';
import { startPuzzle } from './puzzle.js'; // <--- IMPORT PUZZLE

export function loadApp(userSession) {
    const app = document.querySelector('#app');
    
    // 1. WIPE
    app.innerHTML = ''; 

    // 2. INJECT UI
    app.innerHTML = `
        <div class="dashboard-header" style="padding: 50px; text-align: center; opacity: 0;">
            <p style="color: #666; font-size: 0.9rem;">IDENTITY CONFIRMED</p>
            <div class="identity-badge" style="border: 1px dashed #ff0055; padding: 10px 20px; color: #ff0055; display: inline-block; margin: 15px 0; font-family: monospace; letter-spacing: 2px;">
                ${userSession.identity}
            </div>
            <h1 style="font-size: 3rem; margin: 20px 0; color: #fff;">WELCOME, ${userSession.name.toUpperCase()}</h1>
            <p style="color: #fff; font-size: 1.2rem; border-left: 3px solid #ff0055; padding-left: 15px; display: inline-block; margin-bottom: 40px;">
                "${userSession.roast}"
            </p>
            
            <div style="width: 100%; max-width: 600px; margin: 0 auto; position: relative;">
                <div id="interaction-box" style="background: rgba(255, 255, 255, 0.05); border: 1px solid #333; padding: 30px; border-radius: 8px; transition: all 0.3s;">
                    <p id="box-title" style="color: #ff0055; font-size: 0.8rem; text-align: center; margin-bottom: 20px; letter-spacing: 2px;">
                        [ SYSTEM READY: INITIATE CHAOS? ]
                    </p>
                    <div id="btn-container" style="display: flex; justify-content: center; gap: 20px;">
                        <button id="btn-yes" style="padding: 15px 30px; background: transparent; border: 1px solid #00ff88; color: #00ff88; cursor: pointer; font-family: monospace; font-size: 1.2rem; transition: 0.2s;">YES</button>
                        <button id="btn-no" style="padding: 15px 30px; background: transparent; border: 1px solid #ff0055; color: #ff0055; cursor: pointer; font-family: monospace; font-size: 1.2rem; transition: 0.2s;">NO</button>
                    </div>
                    <div id="error-label" style="opacity: 0; background: #ff0055; color: white; padding: 5px 10px; position: absolute; bottom: -15px; left: 50%; transform: translateX(-50%) rotate(-2deg); font-weight: bold; font-family: monospace; white-space: nowrap; pointer-events: none;">
                        STUPID. YOU HAVE TO CLICK YES.
                    </div>
                </div>
                
                <button id="btn-fix" style="opacity: 0; pointer-events: none; margin-top: 20px; background: #fff; color: #000; border: none; padding: 10px 20px; font-weight: bold; cursor: pointer;">
                    I REGRET EVERYTHING. FIX IT.
                </button>
            </div>
        </div>
    `;

    // 3. ANIMATE ENTRANCE
    anime({ targets: '.dashboard-header', opacity: [0, 1], translateY: [20, 0], duration: 800, easing: 'easeOutExpo' });

    // 4. LOGIC
    const btnYes = document.getElementById('btn-yes');
    const btnNo = document.getElementById('btn-no');
    const btnFix = document.getElementById('btn-fix');
    const interactionBox = document.getElementById('interaction-box');
    const errorLabel = document.getElementById('error-label');

    // --- LOGIC: NO (Roast) ---
    btnNo.addEventListener('click', () => {
        anime({ targets: interactionBox, translateX: [0, 10, -10, 10, -10, 0], duration: 400, easing: 'easeInOutSine' });
        anime({ targets: errorLabel, opacity: [0, 1], scale: [0.5, 1], rotate: '-5deg', duration: 400, easing: 'easeOutElastic(1, .5)' });
    });

    // --- LOGIC: YES (Chaos + Enable Fix) ---
    btnYes.addEventListener('click', () => {
        errorLabel.style.opacity = 0;
        
        // Disable Yes/No
        document.getElementById('btn-container').innerHTML = `<p style="color: #00ff88;">SYSTEM REVERSED.</p>`;
        
        // Flip the Screen
        anime({ targets: '#app', scaleX: -1, duration: 1000, easing: 'easeInOutExpo' });

        // Show Fix Button (Delayed)
        setTimeout(() => {
            btnFix.style.pointerEvents = 'all';
            anime({ targets: '#btn-fix', opacity: 1, translateY: [10, 0], duration: 500 });
        }, 1500);
    });

    // --- LOGIC: FIX (Trigger Puzzle) ---
    btnFix.addEventListener('click', () => {
        console.log("Starting puzzle...");
        
        // TRIGGER THE PUZZLE FROM PUZZLE.JS
        startPuzzle(() => {
            // THIS RUNS ONLY IF PUZZLE IS SOLVED
            anime({ targets: '#app', scaleX: 1, duration: 1000, easing: 'easeInOutExpo' });
            
            // Update UI to show success
            document.getElementById('box-title').innerText = "[ SYSTEM RESTORED ]";
            btnFix.style.display = 'none';
        });
    });
}