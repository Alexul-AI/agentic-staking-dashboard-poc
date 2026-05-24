# DeFi Context — Agentic Staking Dashboard PoC

This file is the core technical context for the Agentic Web3 Automation project.

Ignore visual styling and UI aesthetics.  
Focus on:

- Solidity smart contract functions
- contract state
- wagmi / viem hook behavior
- transaction lifecycle
- reward pool mechanics
- DeFi market context
- safe agentic decision logic
- optional AI proxy architecture
- human-approved wallet execution
- B2B readiness artifacts

The project is a portfolio Proof of Concept for AI Operator / AI Solutions Developer work with a Web3 focus.

---

## Current Live Demo

Deployed demo:

```text
https://agentic-staking-dashboard-poc.vercel.app
```

Desktop usage:

```text
Chrome / browser
  → MetaMask extension
  → Sepolia
  → connect wallet
```

Mobile usage:

```text
MetaMask app
  → Explore / Browser
  → open https://agentic-staking-dashboard-poc.vercel.app
  → connect wallet
```

Regular mobile browsers such as Chrome, Safari, or Mi Browser may not expose the injected MetaMask provider required by wagmi.

---

## Current Deployed Contract

Network:

```text
Ethereum Sepolia Testnet
```

Current deployed contract:

```json
{
  "contractAddress": "0xA8Ac339504973AB21c1206F753C5BAF0350ba08d"
}
```

Explorer:

```text
https://sepolia.etherscan.io/address/0xA8Ac339504973AB21c1206F753C5BAF0350ba08d
```

---

## Current Solidity Contract

The current Solidity contract uses:

