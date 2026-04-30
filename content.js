(function() {
    const AI_CONFIGS = {
        'ds': {
            name: 'DeepSeek',
            selectors: ['textarea', '[contenteditable="true"]', '#chat-input'],
            button: 'button[type="submit"], button.ds-send-button'
        },
        'c': {
            name: 'ChatGPT',
            selectors: ['#prompt-textarea', 'textarea'],
            button: 'button[data-testid="send-button"]'
        },
        'g': {
            name: 'Gemini',
            selectors: ['div.ql-editor[contenteditable="true"]', 'textarea'],
            button: 'button[aria-label="Send message"]'
        },
        'x': {
            name: 'Grok',
            selectors: ['textarea', '[role="textbox"]'],
            button: 'button[aria-label="Grok it"], button[type="submit"]'
        }
    };

    async function getTask() {
        // Check URL first
        const params = new URLSearchParams(window.location.search);
        const urlParam = params.get('pending_url');
        const aiParam = params.get('pending_ai');
        if (urlParam && aiParam) return { url: urlParam, ai: aiParam };

        // Check storage
        const data = await chrome.storage.local.get('pending_ai_task');
        return data.pending_ai_task;
    }

    async function automate() {
        const task = await getTask();
        if (!task) return;

        const config = AI_CONFIGS[task.ai];
        if (!config) return;

        console.log(`[AI-Bridge] Automating ${config.name} for:`, task.url);

        let inputArea = null;
        for (const selector of config.selectors) {
            inputArea = document.querySelector(selector);
            if (inputArea) break;
        }

        if (inputArea) {
            const prompt = `Please analyze this repository: ${task.url}\n\nProvide a high-level overview, architecture details, and key features.`;
            
            // Inject text
            if (inputArea.tagName === 'TEXTAREA' || inputArea.tagName === 'INPUT') {
                inputArea.value = prompt;
            } else {
                inputArea.innerText = prompt;
            }

            // Trigger events
            inputArea.dispatchEvent(new Event('input', { bubbles: true }));
            inputArea.dispatchEvent(new Event('change', { bubbles: true }));

            // Find button
            const sendButton = document.querySelector(config.button) || 
                               document.querySelector('button[type="submit"]') ||
                               document.querySelector('div[role="button"] svg')?.closest('button');

            if (sendButton) {
                setTimeout(async () => {
                    sendButton.click();
                    await chrome.storage.local.remove('pending_ai_task');
                    // Clean URL
                    const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
                    window.history.replaceState({}, '', cleanUrl);
                }, 1000);
            }
        } else {
            // Retry (page might be loading)
            setTimeout(automate, 2000);
        }
    }

    automate();
})();
