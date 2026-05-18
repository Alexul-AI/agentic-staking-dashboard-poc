import { useState, useCallback } from "react";

export type AgentAction =
  | "STAKE_MORE"
  | "CLAIM_REWARDS"
  | "WITHDRAW_ALL"
  | "HOLD";

export interface AgentDecision {
  action: AgentAction;
  reasoning: string;
}

const REWARD_CLAIM_THRESHOLD_ETH = 0.000001;

export const useDeFiAgent = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [decision, setDecision] = useState<AgentDecision | null>(null);

  const analyzePosition = useCallback(
    async (stakedBalance: string, earnedRewards: string) => {
      setIsAnalyzing(true);
      setDecision(null);

      try {
        const staked = Number(stakedBalance);
        const rewards = Number(earnedRewards);

        // Small artificial delay to simulate agent reasoning
        await new Promise((resolve) => setTimeout(resolve, 800));

        let agentDecision: AgentDecision;

        if (!staked || staked <= 0) {
          agentDecision = {
            action: "STAKE_MORE",
            reasoning:
              "No active staking position was detected. The agent recommends staking before claiming rewards.",
          };
        } else if (rewards >= REWARD_CLAIM_THRESHOLD_ETH) {
          agentDecision = {
            action: "CLAIM_REWARDS",
            reasoning:
              "Earned rewards are above the configured threshold. The agent recommends claiming rewards, but execution should still be confirmed by the user.",
          };
        } else {
          agentDecision = {
            action: "HOLD",
            reasoning:
              "Rewards are currently too small to justify a transaction. The agent recommends holding the position to avoid unnecessary gas usage.",
          };
        }

        setDecision(agentDecision);
        return agentDecision;
      } catch (error) {
        console.error("Agent analysis failed:", error);

        const fallbackDecision: AgentDecision = {
          action: "HOLD",
          reasoning:
            "The agent failed to analyze the position safely. Defaulting to HOLD.",
        };

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
