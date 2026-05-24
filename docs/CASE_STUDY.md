# Case Study — Agentic Staking Dashboard PoC

## 1. Context

This project was built as part of my transition toward AI Operator / AI Solutions Developer work with a Web3 focus.

The goal was not only to build a staking dashboard, but to demonstrate an AI-assisted operator workflow that connects smart contract logic, frontend integration, wallet UX, transaction transparency, reward pool visibility, backend DeFi context, and an explainable DeFi agent recommendation layer.

The project is designed as a portfolio Proof of Concept for remote / international Web3 opportunities, including crypto-paid work.

---

## 2. Problem

Web3 teams often face a repetitive and error-prone process when connecting Solidity smart contracts to real user-facing frontend interfaces.

Common tasks include:

- Understanding contract functions
- Building ABI-based frontend integration
- Connecting wallets
- Handling pending transactions
- Waiting for confirmations
- Displaying user-friendly errors
- Linking transactions to explorers
- Showing reward pool / contract liquidity clearly
- Creating usable UI components
- Documenting safety boundaries
- Preparing a safe path for AI-assisted decision support
- Turning on-chain activity into business automation triggers

This creates friction between smart contract development and actual dApp usability.

---

## 3. Solution

This PoC demonstrates a Solidity-to-UI workflow where a staking smart contract is connected to a React dashboard using wagmi, viem, MetaMask, and Sepolia.

The dashboard allows the user to:

- Connect MetaMask
- Stake Sepolia ETH
- Withdraw staked ETH
- View staking and rewards state
- View and fund the contract reward pool
- Inspect contract and transaction activity on Sepolia Etherscan
- See clear transaction lifecycle status
- Run a safe DeFi agent recommendation layer
- Understand the public demo mode before connecting a wallet
- View AI recommendation context separately from the main reasoning
- Review backend-provided mock DeFi market context

The DeFi agent layer does not execute wallet actions automatically. It provides an explainable recommendation and leaves execution under user control through MetaMask.

By default, the project uses a local safe mock agent. It also includes an optional backend/serverless AI proxy implementation for future real AI integration.

---

## 4. AI Operator Workflow

This project demonstrates AI Operator work rather than only manual frontend development.

The operator workflow included:

1. Defining the product concept.
2. Designing the Solidity-to-UI pipeline.
3. Guiding AI-assisted code generation.
4. Validating generated React and TypeScript code.
5. Fixing deprecated wagmi / viem patterns.
6. Debugging wallet connector conflicts.
7. Deploying the smart contract through Remix.
8. Connecting the frontend to a live Sepolia contract.
9. Adding Etherscan transparency.
10. Adding an explainable mock DeFi agent layer.
11. Hardening the smart contract with reentrancy protection.
12. Adding Sepolia network guard behavior.
13. Improving transaction status UX.
14. Improving reward pool visibility and funding UX.
15. Adding dashboard screenshots.
16. Adding architecture documentation.
17. Adding an architecture diagram.
18. Documenting a secure AI proxy architecture for future production-style integration.
19. Documenting Solidity security boundaries and production-readiness limitations.
20. Adding an optional backend/serverless AI proxy implementation.
21. Adding backend DeFi mock context for APY, gas, risk, liquidity, and pool-health signals.
22. Replacing custom security logic with OpenZeppelin `ReentrancyGuard` and `Ownable`.
23. Adding smart contract event emissions.
24. Adding automated Hardhat tests for core staking contract flows.
25. Expanding automated contract tests for rewards, events, access control, and edge cases.
26. Adding request validation and basic rate limiting to the optional AI proxy.
27. Making an explicit access-control decision to keep `Ownable` for the current PoC instead of overengineering with role-based `AccessControl`.
28. Improving public demo UX for users without a connected wallet.
29. Improving mobile MetaMask browser guidance.
30. Adding B2B readiness documentation and automation assets.

---

## 5. Technical Flow

```text
Solidity Staking Contract
  → Remix Deployment
  → Ethereum Sepolia Contract Address
  → React / TypeScript Dashboard
  → wagmi / viem Contract Hooks
  → MetaMask Wallet Confirmation
  → Sepolia Transaction
  → Etherscan Transparency
  → Reward Pool Visibility
  → Backend DeFi Mock Context
  → Safe Mock Agent / Optional AI Proxy
  → Agentic Recommendation Layer
  → Human-Approved Execution
```

