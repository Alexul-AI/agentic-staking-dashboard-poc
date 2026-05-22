# Secure AI Proxy Architecture

## 1. Purpose

This document describes the secure AI integration architecture for the Agentic Staking Dashboard PoC.

The project uses a safe local mock DeFi agent by default. This default mode does not call any external AI API and does not require an API key.

The repository also includes an optional backend/serverless AI proxy implementation that demonstrates how a future production-style version could call an AI model such as Gemini, OpenAI, or another LLM provider without exposing secrets in frontend code.

The main principle:

```text
Never expose AI API keys directly in frontend code.
```

---

## 2. Current Implementation Status

This repository includes an optional serverless proxy example:

```text
api/defi-agent.ts
```

The frontend can use either:

```text
VITE_USE_AI_PROXY=false
```

for the default safe mock agent, or:

```text
VITE_USE_AI_PROXY=true
```

to call the optional proxy endpoint.

The default portfolio-safe mode remains the local mock agent.

The optional proxy implementation is included to show a secure architecture path, not to make the dashboard fully autonomous.

---

## 3. Why a Proxy Is Needed

Frontend applications run in the user's browser.

Any environment variable exposed through frontend build systems, including variables such as:

```text
VITE_GEMINI_API_KEY
VITE_OPENAI_API_KEY
```

can become visible in browser DevTools, JavaScript bundles, or network requests.

Because of that, AI API keys should not be stored or used directly inside the React frontend.

Instead, the frontend should call a secure backend or serverless endpoint.

Correct pattern:

```text
Frontend → Backend / Serverless Proxy → AI API
```

Incorrect pattern:

```text
Frontend → AI API directly with exposed API key
```

---

## 4. Recommended Architecture

```text
React Frontend
  │
  │ Sends staking state only
  ▼
Backend / Serverless API
  │
  │ Stores AI API key securely
  │ Calls Gemini / OpenAI / other AI model
  ▼
AI Model
  │
  │ Returns structured JSON decision
  ▼
Backend / Serverless API
  │
  │ Validates and normalizes response
  ▼
React Frontend
  │
  │ Displays recommendation
  ▼
User
  │
  │ Manually confirms action through MetaMask
  ▼
Blockchain
```

This keeps the AI layer separate from wallet execution.

---

## 5. Optional Implementation File

The optional proxy is implemented in:

```text
api/defi-agent.ts
```

The proxy receives staking state from the frontend, calls the AI model server-side, validates the response, and returns a structured decision object.

The proxy is designed to return the same decision shape as the local mock agent:

```json
{
  "action": "HOLD",
  "confidence": "HIGH",
  "reasoning": "Rewards are currently too small to justify a transaction.",
  "recommendedNextStep": "Wait until rewards accumulate further.",
  "executionHint": "No wallet transaction is required for HOLD.",
  "riskNote": "This recommendation does not evaluate market or smart contract risk."
}
```

---

## 6. Environment Configuration

The configuration example is stored in:

```text
.env.example
```

Default safe mode:

```env
VITE_USE_AI_PROXY=false
```

This keeps the dashboard using the local mock DeFi agent.

Optional serverless AI mode:

```env
VITE_USE_AI_PROXY=true
GEMINI_API_KEY=your_server_side_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

Important rule:

```text
GEMINI_API_KEY must remain server-side only.
It must not be exposed as VITE_GEMINI_API_KEY.
```

The `.env.example` file is safe to commit.

The real `.env` file must not be committed.

---

## 7. Data Sent to the AI Proxy

The frontend should send only the data required for decision support.

Example request payload:

```json
{
  "walletAddress": "0x35B40...",
  "contractAddress": "0x8a0fdc67D8751d409d3ad2571faD8eA45820dA47",
  "network": "sepolia",
  "stakedBalanceEth": "0.001",
  "earnedRewardsEth": "0.00000012",
  "contractBalanceEth": "0.003",
  "lastTransactionHash": "0x..."
}
```

The frontend should not send:

- Private keys
- Seed phrases
- Wallet secrets
- Sensitive personal data
- Unnecessary identity details
- Browser cookies
- Authentication tokens unrelated to the request

---

## 8. Expected AI Response

The AI model should return a strict structured JSON response.

Example response:

```json
{
  "action": "HOLD",
  "confidence": "HIGH",
  "reasoning": "Rewards are currently too small to justify a transaction.",
  "recommendedNextStep": "Wait until rewards accumulate further.",
  "executionHint": "No wallet transaction is required for HOLD.",
  "riskNote": "This recommendation does not evaluate market or smart contract risk."
}
```

Supported actions should remain constrained:

```text
STAKE_MORE
CLAIM_REWARDS
WITHDRAW_ALL
HOLD
```

Supported confidence levels:

```text
LOW
MEDIUM
HIGH
```

The backend should validate the AI response before returning it to the frontend.

---

## 9. Response Validation

The proxy should not blindly trust AI output.

The backend should validate:

- `action` is one of the allowed actions
- `confidence` is one of the allowed confidence values
- `reasoning` is present
- `recommendedNextStep` is present
- `executionHint` is present
- `riskNote` is present

If the model returns invalid data, the proxy should return a safe fallback decision.

Example fallback:

```json
{
  "action": "HOLD",
  "confidence": "LOW",
  "reasoning": "The AI proxy could not produce a validated decision. Defaulting to HOLD.",
  "recommendedNextStep": "Do not execute any transaction based on this response. Review the dashboard manually.",
  "executionHint": "No wallet transaction is prepared. Manual user action is required.",
  "riskNote": "Fallback mode was activated because the AI response was unavailable or invalid."
}
```

This keeps failures safe.

---

## 10. Human-Approved Execution

The AI proxy should never directly execute wallet transactions.

The safe execution pattern remains:

```text
AI recommends
  → User reviews
  → User clicks a dashboard action
  → MetaMask opens
  → User confirms or rejects
  → Blockchain executes
