import anime from 'animejs/lib/anime.es.js';

let startTime = 0;
let sceneIndex = 0;
let gameContainer = null;
let score = 1000; 
let mistakes = 0;

// FINAL RED ROASTS
const FINAL_INSULTS = [
    "YOU ARE THE REASON AI WILL TAKE OVER.",
    "I'VE SEEN BETTER REFLEXES ON A TOASTER.",
    "DELETE YOUR ACCOUNT IMMEDIATELY.",
    "YOUR BROWSER HISTORY IS MORE IMPRESSIVE THAN THIS.",
    "ERROR 404: SKILL NOT FOUND.",
    "EVEN THE PIXELS ARE LAUGHING AT YOU."
];

// THE 5 SCENES
const STORIES = [
    {
        title: "SCENE 1: PRECISION SURGERY",
        desc: "The pixels are decaying. Fix them before they vanish.",
        action: "Click the button 10 times. It gets smaller. Don't miss.",
        btnText: "FIX ME"
    },
    {
        title: "SCENE 2: THE IMPULSE TEST",
        desc: "I need to know if you can follow basic orders.",
        action: "Only click when the button is GREEN. If it's RED, do nothing.",
        btnText: "WAIT..."
    },
    {
        title: "SCENE 3: THE PATIENCE TRAP",
        desc: "Motion is failure. Stillness is progress.",
        action: "Let the bar fill. If you move 1 pixel, -50 POINTS.",
        btnText: "LOADING..."
    },
    {
        title: "SCENE 4: HUMAN VERIFICATION",
        desc: "Prove you are not a clumsy script.",
        action: "Check the box. If you can catch it.",
        btnText: "I AM HUMAN"
    },
    {
        title: "FINAL JUDGMENT",
        desc: "The results are in.",
        action: "Witness your mediocrity.",
        btnText: "ACCEPT SHAME"
    }
];

