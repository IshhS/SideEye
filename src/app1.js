// src/app1.js
import anime from 'animejs/lib/anime.es.js';

export function loadApp(userSession) {
    const app = document.querySelector('#app');
    
    // 1. WIPE THE SCREEN
    app.innerHTML = ''; 

    // 2. INJECT THE DASHBOARD UI (With Buttons instead of Input)
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
                    
                    <p style="color: #ff0055; font-size: 0.8rem; text-align: center; margin-bottom: 20px; letter-spacing: 2px;">
                        [ SYSTEM READY: INITIATE CHAOS? ]
                    </p>

                    <div style="display: flex; justify-content: center; gap: 20px;">
                        <button id="btn-yes" style="padding: 15px 30px; background: transparent; border: 1px solid #00ff88; color: #00ff88; cursor: pointer; font-family: monospace; font-size: 1.2rem; transition: 0.2s;">YES</button>
                        <button id="btn-no" style="padding: 15px 30px; background: transparent; border: 1px solid #ff0055; color: #ff0055; cursor: pointer; font-family: monospace; font-size: 1.2rem; transition: 0.2s;">NO</button>
                    </div>

                    <div id="error-label" style="opacity: 0; background: #ff0055; color: white; padding: 5px 10px; position: absolute; bottom: -15px; left: 50%; transform: translateX(-50%) rotate(-2deg); font-weight: bold; font-family: monospace; white-space: nowrap; pointer-events: none;">
                        STUPID. YOU HAVE TO CLICK YES.
                    </div>

                </div>
            </div>
        </div>
    `;

    // 3. ANIMATE ENTRANCE
    anime({
        targets: '.dashboard-header',
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 800,
        easing: 'easeOutExpo'
    });

    // 4. BUTTON LOGIC
    const btnYes = document.getElementById('btn-yes');
    const btnNo = document.getElementById('btn-no');
    const interactionBox = document.getElementById('interaction-box');
    const errorLabel = document.getElementById('error-label');

    // --- LOGIC: NO (The Roast) ---
    btnNo.addEventListener('click', () => {
        // 1. Shake the box
        anime({
            targets: interactionBox,
            translateX: [0, 10, -10, 10, -10, 0],
            duration: 400,
            easing: 'easeInOutSine'
        });

        // 2. Show the insult label
        anime({
            targets: errorLabel,
            opacity: [0, 1],
            scale: [0.5, 1],
            rotate: '-5deg',
            duration: 400,
            easing: 'easeOutElastic(1, .5)'
        });
    });

    // --- LOGIC: YES (The System Flip) ---
    btnYes.addEventListener('click', () => {
        // 1. Hide the error if it's there
        errorLabel.style.opacity = 0;

        // 2. Update Text
        interactionBox.innerHTML = `<p style="color: #00ff88; font-size: 1.2rem; text-align: center;">SYSTEM REVERSED. GOOD LUCK READING.</p>`;

        // 3. THE GRAND REVERSAL (Mirrors the whole app)
        anime({
            targets: '#app',
            scaleX: -1, // Flips everything horizontally
            duration: 1000,
            easing: 'easeInOutExpo'
        });

        console.log("System Flipped.");
    });

    console.log("Redirected to App1 successfully.");
}