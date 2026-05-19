# Architecture Diagram — Agentic Staking Dashboard PoC

This diagram shows the current architecture of the project: a React dashboard connected to a deployed Sepolia staking contract, with MetaMask-confirmed transactions, Etherscan transparency, and a safe mock DeFi agent recommendation layer.

```mermaid
flowchart TD
    User["User / Wallet Owner"]

    subgraph Frontend["React Frontend"]
        Dashboard["StakingDashboard.tsx"]
        StakingHook["useStaking.ts"]
        AgentHook["useDeFiAgent.ts<br/>Safe Mock Agent"]
        WagmiConfig["wagmi.ts<br/>Sepolia + MetaMask config"]
    end

    subgraph AgentLayer["Agentic Decision Layer"]
        OnChainData["Grounding Data<br/>stakedBalance, earnedRewards,<br/>wallet address, txHash"]
        AgentDecision["Structured Recommendation<br/>action, confidence, reasoning,<br/>next step, execution hint, risk note"]
    end

    subgraph WalletLayer["Wallet / Human Approval Layer"]
        MetaMask["MetaMask<br/>User confirms or rejects transaction"]
    end

    subgraph Blockchain["Ethereum Sepolia"]
        Contract["StakingContract.sol<br/>stake, withdraw, claimReward"]
        Etherscan["Sepolia Etherscan<br/>contract + transaction review"]
    end

    User --> Dashboard

    Dashboard --> StakingHook
    Dashboard --> AgentHook
    Dashboard --> WagmiConfig

    StakingHook --> WagmiConfig
    WagmiConfig --> MetaMask
    MetaMask --> Contract

    Contract --> StakingHook
    StakingHook --> Dashboard

    StakingHook --> Etherscan
    Dashboard --> Etherscan

    StakingHook --> OnChainData
    OnChainData --> AgentHook
    AgentHook --> AgentDecision
    AgentDecision --> Dashboard

    AgentDecision -. "Recommendation only" .-> User
    User -. "Manual approval" .-> MetaMask
```

---

## Four-Layer View

```text
Layer 1 — Grounding / On-chain Data
  Wallet address, staking balance, earned rewards, contract address, transaction hash

Layer 2 — Web3 Integration
  wagmi, viem, MetaMask, Sepolia, contract reads and writes

Layer 3 — Agentic Decision Layer
  Safe mock DeFi agent returns structured recommendations

Layer 4 — Human-Approved Execution
  User reviews recommendation and confirms transactions through MetaMask
```

---

## Safety Principle

```text
AI suggests → User reviews → MetaMask confirms → Blockchain executes
```

The mock agent does not execute transactions automatically. It only explains a possible next action.
