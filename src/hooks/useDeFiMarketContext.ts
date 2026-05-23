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
    "Fallback mock DeFi context is being used for public demo mode. This is simulated data for portfolio demonstration only.",
  updatedAt: new Date().toISOString(),
};

const isValidMarketContext = (value: unknown): value is DeFiMarketContext => {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<DeFiMarketContext>;

  return (
    candidate.network === "sepolia" &&
    typeof candidate.mockApy === "string" &&
    typeof candidate.gasCondition === "string" &&
    typeof candidate.poolHealth === "string" &&
    typeof candidate.riskLevel === "string" &&
    typeof candidate.liquidityStatus === "string" &&
    typeof candidate.marketNote === "string" &&
    typeof candidate.updatedAt === "string"
  );
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
      const response = await fetch("/api/defi-market-context", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const contentType = response.headers.get("content-type") ?? "";

      if (!contentType.includes("application/json")) {
        throw new Error("Market context API did not return JSON.");
      }

      const data = (await response.json()) as MarketContextResponse;

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to load DeFi market context.");
      }

      if (!isValidMarketContext(data.context)) {
        throw new Error("Market context API returned an invalid payload.");
      }

      setMarketContext(data.context);
      return data.context;
    } catch (error) {
      console.warn("Using fallback DeFi market context:", error);

      setMarketContextError(
        "Live mock context endpoint is unavailable. Using local fallback demo context.",
      );

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
