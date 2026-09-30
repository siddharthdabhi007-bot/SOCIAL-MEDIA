# POSTFLOW AI — One Idea. Every Platform.

> Turn one piece of content, announcement, job vacancy, or idea into platform-perfect content for Instagram, Facebook, LinkedIn, X (Twitter), WhatsApp, Snapchat, and Handshake.

---

## 🌟 Overview

**PostFlow AI** is a production-ready, full-stack social media content transformation and scheduling engine. Rather than copying identical text across platforms, PostFlow respects each network's unique writing culture, length limitations, hook structures, hashtag density, tone requirements, and audience expectations.

### Supported Platforms & Custom Rules:
- **Instagram**: Catchy visual opening hook, aesthetic vertical spacing, emojis, save/share CTA, and 8–15 targeted hashtags.
- **LinkedIn**: Thought leadership, business value narrative, executive spacing, clear bullet points, and 3–5 professional hashtags.
- **WhatsApp**: Direct, easy-to-forward message with `*bold*` highlights (`*Role:*`, `*Salary:*`), bullet points, and direct phone/email application links.
- **X (Twitter)**: Ultra-concise, high signal-to-noise ratio strictly within 280 characters with 1–2 focused tags.
- **Facebook**: Conversational community narrative with storytelling context and discussion starters.
- **Snapchat**: Bite-sized youth-oriented story caption with low text density and swipe-up prompt.
- **Handshake**: Early-career & student recruitment focus, transparent qualifications, compensation, and university application workflow.

---

## 🚀 Key Features

1. **Strict Factual Preservation**:
   - Zero hallucination on critical facts. If you state ₹3 Lakh/month salary or 3 years of CNC experience, PostFlow retains that exact figure without modification across every single network.
2. **Independent Platform Editing & Regeneration**:
   - Tweak LinkedIn into a more corporate tone or shorten X without altering the other platform outputs.
   - Version history tracking with full revision rollback.
3. **AI Visual Asset Recommender**:
   - Automatically analyzes post concepts (e.g., precision CNC machining, artisan cafe opening, software launch) and synthesizes studio photography generation recipes.
   - Drag & drop image uploads and curated presets.
4. **Brand Kit Integration**:
   - Configure company profile, brand voice, preferred hashtags, and default CTAs. AI automatically weaves your brand identity into every post.
5. **Content Calendar & Scheduler**:
   - Interactive monthly and weekly scheduling calendar with platform-specific release times.
6. **Smart AI Tools Suite**:
   - Standalone utilities for Hook Generation, Hashtag Clustering, CTA Suggestions, and URL / Article Repurposing.
7. **Curated Post Blueprints**:
   - 15 ready-to-use post templates covering job vacancies, product launches, flash sales, webinars, office expansions, and founder stories.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React, Glassmorphism UI
- **Backend**: Node.js, Express, tsx
- **AI Engine**: `@google/genai` TypeScript SDK (model `gemini-3.8-flash`)
- **Persistence**: Structured browser local storage with real seed projects and instant autosave

---

## 🔑 Environment Variables

Configure your environment variables in `.env` (refer to `.env.example`):

```bash
# GEMINI_API_KEY: Required for live Gemini 3.8 Flash model execution.
# AI Studio automatically injects this from user secrets.
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# APP_URL: Base URL of the hosted application.
APP_URL="http://localhost:3000"
```

*Note: If no API key is set, PostFlow automatically runs on its native intelligent generation engine with zero app crashes!*

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start full-stack development server (Express + Vite on port 3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start
```
