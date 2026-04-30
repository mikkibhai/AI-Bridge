# AI-Bridge: Universal Shortcut for AI Code Analysis

AI-Bridge is a Chrome Extension that adds "Magic" shortcuts to your browser. Replicate the `ssyoutube` experience for AI: instantly analyze any GitHub, GitLab, or HuggingFace link using DeepSeek, ChatGPT, Gemini, or Grok.

## 🚀 Usage

Simply add a letter prefix before the domain in your address bar:

- **c**github.com/... → Open in **ChatGPT**
- **ds**github.com/... → Open in **DeepSeek**
- **g**github.com/... → Open in **Gemini**
- **x**github.com/... → Open in **Grok**

*Works for github.com, gitlab.com, bitbucket.org, and huggingface.co.*

## 🛠 Installation (Developer Mode)

1. Clone this repository.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode**.
4. Click **Load unpacked** and select this folder.

## 🧠 How it Works
- **Redirection**: Uses Chrome's `declarativeNetRequest` for instant URL transformation.
- **Automation**: Content scripts detect the repository URL and automatically pre-fill/send the prompt to the AI.
- **Persistence**: Uses `chrome.storage` to ensure analysis triggers even after login redirects.

## ⚖️ License
MIT
