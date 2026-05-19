# Case Study — Agentic Staking Dashboard PoC

## 1. Context

This project was built as part of my transition toward AI Operator / AI Solutions Developer work with a Web3 focus.

The goal was not only to build a staking dashboard, but to demonstrate an AI-assisted operator workflow that connects smart contract logic, frontend integration, wallet UX, transaction transparency, and an explainable agentic recommendation layer.

The project is designed as a portfolio Proof of Concept for remote / international Web3 opportunities, including crypto-paid work.

---

## 2. Problem

Web3 teams often face a repetitive and error-prone process when connecting Solidity smart contracts to real user-facing frontend interfaces.

Common tasks include:

- understanding contract functions
- building ABI-based frontend integration
- connecting wallets
- handling pending transactions
- waiting for confirmations
- displaying user-friendly errors
- linking transactions to explorers
- creating usable UI components
- documenting safety boundaries

This creates friction between smart contract development and actual dApp usability.

---

## 3. Solution

This PoC demonstrates a Solidity-to-UI workflow where a staking smart contract is connected to a React dashboard using wagmi, viem, MetaMask, and Sepolia.

The dashboard allows the user to:

- connect MetaMask
- stake Sepolia ETH
- withdraw staked ETH
- view staking and rewards state
- inspect contract and transaction activity on Sepolia Etherscan
- run a safe mock DeFi agent recommendation layer

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
12. Documenting the architecture and safety boundaries.

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

---

## 6. What Was Validated

The following flows were tested:

- MetaMask wallet connection
- Sepolia contract deployment
- staking transaction
- transaction pending state
- transaction confirmation
- on-chain balance update
- withdraw transaction
- Etherscan transaction link
- mock DeFi agent recommendation rendering
- human-approved execution pattern

---

## 7. Safety Boundaries

The project intentionally avoids unsafe automation.

Current boundaries:

- no private keys are stored
- no seed phrase is requested
- no API key is exposed in frontend
- all blockchain writes require MetaMask confirmation
- the AI agent is recommendation-only
- the project runs on Sepolia testnet
- no real financial advice is provided
- no autonomous fund management is implemented

The intended safety model is:

```text
AI suggests → User reviews → MetaMask confirms → Blockchain executes
```

---

## 8. Business Value

For a Web3 startup, DAO, or protocol team, this workflow demonstrates how an AI Operator can accelerate the transition from smart contract logic to usable frontend interfaces.

Potential value:

- faster Solidity-to-frontend integration
- standardized wallet UX
- reusable contract interaction hooks
- explainable DeFi decision support
- safer human-in-the-loop execution
- better transaction transparency
- portfolio-ready Web3 automation workflows

The value is not only the dashboard itself, but the repeatable process behind it.

---

## 9. Portfolio Positioning

This project positions me as an AI Operator / Web3 Solutions Developer who can combine:

- frontend engineering
- Solidity-to-UI integration
- wallet UX
- AI-assisted development
- agentic workflow design
- security awareness
- human-approved automation

The main message:

```text
I am not only building frontend screens.
I am designing AI-assisted Web3 workflows that turn smart contract logic into usable, explainable, and safer dApp interfaces.
```

---

## 10. Next Improvements

Planned next steps:

- add dashboard screenshots
- add architecture diagram
- add Sepolia network guard
- improve transaction status UX
- add secure AI proxy architecture
- improve reward pool UX
- add production-readiness notes
- prepare LinkedIn / portfolio post
