Build a full-featured AI Chat application called "NexusChat".
No Puter.js. Pure BYOK (Bring Your Own Key) architecture.
Users connect their own API keys from any OpenAI-compatible provider.

DO NOT STOP until ALL phases are 100% complete.
DO NOT ask clarifying questions — make the best decision and implement.
DO NOT write placeholder code, stubs, or TODO comments anywhere.
After EACH phase: run type check → lint → build → git commit.
Create application under current workplace do not use /home/user/xyz
Alway use /home/user/rsai-api path

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE EXECUTION RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Execute phases strictly in order: 1 → 2 → 3 → 4 → 5 → 6 → 7
After every phase, run these commands — fix ALL errors before moving on:
  1. npx tsc --noEmit                  ← must show 0 errors
  2. npx eslint . --max-warnings 0     ← must show 0 warnings
  3. npm run build                     ← must complete successfully
  4. git add -A && git commit -m "feat: complete Phase [N] - [phase name]"

Never proceed to the next phase if any check fails.
If a check fails, fix the issue immediately and re-run all 3 checks.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TECH STACK  (Use All Latest stable available stack)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Next.js 16 (App Router) + TypeScript (strict: true)
- Tailwind CSS v4 + shadcn/ui latest
- @assistant-ui/react + @assistant-ui/react-markdown
- react-markdown + rehype-highlight + remark-gfm
- Framer Motion
- Zustand + zustand/middleware (persist)
- sonner (toast notifications)
- ESLint + Prettier (strict, no any, no unused vars)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SUPPORTED PROVIDERS (built-in presets)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Store all in config/providers.ts as a typed array. Each provider has:
  id, name, color, icon (lucide), baseUrl, docsUrl,
  requiresKey (boolean), keyPlaceholder, defaultModel,
  modelEndpoint (/v1/models or custom), supportsStreaming

Providers to include:

1.  OpenAI
    baseUrl: https://api.openai.com
    keyPlaceholder: sk-...
    defaultModel: gpt-4o

2.  Anthropic (via OpenAI-compat proxy)
    baseUrl: https://api.anthropic.com/v1
    keyPlaceholder: sk-ant-...
    defaultModel: claude-sonnet-4

3.  Google AI Studio (Gemini)
    baseUrl: https://generativelanguage.googleapis.com/v1beta/openai
    keyPlaceholder: AIza...
    defaultModel: gemini-2.0-flash

4.  Groq (free tier: 14,400 req/day)
    baseUrl: https://api.groq.com/openai
    keyPlaceholder: gsk_...
    defaultModel: llama-3.3-70b-versatile

5.  OpenRouter (free models available)
    baseUrl: https://openrouter.ai/api
    keyPlaceholder: sk-or-...
    defaultModel: meta-llama/llama-3.1-8b-instruct:free

6.  Together AI
    baseUrl: https://api.together.xyz
    keyPlaceholder: ...
    defaultModel: meta-llama/Llama-3-70b-chat-hf

7.  Mistral AI
    baseUrl: https://api.mistral.ai
    keyPlaceholder: ...
    defaultModel: mistral-large-latest

8.  Cohere
    baseUrl: https://api.cohere.ai/compatibility
    keyPlaceholder: ...
    defaultModel: command-r-plus

9.  DeepSeek
    baseUrl: https://api.deepseek.com
    keyPlaceholder: sk-...
    defaultModel: deepseek-chat

10. xAI Grok
    baseUrl: https://api.x.ai
    keyPlaceholder: xai-...
    defaultModel: grok-2-latest

11. Perplexity AI
    baseUrl: https://api.perplexity.ai
    keyPlaceholder: pplx-...
    defaultModel: sonar-pro

12. Fireworks AI
    baseUrl: https://api.fireworks.ai/inference
    keyPlaceholder: fw_...
    defaultModel: accounts/fireworks/models/llama-v3p1-70b-instruct

13. Ollama (local, free, unlimited)
    baseUrl: http://localhost:11434/v1
    requiresKey: false  ← no API key needed
    defaultModel: llama3.2
    autoDetect: true    ← always try to connect on app load

14. LM Studio (local, free, unlimited)
    baseUrl: http://localhost:1234/v1
    requiresKey: false
    defaultModel: auto-detect
    autoDetect: true

15. Custom Provider
    baseUrl: user-defined
    keyPlaceholder: (optional)
    defaultModel: user-defined
    ← supports any OpenAI-compatible endpoint

16 SHould have option to add more custom api 