- OpenZeppelin `ReentrancyGuard`
- OpenZeppelin `Ownable`
- event emissions
- reward pool funding
- owner-only reward-rate updates

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract StakingContract is ReentrancyGuard, Ownable {
    mapping(address => uint256) public stakes;
    mapping(address => uint256) public rewards;
    mapping(address => uint256) public lastUpdate;

    uint256 public totalStaked;

    // 1 = 1% per day
    uint256 public rewardRatePercentPerDay = 1;

    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardClaimed(address indexed user, uint256 amount);
    event RewardsFunded(address indexed funder, uint256 amount);
    event RewardRateUpdated(uint256 oldRate, uint256 newRate);

    constructor() Ownable(msg.sender) {}

    function stake() public payable nonReentrant {
        require(msg.value > 0, "Stake amount must be greater than zero");

        updateReward(msg.sender);

        stakes[msg.sender] += msg.value;
        totalStaked += msg.value;

        emit Staked(msg.sender, msg.value);
    }

    function withdraw() public nonReentrant {
        updateReward(msg.sender);

        uint256 amount = stakes[msg.sender];
        require(amount > 0, "No funds to withdraw");

        stakes[msg.sender] = 0;
        totalStaked -= amount;

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "ETH transfer failed");

        emit Withdrawn(msg.sender, amount);
    }

    function claimReward() public nonReentrant {
        updateReward(msg.sender);

        uint256 reward = rewards[msg.sender];
        require(reward > 0, "No rewards available");
        require(
            address(this).balance >= reward,
            "Contract has insufficient reward funds"
        );

        rewards[msg.sender] = 0;

        (bool success, ) = payable(msg.sender).call{value: reward}("");
        require(success, "ETH transfer failed");

        emit RewardClaimed(msg.sender, reward);
    }

    function updateReward(address user) internal {
        if (lastUpdate[user] == 0) {
            lastUpdate[user] = block.timestamp;
            return;
        }

        uint256 timeElapsed = block.timestamp - lastUpdate[user];

        if (stakes[user] > 0 && timeElapsed > 0) {
            uint256 reward = (stakes[user] *
                rewardRatePercentPerDay *
                timeElapsed) / 100 / 1 days;

            rewards[user] += reward;
        }

        lastUpdate[user] = block.timestamp;
    }

    function fundRewards() public payable nonReentrant {
        require(msg.value > 0, "Funding amount must be greater than zero");

        emit RewardsFunded(msg.sender, msg.value);
    }

    function setRewardRate(
        uint256 newRewardRatePercentPerDay
    ) public onlyOwner {
        require(newRewardRatePercentPerDay <= 10, "Reward rate too high");

        uint256 oldRate = rewardRatePercentPerDay;
        rewardRatePercentPerDay = newRewardRatePercentPerDay;

        emit RewardRateUpdated(oldRate, newRewardRatePercentPerDay);
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
```

---

## Current ABI Context

The frontend hook uses the staking contract ABI for:

- `stake`
- `withdraw`
- `claimReward`
- `fundRewards`
- `getContractBalance`
- `stakes`
- `rewards`
- `totalStaked`
- `rewardRatePercentPerDay`

Core ABI excerpt:

```ts
const STAKING_ABI = [
  {
    inputs: [],
    name: "stake",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "claimReward",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "fundRewards",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "getContractBalance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "stakes",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "rewards",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;
```

---

## Current Hook Contract

The main frontend hook is:

```text
src/hooks/useStaking.ts
```

Expected hook return shape:

```ts
interface UseStakingReturn {
  stakedBalance: bigint | undefined;
  earnedRewards: bigint | undefined;
  contractBalance: bigint | undefined;
  isLoading: boolean;
  error: string | null;
  txHash: `0x${string}` | undefined;
  stake: (amountEth: string) => Promise<void>;
  withdraw: () => Promise<void>;
  claimReward: () => Promise<void>;
  fundRewards: (amountEth: string) => Promise<void>;
  refetchData: () => void;
}
```

The hook is responsible for:

- reading user staked balance
- reading user earned rewards
- reading contract reward pool balance
- staking ETH
- withdrawing staked ETH
- claiming rewards
- funding the reward pool
- waiting for transaction receipts
- exposing latest transaction hash
- refetching data after confirmed transactions
- parsing common wallet / contract errors

---

## Contract State Concepts

### `stakes`

```solidity
mapping(address => uint256) public stakes;
```

Tracks how much ETH each user has staked.

---

### `rewards`

```solidity
mapping(address => uint256) public rewards;
```

Tracks accumulated rewards per user.

Rewards are updated when the user interacts with the contract through:

- `stake`
- `withdraw`
- `claimReward`

---

### `lastUpdate`

```solidity
mapping(address => uint256) public lastUpdate;
```

Tracks the last timestamp used for reward calculation per user.

---

### `totalStaked`

```solidity
uint256 public totalStaked;
```

Tracks total user-staked ETH.

---

### `rewardRatePercentPerDay`

```solidity
uint256 public rewardRatePercentPerDay = 1;
```

Represents simplified daily reward rate.

Current model:

```text
1 = 1% per day
```

The owner can update it through:

```solidity
setRewardRate(uint256 newRewardRatePercentPerDay)
```

The current max is:

```text
10 = 10% per day
```

---

### `contractBalance`

The contract balance is read through:

```solidity
function getContractBalance() public view returns (uint256)
```

This represents ETH held by the contract and visible as the reward pool / contract liquidity.

Important distinction:

```text
User stake
  → user's staking position

Reward pool / contract balance
  → ETH liquidity available for reward payouts

Claim rewards
  → possible only if the contract has enough ETH
```

---

## Contract Events

The contract emits events for important actions:

```solidity
event Staked(address indexed user, uint256 amount);
event Withdrawn(address indexed user, uint256 amount);
event RewardClaimed(address indexed user, uint256 amount);
event RewardsFunded(address indexed funder, uint256 amount);
event RewardRateUpdated(uint256 oldRate, uint256 newRate);
```

Purpose:

- improve Etherscan readability
- support automated tests
- make contract activity easier to track
- prepare the contract for more production-like Web3 monitoring
- support future analytics / indexing
- support event-driven automation workflows

---

## Access Control Decision

The contract currently uses OpenZeppelin `Ownable`.

Decision:

```text
Keep Ownable for the current PoC.
Do not add role-based AccessControl yet.
```

Reasoning:

- the contract currently has one privileged operation: `setRewardRate`
- a single-owner model is sufficient for this portfolio PoC
- adding role-based `AccessControl` now would increase complexity without meaningful product value
- `AccessControl` should be considered later only if the protocol introduces multiple privileged roles

Possible future roles:

```text
REWARD_MANAGER_ROLE
PAUSER_ROLE
TREASURY_ROLE
BACKEND_OPERATOR_ROLE
DEFAULT_ADMIN_ROLE
```

Current decision:

```text
Ownable now.
AccessControl later only if multiple privileged roles are introduced.
```

---

## Current Frontend Features

The dashboard currently supports:

- MetaMask wallet connection
- Sepolia network guard
- wrong-network warning state
- switch-to-Sepolia action
- staking ETH
- withdrawing staked ETH
- claiming rewards
- funding reward pool
- reading staked balance
- reading earned rewards
- reading contract balance / reward pool
- transaction lifecycle status
- last transaction hash display
- Sepolia Etherscan contract link
- Sepolia Etherscan transaction link
- public demo onboarding UX
- mobile MetaMask browser guidance
- DeFi market context block
- safe mock DeFi agent decision layer
- separate AI recommendation context display
- optional backend/serverless AI proxy path
- human-approved execution through MetaMask

---

## Public Demo Behavior

Without a connected wallet:

- public demo mode message is visible
- wallet write actions are disabled
- DeFi Market Context can be refreshed
- AI Auto-Pilot can run in safe mock mode
- Sepolia Etherscan contract link remains visible

Wallet actions require MetaMask:

- `Stake`
- `Fund Pool`
- `Claim Rewards`
- `Withdraw All`

Mobile wallet flow:

```text
MetaMask app
  → Explore / Browser
  → open https://agentic-staking-dashboard-poc.vercel.app
  → connect wallet
  → switch to Sepolia if needed
```

---

## Backend DeFi Market Context

The project includes a backend mock context endpoint:

```text
api/defi-market-context.ts
```

Frontend hook:

```text
src/hooks/useDeFiMarketContext.ts
```

The endpoint returns simulated DeFi market context:

```text
mockApy
gasCondition
poolHealth
riskLevel
liquidityStatus
marketNote
updatedAt
```

Purpose:

- make the agent recommendation layer more product-like
- demonstrate backend-driven DeFi context
- simulate APY, gas, pool health, risk, and liquidity signals
- help explain the project as an Agentic DeFi Dashboard

Current context is simulated and portfolio-focused. It is not live market data and is not financial advice.

---

## Current AI Agent Layer

The project includes a DeFi agent layer.

Default mode:

```text
safe local mock agent
```

Optional mode:

```text
React Frontend
  → /api/defi-agent
  → Gemini / AI model through server-side API key
  → structured JSON decision
  → Frontend displays recommendation
  → User manually confirms action through MetaMask
```

The AI agent returns:

```ts
export type AgentAction =
  | "STAKE_MORE"
  | "CLAIM_REWARDS"
  | "WITHDRAW_ALL"
  | "HOLD";

export type AgentConfidence = "LOW" | "MEDIUM" | "HIGH";

export interface AgentDecision {
  action: AgentAction;
  confidence: AgentConfidence;
  reasoning: string;
  recommendedNextStep: string;
  executionHint: string;
  riskNote: string;
  contextSummary?: string;
}
```

The recommendation UI separates:

```text
Reasoning
Context Used
Recommended Next Step
Execution
Risk Note
```

This avoids repeating the same backend market context across multiple explanation fields.

The AI layer must not:

- execute wallet actions automatically
- control private keys
- bypass MetaMask
- provide real financial advice
- expose API keys in frontend code

Core safety pattern:

```text
AI suggests → User reviews → MetaMask confirms → Blockchain executes
```

---

## Secure AI Proxy Context

Optional backend/serverless endpoint:

```text
api/defi-agent.ts
```

Configuration:

```env
VITE_USE_AI_PROXY=false
GEMINI_API_KEY=your_server_side_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

Important:

```text
GEMINI_API_KEY must remain server-side only.
Do not expose it as VITE_GEMINI_API_KEY.
```

Default portfolio-safe mode remains:

```env
VITE_USE_AI_PROXY=false
```

The optional AI proxy includes:

- `POST` method enforcement
- supported network validation
- ETH amount string validation
- optional wallet address validation
- optional contract address validation
- optional transaction hash validation
- optional market context sanitization
- AI response normalization
- safe fallback decision
- basic in-memory rate limiting

Current rate limit:

```text
20 requests / 60 seconds / client
```

Production note:

```text
The current rate limiter is suitable for a portfolio PoC only.
A production deployment should use Redis, Upstash, edge rate limiting, or an API gateway.
```

---

## Security Boundaries

Current safety boundaries:

- Sepolia testnet only
- no private keys in frontend
- no seed phrase handling
- MetaMask confirmation required for all write actions
- no autonomous wallet execution
- safe mock agent by default
- optional AI proxy keeps API keys server-side
- AI proxy validates and sanitizes incoming requests
- AI proxy normalizes model output
- safe fallback to `HOLD`
- Etherscan links included for transparency
- OpenZeppelin `ReentrancyGuard`
- OpenZeppelin `Ownable`
- Checks-Effects-Interactions pattern
- owner-only reward rate updates
- event emissions for contract actions
- Hardhat automated contract tests
- public demo mode explains wallet requirements
- mobile MetaMask browser guidance documented

Known production limitations:

- no professional audit
- no real yield strategy
- no transaction history persistence
- no production risk engine
- no production-grade persistent rate limiting
- no live DeFi market data source
- no production event indexer
- no frontend/component tests yet
- no reentrancy-oriented attack simulation test yet

---

## Automated Test Coverage

Test framework:

```text
Hardhat
```

Test file:

```text
test/StakingContract.test.ts
```

Current test coverage includes:

- deployment owner
- staking
- `Staked` event
- reward pool funding
- `RewardsFunded` event
- withdrawal
- `Withdrawn` event
- reward claiming
- `RewardClaimed` event
- insufficient reward pool rejection
- non-owner reward rate rejection
- owner reward rate update
- `RewardRateUpdated` event
- invalid reward rate rejection
- zero-value stake rejection
- zero-value reward funding rejection
- withdraw without stake rejection
- multi-user staking state

Command:

```bash
npm run test:contracts
```

---

## Project Automation

The repository includes a `Makefile` for simple operational commands.

Available commands:

```text
make install
make dev
make build
make test-contracts
make verify
make status
make clean
```

Main verification command:

```bash
make verify
```

Equivalent npm commands:

```bash
npm run build
npm run test:contracts
```

Note:

```text
On Windows, make may require additional installation.
The npm commands remain the primary cross-platform commands.
```

---

## B2B Readiness Assets

The project includes B2B-oriented documentation:

```text
docs/AI_EVALUATION_GUARDRAILS.md
docs/EVENT_MONITORING_AUTOMATION.md
docs/B2B_PROJECT_PROPOSAL.md
```

Purpose:

- define AI recommendation evaluation guardrails
- document fallback behavior and response validation
- describe AI cost / token-budget control
- explain how smart contract events can trigger business automation
- show how event logs can support notifications, analytics, and AI-generated reports
- provide a reusable B2B proposal template for Web3 client work
- make the project easier to review as a client-ready delivery framework

B2B positioning:

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

## Main Documentation Files

Core documentation:

```text
README.md
docs/ARCHITECTURE.md
docs/CASE_STUDY.md
docs/DEMO_WALKTHROUGH.md
docs/SECURE_AI_PROXY.md
docs/SECURITY_NOTES.md
docs/AI_EVALUATION_GUARDRAILS.md
docs/EVENT_MONITORING_AUTOMATION.md
docs/B2B_PROJECT_PROPOSAL.md
prompts/iteration-log.md
prompts/system-instruction.md
prompts/defi-context.md
```

---

# Iteration Log Summary

This section summarizes the main implementation history.  
The full iteration history is maintained in:

```text
prompts/iteration-log.md
```

---

## Iteration 1 — Initial Hook Generation

Generated a React hook from a Solidity staking contract.

The hook included:

- reading staked balance
- reading earned rewards
- staking ETH
- withdrawing funds
- claiming rewards
- waiting for transaction confirmation

---

## Iteration 2 — wagmi / viem Modernization

The initial generated code used deprecated wagmi patterns.

Fixes included:

- updated wagmi hook usage
- safer transaction handling
- improved hook dependencies
- avoided synchronous `setState` inside effects

---

## Iteration 3 — UI Integration

Generated a Tailwind CSS staking dashboard component.

The component included:

- staking input
- staked balance display
- earned rewards display
- claim rewards action
- withdraw action
- loading state
- error display

---

## Iteration 4 — Tailwind / Vite Setup

Tailwind CSS was configured for the Vite project and global CSS entry points were updated.

---

## Iteration 5 — Sepolia Deployment

The Solidity staking contract was deployed through Remix IDE to the Ethereum Sepolia testnet.

The initial deployed contract was later superseded by redeployments that added:

- event emissions
- OpenZeppelin security patterns
- updated contract address

Current active contract:

```text
0xA8Ac339504973AB21c1206F753C5BAF0350ba08d
```

---

## Iteration 6 — MetaMask Wallet Flow

Added and debugged MetaMask connection flow.

Observed issues:

- competing wallet extensions
- injected provider conflicts
- Trust Wallet / Coinbase Wallet opening instead of MetaMask
- MetaMask SDK connector import issues

Final approach:

```text
injected connector targeting MetaMask
```

---

## Iteration 7 — End-to-End Stake and Withdraw Flow

Verified:

- MetaMask connection
- stake transaction
- Sepolia confirmation
- dashboard balance update
- withdraw transaction
- on-chain state refresh

---

## Iteration 8 — Etherscan Transparency

Added:

- Sepolia contract link
- last transaction link
- transaction hash preview

Purpose:

- improve Web3 transparency
- make transaction review easier
- provide visible proof of on-chain activity

---

## Iteration 9 — Safe Mock DeFi Agent

Added local mock DeFi agent decision layer.

The agent returns:

- action
- confidence
- reasoning
- context summary
- recommended next step
- execution hint
- risk note

Execution remains human-approved through MetaMask.

---

## Iteration 10 — Explainable Agent Recommendation UX

Improved AI Auto-Pilot output so the dashboard clearly displays:

- AI Action
- Confidence
- Reasoning
- Context Used
- Recommended Next Step
- Execution
- Risk Note

---

## Iteration 11 — Reentrancy Protection

The staking contract was first hardened with a custom `nonReentrant` guard and later upgraded to OpenZeppelin `ReentrancyGuard`.

---

## Iteration 12 — Sepolia Network Guard

Added frontend network protection.

The dashboard now:

- detects wrong EVM network
- shows wrong-network warning
- disables write actions on unsupported networks
- provides a `Switch to Sepolia` action

---

## Iteration 13 — Transaction Status UX

Added transaction lifecycle status panel:

```text
Waiting for wallet confirmation
  → Waiting for Sepolia confirmation
  → Transaction submitted
  → Etherscan review available
```

---

## Iteration 14 — Reward Pool UX

Added reward pool visibility and funding flow.

The dashboard supports:

- contract balance display
- reward funding input
- `Fund Pool` transaction action
- warning when rewards may exceed contract liquidity

---

## Iteration 15 — Secure AI Proxy Architecture

Documented and implemented optional backend/serverless AI proxy path.

Default:

```text
safe mock agent
```

Optional:

```text
React Frontend
  → api/defi-agent.ts
  → Gemini API
  → structured JSON decision
  → Frontend recommendation UI
  → User confirms through MetaMask
```

---

## Iteration 16 — Staking Contract Events

The staking smart contract was updated to emit events:

```text
Staked
Withdrawn
RewardClaimed
RewardsFunded
RewardRateUpdated
```

Purpose:

- improve Etherscan readability
- support automated tests
- prepare for event-driven monitoring

---

## Iteration 17 — OpenZeppelin Security Patterns

The contract was updated to use:

```text
OpenZeppelin ReentrancyGuard
OpenZeppelin Ownable
```

Decision:

```text
Ownable is sufficient for the current PoC.
AccessControl should be considered only if multiple privileged roles are introduced.
```

---

## Iteration 18 — Backend DeFi Mock Context API

Added backend mock context endpoint:

```text
api/defi-market-context.ts
```

Added frontend hook:

```text
src/hooks/useDeFiMarketContext.ts
```

The endpoint returns simulated:

- APY
- gas condition
- pool health
- risk level
- liquidity status
- market note

---

## Iteration 19 — AI Proxy Validation and Rate Limiting

The optional AI proxy was updated with:

- request validation
- market context sanitization
- AI response normalization
- fallback to `HOLD`
- basic in-memory rate limiting

---

## Iteration 20 — Automated Contract Tests

Added Hardhat contract tests for:

- staking
- withdrawal
- reward claiming
- reward pool funding
- events
- Ownable access control
- invalid input rejection
- insufficient reward pool
- multi-user staking state

---

## Iteration 21 — Vercel Deployment

The project was deployed to Vercel:

```text
https://agentic-staking-dashboard-poc.vercel.app
```

The public demo supports:

- read-only demo mode without wallet
- MetaMask connection
- Sepolia network guard
- AI Auto-Pilot
- DeFi Market Context
- Etherscan proof links

---

## Iteration 22 — Public Demo and Mobile UX

Added:

- public demo onboarding message
- mobile MetaMask browser guidance
- manual fallback for mobile users
- separate AI context display

Validated mobile path:

```text
MetaMask app
  → Explore / Browser
  → open Vercel demo
  → connect wallet
```

---

## Iteration 23 — B2B Readiness Layer

Added B2B readiness documentation:

```text
docs/AI_EVALUATION_GUARDRAILS.md
docs/EVENT_MONITORING_AUTOMATION.md
docs/B2B_PROJECT_PROPOSAL.md
```

Added project automation:

```text
Makefile
```

Purpose:

- frame the project as a client-ready delivery framework
- show AI evaluation and fallback thinking
- show event-driven automation architecture
- provide a commercial proposal template
- make the project easier to verify operationally

---

## Current Status

The project is working as a deployed Sepolia/Vercel portfolio PoC with:

- deployed Sepolia staking smart contract
- Vercel live demo
- MetaMask connection
- mobile MetaMask browser guidance
- Sepolia network guard
- staking / withdrawal / reward claiming
- reward pool funding
- reward pool visibility
- transaction lifecycle status
- Etherscan contract and transaction links
- event emissions
- OpenZeppelin `ReentrancyGuard`
- OpenZeppelin `Ownable`
- documented access-control decision
- backend DeFi mock context API
- DeFi market context dashboard UI
- safe mock DeFi agent
- optional serverless AI proxy implementation
- AI proxy validation and rate limiting
- separate AI recommendation context display
- Hardhat automated contract tests
- architecture documentation
- demo walkthrough
- portfolio case study
- security notes
- secure AI proxy architecture
- AI evaluation guardrails
- event monitoring automation plan
- B2B project proposal template
- project automation Makefile

Current deployed contract:

```text
0xA8Ac339504973AB21c1206F753C5BAF0350ba08d
```

Live demo:

```text
https://agentic-staking-dashboard-poc.vercel.app
```

---

## Next Steps

1. Prepare LinkedIn / portfolio post.
2. Add frontend/component tests for dashboard UX.
3. Add reentrancy-oriented attack simulation tests.
4. Replace in-memory AI proxy rate limiting with production-grade persistent rate limiting.
5. Add transaction history persistence.
6. Consider live DeFi market data integration.
