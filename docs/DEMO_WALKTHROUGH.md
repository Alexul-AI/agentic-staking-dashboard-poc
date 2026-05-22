# Demo Walkthrough — Agentic Staking Dashboard PoC

## 1. Purpose

This document explains how to present the `agentic-staking-dashboard-poc` project in a live technical walkthrough.

The goal is to make the project understandable to a frontend developer, team lead, Web3 builder, or potential client who may not be deeply familiar with DeFi or agentic AI workflows.

The project demonstrates a practical AI Operator / Web3 workflow:

```text
Solidity smart contract
  → React dashboard
  → MetaMask wallet flow
  → Sepolia blockchain transactions
  → Etherscan transparency
  → Mock DeFi agent recommendation
  → Human-approved execution
```

---

## 2. One-Sentence Explanation

This project is a portfolio PoC showing how an AI Operator can turn smart contract logic into a working Web3 dashboard with wallet interaction, transaction transparency, reward pool visibility, and an explainable DeFi recommendation layer.

---

## 3. What Is Real

The following parts are real and working:

- Deployed Solidity staking contract on Ethereum Sepolia
- React / TypeScript dashboard
- MetaMask wallet connection
- Sepolia network guard
- Stake transaction
- Withdraw transaction
- Reward pool funding transaction
- Contract balance / reward pool display
- Transaction lifecycle status
- Sepolia Etherscan contract links
- Sepolia Etherscan transaction links
- Event emissions from the smart contract
- OpenZeppelin `ReentrancyGuard`
- OpenZeppelin `Ownable`
- Backend DeFi mock context endpoint
- DeFi market context dashboard block

These parts interact with a real deployed testnet smart contract.

---

## 4. What Is Mock / Simulated

The following parts are intentionally mocked or optional:

- The current AI Auto-Pilot recommendation layer is a safe local mock agent by default.
- The mock agent does not call a real external AI API by default.
- The mock agent does not execute transactions.
- The project does not use a real DeFi yield source.
- Rewards are calculated by the demo staking contract, not by a real market protocol.
- APY, gas condition, pool health, risk level, and liquidity status are simulated backend values.

This is intentional for portfolio safety.

The project also includes an optional backend/serverless AI proxy path for future real AI integration.

---

## 5. Demo Preparation

Before starting the demo:

1. Open the project locally.
2. Make sure MetaMask is installed.
3. Make sure MetaMask is connected to the same wallet used for testing.
4. Make sure the wallet has Sepolia ETH.
5. Run the app locally:

```bash
npm run dev
```

6. Open:

```text
http://localhost:5173
```

7. Make sure the contract address in `src/App.tsx` matches the latest deployed Sepolia contract.

---

## 6. Suggested Live Demo Flow

### Step 1 — Show the Dashboard

Open the dashboard.

Explain:

```text
This is a Web3 staking dashboard connected to a deployed Sepolia smart contract.
```

Point out:

- Connected wallet
- Staked ETH
- Earned rewards
- Reward pool
- On-chain references
- Stake input
- AI Auto-Pilot button
- Withdraw and claim actions

---

### Step 2 — Show the Contract on Etherscan

Click:

```text
View staking contract on Sepolia Etherscan
```

Explain:

```text
This proves the dashboard is connected to an actual deployed testnet smart contract, not only local frontend state.
```

Point out:

- Contract address
- Sepolia network
- Transactions
- Event logs after interactions

---

### Step 3 — Show Sepolia Network Guard

Switch MetaMask to a different EVM network, such as Base, OP, or Ethereum Mainnet.

Return to the dashboard.

Expected behavior:

- Warning appears
- Stake / Claim / Withdraw / Fund Pool actions are disabled
- User sees `Switch to Sepolia`

Explain:

```text
The dashboard prevents write actions when the wallet is connected to the wrong network.
```

Then click:

```text
Switch to Sepolia
```

Confirm in MetaMask.

---

### Step 4 — Fund the Reward Pool

In the Reward Pool section, enter a small amount:

```text
0.001
```

Click:

```text
Fund Pool
```

Confirm the transaction in MetaMask.

Explain:

```text
Funding the pool adds ETH liquidity to the contract so rewards can be paid later.
```

Point out:

```text
Contract Balance increases
```

Important distinction:

```text
Fund Pool does not increase Staked ETH.
It only increases contract liquidity.
```

---

### Step 5 — Stake Sepolia ETH

In Deposit Amount, enter:

```text
0.001
```