- make sure it store data and API in any lightweight db that is available on free vercel
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROVIDER CONFIGURATION SYSTEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Each provider card in settings has these states:
  NOT_CONFIGURED → TESTING → CONNECTED / ERROR

CONFIGURE FLOW (per provider):
  Step 1 — Enter API key (or skip if requiresKey: false)
  Step 2 — Click "Fetch Models" → calls /v1/models endpoint
            Show loading spinner during fetch
            On success: list all models in a searchable checkbox list
            On error: show exact error message (401, 403, network etc.)
  Step 3 — Select which models to enable (check/uncheck)
            Show model metadata if available: context window, pricing
  Step 4 — Click "Test" → sends a real minimal chat completion request
            POST /v1/chat/completions with:
              model: first selected model
              messages: [{role: "user", content: "Say: Connection successful"}]
              max_tokens: 10
              stream: false
            Show response text in a preview box
            Show latency (ms) after test
  Step 5 — Click "Save" → persist to settings-store

SAVED STATE per provider in settings-store:
  {
    providerId: string
    apiKey: string           ← encrypted in localStorage (AES via crypto-js)
    baseUrl: string          ← overrideable (user can change default)
    enabledModels: string[]  ← models user selected
    isConnected: boolean
    lastTestedAt: string     ← ISO timestamp
    lastTestLatency: number  ← ms
    lastTestResponse: string ← preview of test response
    error: string | null
  }

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AUTO-DETECT LOCAL PROVIDERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
On app load, automatically probe local providers in background:
  - Try GET http://localhost:11434/v1/models (Ollama)
  - Try GET http://localhost:1234/v1/models (LM Studio)
  - If reachable: mark as CONNECTED, fetch model list, no key needed
  - Show green "Auto-detected" badge on provider card
  - Show toast: "Ollama detected — 3 models available"
  - If unreachable: silently skip (no error shown)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MODEL SELECTOR BEHAVIOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
In the chat interface, model selector shows:
  - Only CONNECTED providers and their ENABLED models
  - Grouped by provider with provider color + icon
  - Each model shows: name, context window, cost/1M tokens if known
  - Search/filter across all providers
  - "No providers configured" empty state with button → opens settings
  - Recently used models pinned at top
  - Keyboard navigable (arrow keys + Enter)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MODULAR FILE STRUCTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
nexuschat/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                         ← redirect to /chat
│   └── chat/
│       └── page.tsx
│
├── components/
│   ├── chat/
│   │   ├── ChatLayout.tsx
│   │   ├── ChatSidebar.tsx
│   │   ├── ChatHistoryItem.tsx
│   │   ├── ChatThread.tsx
│   │   ├── ChatMessage.tsx
│   │   ├── ChatComposer.tsx
│   │   ├── StreamingIndicator.tsx
│   │   └── MessageActions.tsx
│   │
│   ├── model/
│   │   ├── ModelSelector.tsx            ← grouped, searchable, keyboard nav
│   │   ├── ModelBadge.tsx
│   │   └── ModelInfoTooltip.tsx         ← context window, pricing on hover
│   │
│   ├── providers/
│   │   ├── ProvidersPage.tsx            ← full providers management page
│   │   ├── ProviderCard.tsx             ← single provider config card
│   │   ├── ProviderStatusBadge.tsx      ← NOT_CONFIGURED/TESTING/CONNECTED/ERROR
│   │   ├── ApiKeyInput.tsx              ← masked input with show/hide toggle
│   │   ├── BaseUrlInput.tsx             ← editable base URL with reset to default
│   │   ├── ModelFetcher.tsx             ← fetch models button + loading state
│   │   ├── ModelCheckboxList.tsx        ← searchable list of fetched models
│   │   ├── ModelCheckboxItem.tsx        ← single model row with metadata
│   │   ├── ProviderTestPanel.tsx        ← test button + latency + response preview
│   │   └── AutoDetectBanner.tsx        ← shown when local provider auto-detected
│   │
│   ├── parameters/
│   │   ├── ParametersPanel.tsx
│   │   ├── TemperatureSlider.tsx
│   │   ├── MaxTokensInput.tsx
│   │   ├── ReasoningSelect.tsx
│   │   ├── SystemPromptEditor.tsx
│   │   └── TopPSlider.tsx
│   │
│   ├── settings/
│   │   ├── SettingsLayout.tsx           ← settings page with sidebar nav
│   │   ├── SettingsNav.tsx              ← Providers / Appearance / About
│   │   └── ThemeToggle.tsx
│   │
│   └── ui/                             ← shadcn components
│
├── lib/
│   ├── api-chat.ts                     ← OpenAI-compatible SSE streaming
│   ├── api-models.ts                   ← fetch + normalize /v1/models response
│   ├── api-test.ts                     ← test connection (real chat request)
│   ├── auto-detect.ts                  ← probe local providers on app load
│   ├── encryption.ts                   ← AES encrypt/decrypt API keys (crypto-js)
│   ├── abort-manager.ts
│   ├── token-counter.ts
│   ├── export.ts
│   └── storage-keys.ts
│
├── store/
│   ├── chat-store.ts                   ← messages, sessions, history
│   ├── providers-store.ts              ← all provider configs + connection state
│   └── settings-store.ts              ← active model, params, theme
│
├── types/
│   └── index.ts                        ← ALL interfaces:
│                                          Provider, ProviderConfig, ProviderStatus,
│                                          ModelInfo, SavedModel, ChatMessage,
│                                          ChatSession, StreamChunk, TestResult,
│                                          ChatParams, Theme
│
├── hooks/
│   ├── useChat.ts
│   ├── useProviders.ts                 ← CRUD + test + fetch models logic
│   ├── useAutoDetect.ts                ← runs on mount, probes local providers
│   ├── useModels.ts                    ← aggregates enabled models across providers
│   ├── useChatHistory.ts
│   └── useKeyboardShortcuts.ts
│
└── config/
    ├── providers.ts                    ← all 15 provider presets
    └── default-params.ts

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 1 — Foundation & Types
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Init Next.js 14 strict TypeScript
- Configure tsconfig, ESLint, Prettier
- Install all dependencies
- Build types/index.ts with every interface
- Build config/providers.ts with all 15 providers
- Build config/default-params.ts
- Build lib/storage-keys.ts (all keys namespaced nexuschat_*)
- Build lib/encryption.ts:
    encryptKey(plaintext: string): string  ← AES with device fingerprint as salt
    decryptKey(ciphertext: string): string
