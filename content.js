(function() {
    const AI_CONFIGS = {
        'ds': { name: 'DeepSeek', selectors: ['textarea', '[contenteditable="true"]', '#chat-input'], button: 'button[type="submit"]' },
        'c': { name: 'ChatGPT', selectors: ['#prompt-textarea', 'textarea'], button: 'button[data-testid="send-button"]' },
        'g': { name: 'Gemini', selectors: ['div.ql-editor', 'textarea'], button: 'button[aria-label="Send message"]' },
        'x': { name: 'Grok', selectors: ['textarea', '[role="textbox"]'], button: 'button[aria-label="Grok it"]' }
    };

    function getSmartPrompt(url) {
        const u = url.toLowerCase();
        if (u.includes('github.com') || u.includes('gitlab.com')) {
            return `Please analyze this code repository: ${url}\n\nProvide an architecture overview and explain the main logic.`;
        }
        if (u.includes('youtube.com') || u.includes('youtu.be')) {
            return `Please summarize this video: ${url}\n\nList the key takeaways and main points discussed.`;
        }
        if (u.includes('wikipedia.org') || u.includes('medium.com') || u.includes('news')) {
            return `Please summarize this article/page: ${url}\n\nProvide a concise 3-bullet point summary.`;
        }
        if (u.includes('huggingface.co')) {
            return `Please explain this AI model/dataset: ${url}\n\nWhat is its primary use case and performance?`;
        }
        // Default prompt for any other site
        return `Please analyze this website: ${url}\n\nSummarize the content and tell me what the main purpose of this page is.`;
    }

    async function automate() {
        const data = await chrome.storage.local.get('pending_ai_task');
        const task = data.pending_ai_task;
        if (!task) return;

        const config = AI_CONFIGS[task.ai];
        if (!config) return;

        let inputArea = null;
        for (const selector of config.selectors) {
            inputArea = document.querySelector(selector);
            if (inputArea) break;
        }

        if (inputArea) {
            const prompt = getSmartPrompt(task.url);
            
            if (inputArea.tagName === 'TEXTAREA') {
                inputArea.value = prompt;
            } else {
                inputArea.innerText = prompt;
            }

            inputArea.dispatchEvent(new Event('input', { bubbles: true }));
            
            const sendButton = document.querySelector(config.button) || 
                               document.querySelector('button[type="submit"]') ||
                               document.querySelector('div[role="button"] svg')?.closest('button');

            if (sendButton) {
                setTimeout(async () => {
                    sendButton.click();
                    await chrome.storage.local.remove('pending_ai_task');
                    const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
                    window.history.replaceState({}, '', cleanUrl);
                }, 1000);
            }
        } else {
            setTimeout(automate, 2000);
        }
    }

    automate();
})();