```

This keeps the system:

- Human-approved
- Explainable
- Auditable
- Safer than fully autonomous wallet execution

The AI layer should support decision-making, not control funds.

---

## 11. Backend Responsibilities

The backend / serverless proxy should:

- Store AI API keys securely
- Receive limited staking state from the frontend
- Call the AI model
- Enforce strict output format
- Validate supported actions
- Normalize model responses
- Return only safe recommendation data to the frontend
- Avoid executing blockchain transactions directly
- Avoid storing wallet secrets
- Avoid requesting private keys or seed phrases

---

## 12. Frontend Responsibilities

The frontend should:

- Collect visible staking state
- Send only necessary data to the proxy
- Display the AI recommendation
- Show reasoning, confidence, next step, execution hint, and risk note
- Keep wallet actions manual
- Require MetaMask confirmation for every transaction
- Show Etherscan links for transparency
- Keep the mock-agent mode available as a safe default

---

## 13. Security Boundaries

The secure AI proxy architecture should preserve the following boundaries:

- No API keys in frontend code
- No private keys in backend code
- No seed phrase handling
- No autonomous wallet execution
- No direct AI-to-blockchain transaction path
- No financial advice claims
- No production yield strategy without proper risk controls
- All write actions remain user-confirmed through MetaMask

The AI proxy may recommend an action, but it must not execute that action.

---

## 14. Local Development Notes

In a plain Vite development server, files under `api/` are not automatically executed as serverless functions.

The optional proxy is designed for environments that support serverless API routes, such as:

- Vercel Serverless Functions
- Netlify Functions
- Cloudflare Workers
- Express backend
- FastAPI backend
- Next.js API Routes

For local portfolio development, the recommended default remains:

```env
VITE_USE_AI_PROXY=false
```

This keeps the project running safely without requiring a backend or real AI API key.

---

## 15. Future Implementation Options

Possible implementation options:

- Vercel Serverless Function
- Netlify Function
- Cloudflare Worker
- Express backend
- FastAPI backend
- Next.js API Route

For this portfolio PoC, the current local mock agent is intentionally kept as the default.

The optional proxy implementation is included as the recommended path for a future production-style AI integration.

---

## 16. AI Operator Value

This architecture demonstrates AI Operator judgment.

The value is not only in calling an AI API, but in designing a safe workflow:

```text
on-chain data
  → controlled AI reasoning
  → structured recommendation
  → human review
  → MetaMask confirmation
  → blockchain execution
```

This supports a professional positioning around:

- AI-assisted Web3 automation
- Agentic dashboard design
- Secure AI integration
- Human-in-the-loop execution
- Crypto-native product workflows
- Responsible AI-assisted DeFi UX

---

## 17. Current Status

Current implementation status:

- Local mock DeFi agent is the default mode.
- Optional backend/serverless AI proxy file exists.
- `.env.example` documents the required environment variables.
- AI API keys are not exposed in frontend code.
- The AI proxy is not required for the default local demo.
- Blockchain execution remains user-approved through MetaMask.

Recommended next step for production-style deployment:

```text
Deploy the frontend and proxy to a serverless environment,
store GEMINI_API_KEY as a server-side environment variable,
and keep VITE_USE_AI_PROXY=true only in that deployed environment.
```
