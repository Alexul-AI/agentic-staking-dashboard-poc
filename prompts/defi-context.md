# DeFi Context — Agentic Staking Dashboard PoC

This file is the core technical context for the Agentic Web3 Automation project.

Ignore visual styling and UI aesthetics.  
Focus on:

- Solidity smart contract functions
- contract state
- wagmi / viem hook behavior
- transaction lifecycle
- reward pool mechanics
- safe agentic decision logic
- human-approved wallet execution

The project is a portfolio Proof of Concept for AI Operator / AI Solutions Developer work with a Web3 focus.

---

## Current Deployed Contract

Network:

```text
Ethereum Sepolia Testnet
```

Current deployed contract:

```json
{
  "contractAddress": "0x8a0fdc67D8751d409d3ad2571faD8eA45820dA47"
}
```

Explorer:

```text
https://sepolia.etherscan.io/address/0x8a0fdc67D8751d409d3ad2571faD8eA45820dA47
```

---

## Current Solidity Contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StakingContract {
    mapping(address => uint256) public stakes;
    mapping(address => uint256) public rewards;
    mapping(address => uint256) public lastUpdate;

    uint256 public totalStaked;

    // 1 = 1% per day
    uint256 public rewardRatePercentPerDay = 1;

    address public owner;

    bool private locked;

    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardClaimed(address indexed user, uint256 amount);
    event RewardsFunded(address indexed funder, uint256 amount);
    event RewardRateUpdated(uint256 oldRate, uint256 newRate);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    modifier nonReentrant() {
        require(!locked, "Reentrant call detected");
        locked = true;
        _;
        locked = false;
    }

    constructor() {
        owner = msg.sender;
    }

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

    function setRewardRate(uint256 newRewardRatePercentPerDay) public onlyOwner {
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

Current expected hook return shape:

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

- Improve Etherscan readability
- Support future automated tests
- Make contract activity easier to track
- Prepare the contract for more production-like Web3 monitoring
- Make future analytics / indexing easier

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
- safe mock DeFi agent decision layer
- optional backend/serverless AI proxy path
- human-approved execution through MetaMask

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
}
```

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

---

## Security Boundaries

Current safety boundaries:

- Sepolia testnet only
- No private keys in frontend
- No seed phrase handling
- MetaMask confirmation required for all write actions
- No autonomous wallet execution
- Safe mock agent by default
- Optional AI proxy keeps API keys server-side
- Etherscan links included for transparency
- Custom `nonReentrant` guard
- Checks-Effects-Interactions pattern
- Owner-only reward rate updates
- Event emissions for contract actions

Known production limitations:

- No professional audit
- No OpenZeppelin-based security patterns yet
- No automated test suite yet
- No production-grade access control yet
- No backend request validation / rate limiting yet
- No real yield strategy
- No transaction history persistence
- No production risk engine

---

# Iteration Log

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

## Issue 1 — Deprecated wagmi API

The initial generated code used deprecated wagmi patterns.

### Fix

Updated the hook to use current wagmi patterns and replaced deprecated usage.

---

## Issue 2 — React Hooks ESLint Warning

The generated code called `setState` directly inside an effect.

### Fix

Refactored error handling so transaction receipt errors are derived from existing hook state instead of being set synchronously inside `useEffect`.

---

## Issue 3 — Missing Hook Dependencies

React Hooks ESLint reported missing dependencies inside `useCallback`.

### Fix

Wrapped transaction helpers in `useCallback` and added the correct dependency arrays.

---

## Issue 4 — UI Integration

Generated a Tailwind CSS staking dashboard component.

The component includes:

- staking input
- staked balance display
- earned rewards display
- claim rewards action
- withdraw action
- loading spinner
- error display

---

## Issue 5 — Tailwind CSS Not Applied

The first UI preview appeared broken because Tailwind CSS was not correctly configured.

### Fix

Installed and configured Tailwind CSS for Vite and updated the global CSS entry point.

---

## Issue 6 — Initial Contract Address

The frontend required a deployed smart contract address.

### Fix

The Solidity staking contract was deployed through Remix IDE to the Ethereum Sepolia testnet.

Initial deployed contract is now superseded by later redeploys.

---

## Issue 7 — Missing Wallet Connection Flow

The staking dashboard could call the contract hook, but there was no visible wallet connection button.

### Fix

Added a MetaMask connection button using wagmi connection hooks and displayed the connected wallet address in the dashboard.

---

## Issue 8 — Wallet Connector Conflict

During wallet connection testing, multiple browser wallet extensions competed for the injected provider.

Observed behavior:

- Trust Wallet opened instead of MetaMask.
- Coinbase Wallet opened after Trust Wallet was removed.
- MetaMask was available in the browser, but the connector flow had to be debugged.

### Fix

Removed or disabled competing wallet extensions and configured the app to target MetaMask through the injected wallet connector.

---

## Issue 9 — MetaMask SDK Connector Import Error

Using the direct MetaMask connector caused a Vite runtime import error related to a missing MetaMask SDK dependency.

### Fix

Replaced the direct MetaMask connector with an injected connector targeting MetaMask.

---

## Issue 10 — Successful MetaMask Connection

The frontend successfully opened the MetaMask connection request from `localhost:5173`.

Result:

- MetaMask connection popup appeared.
- The wallet was connected to the dashboard.
- The UI displayed the shortened wallet address.

---

## Issue 11 — Successful End-to-End Stake Flow

The React frontend successfully connected to MetaMask, submitted a stake transaction, waited for confirmation, and updated the on-chain staking balance in the UI.

Verified flow:

```text
React UI
  → wagmi / viem hook
  → MetaMask transaction request
  → Sepolia transaction
  → deployed Solidity contract
  → confirmed transaction
  → updated dashboard state
