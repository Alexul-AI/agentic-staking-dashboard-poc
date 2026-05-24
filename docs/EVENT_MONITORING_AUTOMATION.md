# Event Monitoring Automation

## 1. Purpose

This document describes how on-chain smart contract events can be used to automate business workflows around the Agentic Staking Dashboard PoC.

The staking contract emits events such as:

```text
Staked
Withdrawn
RewardClaimed
RewardsFunded
RewardRateUpdated
```

These events make contract activity observable and allow external systems, AI agents, dashboards, or workflow tools to react automatically when something happens on-chain.

The goal is to show how a Web3 AI Operator can connect blockchain events to automated business logic.

The core idea:

```text
Smart contract emits event
  → backend / worker detects it
  → automation layer processes it
  → AI agent explains it
  → user or operator receives a useful notification
```

---

## 2. Current Contract Context

The current staking contract is deployed on Ethereum Sepolia.

Live demo:

```text
https://agentic-staking-dashboard-poc.vercel.app
```

Current deployed contract:

```text
0xA8Ac339504973AB21c1206F753C5BAF0350ba08d
```

Sepolia Etherscan:

```text
https://sepolia.etherscan.io/address/0xA8Ac339504973AB21c1206F753C5BAF0350ba08d
```

Note:

```text
If the contract is redeployed, update the contract address in this document and in the monitoring script example.
```

---

## 3. Why Events Matter

Smart contract events are a reliable way to expose on-chain activity to off-chain systems.

Instead of manually checking the dashboard, an automation service can listen for events and trigger actions.

Example:

```text
User claims rewards
  → smart contract emits RewardClaimed
  → event listener detects the event
  → automation service processes it
  → AI agent generates a user-friendly explanation
  → notification is sent to Telegram / Discord / email
```

This turns blockchain activity into operational workflows.

For a B2B client, event monitoring can support:

- user notifications
- protocol monitoring
- internal operations
- analytics dashboards
- support workflows
- risk alerts
- AI-generated activity reports

---

## 4. Events Emitted by the Contract

The staking contract currently emits:

```solidity
event Staked(address indexed user, uint256 amount);
event Withdrawn(address indexed user, uint256 amount);
event RewardClaimed(address indexed user, uint256 amount);
event RewardsFunded(address indexed funder, uint256 amount);
event RewardRateUpdated(uint256 oldRate, uint256 newRate);
```

### Event Purpose

| Event               | Trigger                   | Business Meaning                            |
| ------------------- | ------------------------- | ------------------------------------------- |
| `Staked`            | User stakes ETH           | New staking position created or increased   |
| `Withdrawn`         | User withdraws stake      | User exits or reduces staking position      |
| `RewardClaimed`     | User claims rewards       | User realizes staking rewards               |
| `RewardsFunded`     | Someone funds reward pool | Contract liquidity for rewards increases    |
| `RewardRateUpdated` | Owner changes reward rate | Protocol-level reward configuration changed |

---

## 5. High-Level Monitoring Architecture

```text
Sepolia Smart Contract
  │
  │ emits events
  ▼
Event Listener
  │
  │ parses logs
  ▼
Automation Layer
  │
  ├─ stores event in database
  ├─ triggers notification workflow
  ├─ sends event context to AI agent
  └─ updates analytics dashboard
        │
        ▼
User / Operator Notification
```

The event listener can be implemented with:

- Node.js script using `viem` or `ethers`
- n8n workflow
- serverless function
- backend worker
- indexer service
- The Graph / Subgraph in a more advanced setup

---

## 6. Example Business Workflow

### Reward Claim Report

```text
1. User clicks Claim Rewards.
2. MetaMask confirms transaction.
3. Contract emits RewardClaimed(user, amount).
4. Event listener detects the event.
5. Automation service calculates:
   - claimed amount
   - user staking position
   - reward pool status
   - gas context
6. AI agent generates a plain-language report.
7. Report is sent to Telegram / Discord / email.
```

Example notification:

```text
Reward claimed successfully.

Wallet: 0x35B4...A3c5
Amount claimed: 0.0012 ETH
Network: Sepolia
Context: Reward pool remains sufficiently funded.
Risk note: This is a testnet demonstration, not financial advice.
```

