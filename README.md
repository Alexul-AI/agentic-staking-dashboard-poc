# Agentic Staking Dashboard PoC

A portfolio Proof of Concept demonstrating an Agentic Web3 Automation workflow: transforming a Solidity smart contract into a working React frontend integration.

## Project Concept

This project demonstrates a Solidity-to-UI pipeline where an AI Operator uses structured prompting, iterative validation, and debugging to generate a production-oriented Web3 frontend.

The goal is not only to build a staking dashboard, but to show how AI-assisted workflows can accelerate repetitive Web3 frontend integration work.

## Problem

In Web3 projects, connecting Solidity smart contracts to frontend applications is often repetitive, slow, and error-prone.

Developers usually need to manually create:

- contract ABI integration
- wallet connection logic
- read/write contract hooks
- transaction pending states
- transaction receipt confirmation handling
- MetaMask rejection handling
- user-facing error states
- UI components for contract interaction

## Solution

This PoC uses an AI-assisted workflow to generate:

- a reusable React staking hook
- wagmi / viem contract interaction logic
- a Tailwind CSS dashboard component
- transaction lifecycle handling
- error handling for common wallet and blockchain cases
- MetaMask connection flow
- deployed Sepolia contract integration

## Deployed Contract

Network:

```text
Ethereum Sepolia Testnet

Contract address:

0x79406FB2c52108ff36C4bB801c0Cd5215Cf40183

Explorer:

https://sepolia.etherscan.io/address/0x79406FB2c52108ff36C4bB801c0Cd5215Cf40183

Tech Stack
React
TypeScript
Vite
Solidity
wagmi
viem
TanStack React Query
Tailwind CSS
MetaMask
Sepolia testnet
Remix IDE
Project Structure
src/
  components/
    StakingDashboard.tsx
  hooks/
    useStaking.ts
  App.tsx
  main.tsx
  wagmi.ts
  index.css

contracts/
  StakingContract.sol

prompts/
  system-instruction.md
  iteration-log.md
Smart Contract Features

The Solidity contract supports:

stake ETH
withdraw staked ETH
claim accumulated rewards
read user stake
read user rewards
fund the contract reward pool
owner-controlled reward rate
Frontend Features
MetaMask wallet connection
ETH staking input
staked balance display
earned rewards display
claim rewards button
withdraw button
loading spinner during transactions
user-facing error messages
transaction confirmation flow
automatic UI refresh after confirmed transactions
Verified Flow

The end-to-end flow was tested on Ethereum Sepolia:

React UI
  → wagmi / viem hook
  → MetaMask transaction request
  → Sepolia smart contract
  → transaction confirmation
  → updated on-chain staking balance in UI

Tested actions:

wallet connection
stake transaction
transaction pending state
on-chain balance update
withdraw transaction
rewards state update
AI Operator Role

This project was built as an AI Operator workflow.

The operator designed the system instructions, validated the generated code, fixed deprecated API usage, improved React hook dependencies, resolved wallet connector issues, deployed the contract through Remix, and connected the generated frontend to a live Sepolia smart contract.

How to Run

Install dependencies:

npm install

Start the development server:

npm run dev

Build the project:

npm run build
Status

Portfolio PoC / work in progress.

Next planned improvements:

add network mismatch handling
add transaction hash links to Sepolia Etherscan
improve reward pool UX
add production security notes for the Solidity contract
add architecture documentation
```