```

Tested stake amount:

```text
0.001 SepoliaETH
```

Result:

- MetaMask transaction request appeared.
- Transaction was confirmed.
- `Staked ETH` updated to `0.001`.

---

## Issue 12 — Successful Withdraw Flow

The withdraw flow was tested after staking.

Result:

- `Withdraw All` triggered a MetaMask transaction.
- Staked balance returned to `0.0`.
- Rewards value became visible.
- The dashboard continued reading on-chain state correctly.

---

## Iteration 13 — Etherscan Transaction Links

Added Sepolia Etherscan transparency.

The dashboard now shows:

- contract address link
- last transaction link
- transaction hash preview

Purpose:

- improve Web3 transparency
- make transaction review easier
- provide visible proof of on-chain activity

---

## Iteration 14 — Safe Mock DeFi Agent

Added a local mock DeFi agent decision layer.

The agent returns:

- action
- confidence
- reasoning
- recommended next step
- execution hint
- risk note

Execution remains human-approved through MetaMask.

---

## Iteration 15 — Explainable Agent Recommendation UX

Improved the AI Auto-Pilot output so the dashboard clearly displays:

- AI Action
- Confidence
- Reasoning
- Recommended Next Step
- Execution
- Risk Note

This transformed the agent from a simple action suggestion into an explainable decision-support layer.

---

## Iteration 16 — Reentrancy Guard

The staking contract was hardened with a custom `nonReentrant` guard.

Reason:

- ETH transfers use low-level `.call`
- `.call` can pass execution control to receiver contracts
- `nonReentrant` reduces reentrancy risk

The contract also follows the Checks-Effects-Interactions pattern.

---

## Iteration 17 — Sepolia Network Guard

Added frontend network protection.

The dashboard now:

- detects wrong EVM network
- shows a wrong-network warning
- disables write actions on unsupported networks
- provides a `Switch to Sepolia` action

This improves dApp safety and wallet UX.

---

## Iteration 18 — Transaction Status UX

Added a transaction lifecycle status panel.

The dashboard now explains:

```text
Waiting for wallet confirmation
  → Waiting for Sepolia confirmation
  → Transaction submitted
  → Etherscan review available
```

This makes MetaMask and blockchain confirmation states clearer to the user.

---

## Iteration 19 — Reward Pool UX

Added reward pool visibility and funding flow.

The dashboard now supports:

- contract balance display
- reward funding input
- `Fund Pool` transaction action
- warning when rewards may exceed contract liquidity

This clarifies the difference between earned rewards and available contract liquidity.

---

## Iteration 20 — Secure AI Proxy Architecture

Documented and implemented an optional backend/serverless AI proxy path.

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

The API key remains server-side.

---

## Iteration 21 — Staking Contract Events

The staking smart contract was updated to emit events for key contract actions.

Added events:

```text
Staked(address indexed user, uint256 amount)
Withdrawn(address indexed user, uint256 amount)
RewardClaimed(address indexed user, uint256 amount)
RewardsFunded(address indexed funder, uint256 amount)
RewardRateUpdated(uint256 oldRate, uint256 newRate)
```

Purpose:

- Improve Etherscan readability
- Support future automated tests
- Make contract activity easier to track
- Prepare the contract for more production-like Web3 monitoring

The contract was redeployed to Ethereum Sepolia after adding events.

Updated deployed contract:

```text
0x8a0fdc67D8751d409d3ad2571faD8eA45820dA47
```

Explorer:

```text
https://sepolia.etherscan.io/address/0x8a0fdc67D8751d409d3ad2571faD8eA45820dA47
```

Validated flows after redeploy:

- Stake transaction
- Reward pool funding transaction
- Withdraw transaction
- Etherscan transaction review
- Event logs visible on Sepolia Etherscan

---

## Current Status

The project is working on Ethereum Sepolia with:

- deployed staking smart contract
- event emissions
- MetaMask connection
- Sepolia network guard
- stake / withdraw / claim flows
- reward pool funding
- transaction status UX
- Etherscan links
- safe mock DeFi agent
- optional serverless AI proxy implementation
- architecture documentation
- portfolio case study
- security notes

Current deployed contract:

```text
0x8a0fdc67D8751d409d3ad2571faD8eA45820dA47
```

---

## Next Steps

1. Add automated tests.
2. Add OpenZeppelin-based security patterns.
3. Add production-grade access control.
4. Add backend request validation and rate limiting for the optional AI proxy.
5. Prepare LinkedIn / portfolio post.