---

## 7. Example Event Listener with viem

This is a lightweight example showing how an external script could watch staking contract events.

```ts
import { createPublicClient, http, formatEther } from "viem";
import { sepolia } from "viem/chains";

const CONTRACT_ADDRESS = "0xA8Ac339504973AB21c1206F753C5BAF0350ba08d";

const stakingAbi = [
  {
    type: "event",
    name: "Staked",
    inputs: [
      { indexed: true, name: "user", type: "address" },
      { indexed: false, name: "amount", type: "uint256" },
    ],
  },
  {
    type: "event",
    name: "Withdrawn",
    inputs: [
      { indexed: true, name: "user", type: "address" },
      { indexed: false, name: "amount", type: "uint256" },
    ],
  },
  {
    type: "event",
    name: "RewardClaimed",
    inputs: [
      { indexed: true, name: "user", type: "address" },
      { indexed: false, name: "amount", type: "uint256" },
    ],
  },
  {
    type: "event",
    name: "RewardsFunded",
    inputs: [
      { indexed: true, name: "funder", type: "address" },
      { indexed: false, name: "amount", type: "uint256" },
    ],
  },
  {
    type: "event",
    name: "RewardRateUpdated",
    inputs: [
      { indexed: false, name: "oldRate", type: "uint256" },
      { indexed: false, name: "newRate", type: "uint256" },
    ],
  },
] as const;

const client = createPublicClient({
  chain: sepolia,
  transport: http(),
});

client.watchContractEvent({
  address: CONTRACT_ADDRESS,
  abi: stakingAbi,
  onLogs: (logs) => {
    for (const log of logs) {
      console.log("Event detected:", log.eventName);
      console.log("Transaction:", log.transactionHash);

      if (log.eventName === "Staked") {
        console.log("User:", log.args.user);
        console.log("Amount:", formatEther(log.args.amount), "ETH");
      }

      if (log.eventName === "Withdrawn") {
        console.log("User:", log.args.user);
        console.log("Amount:", formatEther(log.args.amount), "ETH");
      }

      if (log.eventName === "RewardClaimed") {
        console.log("User:", log.args.user);
        console.log("Claimed:", formatEther(log.args.amount), "ETH");
      }

      if (log.eventName === "RewardsFunded") {
        console.log("Funder:", log.args.funder);
        console.log("Amount:", formatEther(log.args.amount), "ETH");
      }

      if (log.eventName === "RewardRateUpdated") {
        console.log("Old rate:", log.args.oldRate?.toString());
        console.log("New rate:", log.args.newRate?.toString());
      }
    }
  },
});
```

This script is intentionally simple.

A production event listener would also include:

- RPC provider configuration
- retry logic
- database persistence
- duplicate event protection
- alerting
- structured logging
- monitoring
- failure recovery
- confirmation waiting
- error reporting

---

## 8. Possible File Location for a Future Listener

A future implementation could add a script such as:

```text
scripts/watch-staking-events.ts
```

Possible command:

```bash
npm run watch:events
```

Or through a Makefile:

```bash
make watch-events
```

For the current portfolio PoC, this document describes the architecture and provides a lightweight script example without adding a running worker process to the deployed dashboard.

---

## 9. n8n / No-Code Automation Option

The same workflow can be implemented with a no-code or low-code automation tool such as n8n.

Example workflow:

```text
Schedule / Webhook Trigger
  → Query blockchain logs
  → Filter RewardClaimed events
  → Format event data
  → Send data to AI summarization node
  → Send Telegram / Discord notification
  → Store record in Google Sheets / database
```

Possible integrations:

- Telegram bot
- Discord webhook
- Slack webhook
- Google Sheets
- Airtable
- Notion
- PostgreSQL
- Supabase
- AI model API

This demonstrates how a Web3 event can become a business automation trigger.

---

## 10. AI Agent Workflow on Top of Events

An AI agent should not blindly act on events.

A safer AI event workflow:

```text
On-chain event detected
  → deterministic parser extracts event data
  → rule layer validates event type and amount
  → AI generates explanation or report
  → user/operator receives notification
```

Recommended AI responsibilities:

