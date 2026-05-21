# Case Study — Agentic Staking Dashboard PoC

## 1. Context

This project was built as part of my transition toward AI Operator / AI Solutions Developer work with a Web3 focus.

The goal was not only to build a staking dashboard, but to demonstrate an AI-assisted operator workflow that connects smart contract logic, frontend integration, wallet UX, transaction transparency, and an explainable agentic recommendation layer.

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
- Creating usable UI components
- Documenting safety boundaries

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
- Run a safe mock DeFi agent recommendation layer

The AI agent layer does not execute wallet actions automatically. It provides an explainable recommendation and leaves execution under user control through MetaMask.

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
11. Hardening the smart contract with a reentrancy guard.
12. Improving reward pool visibility and funding UX.
13. Adding dashboard screenshots.
14. Adding architecture documentation.
15. Adding an architecture diagram.
16. Documenting the architecture and safety boundaries.
17. Documenting a secure AI proxy architecture for future production-style integration.

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
  → Agentic Recommendation Layer
```

The full architecture diagram is available in:

[`docs/architecture-diagram.md`](architecture-diagram.md)

---

## 6. What Was Validated

The following flows were tested:

- MetaMask wallet connection
- Sepolia contract deployment
- Staking transaction
- Transaction pending state
- Transaction confirmation
- On-chain balance update
- Reward pool balance display
- Reward pool funding transaction
- Withdraw transaction
- Etherscan transaction link
- Mock DeFi agent recommendation rendering
- Human-approved execution pattern

````md
- Transaction lifecycle status UX
- Wallet confirmation status
- Sepolia confirmation status
- Last transaction hash display

---

## 7. Safety Boundaries

The project intentionally avoids unsafe automation.

Current boundaries:

- No private keys are stored
- No seed phrase is requested
- No API key is exposed in frontend
- All blockchain writes require MetaMask confirmation
- The AI agent is recommendation-only
- The project runs on Sepolia testnet
- No real financial advice is provided
- No autonomous fund management is implemented

The intended safety model is:

```text
AI suggests → User reviews → MetaMask confirms → Blockchain executes
```
````

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

---

## 10. Portfolio Positioning

This project positions me as an AI Operator / Web3 Solutions Developer who can combine:

- Frontend engineering
- Solidity-to-UI integration
- Wallet UX
- AI-assisted development
- Agentic workflow design
- Security awareness
- Human-approved automation

The main message:

```text
I am not only building frontend screens.
I am designing AI-assisted Web3 workflows that turn smart contract logic into usable, explainable, and safer dApp interfaces.
```

---

## 11. Current Status

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
- Improved transaction status UX
- Secure AI proxy architecture documentation
- Reward pool visibility and funding UX

---

## 12. Next Improvements

Planned next steps:

- Add production-readiness notes
- Prepare LinkedIn / portfolio post
