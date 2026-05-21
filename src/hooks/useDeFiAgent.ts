import { useState, useCallback } from "react";

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

interface ProxyResponse {
  decision?: AgentDecision;
  error?: string;
}

const REWARD_CLAIM_THRESHOLD_ETH = 0.000001;

const getMockDecision = (
  stakedBalance: string,
  earnedRewards: string,
): AgentDecision => {
  const staked = Number(stakedBalance);
  const rewards = Number(earnedRewards);

  if (!staked || staked <= 0) {
    return {
      action: "STAKE_MORE",
      confidence: "HIGH",
      reasoning:
        "No active staking position was detected. Without a staked balance, the position cannot generate meaningful rewards.",
      recommendedNextStep:
        "Stake a small amount of Sepolia ETH to activate the position.",
      executionHint:
        "Enter an amount in the deposit field and click Stake. MetaMask will ask you to confirm the transaction.",
      riskNote:
        "This is a testnet PoC. On mainnet, staking decisions should consider gas costs, contract risk, and liquidity needs.",
    };
  }

  if (rewards >= REWARD_CLAIM_THRESHOLD_ETH) {
    return {
      action: "CLAIM_REWARDS",
      confidence: "MEDIUM",
      reasoning:
        "The earned rewards are above the configured claim threshold. Claiming may be reasonable, depending on gas cost and user preference.",
      recommendedNextStep:
        "Consider claiming accumulated rewards if the expected value justifies a transaction.",
      executionHint:
        "Click Claim Rewards to open MetaMask and manually confirm the transaction.",
      riskNote:
        "The agent does not execute wallet actions automatically. User confirmation through MetaMask is required.",
    };
  }

  return {
    action: "HOLD",
    confidence: "HIGH",
    reasoning:
      "Rewards are currently too small to justify a transaction. Claiming now would create unnecessary transaction activity.",
    recommendedNextStep:
      "Hold the staking position and wait for rewards to accumulate further.",
    executionHint:
      "No wallet transaction is required for HOLD. The user can manually claim or withdraw if desired.",
    riskNote:
      "This recommendation is based only on simple staking and reward data. It does not evaluate market risk or smart contract security.",
  };
};

const getFallbackDecision = (): AgentDecision => ({
  action: "HOLD",
  confidence: "LOW",
  reasoning:
    "The AI proxy could not return a validated decision. Defaulting to HOLD.",
  recommendedNextStep:
    "Review the position manually before taking any blockchain action.",
  executionHint:
    "No transaction was prepared. Use the manual dashboard controls if needed.",
  riskNote:
    "Fallback mode was activated because the optional AI proxy failed or was unavailable.",
});

export const useDeFiAgent = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [decision, setDecision] = useState<AgentDecision | null>(null);

  const analyzePosition = useCallback(
    async (
      stakedBalance: string,
      earnedRewards: string,
      contractBalance = "0.0",
    ) => {
      setIsAnalyzing(true);
      setDecision(null);

      try {
        const shouldUseProxy = import.meta.env.VITE_USE_AI_PROXY === "true";

        if (!shouldUseProxy) {
          await new Promise((resolve) => setTimeout(resolve, 800));

          const mockDecision = getMockDecision(stakedBalance, earnedRewards);
          setDecision(mockDecision);
          return mockDecision;
        }

        const response = await fetch("/api/defi-agent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            network: "sepolia",
            stakedBalanceEth: stakedBalance,
            earnedRewardsEth: earnedRewards,
            contractBalanceEth: contractBalance,
          }),
        });

        const data = (await response.json()) as ProxyResponse;

        if (!response.ok || !data.decision) {
          console.error("AI proxy failed:", data.error);
          const fallbackDecision = getFallbackDecision();
          setDecision(fallbackDecision);
          return fallbackDecision;
        }

        setDecision(data.decision);
        return data.decision;
      } catch (error) {
        console.error("Agent analysis failed:", error);

        const fallbackDecision = getFallbackDecision();
        setDecision(fallbackDecision);
        return fallbackDecision;
      } finally {
        setIsAnalyzing(false);
      }
    },
    [],
  );

  return { analyzePosition, isAnalyzing, decision };
};
