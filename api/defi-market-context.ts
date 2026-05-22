type GasCondition = "LOW" | "MEDIUM" | "HIGH";
type PoolHealth = "HEALTHY" | "WATCH" | "RISKY";
type RiskLevel = "LOW" | "MEDIUM" | "HIGH";
type LiquidityStatus = "SUFFICIENT" | "LOW" | "EMPTY";

interface DeFiMarketContext {
  network: "sepolia";
  mockApy: string;
  gasCondition: GasCondition;
  poolHealth: PoolHealth;
  riskLevel: RiskLevel;
  liquidityStatus: LiquidityStatus;
  marketNote: string;
  updatedAt: string;
}

interface ApiRequest {
  method?: string;
}

interface ApiResponse {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
}

const buildMockMarketContext = (): DeFiMarketContext => {
  return {
    network: "sepolia",
    mockApy: "4.2%",
    gasCondition: "LOW",
    poolHealth: "HEALTHY",
    riskLevel: "LOW",
    liquidityStatus: "SUFFICIENT",
    marketNote:
      "Mock DeFi context indicates stable staking conditions on Sepolia. This is simulated data for portfolio demonstration only.",
    updatedAt: new Date().toISOString(),
  };
};

export default function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Method not allowed. Use GET.",
    });
  }

  return res.status(200).json({
    context: buildMockMarketContext(),
  });
}
