# git blame --emotions 💔

> *No solutions. Just vibes.*

![git blame --emotions in action](https://highflyer910.sirv.com/gitblame.png)

A Shakespearean error therapy app powered by Google Gemini AI and a complete disregard for productivity.

You paste your error message. It writes you a sonnet. The error remains. You feel seen.

**Live site:** [git-blame--emotions](https://git-blame-emotions.vercel.app)

---

## What It Does

1. You paste an error message, or stack trace
2. Google Gemini AI reads it and writes a **Shakespearean sonnet** - 14 lines, ABAB CDCD EFEF GG rhyme scheme, iambic pentameter
3. Confetti fires
4. You feel emotionally validated
5. Your code is still broken

This tool will not fix your bugs. It will not suggest a solution. It will not link you to Stack Overflow. It will, however, tell you that your `NullPointerException` is *"a void where love should be"* - and sometimes that's enough.

> ⚠️ **Bonus:** Paste anything containing `418` or `teapot` for a special surprise. RFC 2324 compliant.

---

## Tech Stack

- **Vanilla HTML, CSS, JavaScript** - zero frameworks, zero build tools, zero npm
- **Google Generative AI API** - for the sonnets
- **Vercel Serverless Function** (`api/poem.js`) - keeps the API key server-side
- **canvas-confetti** - for emotional release
- **UnifrakturMaguntia + Patrick Hand** - for maximum drama
- **Comic Sans MS** - non-negotiable

---

## Features (All Intentional)

- 🌈 Rainbow `<marquee>` at the top because it's 1999
- ✨ Sparkle cursor that follows your mouse
- 🔢 Visitor counter permanently stuck at `000418`
- 🚧 Blinking "UNDER ETERNAL EMOTIONAL CONSTRUCTION" sign
- 📺 Mobile users get a modal asking them to rotate their CRT monitor
- 418/teapot easter egg with full confetti cannon
- 🏆 Hall of Fame featuring the most emotionally devastating errors in history

---

## Why

It was April Fools. The brief said "build something completely useless."


*Built for the [DEV April Fools Challenge 2026](https://dev.to/challenges/aprilfools-2026) - #418challenge*

---

## License

MIT - though using this in production to debug real issues is strongly discouraged and also deeply funny.

---

*No bugs were fixed during the making of this repository.* 🖥️