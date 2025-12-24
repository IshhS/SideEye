import anime from 'animejs/lib/anime.es.js';

// --- THE DEADLY PUZZLE BANK ---
const PUZZLES = [
    
   
    {
        type: 'wait',
        question: "Patience Test: Wait for the button to turn GREEN.",
        special: true, // Custom logic
        hint: "Do not click while RED."
    },
    {
        type: 'reflex_hard',
        question: "Catch me. (I fade when you get close)",
        special: true 
    },
   
];

// --- MAIN FUNCTION ---
export function startPuzzle(onSuccess) {
    const puzzle = PUZZLES[Math.floor(Math.random() * PUZZLES.length)];
    
    // Note: transform: scaleX(-1) keeps the text readable while the app behind is flipped
    const modalHTML = `
        <div id="puzzle-overlay" style="
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.95); z-index: 9999;
            display: flex; flex-direction: column; justify-content: center; align-items: center;
            transform: scaleX(-1); 
            font-family: monospace;
        ">
            <div style="background: #050505; border: 1px solid #ff0055; padding: 40px; border-radius: 4px; max-width: 500px; width: 90%; text-align: center; box-shadow: 0 0 50px rgba(255, 0, 85, 0.2);">
                <h2 style="color: #ff0055; letter-spacing: 4px; margin-bottom: 20px;">CRITICAL FAILURE</h2>
                <p style="color: #fff; font-size: 1.1rem; margin-bottom: 30px; line-height: 1.5;">${puzzle.question}</p>
                
                <div id="puzzle-interaction" style="min-height: 80px; display: flex; align-items: center; justify-content: center;">
                    </div>

                <p id="puzzle-status" style="color: #444; font-size: 0.8rem; margin-top: 25px; min-height: 20px;">[ ATTEMPTING RECOVERY... ]</p>
                <p style="color: #333; font-size: 0.7rem; margin-top: 5px;">HINT: ${puzzle.hint || "Good luck."}</p>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // --- RENDER LOGIC BASED ON TYPE ---
    const container = document.getElementById('puzzle-interaction');
    
    // 1. REFLEX HARD (Moves & Fades)
    if (puzzle.type === 'reflex_hard') {
        container.innerHTML = `<button id="catch-me-btn" class="sleek-btn">RESTORE</button>`;
        const btn = document.getElementById('catch-me-btn');
        
        btn.addEventListener('mouseover', () => {
            const x = (Math.random() - 0.5) * 350;
            const y = (Math.random() - 0.5) * 350;
            
            anime({ 
                targets: btn, 
                translateX: x, 
                translateY: y, 
                opacity: [1, 0.2], // Fades out when moving
                duration: 250, 
                easing: 'easeOutCirc',
                complete: () => {
                     // Fade back in after move
                    anime({ targets: btn, opacity: 1, duration: 500 });
                }
            });
        });
        
        btn.addEventListener('click', () => resolvePuzzle(onSuccess));
    } 
    
    // 2. PATIENCE TEST (Wait Logic)
    else if (puzzle.type === 'wait') {
        container.innerHTML = `<button id="wait-btn" style="background: #ff0055; color: white; border: none; padding: 15px 30px; cursor: not-allowed;">WAIT...</button>`;
        const btn = document.getElementById('wait-btn');
        let isReady = false;

        // Random time between 3 and 6 seconds
        const waitTime = 3000 + Math.random() * 3000;

        setTimeout(() => {
            isReady = true;
            btn.style.background = "#00ff88";
            btn.style.color = "#000";
            btn.style.cursor = "pointer";
            btn.innerText = "CLICK NOW";
        }, waitTime);

        btn.addEventListener('click', () => {
            if(isReady) {
                resolvePuzzle(onSuccess);
            } else {
                // Punishment for clicking early
                anime({ targets: '#puzzle-overlay', translateX: [0, 20, -20, 0], duration: 300 });
                document.getElementById('puzzle-status').innerText = "TOO SOON. RESETTING TIMER.";
                document.getElementById('puzzle-status').style.color = "red";
                // Reset (Cruel)
                btn.innerText = "WAIT...";
                setTimeout(() => {
                    isReady = true;
                    btn.style.background = "#00ff88";
                    btn.style.color = "#000";
                    btn.style.cursor = "pointer";
                    btn.innerText = "CLICK NOW";
                }, waitTime);
            }
        });
    }

    // 3. STANDARD TEXT INPUT (Reverse Type / Hex / Binary)
    else {
        container.innerHTML = `
            <div style="display: flex; gap: 10px; width: 100%;">
                <input type="text" id="puzzle-input" placeholder="Answer..." autocomplete="off"
                    style="flex: 1; padding: 15px; font-family: monospace; border: 1px solid #333; background: #000; color: #fff; outline: none; text-align: center;">
                <button id="puzzle-submit" class="sleek-btn">></button>
            </div>
        `;

        const submitBtn = document.getElementById('puzzle-submit');
        const inputField = document.getElementById('puzzle-input');
        
        submitBtn.addEventListener('click', () => checkAnswer(puzzle, onSuccess));
        inputField.addEventListener('keypress', (e) => {
            if(e.key === 'Enter') checkAnswer(puzzle, onSuccess);
        });
        inputField.focus();
    }

    // Animate In
    anime({ targets: '#puzzle-overlay', opacity: [0, 1], duration: 500, easing: 'easeOutExpo' });
}

// --- CHECK ANSWER LOGIC ---
function checkAnswer(puzzle, onSuccess) {
    const input = document.getElementById('puzzle-input').value.trim();
    const status = document.getElementById('puzzle-status');

    if (input === puzzle.answer) { // Case sensitive for chaos
        resolvePuzzle(onSuccess);
    } else {
        // Wrong Answer
        anime({ targets: '#puzzle-interaction', translateX: [0, 10, -10, 10, -10, 0], duration: 400 });
        status.innerText = `WRONG. EXPECTED: "${puzzle.answer}" (Just kidding, figure it out)`;
        status.style.color = "#ff0055";
        document.getElementById('puzzle-input').value = ""; // Clear input to annoy them
    }
}

// --- SUCCESS LOGIC ---
function resolvePuzzle(onSuccess) {
    const status = document.getElementById('puzzle-status');
    const box = document.querySelector('#puzzle-overlay > div');
    
    status.innerText = "SYSTEM RESTORED.";
    status.style.color = "#00ff88";
    box.style.borderColor = "#00ff88";
    box.style.boxShadow = "0 0 50px rgba(0, 255, 136, 0.2)";

    anime({
        targets: '#puzzle-overlay',
        opacity: 0,
        delay: 800,
        duration: 800,
        easing: 'easeInExpo',
        complete: () => {
            document.getElementById('puzzle-overlay').remove();
            onSuccess();
        }
    });
}