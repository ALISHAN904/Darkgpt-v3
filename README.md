# DarkGPT AI v3

Simple version — no login, no database. OpenRouter API se chalta hai, chat history browser ke localStorage mein save hoti hai (multiple chats, jaise ChatGPT).

## Setup

1. openrouter.ai pe account bana, API key le
2. Vercel pe deploy karte waqt Environment Variable daal:
   ```
   OPENROUTER_API_KEY=<your key>
   ```
3. Deploy

## Note
- History sirf usi browser/device mein save rahegi jaha use kiya. Browser data clear karega toh chats delete ho jayengi.
- Model change karna ho toh `pages/api/chat.js` mein `MODEL` variable badal de.
