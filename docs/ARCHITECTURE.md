# Architecture — Agentic Staking Dashboard PoC

## 1. Project Overview

`agentic-staking-dashboard-poc` is a portfolio-focused Web3 Proof of Concept demonstrating how a React dashboard can interact with a deployed Sepolia staking smart contract through MetaMask, while also presenting an explainable DeFi agent decision layer.

The project is designed as part of an AI Operator / AI Solutions Developer portfolio with a Web3 focus.

The main idea is not only to build a staking dashboard, but to demonstrate an AI-assisted operator workflow:

```text
Solidity smart contract logic
  → AI-assisted frontend integration
  → Web3 wallet UX
  → transaction transparency
  → reward pool visibility
  → explainable agent recommendation layer
  → optional backend/serverless AI proxy
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
- Display reward pool liquidity and support reward pool funding.
- Use OpenZeppelin-based security patterns for reentrancy protection and ownership.
- Demonstrate a safe mock agentic decision layer for DeFi recommendations.
- Keep blockchain execution under user control.
- Provide an optional backend/serverless AI proxy implementation.
- Show how an AI Operator can guide, validate, and structure AI-assisted Web3 delivery.
- Package the project as a portfolio asset for Web3 / AI Operator opportunities.
- Validate core Solidity flows with automated Hardhat tests.

---

## 3. Architecture Diagram

The visual architecture diagram is available here:

[`docs/architecture-diagram.md`](architecture-diagram.md)

It summarizes the main project flow:

```text
React Dashboard
  → wagmi / viem
  → MetaMask
  → Sepolia Smart Contract
  → Etherscan
  → Reward Pool UX
  → Safe Mock Agent / Optional AI Proxy
  → Human-Approved Execution
```

---

## 4. High-Level Architecture

```text
User
 │
 │ Opens React dashboard
 ▼
React Frontend
 │
 │ Reads staking state
 │ Reads reward pool state
 │ Requests wallet connection
 │ Checks Sepolia network
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
 │ Stores staking balances
 │ Stores reward pool liquidity
 ▼
Frontend Dashboard
 │
 │ Refetches data
 │ Updates balances
 │ Updates reward pool display
 │ Shows transaction status
 │ Shows Etherscan links
 │ Displays agent recommendation
 ▼
User reviews result
```

Optional AI proxy path:

```text
React Frontend
 │
 │ Sends staking state
 ▼
api/defi-agent.ts
 │
 │ Calls AI model server-side
 ▼
AI Model
 │
 │ Returns structured JSON decision
 ▼
Frontend Dashboard
 │
 │ Displays recommendation
 ▼
