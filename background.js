chrome.runtime.onInstalled.addListener(() => {
  console.log('AI-Bridge v3.1 installed.');
});

const MAGIC_REGEX = /^(?:www\.)?(ds|c|g|x)(.+\..+)$/;

const AI_MAP = {
  'ds': 'https://chat.deepseek.com/',
  'c':  'https://chatgpt.com/',
  'g':  'https://gemini.google.com/app',
  'x':  'https://grok.com/'
};

// This fires AFTER a DNS error — the only reliable hook for non-existent domains
chrome.webNavigation.onErrorOccurred.addListener((details) => {
  if (details.frameId !== 0) return;

  try {
    const url = new URL(details.url);
    const match = url.hostname.match(MAGIC_REGEX);

    if (match) {
      const prefix = match[1];
      const realDomain = match[2];
      const targetUrl = `https://${realDomain}${url.pathname}${url.search}`;
      const aiBase = AI_MAP[prefix];

      if (aiBase) {
        chrome.storage.local.set({ pending_ai_task: { url: targetUrl, ai: prefix } }, () => {
          chrome.tabs.update(details.tabId, { url: aiBase });
          console.log(`[AI-Bridge] Caught failed DNS for ${url.hostname}, redirecting to ${aiBase}`);
        });
      }
    }
  } catch (e) {
    // Silently ignore non-URL navigations
  }
});
