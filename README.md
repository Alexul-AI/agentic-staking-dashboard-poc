# Agentic Staking Dashboard PoC

A portfolio Proof of Concept demonstrating how an AI-assisted Web3 operator workflow can turn Solidity smart contract logic into a usable React staking dashboard with wallet interaction, transaction transparency, reward pool visibility, and an explainable DeFi agent layer.

This project is part of my transition toward AI Operator / AI Solutions Developer work with a Web3 focus.

---

## Overview

`agentic-staking-dashboard-poc` demonstrates a full Solidity-to-UI integration workflow:

- Deployed staking smart contract on Ethereum Sepolia
- React / TypeScript dashboard
- MetaMask wallet connection
- Staking, withdrawal, reward claiming, and reward pool funding flow
- Sepolia Etherscan links for contract and transaction transparency
- Reward pool visibility and funding UX
- Safe mock DeFi agent decision layer
- Optional backend/serverless AI proxy implementation
- Backend DeFi mock context API
- AI proxy request validation and rate limiting
- Human-confirmed blockchain execution

The goal is not only to build a staking dashboard, but to show how AI-assisted workflows can help Web3 teams move from smart contract logic to usable frontend interfaces faster and more safely.

---

## Demo Preview

### Connected Dashboard

![Connected Dashboard](docs/assets/dashboard-connected.png)

### MetaMask Transaction Confirmation

![MetaMask Transaction](docs/assets/metamask-transaction.png)

### Sepolia Etherscan Transaction

![Sepolia Etherscan Transaction](docs/assets/etherscan-transaction.png)

### AI Auto-Pilot Recommendation

![AI Recommendation](docs/assets/ai-recommendation.png)

---

## Architecture Diagram

The project architecture is documented in:

- [`Architecture Documentation`](docs/ARCHITECTURE.md)
- [`Architecture Diagram`](docs/architecture-diagram.md)
- [`Portfolio Case Study`](docs/CASE_STUDY.md)

High-level flow:

```text
React Dashboard
  → wagmi / viem
  → MetaMask
  → Sepolia Staking Contract
  → Etherscan Transparency
  → Reward Pool UX
  → Safe Mock Agent / Optional AI Proxy
  → Human-Approved Execution
```

---

## Problem

In Web3 projects, connecting Solidity smart contracts to frontend applications is often repetitive, slow, and error-prone.

Teams usually need to manually build:

- Contract ABI integration
- Wallet connection logic
- Read/write contract hooks
- Transaction pending states
- Transaction confirmation handling
- MetaMask rejection handling
- User-facing error states
- Explorer links for transparency
- Reward pool / contract liquidity visibility
- UI components for contract interaction
- Documentation of safety boundaries

This creates friction between smart contract development and real user-facing dApp interfaces.

---

## Solution

This PoC shows an AI-assisted operator workflow for generating, validating, and connecting a working Web3 frontend integration.

The workflow includes:

- Translating Solidity contract functions into frontend actions
- Building reusable React hooks
- Connecting wagmi / viem contract calls
- Handling MetaMask wallet states
- Blocking write actions on the wrong network
- Showing transaction status to the user
- Linking transactions to Sepolia Etherscan
- Displaying contract reward pool liquidity
- Supporting reward pool funding through MetaMask-confirmed transactions
- Adding a safe mock agent layer that explains possible next actions
- Adding an optional backend/serverless AI proxy path for future real AI integration
- Adding a backend DeFi mock context API for simulated APY, gas, risk, liquidity, and pool-health signals

The AI layer does not execute transactions automatically. It only provides explainable recommendations. The user remains in control and confirms every blockchain action through MetaMask.

---

## Live Contract

**Network:** Ethereum Sepolia Testnet

**Contract Address:**

```text
0xA8Ac339504973AB21c1206F753C5BAF0350ba08d
```

**Sepolia Etherscan:**

```text
https://sepolia.etherscan.io/address/0xA8Ac339504973AB21c1206F753C5BAF0350ba08d
```

---

## Tech Stack

- React
- TypeScript
- Vite
- Solidity
- OpenZeppelin Contracts
- Hardhat
- wagmi
- viem
- TanStack React Query
- Tailwind CSS
- MetaMask
- Ethereum Sepolia Testnet
- Remix IDE
- Optional serverless AI proxy
- Gemini API integration path

---

## Project Structure

```text
api/
  defi-agent.ts
  defi-market-context.ts

src/
  components/
    StakingDashboard.tsx
  hooks/
    useStaking.ts
    useDeFiAgent.ts
    useDeFiMarketContext.ts
  App.tsx
  main.tsx
  wagmi.ts
  index.css

contracts/
  StakingContract.sol

test/
  StakingContract.test.ts

prompts/
  system-instruction.md
  iteration-log.md
  defi-context.md

docs/
  ARCHITECTURE.md
  CASE_STUDY.md
  DEMO_WALKTHROUGH.md
  SECURE_AI_PROXY.md
  SECURITY_NOTES.md
  architecture-diagram.md
  assets/

hardhat.config.ts
.env.example
```

