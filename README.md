# Agentic Staking Dashboard PoC

A portfolio Proof of Concept demonstrating an Agentic Web3 Automation workflow: transforming a Solidity smart contract into a working React frontend integration.

## Project Concept

This project demonstrates a Solidity-to-UI pipeline where an AI Operator uses structured prompting and iterative validation to generate a production-oriented Web3 frontend.

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

## Tech Stack

- React
- TypeScript
- Vite
- Solidity
- wagmi
- viem
- TanStack React Query
- Tailwind CSS
- MetaMask
- Sepolia testnet

## Current Frontend Structure

```text
src/
  components/
    StakingDashboard.tsx
  hooks/
    useStaking.ts
  App.tsx
  main.tsx
  wagmi.ts
  index.css
```