- Set up Tailwind dark theme + shadcn/ui
→ COMMIT: "feat: Phase 1 - foundation, types, and provider config"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 2 — Provider & Chat Core Logic
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Build store/providers-store.ts (Zustand persist):
    State: providers (Record<id, ProviderConfig>)
    Actions: saveProvider, removeProvider, setStatus,
             setEnabledModels, updateTestResult, resetProvider
- Build store/chat-store.ts and store/settings-store.ts
- Build lib/api-models.ts:
    fetchModels(baseUrl, apiKey): Promise<ModelInfo[]>
    Handles: paginated responses, different response shapes,
             timeout (5s), network errors with typed errors
    Normalizes: id, name, context_length, pricing from any provider format
- Build lib/api-test.ts:
    testConnection(config): Promise<TestResult>
    Sends: POST /v1/chat/completions with minimal payload
    Returns: { success, responseText, latencyMs, error }
    Timeout: 10 seconds
- Build lib/api-chat.ts:
    streamChat(config, messages, params, signal): AsyncGenerator<string>
    Full SSE parsing: ReadableStream → TextDecoder → split lines →
    parse "data: {...}" → extract delta.content → yield chunks
    Handle: [DONE], errors mid-stream, abort signal, 401/429/500
- Build lib/auto-detect.ts:
    autoDetectLocalProviders(): Promise<DetectedProvider[]>
    Probes Ollama (11434) and LM Studio (1234) with 2s timeout each
    Returns detected providers with their model lists
- Build all hooks/
→ COMMIT: "feat: Phase 2 - provider store and core API logic"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 3 — Provider Configuration UI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This is the most important phase — implement completely.

ProvidersPage.tsx:
  - Grid of ProviderCards (2 cols desktop, 1 col mobile)
  - Top bar: "Connected: 3/15" summary + "Auto-detect Local" button
  - Search/filter providers by name

ProviderCard.tsx (full implementation):
  - Header: provider icon + name + ProviderStatusBadge
  - Collapsed state: shows status + quick connect button
  - Expanded state (click to expand):
    ┌─ ApiKeyInput (hidden if requiresKey: false)
    ├─ BaseUrlInput (pre-filled, editable, reset button)
    ├─ [Fetch Models] button → ModelFetcher
    │   On click: show spinner, call fetchModels()
    │   On success: show ModelCheckboxList
    │   On error: show error message + retry
    ├─ ModelCheckboxList (shown after fetch):
    │   Search input to filter models
    │   [Select All] / [Deselect All] buttons
    │   Each row: checkbox + model name + context window + pricing badge
    │   Sorted: free models first, then by context window desc
    ├─ ProviderTestPanel (shown after models selected):
    │   [Test Connection] button
    │   During test: spinner + "Testing..."
    │   After test:
    │     ✅ green banner: "Connected • 234ms"
    │     Preview box: shows actual AI response text
    │     Last tested: relative timestamp
    │   On error:
    │     ❌ red banner: exact error (401 Unauthorized, etc.)
    │     Suggestion text based on error type
    └─ [Save Configuration] button (disabled until test passes)
       [Reset] button to clear all