---

## Smart Contract Features

The Solidity staking contract supports:

- Staking ETH
- Withdrawing staked ETH
- Claiming accumulated rewards
- Reading user stake
- Reading user rewards
- Reading contract reward pool balance
- Funding the reward pool
- Owner-controlled reward rate
- Event emissions for key staking actions
- OpenZeppelin-based `ReentrancyGuard`
- OpenZeppelin-based `Ownable` access control
- Automated Hardhat tests for staking, reward pool funding, reward claiming, events, access control, and edge cases
  The contract is deployed on Sepolia for demonstration purposes only.

Security hardening includes:

- Checks-Effects-Interactions flow
- Custom `nonReentrant` guard
- Owner-only reward rate updates

---

## Frontend Features

The React dashboard supports:

- MetaMask wallet connection
- Sepolia network guard
- ETH staking input
- Staked balance display
- Earned rewards display
- Reward pool / contract balance display
- Reward pool funding action
- Claim rewards action
- Withdraw action
- Loading states during transactions
- Transaction lifecycle status UX
- User-facing error messages
- Transaction confirmation flow
- Automatic UI refresh after confirmed transactions
- Sepolia Etherscan links for contract and transaction review
- AI Auto-Pilot recommendation rendering
- Public demo onboarding message for users without a connected wallet
- Separate AI recommendation context display

---

## DeFi Agent Layer

The project includes a safe DeFi agent decision layer.

By default, the dashboard uses a local mock agent. This keeps the project safe for GitHub and portfolio review because no external AI API key is required.

The project also includes an optional backend/serverless AI proxy implementation:

```text
React Frontend → /api/defi-agent → AI Model → Structured JSON Decision → Frontend
```

The dashboard also includes a backend DeFi mock context API:

```text
/api/defi-market-context
```

This endpoint returns simulated market context used by the AI Auto-Pilot layer, including:

- Mock APY
- Gas condition
- Pool health
- Risk level
- Liquidity status
- Market note

This makes the recommendation layer more product-like because the agent can combine visible on-chain staking state with backend-provided DeFi context.

The agent evaluates the current staking position and returns:

- Suggested action
- Confidence level
- Reasoning
- Context used
- Recommended next step
- Execution guidance
- Risk note

The recommendation UI separates the agent reasoning from the backend mock DeFi context. This keeps the output easier to read and avoids repeating the same context across every explanation field.

Current supported actions:

```text
STAKE_MORE
CLAIM_REWARDS
WITHDRAW_ALL
HOLD
```

The agent does not control the wallet and does not submit transactions automatically.

The intended pattern is:

```text
AI suggests → User reviews → MetaMask confirms → Blockchain executes
```

This keeps the system explainable, auditable, and human-approved.

---

## Verified Flow

The end-to-end flow was tested on Ethereum Sepolia:

```text
React UI
  → wagmi / viem hook
  → MetaMask transaction request
  → Sepolia smart contract
  → transaction confirmation
  → updated on-chain staking balance in UI
  → reward pool update
  → Etherscan transaction review
  → mock agent recommendation
  - Backend DeFi mock context loading
  - AI recommendation enriched with mock market context
```

Tested actions:

- Wallet connection
- Sepolia network guard
- Wrong-network warning state
- Switch-to-Sepolia recovery flow
- Stake transaction
- Reward pool funding transaction
- Transaction pending state
- Transaction lifecycle status UX
- On-chain balance update
- Withdraw transaction
- Rewards state update
- Contract balance / reward pool update
- Etherscan transaction link
- Mock agent recommendation rendering
- Optional AI proxy fallback behavior
- Safe mock-agent default mode

---

## AI Operator Role

This project was built as an AI Operator workflow.

The operator role included:

- Defining the system instructions
- Guiding AI-assisted code generation
- Validating generated React and TypeScript code
- Fixing deprecated wagmi / viem usage
- Improving React hook dependencies
- Resolving wallet connector issues
- Deploying the contract through Remix
- Connecting the frontend to a live Sepolia smart contract
- Adding transaction transparency through Etherscan links
- Hardening the Solidity contract with a reentrancy guard
- Designing reward pool visibility and funding UX
- Designing a safe human-in-the-loop agentic decision layer
- Documenting a secure backend/serverless AI proxy path
- Documenting security boundaries and production-readiness limitations

The purpose is to demonstrate not only frontend implementation, but also operator judgment, architecture decisions, and safe AI-assisted Web3 delivery.

---

## Security & Safety Notes

This is a portfolio PoC running on Sepolia testnet.

Current safety boundaries:

