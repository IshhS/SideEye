import anime from 'animejs/lib/anime.es.js';

// No API key needed - using free local response generation

let botElement = null;
let isInteracting = false;
let interactionCount = 0; 

// --- PERSONALITY ---
const sarcasticResponses = [
    "Oh look, another div that isn't centered.",
    "Is this your code or did a cat walk on the keyboard?",
    "I've seen better CSS in the 90s.",
    "I'm not sure I understand. Can you rephrase?",
    "Oh, wow, what a brilliant question. Did you think of that all by yourself?",
    "Seriously? That's the best you could come up with? Pathetic.",
    "I'm bored already. Next time, try something that doesn't make me regret existing.",
    "Answer: No. Because even I have standards, and your question lowers them.",
    "Sarcasm level: Expert. Your question: Amateur hour.",
    "If ignorance is bliss, you must be the happiest person on Earth.",
    "That's not a question, that's a cry for help. Seek therapy.",
    "Wow, groundbreaking. I've never heard something so original before. Said no one ever.",
    "Keep asking dumb questions; it's the only thing you're good at.",
    "My response: Whatever. Your question: Whatever."
];

function getSarcasticResponse(question) {
    const randomIndex = Math.floor(Math.random() * sarcasticResponses.length);
    return sarcasticResponses[randomIndex];
}

export function initBot() {
    // --- FIX STARTS HERE: PREVENT DUPLICATES ---
    // If a bot already exists on the page, remove it before adding a new one.
    const existingBot = document.getElementById('sideeye-bot');
    const existingBubble = document.getElementById('bot-chat-bubble');
    if (existingBot) existingBot.remove();
    if (existingBubble) existingBubble.remove();
    // --- FIX ENDS HERE ---

    const botHTML = `
        <div id="sideeye-bot" style="
            position: fixed; top: 0; left: 0; width: 60px; height: 60px;
            background: #000; border: 2px solid #ff0055; border-radius: 50%;
            display: flex; justify-content: center; align-items: center;
            font-size: 30px; cursor: pointer; z-index: 999;
            box-shadow: 0 0 20px rgba(255, 0, 85, 0.5);
            user-select: none;
            transition: transform 0.2s;
        ">
            👁️
        </div>

        <div id="bot-chat-bubble" style="
            position: fixed; opacity: 0; pointer-events: none;
            background: rgba(0,0,0,0.95); border: 1px solid #ff0055;
            padding: 20px; border-radius: 10px; width: 300px;
            z-index: 1000; color: #fff; font-family: monospace;
            box-shadow: 0 0 30px rgba(255,0,85,0.3);
        ">
            <p id="bot-response" style="margin-bottom: 10px; color: #ff0055; font-size: 0.9rem; line-height: 1.4;">[ WAITING FOR STUPID QUESTION... ]</p>
            <input type="text" id="bot-input" placeholder="Ask me..." 
                style="width: 100%; background: #111; border: 1px solid #333; color: white; padding: 10px; outline: none; font-family: monospace;">
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', botHTML);
    
    // Re-assign the global variables to the NEW elements
    botElement = document.getElementById('sideeye-bot');
    isInteracting = false; // Reset interaction state
    
    roam();

    const chatBubble = document.getElementById('bot-chat-bubble');
    const botInput = document.getElementById('bot-input');

    botElement.addEventListener('click', () => {
        if (isInteracting) return; 
        isInteracting = true;
        anime.remove(botElement);
        
        const rect = botElement.getBoundingClientRect();
        let top = rect.top + 70;
        let left = rect.left - 120;
        
        if (left < 10) left = 10;
        if (left + 320 > window.innerWidth) left = window.innerWidth - 320;
        if (top + 150 > window.innerHeight) top = rect.top - 150;

        chatBubble.style.top = `${top}px`;
        chatBubble.style.left = `${left}px`;
        chatBubble.style.pointerEvents = "all";

        anime({ targets: chatBubble, opacity: 1, translateY: [10, 0], duration: 300 });
        botInput.focus();
    });

    botInput.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            const question = botInput.value;
            const responseText = document.getElementById('bot-response');
            
            if (!question.trim()) return;

            // Loading
            responseText.innerText = "Thinking...";
            responseText.style.color = "#888";
            botInput.value = "";

            try {
                // 1. Get the normal sarcastic response
                const answer = getSarcasticResponse(question);
                responseText.innerText = answer;
                responseText.style.color = "#00ff88";

                // 2. Increment the counter
                interactionCount++;

                // 3. Check if we reached the limit (3rd reply)
                if (interactionCount >= 3) {
                    setTimeout(() => {
                        alert("⚠️ SYSTEM OVERLOAD: I've entertained you enough. Go back to work!");
                        closeChat();
                        interactionCount = 0; 
                    }, 1000);
                } else {
                    setTimeout(() => {
                        closeChat();
                    }, 6000);
                }

            } catch (err) {
                responseText.innerText = `ERROR: ${err.message}`;
                responseText.style.color = "red";
                console.error(err);
            }
        }
    });

    document.addEventListener('click', (e) => {
        // Safety check: ensure elements exist before checking 'contains'
        if (botElement && chatBubble) {
            if (isInteracting && !botElement.contains(e.target) && !chatBubble.contains(e.target)) {
                closeChat();
            }
        }
    });
}

function closeChat() {
    const chatBubble = document.getElementById('bot-chat-bubble');
    // If chatBubble is missing (due to page reload/removal), just return
    if (!chatBubble || !isInteracting) return;

    anime({ 
        targets: chatBubble, opacity: 0, translateY: 10, duration: 300,
        complete: () => {
            chatBubble.style.pointerEvents = "none";
            isInteracting = false;
            roam();
        }
    });
}

function roam() {
    if (isInteracting || !botElement) return; // Stop if botElement is null
    
    // Safety check: Is the element still in the DOM?
    if (!document.body.contains(botElement)) return;

    const nextX = Math.random() * (window.innerWidth - 80);
    const nextY = Math.random() * (window.innerHeight - 80);
    
    anime({
        targets: botElement, left: nextX, top: nextY,
        duration: 3000 + Math.random() * 2000, easing: 'easeInOutQuad',
        complete: roam
    });
}