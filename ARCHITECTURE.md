# Architecture — Agentic Staking Dashboard PoC

## 1. Project Overview

`agentic-staking-dashboard-poc` is a portfolio-focused Web3 Proof of Concept demonstrating how a React dashboard can interact with a deployed Sepolia staking smart contract through MetaMask, while also presenting an explainable mock DeFi agent decision layer.

The project is designed as part of an AI Operator / AI Solutions Developer portfolio with a Web3 focus.

The main idea is not only to build a staking dashboard, but to demonstrate an AI-assisted operator workflow:

```text
Solidity smart contract logic
  → AI-assisted frontend integration
  → Web3 wallet UX
  → transaction transparency
  → explainable agent recommendation layer
  → human-approved blockchain execution
```

This is not a fully autonomous DeFi system. All blockchain transactions require explicit user confirmation through MetaMask.

---

## 2. System Goals

The main goals of this PoC are:

- Connect a deployed Solidity staking contract to a React frontend.
- Provide a clear MetaMask-based transaction flow.
- Display staking position data in a user-friendly dashboard.
- Add Sepolia Etherscan links for contract and transaction transparency.
- Demonstrate a safe mock agentic decision layer for DeFi recommendations.
- Keep blockchain execution under user control.
- Show how an AI Operator can guide, validate, and structure AI-assisted Web3 delivery.

---

## 3. High-Level Architecture

```text
User
 │
 │ Opens React dashboard
 ▼
React Frontend
 │
 │ Reads staking state
 │ Requests wallet connection
 │ Prepares contract interactions
 │ Displays AI recommendation
 ▼
wagmi / viem Integration Layer
 │
 │ Reads contract state
 │ Sends write transaction requests
 │ Waits for transaction receipts
 ▼
MetaMask
 │
 │ User reviews transaction
 │ User confirms or rejects
 ▼
Ethereum Sepolia Network
 │
 │ Executes transaction
 ▼
Staking Smart Contract
 │
 │ Updates on-chain state
 ▼
Frontend Dashboard
 │
 │ Refetches data
 │ Updates balances
 │ Shows Etherscan links
 │ Displays agent recommendation
 ▼
User reviews result
```

---

## 4. Four-Layer Agentic Architecture

This project can be understood through a four-layer AI Operator architecture.

### Layer 1 — Grounding / On-Chain Data

The grounding layer contains the factual state used by the dashboard and the mock agent.

Examples:

- Connected wallet address
- Staked balance
- Earned rewards
- Contract address
- Sepolia network state
- Last transaction hash
- Etherscan contract and transaction links

This layer provides the real data context for the agentic recommendation layer.

---

### Layer 2 — Web3 Integration Layer

This layer translates blockchain logic into frontend-readable and user-actionable state.

Main files:

```text
src/hooks/useStaking.ts
src/wagmi.ts
```

Responsibilities:

- Configure Sepolia and MetaMask connection
- Read contract state using wagmi / viem
- Call smart contract write functions
- Wait for transaction receipts
- Refetch staking data after confirmed transactions
- Expose transaction hash for Etherscan transparency

---

### Layer 3 — Agentic Decision Layer

This layer is currently implemented as a safe mock DeFi agent.

Main file:

```text
src/hooks/useDeFiAgent.ts
```

The agent evaluates staking position data and returns a structured recommendation.

Current supported actions:

```text
STAKE_MORE
CLAIM_REWARDS
WITHDRAW_ALL
HOLD
```

The agent returns:

- Suggested action
- Confidence level
- Reasoning
- Recommended next step
- Execution guidance
- Risk note

The current agent does not call an external AI API and does not expose any API key.

This design keeps the project safe for GitHub and portfolio use.

---

### Layer 4 — Human-Approved Execution Layer

Execution is handled through the user interface and MetaMask.

The agent can recommend an action, but it does not execute wallet operations automatically.

The intended pattern is:

```text
AI suggests
  → User reviews
  → User clicks an action
  → MetaMask opens
  → User confirms
  → Blockchain executes
```

This keeps the system:

- Explainable
- Auditable
- Human-approved
- Safer than fully autonomous wallet execution

---

## 5. User Flow

The user flow is intentionally simple and transparent:

1. User opens the staking dashboard.
2. User connects MetaMask.
3. Frontend reads wallet and staking state.
4. User can stake Sepolia ETH.
5. MetaMask opens and asks for confirmation.
6. Transaction is submitted to Sepolia.
7. Dashboard displays transaction status.
8. Dashboard updates on-chain staking data.
9. User can open the transaction on Sepolia Etherscan.
10. User can run the mock AI Auto-Pilot.
11. Agent evaluates the current staking position.
12. Agent displays an explainable recommendation.
13. User decides whether to manually claim, withdraw, stake more, or hold.

---

## 6. Smart Contract Layer

The staking contract is deployed on the Ethereum Sepolia testnet.

Main file:

```text
contracts/StakingContract.sol
```

Deployed contract:

```text
0x79406FB2c52108ff36C4bB801c0Cd5215Cf40183
```

Explorer:

```text
https://sepolia.etherscan.io/address/0x79406FB2c52108ff36C4bB801c0Cd5215Cf40183
```

Responsibilities of the smart contract layer:

- Accept staking deposits
- Track user staking balances
- Track accumulated rewards
- Support withdrawal flow
- Support reward claiming
- Allow reward pool funding
- Provide readable staking state to the frontend

The contract layer does not contain AI logic. It only handles deterministic blockchain state and staking-related operations.

---

## 7. Frontend Layer

The frontend is built with React, TypeScript, Vite, Tailwind CSS, wagmi, and viem.

Main files:

```text
src/App.tsx
src/components/StakingDashboard.tsx
src/hooks/useStaking.ts
src/hooks/useDeFiAgent.ts
src/wagmi.ts
```