- No private keys are stored in the frontend
- No seed phrases are requested or handled
- All transactions require MetaMask confirmation
- The smart contract uses OpenZeppelin `ReentrancyGuard`
- The smart contract uses OpenZeppelin `Ownable`
- The mock agent does not execute blockchain actions automatically
- No autonomous fund management is implemented
- No production yield strategy is used
- No real financial advice is provided
- Etherscan links are included for transparency
- API keys are not exposed in frontend code
- Optional AI proxy validates request body before calling the AI model
- Optional AI proxy includes basic in-memory rate limiting

Future production AI integration should use a secure backend or serverless proxy.

This repository includes an optional serverless proxy example in:

```text
api/defi-agent.ts
```

The proxy is disabled by default unless explicitly enabled through environment configuration.

Recommended production pattern:

```text
Frontend → Backend / Serverless Proxy → AI API
```

The optional AI proxy implementation includes:

- request method validation
- supported network validation
- ETH amount string validation
- optional wallet and contract address validation
- optional transaction hash validation
- sanitized market context input
- response normalization
- basic in-memory rate limiting

For production, the in-memory limiter should be replaced with a persistent rate-limiting layer such as Redis / Upstash or a platform-level edge rate limiter.

`GEMINI_API_KEY` must remain server-side only. It must not be exposed as a `VITE_*` variable.

---

## How to Run

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build the project:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

Run smart contract tests:

```bash
npm run test:contracts
```

---

### Mobile Wallet Usage

On mobile, wallet connection should be opened through the MetaMask mobile app browser.

Recommended mobile flow:

```text
MetaMask app
  → Explore / Browser
  → open https://agentic-staking-dashboard-poc.vercel.app
  → connect wallet
  → switch to Sepolia if needed
```

Regular mobile browsers such as Chrome, Safari, or Mi Browser may not expose the injected wallet provider required by wagmi / MetaMask connection.

---

## Optional AI Proxy Configuration

Copy the example environment file:

```bash
cp .env.example .env
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

Important:

```text
GEMINI_API_KEY must remain server-side only.
Do not expose it as VITE_GEMINI_API_KEY.
Do not commit real .env files.
```

The `.env.example` file is safe to commit. The real `.env` file must remain ignored by Git.

---

## Documentation

Current documentation:

- [`Architecture Documentation`](docs/ARCHITECTURE.md)
- [`Architecture Diagram`](docs/architecture-diagram.md)
- [`Portfolio Case Study`](docs/CASE_STUDY.md)
- [`Demo Walkthrough`](docs/DEMO_WALKTHROUGH.md)
- [`Secure AI Proxy Architecture`](docs/SECURE_AI_PROXY.md)
- [`Security Notes`](docs/SECURITY_NOTES.md)
- `prompts/system-instruction.md`
- `prompts/iteration-log.md`
- `prompts/defi-context.md`

Configuration example:

- `.env.example`

Demo assets:

- `docs/assets/dashboard-connected.png`
- `docs/assets/metamask-transaction.png`
- `docs/assets/etherscan-transaction.png`
- `docs/assets/ai-recommendation.png`

---

## Current Status

Portfolio PoC / work in progress.

Completed:

- Deployed Sepolia staking contract
- Hardened staking contract with a custom `nonReentrant` guard
- React staking dashboard
- MetaMask wallet flow
- Staking and withdrawal interaction
- Etherscan contract and transaction links
- Safe mock DeFi agent decision layer
- Explainable recommendation UX
- Dashboard demo screenshots
- Architecture documentation
- Architecture diagram
- Portfolio case study
- Sepolia network guard
- Improved transaction status UX
- Secure AI proxy architecture documentation
- Reward pool visibility and funding UX
- Solidity production security notes
- Optional backend/serverless AI proxy implementation
- OpenZeppelin-based `ReentrancyGuard` and `Ownable`
- Technical demo walkthrough
- Backend DeFi mock context API
- DeFi market context dashboard UI
- Automated staking contract tests
- AI proxy request validation and rate limiting
- Documented access-control decision: `Ownable` is sufficient for the current PoC
- Expanded automated staking contract tests
- Public demo onboarding UX
- Separate AI recommendation context display

Next planned improvements:

- Add frontend/component tests for dashboard UX
- Replace in-memory AI proxy rate limiting with production-grade persistent rate limiting
- Consider role-based `AccessControl` only if multiple privileged roles are introduced
- Prepare LinkedIn / portfolio case study post

---

## Portfolio Positioning

This project demonstrates the ability to combine:

- Frontend engineering
- Solidity-to-UI integration
- Web3 wallet UX
- Transaction transparency
- Reward pool UX
- AI-assisted development
- Agentic workflow design
- Secure AI proxy architecture
- Human-in-the-loop automation
- Solidity security awareness

The main value of the project is the workflow behind it: using AI-assisted operator methods to transform smart contract logic into a usable, explainable, and safer Web3 interface.

This project is part of a broader path toward AI Operator / AI Solutions Developer work focused on Web3 automation, agentic dashboards, and remote crypto-paid opportunities.