- explain what happened
- summarize user activity
- compare event to previous activity
- generate portfolio-friendly reports
- flag unusual behavior
- suggest manual review when needed
- explain reward pool changes
- summarize protocol activity

AI should not:

- automatically move funds
- change reward rate
- approve transactions
- hide failed events
- claim financial certainty
- bypass operator review
- trigger wallet actions directly

---

## 11. Business Use Cases

### User Notifications

Notify users when staking activity occurs:

```text
You staked 0.01 ETH on Sepolia.
Your current staking position is now 0.05 ETH.
```

### Reward Reports

Generate a periodic report:

```text
This week you claimed 0.002 ETH in staking rewards.
Reward pool liquidity remains sufficient.
```

### Operator Alerts

Notify the project owner when:

```text
Reward pool balance is low
Reward rate was changed
Large withdrawal occurred
Multiple users claimed rewards
Contract activity spikes unexpectedly
```

### Client Dashboard Analytics

Use event logs to build:

- staking volume charts
- user activity history
- reward claim history
- liquidity monitoring
- protocol health indicators
- event-driven user timelines
- protocol operations reports

---

## 12. Monitoring Risks

Event monitoring systems should handle:

- chain reorgs
- duplicate logs
- RPC downtime
- missed events
- delayed confirmations
- incorrect ABI configuration
- rate limits from RPC providers
- private user data handling
- failed notification delivery
- worker crashes
- database write failures

Production monitoring should wait for a safe number of confirmations before treating an event as final.

Example:

```text
Detected event
  → wait 3-12 confirmations
  → process as confirmed
  → notify user/operator
```

For a portfolio PoC, immediate event detection is acceptable for demonstration.

---

## 13. Production Monitoring Pattern

```text
Blockchain RPC Provider
  │
  ▼
Event Listener Worker
  │
  ├─ validates event logs
  ├─ stores events in database
  ├─ detects duplicates
  ├─ waits for confirmations
  └─ sends event context to AI/reporting layer
        │
        ▼
Notification / Dashboard Layer
```

Recommended production components:

- managed RPC provider
- background worker
- persistent database
- event deduplication
- retry queue
- alerting service
- AI summarization layer
- notification integrations
- operational dashboard
- error tracking

---

## 14. Example Event-to-Notification Payload

A backend worker could normalize an event into a structured payload before sending it to an AI reporting layer.

```json
{
  "eventName": "RewardClaimed",
  "network": "sepolia",
  "contractAddress": "0xA8Ac339504973AB21c1206F753C5BAF0350ba08d",
  "transactionHash": "0x...",
  "user": "0x35B40...",
  "amountEth": "0.0012",
  "timestamp": "2026-05-24T10:00:00.000Z",
  "context": {
    "rewardPoolStatus": "SUFFICIENT",
    "gasCondition": "LOW",
    "riskLevel": "LOW"
  }
}
```

The AI layer could then generate a plain-language explanation:

```text
Your reward claim was confirmed on Sepolia.

You claimed 0.0012 ETH from the staking contract.
The reward pool still appears sufficiently funded.
This is a testnet demonstration and not financial advice.
```

---

## 15. B2B Delivery Option

For a client project, event monitoring can be delivered in phases.

### Phase 1 — Event Mapping

```text
Identify contract events
Map events to business meaning
Define notification and analytics requirements
```

### Phase 2 — Listener Prototype

```text
Create lightweight listener
Parse logs
Print structured events
Validate ABI and contract address
```

### Phase 3 — Automation Workflow

```text
Store events
Trigger notifications
Generate AI summaries
Send reports to Telegram / Discord / Slack
```

### Phase 4 — Production Hardening

```text
Add database
Add retry queue
Add confirmations
Add deduplication
Add monitoring and alerting
```

---

## 16. Portfolio Positioning

This document shows that the project can go beyond a frontend demo.

It demonstrates AI Operator thinking around:

- event-driven automation
- blockchain observability
- DeFi operations
- workflow orchestration
- AI-generated reporting
- user notifications
- protocol monitoring
- B2B automation design

The main idea:

```text
Smart contract events can become automation triggers.
AI can explain and summarize events.
The user or operator remains in control.
```

This supports the broader positioning of the project as an Agentic Web3 Automation PoC.