User reviews result
```

---

## 5. Four-Layer Agentic Architecture

This project can be understood through a four-layer AI Operator architecture.

### Layer 1 — Grounding / On-Chain Data

The grounding layer contains the factual state used by the dashboard and the agent.

Examples:

- Connected wallet address
- Current chain / network state
- Staked balance
- Earned rewards
- Contract reward pool balance
- Contract address
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
- Detect wrong wallet network
- Read contract state using wagmi / viem
- Read user stake, earned rewards, and contract reward pool balance
- Call smart contract write functions
- Support staking, withdrawal, reward claiming, and reward pool funding
- Wait for transaction receipts
- Refetch staking data after confirmed transactions
- Expose transaction hash for Etherscan transparency

---

### Layer 3 — Agentic Decision Layer

This layer is implemented as a safe DeFi agent decision layer.

Main file:

```text
src/hooks/useDeFiAgent.ts
```

By default, the agent uses a local mock decision function and does not call an external AI API.

The project also includes an optional backend/serverless AI proxy implementation in:

```text
api/defi-agent.ts
```

This proxy is intended for future production-style integration and keeps AI API keys server-side.

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

The default mock mode does not require any API key.

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

## 6. User Flow

The user flow is intentionally simple and transparent:

1. User opens the staking dashboard.
2. User connects MetaMask.
3. Frontend checks that the wallet is connected to Sepolia.
4. Frontend reads wallet and staking state.
5. User can stake Sepolia ETH.
6. User can view the contract reward pool balance.
7. User can optionally fund the reward pool.
8. MetaMask opens and asks for confirmation.
9. Transaction is submitted to Sepolia.
10. Dashboard displays transaction lifecycle status.
11. Dashboard updates on-chain staking and reward pool data.
12. User can open the transaction on Sepolia Etherscan.
13. User can run the DeFi agent.
14. Agent evaluates the current staking position.
15. Agent displays an explainable recommendation.
16. User decides whether to manually claim, withdraw, stake more, fund the reward pool, or hold.

---

## 7. Smart Contract Layer

The staking contract is deployed on the Ethereum Sepolia testnet.

Main file:

```text
contracts/StakingContract.sol
```

Deployed contract:

```text
0xA8Ac339504973AB21c1206F753C5BAF0350ba08d
```

Explorer:

```text
https://sepolia.etherscan.io/address/0xA8Ac339504973AB21c1206F753C5BAF0350ba08d
```

Responsibilities of the smart contract layer:

- Accept staking deposits
- Track user staking balances
- Track accumulated rewards
- Support withdrawal flow
- Support reward claiming
- Expose contract reward pool balance through `getContractBalance`
- Allow reward pool funding through `fundRewards`
- Provide readable staking state to the frontend

Security hardening currently includes:

- Checks-Effects-Interactions flow
- OpenZeppelin `ReentrancyGuard`
- OpenZeppelin `Ownable`
- Owner-only reward rate updates
- Event emissions for staking, withdrawal, reward claiming, reward funding, and reward rate updates

The contract layer does not contain AI logic. It only handles deterministic blockchain state and staking-related operations.

Automated tests currently cover core contract behavior, including:

- deployment owner
- staking
- reward pool funding
- withdrawal
- reward claiming
- emitted staking events
- emitted reward funding events
- emitted withdrawal events
- emitted reward claiming events
- emitted reward rate update events
- owner-only reward rate update
- invalid reward rate rejection
- zero-value stake rejection
- zero-value reward funding rejection
- withdraw without stake rejection
- insufficient reward pool rejection
- multi-user staking state

Additional Solidity security notes are documented here:

[`docs/SECURITY_NOTES.md`](SECURITY_NOTES.md)

---

## 8 Access Control Decision

The current staking contract uses OpenZeppelin `Ownable`.

This is intentional for the current PoC because the contract currently has a simple privileged model:

```text
Owner
  → can update reward rate

Users
  → can stake
  → can withdraw
  → can claim rewards
  → can fund the reward pool
```

Role-based AccessControl is intentionally not implemented at this stage to avoid unnecessary complexity.

AccessControl would become appropriate if the protocol introduced multiple privileged roles, such as:

reward manager
treasury manager
pauser
backend operator
DAO-controlled admin
upgrade admin

For the current portfolio PoC, Ownable provides a clear and sufficient access-control model.

---

## 9. Frontend Layer

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
- Detect wrong wallet network and guide the user back to Sepolia
- Read wallet and staking state
- Trigger contract write operations
- Show transaction loading states
- Display clear transaction lifecycle status for wallet confirmation, network confirmation, and Etherscan review
- Display user-facing errors
- Provide Etherscan links
- Display reward pool liquidity
- Allow reward pool funding through MetaMask-confirmed transactions
- Display DeFi agent recommendations
- Keep blockchain execution under user control

The frontend does not store private keys and does not execute blockchain transactions without wallet confirmation.

The frontend also includes a Sepolia network guard. If the connected wallet is on a different EVM network, the dashboard shows a warning, disables write actions, and provides a `Switch to Sepolia` action through MetaMask.

---

## 10. Wallet & Transaction Flow

MetaMask is used as the wallet interaction layer.

Before allowing write actions, the dashboard checks that the connected wallet is on Ethereum Sepolia. If the wallet is connected to another network, staking, reward pool funding, reward claiming, and withdrawing are disabled until the user switches back to Sepolia.

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

The dashboard also includes a transaction status panel that explains the current transaction lifecycle to the user:

```text
Waiting for wallet confirmation
  → Waiting for Sepolia confirmation
  → Transaction submitted
  → Etherscan review available
```

This improves the user experience by making the wallet and network confirmation process more transparent.

---

## 11. Reward Pool UX

The dashboard includes a reward pool section that displays the current ETH balance held by the staking contract.

This balance represents contract liquidity available for paying staking rewards.

The reward pool UX includes:

- Contract balance display
- Reward funding input
- `Fund Pool` transaction action
- Warning when earned rewards may exceed available contract liquidity
- MetaMask-confirmed reward pool funding

This makes the staking system easier to understand because earned rewards and contract liquidity are separate concepts.

The intended model is:

```text
User stake
  → creates staking position

