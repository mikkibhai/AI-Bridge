chrome.runtime.onInstalled.addListener(() => {
  console.log('AI Bridge: Universal Shortcut Extension Installed.');
});

// Capture any of our magic prefixes
const PREFIXES = ['ds', 'c', 'g', 'x'];
const DOMAINS = ['github.com', 'gitlab.com', 'bitbucket.com', 'huggingface.co'];

chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  const url = new URL(details.url);
  const hostname = url.hostname;

  // Check if hostname starts with one of our prefixes
  for (const p of PREFIXES) {
    for (const d of DOMAINS) {
      if (hostname === p + d) {
        const fullTargetUrl = `https://${d}${url.pathname}${url.search}`;
        chrome.storage.local.set({ 'pending_ai_task': { url: fullTargetUrl, ai: p } }, () => {
          console.log(`[AI-Bridge] Task saved for ${p}:`, fullTargetUrl);
        });
        return;
      }
    }
  }
}, { url: [{ hostPrefix: 'ds' }, { hostPrefix: 'c' }, { hostPrefix: 'g' }, { hostPrefix: 'x' }] });
