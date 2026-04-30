# AI-Bridge: Universal Shortcut for Instant AI Analysis

AI-Bridge is a Chrome Extension that adds single-letter "magic" shortcuts to your browser's address bar. Instantly send **any website** to your favorite AI for analysis — just add a prefix before the domain name.

Inspired by the `ssyoutube.com` trick for video downloading, but for AI-powered analysis across the entire web.

## 🚀 Usage

Add a letter prefix before **any domain** in your address bar:

| Prefix | AI Model | Example |
|--------|----------|---------|
| **ds** | DeepSeek | `dsyoutube.com/watch?v=...` |
| **c**  | ChatGPT  | `cgithub.com/facebook/react` |
| **g**  | Gemini   | `gwikipedia.org/wiki/SpaceX` |
| **x**  | Grok     | `xmedium.com/some-article` |

Works with **any website** — GitHub, YouTube, Wikipedia, news sites, documentation, and more.

## 🧠 Context-Aware Prompting

The extension automatically detects the type of content and adjusts the AI prompt:

- **Code Repositories** (GitHub, GitLab) → Architecture and logic analysis
- **Videos** (YouTube) → Key takeaways and summary
- **Articles** (Wikipedia, Medium, News) → 3-bullet point summary
- **AI Models** (HuggingFace) → Use case and performance overview
- **Any other site** → General content analysis

## 🛠 Installation

1. Clone or download this repository.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** (top right toggle).
4. Click **Load unpacked** and select the project folder.
5. Done! Start using shortcuts immediately.

## ⚙️ How It Works

1. You type `dsyoutube.com/...` in the address bar.
2. Chrome tries to resolve the (non-existent) domain and fails.
3. The extension catches the DNS error via `onErrorOccurred`.
4. It detects the magic prefix, extracts the real URL, and redirects to the target AI.
5. A content script auto-fills the analysis prompt and submits it.

### Technical Stack
- **Engine**: Manifest V3 (MV3)
- **Interception**: `webNavigation.onErrorOccurred` — lightweight, only fires on failed navigations
- **State**: `chrome.storage` — persists tasks across login redirects
- **Automation**: Content scripts with per-AI DOM selectors

## 📁 Project Structure

```
├── manifest.json    # Extension config and permissions
├── background.js    # DNS error interception and redirection
├── content.js       # AI-specific prompt injection and automation
└── README.md
```

## 🔒 Privacy

- **No external servers.** Everything runs locally in your browser.
- **No tracking.** No data is collected or sent anywhere.
- **No background polling.** The extension only activates when a navigation error occurs.

## ⚖️ License

MIT
