# Secure AI Proxy Architecture

## 1. Purpose

This document describes the planned secure AI integration architecture for the Agentic Staking Dashboard PoC.

The current project uses a safe mock DeFi agent. The mock agent does not call any external AI API and does not require an API key.

A future production-oriented version should use a backend or serverless proxy to call an AI model such as Gemini, OpenAI, or another LLM provider.

The main principle:

```text
Never expose AI API keys directly in frontend code.
```

---

## 2. Why a Proxy Is Needed

Frontend applications run in the user's browser.

Any variable exposed through frontend build systems, including variables such as:

```text
VITE_GEMINI_API_KEY
VITE_OPENAI_API_KEY
```

can become visible in browser DevTools, JavaScript bundles, or network requests.

Because of that, AI API keys should not be stored or used directly inside the React frontend.

Instead, the frontend should call a secure backend endpoint.

---

## 3. Recommended Architecture

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

---

## 4. Data Sent to the AI Proxy

The frontend should send only the data required for decision support.

Example request payload:

```json
{
  "walletAddress": "0x35B40...",
  "contractAddress": "0xbB31245F4842FE90041B378CDac9Fe1c37701067",
  "network": "sepolia",
  "stakedBalanceEth": "0.001",
  "earnedRewardsEth": "0.00000012",
  "lastTransactionHash": "0x..."
}
```

The frontend should not send:

- Private keys
- Seed phrases
- Wallet secrets
- Sensitive personal data
- Unnecessary identity details

---

## 5. Expected AI Response

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

The backend should validate the AI response before returning it to the frontend.

---

## 6. Human-Approved Execution

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

---

## 7. Example Serverless Endpoint

A future implementation could expose an endpoint such as:

```text
POST /api/defi-agent
```

Example request:

```json
{
  "stakedBalanceEth": "0.001",
  "earnedRewardsEth": "0.00000012",
  "network": "sepolia"
}
```

Example response:

```json
{
  "action": "HOLD",
  "confidence": "HIGH",
  "reasoning": "Rewards are too small to justify a transaction.",
  "recommendedNextStep": "Hold the staking position.",
  "executionHint": "No wallet transaction is required.",
  "riskNote": "This is a decision-support recommendation only."
}
```

---

## 8. Backend Responsibilities

The backend / serverless proxy should:

- Store AI API keys securely
- Receive limited staking state from the frontend
- Call the AI model
- Enforce strict output format
- Validate supported actions
- Normalize model responses
- Return only safe recommendation data to the frontend
- Avoid executing blockchain transactions directly

---

## 9. Frontend Responsibilities

The frontend should:

- Collect visible staking state
- Send only necessary data to the proxy
- Display the AI recommendation
- Show reasoning, confidence, next step, execution hint, and risk note
- Keep wallet actions manual
- Require MetaMask confirmation for every transaction
- Show Etherscan links for transparency

---

## 10. Security Boundaries

The secure AI proxy architecture should preserve the following boundaries:

- No API keys in frontend code
- No private keys in backend code
- No seed phrase handling
- No autonomous wallet execution
- No direct AI-to-blockchain transaction path
- No financial advice claims
- No production yield strategy without proper risk controls
- All write actions remain user-confirmed through MetaMask

---

## 11. Future Implementation Options

Possible implementation options:

- Next.js API Route
- Vercel Serverless Function
- Netlify Function
- Cloudflare Worker
- Express backend
- FastAPI backend

For this portfolio PoC, the current mock agent is intentionally kept local and safe.

The secure proxy architecture is documented as the recommended path for a future production-style AI integration.

---

## 12. AI Operator Value

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