AutoDetectBanner.tsx:
  - Shown at top of ProvidersPage when local provider detected
  - "🟢 Ollama detected — 4 models available. Click to configure"
  - One-click to auto-fill and save Ollama config

→ COMMIT: "feat: Phase 3 - provider configuration UI"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 4 — Chat UI Components
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- ChatThread: assistant-ui Thread, connects to chat-store + providers-store
- ChatMessage:
    User: right bubble, zinc-800, avatar initials, edit on click
    AI: left, full markdown, code blocks with copy + language badge,
        syntax highlight via rehype-highlight
    Framer Motion: fadeIn + slideUp per message
- ChatComposer:
    Auto-resize textarea, Enter=send, Shift+Enter=newline
    Token counter (approximate)
    Stop button with AbortController during streaming
    Attach image (shown only for vision-capable models)
    Empty state: "Select a model to start chatting"
- StreamingIndicator: 3-dot bounce animation
- MessageActions: Copy, Edit (user), Regenerate (AI), Delete — hover reveal
- ModelSelector:
    Grouped by provider (colored header per provider)
    Each model: name + context window + price/1M tokens
    Search across all providers
    Keyboard navigation (↑↓ Enter)
    "No providers configured" empty state → link to /settings/providers
    Recently used (last 5) pinned at top with clock icon
- Parameters Panel: right collapsible panel with tabs
→ COMMIT: "feat: Phase 4 - chat UI components"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 5 — Layout, Sidebar & Settings
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- ChatLayout: CSS Grid 3-panel (260px | flex-1 | 320px collapsible)
- ChatSidebar:
    Logo + gradient wordmark
    [+ New Chat] (Ctrl+N)
    Search history (Ctrl+F)
    History grouped: Today / Yesterday / Last 7 Days / Older
    Bottom: connected providers count + Settings link
- Settings at /settings/providers and /settings/appearance
- SettingsLayout: sidebar nav (Providers | Appearance | About)
- Keyboard shortcuts:
    Ctrl+N → new chat
    Ctrl+K → focus model search
    Ctrl+, → open settings
    Escape → close panels
- Mobile: sidebar as drawer, parameters as bottom sheet
- app/layout.tsx: ThemeProvider, Inter font, Sonner toaster
→ COMMIT: "feat: Phase 5 - layout, sidebar, and settings"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 6 — Error Handling & Polish
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Error boundaries: ChatThread, ProvidersPage
- Toast notifications (sonner) for:
    Provider saved ✅
    Test passed ✅ with latency
    Test failed ❌ with error
    Model list fetched ✅ (N models found)
    Auto-detect results
    Copy message ✅
    Export complete ✅
    Stream error ❌ with retry button
- Empty states:
    No providers: centered illustration + "Connect a provider to start"
    No models enabled: "Enable models in settings"
    No chat history: "Your conversations will appear here"
- Loading skeletons: provider cards, model list, chat history
- Export chat: Markdown with metadata header
- Re-fetch models button per provider (refresh icon)
→ COMMIT: "feat: Phase 6 - error handling and polish"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 7 — Final QA & Release
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Verify ALL 15 providers have correct baseUrls and defaults
- Verify encryption/decryption round-trip for API keys
- Verify SSE streaming works and AbortController cancels cleanly
- Verify auto-detect runs silently on app load
- Verify model selector only shows connected+enabled models
- Verify settings persist across page refresh
- Final checks:
    npx tsc --noEmit          ← 0 errors
    npx eslint . --max-warnings 0  ← 0 warnings
    npm run build             ← success
→ COMMIT: "feat: Phase 7 - final QA and verification"
→ TAG: git tag -a v1.0.0 -m "NexusChat v1.0.0"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ABSOLUTE RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- No Puter.js anywhere — completely removed
- No `any` TypeScript — use unknown + type guards
- API keys AES-encrypted before localStorage write
- API keys never sent to any server or logged
- No TODO / FIXME / placeholder in any file
- No inline styles — Tailwind only
- Named exports everywhere except page.tsx files
- One responsibility per file
- All fetch calls have explicit timeout (AbortSignal.timeout)
- Do NOT stop between phases — run all 7 phases continuously