Click:

```text
Stake
```

Confirm in MetaMask.

Explain:

```text
This creates the user staking position on-chain.
```

Point out:

- Transaction status panel
- Wallet confirmation state
- Sepolia confirmation state
- Transaction hash
- Etherscan link
- Updated `Staked ETH`

---

### Step 6 — Open the Last Transaction on Etherscan

Click:

```text
View last transaction on Sepolia Etherscan
```

Explain:

```text
Every transaction can be inspected externally on Etherscan.
This gives the dashboard transparency and auditability.
```

Point out:

- Transaction hash
- Status success
- From wallet address
- To contract address
- Function call
- Event logs

---

### Step 7 — Run AI Auto-Pilot

Click:

```text
AI Auto-Pilot
```

Explain:

```text
The current agent is a safe mock DeFi decision layer.
It reads the visible staking state and returns a structured recommendation.
```

Point out:

- AI Action
- Confidence
- Reasoning
- Recommended next step
- Execution hint
- Risk note

Important:

```text
The AI does not execute transactions.
It only recommends.
The user must manually confirm blockchain actions through MetaMask.
```

---

### Step 8 — Show Backend DeFi Mock Context

Point out the DeFi Market Context section.

Explain:

```text
This backend mock endpoint simulates DeFi market context such as APY, gas condition, pool health, risk level, and liquidity status.
```

The purpose is to show how the agent can combine:

```text
on-chain staking state
+
backend DeFi context
```

This makes the dashboard closer to a product-style Agentic DeFi Dashboard rather than only a staking UI.

### Step 9 — Explain Optional AI Proxy

Open:

```text
docs/SECURE_AI_PROXY.md
```

Explain:

```text
The current portfolio-safe mode uses a local mock agent.
The project also includes an optional backend/serverless AI proxy architecture for real AI integration.
```

Then explain the future flow:

```text
React frontend
  → /api/defi-agent
  → server-side AI API call
  → structured JSON decision
  → frontend recommendation
  → user confirms manually through MetaMask
```

Key point:

```text
AI API keys stay server-side.
No private keys or wallet secrets are exposed.
```

---

## 7. How to Explain the DeFi Part

This project is not a full DeFi protocol.

It demonstrates a simplified DeFi-like staking flow:

```text
User stakes ETH
  → contract records user position

Reward pool is funded
  → contract has ETH liquidity for rewards

Rewards accumulate
  → user may claim rewards if available

User withdraws
  → staked ETH returns to user
```

The important product idea:

```text
A DeFi dashboard should show not only user balance, but also reward liquidity, transaction state, and risk context.
```

---

## 8. How to Explain the AI Operator Part

The value is not only the code.

The AI Operator role includes:

- Defining the system concept
- Translating Solidity contract logic into UI requirements
- Guiding AI-assisted code generation
- Debugging generated code
- Validating wallet and transaction flows
- Adding safety boundaries
- Documenting architecture
- Turning a raw prototype into a portfolio-ready asset

Main message:

```text
I am not only building a staking app.
I am building an AI-assisted Web3 workflow that turns smart contract logic into a usable, explainable dashboard.
```

---

## 9. What This Could Become

Possible next product directions:

- Real backend DeFi market context API
- Real AI model integration through the serverless proxy
- Automated tests for the Solidity contract
- Event-based transaction history
- Better reward accounting
- Role-based access control
- More advanced risk scoring
- Multi-contract Solidity-to-UI generation pipeline
- Client-facing AI Operator service for Web3 teams

---

## 10. Questions to Ask During Technical Review

Useful questions for a frontend team lead or Web3 reviewer:

1. Is the dashboard flow understandable?
2. Is the wallet UX clear enough?
3. Does the separation between mock AI and real on-chain flow make sense?
4. What would make this feel more production-like?
5. Is the backend DeFi mock layer the right next step?
6. Would automated tests or transaction history be more valuable next?
7. Does the project explain the AI Operator role clearly enough?

---

## 11. Current Suggested Next Step

Based on technical review feedback, the next useful implementation step is:

```text
Add automated tests for staking, reward pool, events, and access-control flows.
```

This would make the agent recommendation layer more product-like by adding mock market context such as:

```text
mock APY
gas condition
pool health
risk level
liquidity status
```

Then the AI Auto-Pilot could explain recommendations using both:

```text
on-chain staking state
+
backend DeFi context
```

This would make the project easier to understand as an Agentic DeFi Dashboard rather than only a staking UI.