Reward pool funding
  → provides ETH liquidity for reward payouts

Claim rewards
  → transfers earned rewards if the contract has enough ETH
```

This improves the DeFi product UX by making reward liquidity visible instead of hidden behind failed claim transactions.

---

## 12. Agentic Decision Layer

The current agentic layer is a safe decision-support module.

It evaluates visible staking state and returns:

- Suggested action
- Confidence level
- Reasoning
- Recommended next step
- Execution guidance
- Risk note

Default mode:

```text
Local safe mock agent
```

Optional mode:

```text
React Frontend
  → /api/defi-agent
  → AI Model
  → Structured JSON Decision
  → Frontend Recommendation UI
```

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

## 13. Optional AI Proxy Implementation

The repository includes an optional backend/serverless AI proxy implementation:

```text
api/defi-agent.ts
```

The proxy is designed to support a future real AI agent integration while keeping API keys out of frontend code.

Configuration is controlled through:

```text
.env.example
```

Default safe mode:

```env
VITE_USE_AI_PROXY=false
```

Optional AI proxy mode:

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

The proxy returns a structured decision object:

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

---

## 14. Security & Safety Boundaries

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
- AI API keys are not exposed in frontend code.
- Optional AI proxy validates incoming request bodies.
- Optional AI proxy includes basic in-memory rate limiting.
- AI model output is normalized before being returned to the frontend.

Additional security and production-readiness notes are documented here:

[`docs/SECURITY_NOTES.md`](SECURITY_NOTES.md)

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

## 15. Current Limitations

This project is currently a PoC and has several limitations:

- Uses Sepolia testnet only.
- Default agentic decision layer is mocked.
- Optional AI proxy is included as an implementation path, but not required for default local demo.
- No production-grade backend deployment yet.
- No persistent database.
- Uses OpenZeppelin security primitives, but the staking contract itself has not been professionally audited.
- No real yield strategy optimization.c
- No autonomous fund management.
- No transaction history beyond the current session.
- No production risk engine.
- No financial advice logic.
- Automated contract tests cover the main staking, reward pool, event, access-control, and edge-case flows; future tests could still add reentrancy-oriented attack simulations and larger multi-user reward accounting scenarios.
  These limitations are intentional for a safe portfolio demonstration.

---

## 16. Planned Improvements

Planned improvements include:

- Add reentrancy-oriented attack simulation tests.
- Add larger multi-user reward accounting tests.
- Add frontend/component tests for dashboard UX.
- Improve error handling for rejected MetaMask transactions.
- Add transaction history persistence.
- Replace in-memory AI proxy rate limiting with a production-grade persistent limiter.
- Consider role-based `AccessControl` only if the protocol introduces multiple privileged roles.
- Prepare LinkedIn / portfolio case study post.

Completed portfolio documentation assets already include:
c

- Architecture documentation
- Architecture diagram
- Dashboard screenshots
- Portfolio case study
- Secure AI proxy architecture
- Solidity security notes

---

## 17. Future Secure AI Integration

The current project uses a safe mock DeFi agent by default.

The project also includes an optional backend/serverless AI proxy implementation.

Detailed proxy architecture:

[`docs/SECURE_AI_PROXY.md`](SECURE_AI_PROXY.md)

Optional implementation file:

```text
api/defi-agent.ts
```

The optional AI proxy implementation includes request validation and basic rate limiting.

Validation currently covers:

- HTTP method
- supported network
- ETH amount strings
- optional wallet address
- optional contract address
- optional transaction hash
- optional backend market context

The proxy also normalizes the AI response before returning it to the frontend.

Configuration example:

```text
.env.example
```

The main security principle is:

```text
AI API keys should never be exposed directly in frontend code.
```

Recommended production pattern:

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
   │ Returns structured JSON recommendation
   ▼
Backend / Serverless API Route
   │
   │ Validates and normalizes the response
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

This preserves the core safety principle:

```text
AI recommends, but the user controls execution.
```

The AI layer should support decision-making and explanation, while blockchain execution remains human-approved through MetaMask.

---

## 18. AI Operator Value

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

## 19. Portfolio Positioning

This project demonstrates the ability to operate at the intersection of:

- Frontend engineering
- Web3 wallet UX
- Solidity-to-UI integration
- Transaction transparency
- Reward pool UX
- AI-assisted product thinking
- Agentic workflow design
- Secure AI proxy architecture
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