The full architecture diagram is available in:

[`docs/architecture-diagram.md`](architecture-diagram.md)

---

## 6. What Was Validated

The following flows were tested or validated:

- MetaMask wallet connection
- Sepolia contract deployment
- Sepolia network guard
- Wrong-network warning state
- Disabled transaction actions on unsupported networks
- Switch-to-Sepolia recovery flow
- Staking transaction
- Transaction pending state
- Wallet confirmation status
- Sepolia confirmation status
- Last transaction hash display
- Transaction lifecycle status UX
- Transaction confirmation
- On-chain balance update
- Reward pool balance display
- Reward pool funding transaction
- Withdraw transaction
- Etherscan transaction link
- Safe mock-agent default mode
- Mock DeFi agent recommendation rendering
- Optional AI proxy fallback behavior
- Server-side AI proxy architecture path
- Backend DeFi mock context API
- DeFi market context dashboard rendering
- AI recommendation enriched with mock market context
- Human-approved execution pattern
- OpenZeppelin-based reentrancy protection
- OpenZeppelin-based ownership protection
- Owner-only reward rate protection
- Automated Hardhat contract test setup
- Owner assignment on deploy
- Staking test flow
- Reward pool funding test flow
- Withdrawal test flow
- Owner-only reward rate test flow
- Zero-value transaction rejection tests
- AI proxy request body validation
- AI proxy supported network validation
- AI proxy ETH amount validation
- AI proxy response normalization
- Basic in-memory AI proxy rate limiting
- Reward claiming test flow
- Emitted event assertions
- Insufficient reward pool rejection test
- Invalid reward rate rejection test
- Withdraw-without-stake rejection test
- Multi-user staking state test
- Public demo onboarding UX
- Read-only demo behavior without wallet connection
- Separate AI recommendation context rendering
- Mobile MetaMask browser flow through the MetaMask Explore / Browser tab
- B2B documentation layer for AI guardrails, event monitoring, and proposal framing

---

## 7. Safety Boundaries

The project intentionally avoids unsafe automation.

Current boundaries:

- No private keys are stored
- No seed phrase is requested
- No API key is exposed in frontend code
- All blockchain writes require MetaMask confirmation
- The DeFi agent is recommendation-only
- The project runs on Sepolia testnet
- No real financial advice is provided
- No autonomous fund management is implemented
- AI recommendations do not directly execute wallet actions
- Optional AI proxy responses are validated and normalized
- Fallback behavior defaults to safe `HOLD`

The intended safety model is:

```text
AI suggests → Rules validate → User reviews → MetaMask confirms → Blockchain executes
```

---

## 8. Business Value

For a Web3 startup, DAO, or protocol team, this workflow demonstrates how an AI Operator can accelerate the transition from smart contract logic to usable frontend interfaces.

Potential value:

- Faster Solidity-to-frontend integration
- Standardized wallet UX
- Reusable contract interaction hooks
- Explainable DeFi decision support
- Clearer reward liquidity visibility
- Safer human-in-the-loop execution
- Better transaction transparency
- Backend-driven mock DeFi market context
- Production-safe path for AI API integration
- Event-driven automation planning
- B2B-ready delivery documentation
- Portfolio-ready Web3 automation workflows

The value is not only the dashboard itself, but the repeatable process behind it.

---

## 9. Portfolio Demo Assets

The project includes dashboard screenshots that show the working flow:

```text
docs/assets/dashboard-connected.png
docs/assets/metamask-transaction.png
docs/assets/etherscan-transaction.png
docs/assets/ai-recommendation.png
```

These screenshots demonstrate:

- Connected dashboard state
- MetaMask transaction confirmation
- Etherscan transaction proof
- AI Auto-Pilot recommendation output

The project also includes a deployed Vercel demo:

```text
https://agentic-staking-dashboard-poc.vercel.app
```

---

## 10. Documentation Assets

The project includes supporting documentation:

