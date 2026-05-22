import { useCallback, useState } from "react";

export type GasCondition = "LOW" | "MEDIUM" | "HIGH";
export type PoolHealth = "HEALTHY" | "WATCH" | "RISKY";
export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";
export type LiquidityStatus = "SUFFICIENT" | "LOW" | "EMPTY";

export interface DeFiMarketContext {
  network: "sepolia";
  mockApy: string;
  gasCondition: GasCondition;
  poolHealth: PoolHealth;
  riskLevel: RiskLevel;
  liquidityStatus: LiquidityStatus;
  marketNote: string;
  updatedAt: string;
}

interface MarketContextResponse {
  context?: DeFiMarketContext;
  error?: string;
}

const fallbackContext: DeFiMarketContext = {
  network: "sepolia",
  mockApy: "4.2%",
  gasCondition: "LOW",
  poolHealth: "HEALTHY",
  riskLevel: "LOW",
  liquidityStatus: "SUFFICIENT",
  marketNote:
    "Fallback mock DeFi context is being used. This is simulated data for portfolio demonstration only.",
  updatedAt: new Date().toISOString(),
};

export const useDeFiMarketContext = () => {
  const [marketContext, setMarketContext] = useState<DeFiMarketContext | null>(
    null,
  );
  const [isLoadingMarketContext, setIsLoadingMarketContext] = useState(false);
  const [marketContextError, setMarketContextError] = useState<string | null>(
    null,
  );

  const fetchMarketContext = useCallback(async () => {
    setIsLoadingMarketContext(true);
    setMarketContextError(null);

    try {
      const response = await fetch("/api/defi-market-context");
      const data = (await response.json()) as MarketContextResponse;

      if (!response.ok || !data.context) {
        throw new Error(data.error ?? "Failed to load DeFi market context.");
      }

      setMarketContext(data.context);
      return data.context;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unknown DeFi market context error.";

      console.error("DeFi market context failed:", error);
      setMarketContextError(message);

      setMarketContext(fallbackContext);
      return fallbackContext;
    } finally {
      setIsLoadingMarketContext(false);
    }
  }, []);

  return {
    marketContext,
    isLoadingMarketContext,
    marketContextError,
    fetchMarketContext,
  };
};
