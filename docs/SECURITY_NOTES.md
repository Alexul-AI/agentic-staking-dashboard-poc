# Security Notes — Agentic Staking Dashboard PoC

## 1. Purpose

This document describes the current security boundaries, known limitations, and production-readiness considerations for the Solidity staking contract and the surrounding Web3 dashboard.

This project is a portfolio Proof of Concept running on Ethereum Sepolia.

It is not a production DeFi protocol and should not be used with real funds without a full security review and professional audit.

---

## 2. Current Security Boundaries

Current safety boundaries:

- The project runs on Ethereum Sepolia testnet.
- The frontend does not store private keys.
- The frontend does not request or handle seed phrases.
- All blockchain write actions require MetaMask confirmation.
- The AI agent layer is recommendation-only.
- The AI agent does not execute wallet actions automatically.
- Etherscan links are provided for contract and transaction transparency.
- The current AI layer is mocked and does not require an API key.

The intended safety model is:

```text
AI suggests → User reviews → MetaMask confirms → Blockchain executes
```

---

## 3. Existing Solidity Hardening

The current staking contract includes several basic safety improvements.

### Reentrancy Guard

The contract uses a custom `nonReentrant` guard to protect functions that modify state and interact with ETH transfers.

Protected functions include:

```text
stake
withdraw
claimReward
```

This is important because ETH transfers use low-level `.call{value: amount}("")`, which can pass execution control to the receiver.

### Checks-Effects-Interactions Pattern

The contract updates internal state before transferring ETH.

Example pattern:

```text
check user balance
update internal state
transfer ETH
```

This helps reduce reentrancy risk.

### Owner-Only Reward Rate Updates

The reward rate can only be changed by the contract owner.

This avoids arbitrary users modifying reward logic.

---

## 4. Known Smart Contract Limitations

This contract is intentionally simple and designed for portfolio demonstration.

Known limitations:

- No professional audit.
- No formal verification.
- No test suite for edge cases yet.
- No event emissions for stake, withdraw, claim, or funding actions.
- No pause / emergency stop mechanism.
- No role-based access control beyond a simple owner check.
- No upgrade strategy.
- No protection against poor owner configuration.
- No advanced reward accounting model.
- No time-weighted or proportional multi-user reward distribution.
- No slashing, lock period, or withdrawal delay.
- No production-grade economic model.

---

## 5. Reward Pool Considerations

The contract separates user staking balance from reward pool liquidity.

This means:

```text
User stake
  → user's deposited ETH

Reward pool
  → ETH available inside the contract to pay rewards

Claim rewards
  → possible only if the contract has enough ETH liquidity
```

The dashboard now exposes contract balance / reward pool visibility to make this relationship clearer.

Remaining considerations:

- Reward pool can be underfunded.
- Reward calculation is simplified.
- Rewards are not backed by an economic yield source.
- Reward rate is manually configured.
- In production, reward sustainability would need a real economic model.

---

## 6. Frontend Safety Boundaries

The frontend improves safety by:

- Requiring MetaMask confirmation for all write actions.
- Showing transaction lifecycle status.
- Providing Sepolia Etherscan links.
- Blocking write actions on the wrong network.
- Showing reward pool balance.
- Showing user-facing errors.
- Keeping AI recommendations separate from execution.

The frontend does not:

- Store private keys.
- Store seed phrases.
- Execute transactions without wallet approval.
- Hide transaction destinations from the user.
- Provide real financial advice.

---

## 7. AI Agent Safety Boundaries

The current AI agent layer is a safe mock recommendation module.

It does not:

- Call an external AI API.
- Use an API key.
- Execute transactions.
- Control the wallet.
- Manage funds autonomously.
- Provide real financial advice.

A future AI integration should use a secure backend or serverless proxy.

Recommended pattern:

```text
Frontend → Backend / Serverless Proxy → AI API
```

The AI output should remain structured, validated, and recommendation-only.

---

## 8. Production Readiness Checklist

Before any mainnet deployment, the following steps would be required:

- Add a full smart contract test suite.
- Add event emissions.
- Add professional security audit.
- Consider using OpenZeppelin `ReentrancyGuard`.
- Consider using OpenZeppelin `Ownable` or role-based access control.
- Add emergency pause functionality.
- Define a real reward funding model.
- Add stronger reward accounting.
- Add monitoring and alerting.
- Add frontend network and transaction error coverage.
- Add backend security if using an AI proxy.
- Ensure no API keys are exposed in frontend code.
- Add legal and financial disclaimers where relevant.

---

## 9. Portfolio Positioning

These security notes are included to make the PoC more transparent and professionally framed.

The purpose is not to claim that the contract is production-ready.

The purpose is to demonstrate:

- security awareness
- clear limitation mapping
- Web3 risk understanding
- safe human-in-the-loop execution design
- AI Operator judgment
- responsible portfolio presentation

This supports the broader goal of building practical AI Operator / Web3 Solutions Developer portfolio assets.