- [`Architecture Documentation`](ARCHITECTURE.md)
- [`Architecture Diagram`](architecture-diagram.md)
- [`Secure AI Proxy Architecture`](SECURE_AI_PROXY.md)
- [`Security Notes`](SECURITY_NOTES.md)
- [`Demo Walkthrough`](DEMO_WALKTHROUGH.md)
- [`AI Evaluation Guardrails`](AI_EVALUATION_GUARDRAILS.md)
- [`Event Monitoring Automation`](EVENT_MONITORING_AUTOMATION.md)
- [`B2B Project Proposal Template`](B2B_PROJECT_PROPOSAL.md)

These documents explain the technical architecture, AI Operator workflow, secure AI integration path, Solidity production-readiness boundaries, safety constraints, event-driven automation options, and B2B delivery framing.

The B2B documentation layer explains how the system could be evaluated, monitored, automated, packaged, and proposed as a client-facing Web3 AI Operator service.

---

## 11. Optional AI Proxy Implementation

The project includes an optional backend/serverless AI proxy implementation:

```text
api/defi-agent.ts
```

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

The optional proxy is designed to keep AI API keys server-side.

The configuration example is documented in:

```text
.env.example
```

The key safety rule:

```text
GEMINI_API_KEY must remain server-side only.
It must not be exposed as VITE_GEMINI_API_KEY.
```

This shows how the project can evolve from a local mock agent into a real AI-assisted decision-support layer without exposing secrets in frontend code.

---

## 12. Event-Driven Automation Potential

The staking contract emits events such as:

```text
Staked
Withdrawn
RewardClaimed
RewardsFunded
RewardRateUpdated
```

These events can be used by external automation systems to trigger workflows such as:

- Telegram / Discord notifications
- reward claim reports
- staking activity summaries
- liquidity monitoring alerts
- operator dashboards
- AI-generated explanations of user activity

This turns the smart contract from a passive backend into an observable automation source.

The event automation plan is documented in:

[`Event Monitoring Automation`](EVENT_MONITORING_AUTOMATION.md)

---

## 13. B2B Readiness Layer

The project includes B2B-oriented assets that show how the PoC could be evaluated, monitored, automated, packaged, and offered as a client-facing service.

B2B readiness assets include:

- AI evaluation guardrails
- fallback behavior
- token / API cost-control thinking
- event monitoring automation plan
- commercial proposal template
- project automation commands through `Makefile`

This layer helps position the project as more than a technical demo.

It presents the project as a reusable delivery framework for Web3 teams that need:

```text
AI Operator
+
Web3 dashboard delivery
+
smart contract integration
+
AI recommendation guardrails
+
event-driven automation
+
client-ready proposal structure
```

---

## 14. Portfolio Positioning

This project positions me as an AI Operator / Web3 Solutions Developer who can combine:

- Frontend engineering
- Solidity-to-UI integration
- Wallet UX
- AI-assisted development
- Agentic workflow design
- Secure AI proxy architecture
- Security awareness
- Human-approved automation
- B2B solution packaging
- AI evaluation and guardrail planning
- Event-driven automation design
- Commercial proposal framing

The main message:

```text
I am not only building frontend screens.
I am designing AI-assisted Web3 workflows that turn smart contract logic into usable, explainable, and safer dApp interfaces.
```

---

## 15. Current Status

Completed:

- Deployed Sepolia staking contract
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
- Backend DeFi mock context API
- OpenZeppelin-based `ReentrancyGuard` and `Ownable`
- Staking contract event emissions
- Technical demo walkthrough
- Automated staking contract tests
- Expanded automated staking contract tests
- AI proxy request validation and rate limiting
- Documented access-control decision
- Public demo onboarding UX
- Separate AI recommendation context display
- Mobile MetaMask browser guidance
- Vercel live demo deployment
- B2B readiness documentation
- AI evaluation guardrails
- Event monitoring automation plan
- B2B project proposal template
- Project automation Makefile

---

## 16. Next Improvements

Planned next steps:

- Prepare LinkedIn / portfolio post
- Add frontend/component tests for dashboard UX
- Add reentrancy-oriented attack simulation tests
- Replace in-memory AI proxy rate limiting with production-grade persistent rate limiting