Responsibilities of the frontend layer:

- Render staking dashboard UI
- Connect to MetaMask
- Read wallet and staking state
- Trigger contract write operations
- Show transaction loading states
- Display user-facing errors
- Provide Etherscan links
- Display mock agent recommendations
- Keep blockchain execution under user control

The frontend does not store private keys and does not execute blockchain transactions without wallet confirmation.

---

## 8. Wallet & Transaction Flow

MetaMask is used as the wallet interaction layer.

Transaction flow:

```text
Frontend prepares transaction
        │
        ▼
MetaMask requests user confirmation
        │
        ▼
User approves or rejects
        │
        ▼
Transaction is sent to Sepolia
        │
        ▼
Frontend receives transaction hash
        │
        ▼
Frontend waits for confirmation
        │
        ▼
Frontend refetches contract state
        │
        ▼
User can inspect transaction on Etherscan
```

This keeps execution transparent and user-approved.

---

## 9. Agentic Decision Layer

The current agentic layer is a safe mock decision-support module.

It evaluates visible staking state and returns:

- Suggested action
- Confidence level
- Reasoning
- Recommended next step
- Execution guidance
- Risk note

Example output:

```text
AI Action: HOLD
Confidence: HIGH

Reasoning:
Rewards are currently too small to justify a transaction.

Recommended Next Step:
Hold the staking position and wait for rewards to accumulate further.

Execution:
No wallet transaction is required for HOLD.

Risk Note:
This recommendation is based only on simple staking and reward data.
```

The agent does not directly execute transactions.

This design reflects a safe AI Operator pattern:

```text
AI suggests → User reviews → Wallet confirms → Blockchain executes
```

---

## 10. Security & Safety Boundaries

Current safety boundaries:

- No private keys are handled by the frontend.
- No seed phrase is requested or stored.
- No backend stores wallet secrets.
- No autonomous transaction execution is implemented.
- All blockchain writes require MetaMask confirmation.
- Etherscan links are provided for transparency.
- The agent layer is recommendation-only.
- The project runs on Sepolia testnet.
- No real financial advice is provided.
- No production yield strategy is implemented.

Future AI integration should follow a safer architecture:

```text
Frontend
   │
   ▼
Backend / Serverless Proxy
   │
   ▼
AI API
```

AI API keys should never be exposed directly in frontend code.

---

## 11. Current Limitations

This project is currently a PoC and has several limitations:

- Uses Sepolia testnet only.
- Agentic decision layer is mocked.
- No production-grade backend.
- No real Gemini / AI API integration yet.
- No persistent database.
- No audited production staking contract.
- No real yield strategy optimization.
- No autonomous fund management.
- No transaction history beyond the current session.
- No production risk engine.
- No financial advice logic.

These limitations are intentional for a safe portfolio demonstration.

---

## 12. Planned Improvements

Planned improvements include:

- Add Sepolia network guard.
- Add stronger transaction status handling.
- Add contract address visibility improvements.
- Add architecture diagram image to README.
- Add dashboard screenshots.
- Add secure Gemini proxy architecture example.
- Add portfolio case study explaining the AI Operator workflow.
- Add tests for staking and withdraw flows.
- Improve error handling for rejected MetaMask transactions.
- Improve reward pool UX.
- Add production security notes for the Solidity contract.
- Add transaction history persistence.
- Add optional backend/serverless AI decision endpoint.

---

## 13. Future Secure AI Integration

The current mock agent is intentionally safe and does not require an API key.

A future production-oriented AI integration should avoid placing API keys in frontend code.

Recommended architecture:

```text
React Frontend
   │
   │ Sends staking state only
   ▼
Backend / Serverless API Route
   │
   │ Stores AI API key securely
   │ Calls Gemini / OpenAI / other AI model
   ▼
AI Decision Engine
   │
   │ Returns structured JSON
   ▼
Frontend
   │
   │ Displays recommendation
   ▼
User
   │
   │ Confirms action through MetaMask
   ▼
Blockchain
```

Example structured response:

```json
{
  "action": "HOLD",
  "confidence": "HIGH",
  "reasoning": "Rewards are too small to justify a transaction.",
  "recommendedNextStep": "Wait until rewards accumulate further.",
  "executionHint": "No wallet transaction is required.",
  "riskNote": "This recommendation does not evaluate market or contract risk."
}
```

This preserves the core safety principle:

```text
AI recommends, but the user controls execution.
```

---

## 14. AI Operator Value

This project demonstrates AI Operator work, not only frontend implementation.

The operator role includes:

- Defining the product direction
- Structuring system instructions
- Guiding AI-assisted code generation
- Debugging generated code
- Validating wallet and transaction flows
- Resolving package and API compatibility issues
- Designing a safe human-in-the-loop automation pattern
- Documenting architecture and decision logic
- Turning a raw technical prototype into a portfolio asset

The project shows practical operator judgment across:

- Web3 UX
- Smart contract integration
- AI-assisted development
- Agentic workflow design
- Safety boundaries
- Portfolio positioning

---

## 15. Portfolio Positioning

This project demonstrates the ability to operate at the intersection of:

- Frontend engineering
- Web3 wallet UX
- Solidity-to-UI integration
- Transaction transparency
- AI-assisted product thinking
- Agentic workflow design
- Safe human-in-the-loop automation

The main value is not only the staking dashboard itself, but the workflow behind it:

```text
Using AI-assisted development and operator judgment
to turn smart contract logic
into a usable, explainable, and safer Web3 interface.
```

This supports a broader professional direction toward:

- AI Operator work
- AI Solutions Development
- Web3 automation
- Agentic DeFi dashboards
- Remote / international crypto-paid opportunities