export function startDeadlyGames(onComplete) {
    startTime = Date.now();
    sceneIndex = 0;
    score = 1000;
    mistakes = 0;
    
    // Create the overlay
    const overlayHTML = `
        <div id="deadly-games-overlay" style="
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.98); z-index: 2000;
            display: flex; justify-content: center; align-items: center;
            flex-direction: column; opacity: 0; font-family: 'Courier New', monospace;
        ">
            <div style="position: absolute; top: 20px; right: 20px; color: #00ff88; font-size: 1.5rem;">
                SCORE: <span id="live-score">1000</span>
            </div>

            <div id="game-card" style="
                width: 450px; padding: 40px; border: 2px solid #ff0055;
                background: #0a0a0a; text-align: center; color: white;
                box-shadow: 0 0 50px rgba(255,0,85,0.1); transform: scale(0.8);
                position: relative; overflow: hidden;
            ">
                <div id="damage-flash" style="position: absolute; top:0; left:0; width:100%; height:100%; background: red; opacity: 0; pointer-events: none;"></div>
                
                <h2 id="g-title" style="color: #ff0055; margin-bottom: 10px; font-weight: bold; letter-spacing: 2px;"></h2>
                <p id="g-desc" style="color: #888; margin-bottom: 20px; font-size: 0.9rem;"></p>
                <p id="g-action" style="color: #fff; margin-bottom: 30px; font-style: italic; border-bottom: 1px solid #333; padding-bottom: 10px;"></p>
                
                <div id="g-stage" style="margin: 20px 0; min-height: 150px; display: flex; justify-content: center; align-items: center; position: relative;">
                    </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', overlayHTML);
    gameContainer = document.getElementById('deadly-games-overlay');
    
    // Fade in
    anime({ targets: gameContainer, opacity: 1, duration: 500 });
    anime({ targets: '#game-card', scale: 1, duration: 800, easing: 'easeOutElastic' });

    // Start Score Decay Loop
    startScoreDecay();

    loadScene(0, onComplete);
}

function startScoreDecay() {
    const scoreEl = document.getElementById('live-score');
    const interval = setInterval(() => {
        if (!gameContainer || !document.body.contains(gameContainer) || sceneIndex === 4) {
            clearInterval(interval);
            return;
        }
        score -= 5; // Decay
        if(score < 0) score = 0;
        if(scoreEl) scoreEl.innerText = score;
    }, 1000);
}

function punishUser() {
    score -= 50;
    mistakes++;
    const scoreEl = document.getElementById('live-score');
    if(scoreEl) scoreEl.innerText = score;
    
    if(scoreEl) scoreEl.style.color = "red";
    setTimeout(() => { if(scoreEl) scoreEl.style.color = "#00ff88"; }, 200);

    anime({ targets: '#game-card', translateX: [0, -10, 10, -10, 10, 0], duration: 300, easing: 'easeInOutSine' });
    anime({ targets: '#damage-flash', opacity: [0.8, 0], duration: 300, easing: 'easeOutQuad' });
}

function loadScene(index, onComplete) {
    const card = document.getElementById('game-card');
    const title = document.getElementById('g-title');
    const desc = document.getElementById('g-desc');
    const action = document.getElementById('g-action');
    const stage = document.getElementById('g-stage');
    
    const story = STORIES[index];

    anime({ targets: card, translateX: [0, -50, 0], opacity: [1, 0.5, 1], duration: 300, easing: 'easeInOutSine' });

    title.innerText = story.title;
    desc.innerText = story.desc;
    action.innerText = story.action;
    stage.innerHTML = ''; 

    // --- SCENE 1: THE SHRINKING BUTTON (FIXED LOGIC) ---
    if (index === 0) {
        let clicks = 0;
        const btn = createBtn(story.btnText, '#ff0055');
        
        // **FIX:** Disable default click effect (translateY) so it doesn't conflict with anime.js
        btn.onmousedown = null; 
        btn.onmouseup = null;
        
        stage.appendChild(btn);
        
        // Trap: Clicking background
        stage.onclick = (e) => {
            if (e.target === stage) punishUser();
        };

        btn.onclick = (e) => {
            e.stopPropagation(); // Stop stage click
            clicks++;
            btn.innerText = `FIX (${clicks}/10)`;
            
            // Movement Logic
            const scale = 1 - (clicks * 0.08); 
            const rndX = (Math.random() - 0.5) * 200;
            const rndY = (Math.random() - 0.5) * 100;
            
            anime({
                targets: btn,
                translateX: rndX, translateY: rndY, scale: scale,
                duration: 100, easing: 'easeOutQuad'
            });

            if (clicks >= 10) {
                stage.onclick = null;
                nextScene(onComplete);
            }
        };
    }

    // --- SCENE 2: THE REFLEX TRAP ---
    else if (index === 1) {
        const btn = createBtn("DO NOT CLICK", 'red');
        btn.style.width = "200px";
        stage.appendChild(btn);

        let safeToClick = false;
        let trapTimeout;

        const cycleText = () => {
            safeToClick = false;
            btn.innerText = "DO NOT CLICK";
            btn.style.background = "red";
            
            const delay = 1000 + Math.random() * 2000;
            
            trapTimeout = setTimeout(() => {
                safeToClick = true;
                btn.innerText = "CLICK NOW!";
                btn.style.background = "#00ff88";
            }, delay);
        };

        cycleText();

        btn.onclick = () => {
            if (safeToClick) {
                nextScene(onComplete);
            } else {
                punishUser();
                clearTimeout(trapTimeout);
                cycleText();
            }
        };
    }

    // --- SCENE 3: THE TROLL BAR ---
    else if (index === 2) {
        const barContainer = document.createElement('div');
        barContainer.style.cssText = "width: 100%; height: 20px; background: #333; border: 1px solid #555; position: relative;";
        const barFill = document.createElement('div');
        barFill.style.cssText = "width: 0%; height: 100%; background: #ff0055; transition: width 0.1s linear;";
        barContainer.appendChild(barFill);
        stage.appendChild(barContainer);
        
        const status = document.createElement('div');
        status.style.cssText = "margin-top: 15px; font-size: 0.8rem; color: #666;";
        status.innerText = "Don't move...";
        stage.appendChild(status);

        let progress = 0;
        let isComplete = false;

        const interval = setInterval(() => {
            if (isComplete) return;

            let increment = 1;
            if (progress > 80) increment = 0.2;
            if (progress > 95) increment = 0.05;

            progress += increment;
            barFill.style.width = `${progress}%`;

            if (progress >= 100) {
                isComplete = true;
                clearInterval(interval);
                document.onmousemove = null; 
                nextScene(onComplete);
            }
        }, 50);

        document.onmousemove = () => {
            if (!isComplete) {
                punishUser(); // -50 pts
                progress = 0; // Reset Bar
                barFill.style.width = '0%';
                status.innerText = "YOU MOVED. -50 PTS.";
                status.style.color = "red";
                setTimeout(() => { status.style.color = "#666"; status.innerText = "Don't move..."; }, 1000);
            }
        };
    }

    // --- SCENE 4: HUMAN VERIFICATION ---
    else if (index === 3) {
        const boxContainer = document.createElement('div');
        boxContainer.style.cssText = "width: 100%; height: 100%; position: relative; cursor: crosshair;";
        stage.appendChild(boxContainer);

        const checkBtn = document.createElement('div');
        checkBtn.style.cssText = `
            width: 20px; height: 20px; border: 2px solid #00ff88; 
            position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
            cursor: pointer; background: transparent; transition: background 0.1s;
        `;
        boxContainer.appendChild(checkBtn);
        
        const label = document.createElement('span');
        label.innerText = " CLICK ME";
        label.style.marginLeft = "30px";
        label.style.color = "#00ff88";
        checkBtn.appendChild(label);

        // Evil Hover: Run away
        checkBtn.onmouseover = () => {
            if (Math.random() > 0.3) {
                const maxX = 300; 
                const maxY = 100;
                const rndX = (Math.random() * maxX) - (maxX/2);
                const rndY = (Math.random() * maxY) - (maxY/2);
                
                anime({
                    targets: checkBtn,
                    translateX: rndX, translateY: rndY,
                    duration: 200, easing: 'easeOutQuad'
                });
            }
        };

        // Trap: Clicking background
        boxContainer.onclick = (e) => {
            // Only punish if we clicked the container, not the button
            if(e.target === boxContainer) punishUser();
        };

        checkBtn.onclick = (e) => {
            e.stopPropagation();
            checkBtn.style.background = "#00ff88"; 
            setTimeout(() => nextScene(onComplete), 300);
        };
    }

    // --- SCENE 5: FINAL RESULT ---
    else if (index === 4) {
        const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
        
        let rank = "F";
        let color = "#666";
        if (score > 800) { rank = "S"; color = "#00ff88"; }
        else if (score > 600) { rank = "B"; color = "yellow"; }
        else if (score > 400) { rank = "C"; color = "orange"; }
        else { rank = "F-"; color = "red"; }

        const finalRedRoast = FINAL_INSULTS[Math.floor(Math.random() * FINAL_INSULTS.length)];

        stage.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 10px; width: 100%;">
                <div style="font-size: 1rem; color: #ccc;">FINAL SCORE</div>
                <div style="font-size: 3rem; color: ${color}; font-weight: bold;">${score}</div>
                <div style="font-size: 1rem; border-top: 1px solid #333; padding-top: 10px;">RANK: <span style="color: ${color}; font-size: 1.5rem;">${rank}</span></div>
                
                <div style="margin-top: 15px; color: red; font-weight: bold; font-size: 1.1rem; text-transform: uppercase; text-shadow: 0 0 10px rgba(255,0,0,0.5); animation: pulse 2s infinite;">
                    "${finalRedRoast}"
                </div>
            </div>
        `;
        
        action.innerText = `Total time wasted: ${totalTime}s | Mistakes: ${mistakes}`;

        const finishBtn = createBtn("LEAVE IN SHAME", "#333");
        finishBtn.style.marginTop = "20px";
        stage.appendChild(finishBtn);
        
        finishBtn.onclick = () => {
            anime({
                targets: gameContainer, opacity: 0, duration: 500,
                complete: () => { gameContainer.remove(); if (onComplete) onComplete(); }
            });
        };
    }
}

function nextScene(onComplete) {
    sceneIndex++;
    setTimeout(() => { loadScene(sceneIndex, onComplete); }, 500);
}

function createBtn(text, color) {
    const btn = document.createElement('button');
    btn.innerText = text;
    btn.style.cssText = `
        padding: 12px 25px; background: ${color}; color: white; 
        border: none; font-family: monospace; cursor: pointer; 
        font-size: 1.1rem; transition: all 0.1s; font-weight: bold;
        box-shadow: 0 4px 0 rgba(0,0,0,0.5); border-radius: 4px;
    `;
    // Default click effects (will be disabled for Scene 1)
    btn.onmousedown = () => btn.style.transform = "translateY(2px)";
    btn.onmouseup = () => btn.style.transform = "translateY(0)";
    return btn;
}

// Add CSS animation for the red text
const style = document.createElement('style');
style.innerHTML = `
  @keyframes pulse {
    0% { opacity: 0.8; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.05); }
    100% { opacity: 0.8; transform: scale(1); }
  }
`;
document.head.appendChild(style);