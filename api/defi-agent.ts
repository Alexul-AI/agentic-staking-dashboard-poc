type AgentAction = "STAKE_MORE" | "CLAIM_REWARDS" | "WITHDRAW_ALL" | "HOLD";
type AgentConfidence = "LOW" | "MEDIUM" | "HIGH";

interface AgentDecision {
  action: AgentAction;
  confidence: AgentConfidence;
  reasoning: string;
  recommendedNextStep: string;
  executionHint: string;
  riskNote: string;
}

interface AgentMarketContext {
  mockApy?: string;
  gasCondition?: string;
  poolHealth?: string;
  riskLevel?: string;
  liquidityStatus?: string;
  marketNote?: string;
}

interface DefiAgentRequestBody {
  walletAddress?: string;
  contractAddress?: string;
  network?: string;
  stakedBalanceEth?: string;
  earnedRewardsEth?: string;
  contractBalanceEth?: string;
  lastTransactionHash?: string | null;
  marketContext?: AgentMarketContext | null;
}

interface ApiRequest {
  method?: string;
  body?: DefiAgentRequestBody;
  headers?: Record<string, string | string[] | undefined>;
  socket?: {
    remoteAddress?: string;
  };
}

interface ApiResponse {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
  setHeader?: (name: string, value: string) => void;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedBody: Required<
    Pick<
      DefiAgentRequestBody,
      "network" | "stakedBalanceEth" | "earnedRewardsEth" | "contractBalanceEth"
    >
  > &
    Pick<
      DefiAgentRequestBody,
      | "walletAddress"
      | "contractAddress"
      | "lastTransactionHash"
      | "marketContext"
    >;
}

const ALLOWED_ACTIONS: AgentAction[] = [
  "STAKE_MORE",
  "CLAIM_REWARDS",
  "WITHDRAW_ALL",
  "HOLD",
];

const ALLOWED_CONFIDENCE: AgentConfidence[] = ["LOW", "MEDIUM", "HIGH"];

const SUPPORTED_NETWORKS = ["sepolia"];

const MAX_REQUESTS_PER_WINDOW = 20;
const RATE_LIMIT_WINDOW_MS = 60_000;

const requestLog = new Map<string, number[]>();

const fallbackDecision: AgentDecision = {
  action: "HOLD",
  confidence: "LOW",
  reasoning:
    "The AI proxy could not produce a validated decision. Defaulting to HOLD.",
  recommendedNextStep:
    "Do not execute any transaction based on this response. Review the dashboard manually.",
  executionHint:
    "No wallet transaction is prepared. Manual user action is required.",
  riskNote:
    "Fallback mode was activated because the AI response was unavailable or invalid.",
};

const normalizeString = (value: unknown, fallback: string) =>
  typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : fallback;

const isEthAmountString = (value: unknown) => {
  if (typeof value !== "string") return false;

  const trimmed = value.trim();

  if (!/^\d+(\.\d+)?$/.test(trimmed)) return false;

  const parsed = Number(trimmed);

  return Number.isFinite(parsed) && parsed >= 0;
};

const isOptionalEthAddress = (value: unknown) => {
  if (value === undefined || value === null || value === "") return true;

  return typeof value === "string" && /^0x[a-fA-F0-9]{40}$/.test(value);
};

const isOptionalTxHash = (value: unknown) => {
  if (value === undefined || value === null || value === "") return true;

  return typeof value === "string" && /^0x[a-fA-F0-9]{64}$/.test(value);
};

const sanitizeMarketContext = (
  value: unknown,
): AgentMarketContext | null | undefined => {
  if (value === undefined || value === null) return value;

  if (typeof value !== "object") return undefined;

  const candidate = value as Record<string, unknown>;

  return {
    mockApy:
      typeof candidate.mockApy === "string" ? candidate.mockApy : undefined,
    gasCondition:
      typeof candidate.gasCondition === "string"
        ? candidate.gasCondition
        : undefined,
    poolHealth:
      typeof candidate.poolHealth === "string"
        ? candidate.poolHealth
        : undefined,
    riskLevel:
      typeof candidate.riskLevel === "string" ? candidate.riskLevel : undefined,
    liquidityStatus:
      typeof candidate.liquidityStatus === "string"
        ? candidate.liquidityStatus
        : undefined,
    marketNote:
      typeof candidate.marketNote === "string"
        ? candidate.marketNote
        : undefined,
  };
};

const validateRequestBody = (
  body: DefiAgentRequestBody | undefined,
): ValidationResult => {
  const errors: string[] = [];
  const requestBody = body ?? {};

  const network = requestBody.network?.trim() || "sepolia";

  if (!SUPPORTED_NETWORKS.includes(network)) {
    errors.push("Unsupported network. Only sepolia is supported.");
  }

  if (!isEthAmountString(requestBody.stakedBalanceEth ?? "0")) {
    errors.push("stakedBalanceEth must be a non-negative ETH amount string.");
  }

  if (!isEthAmountString(requestBody.earnedRewardsEth ?? "0")) {
    errors.push("earnedRewardsEth must be a non-negative ETH amount string.");
  }

  if (!isEthAmountString(requestBody.contractBalanceEth ?? "0")) {
    errors.push("contractBalanceEth must be a non-negative ETH amount string.");
  }

  if (!isOptionalEthAddress(requestBody.walletAddress)) {
    errors.push("walletAddress must be a valid 0x Ethereum address.");
  }

  if (!isOptionalEthAddress(requestBody.contractAddress)) {
    errors.push("contractAddress must be a valid 0x Ethereum address.");
  }

  if (!isOptionalTxHash(requestBody.lastTransactionHash)) {
    errors.push("lastTransactionHash must be a valid 0x transaction hash.");
  }

  const sanitizedMarketContext = sanitizeMarketContext(
    requestBody.marketContext,
  );

  if (sanitizedMarketContext === undefined && requestBody.marketContext) {
    errors.push("marketContext must be an object when provided.");
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedBody: {
      network,
      stakedBalanceEth: requestBody.stakedBalanceEth?.trim() || "0",
      earnedRewardsEth: requestBody.earnedRewardsEth?.trim() || "0",
      contractBalanceEth: requestBody.contractBalanceEth?.trim() || "0",
      walletAddress: requestBody.walletAddress,
      contractAddress: requestBody.contractAddress,
      lastTransactionHash: requestBody.lastTransactionHash ?? null,
      marketContext: sanitizedMarketContext ?? null,
    },
  };
};

const getClientId = (req: ApiRequest) => {
  const forwardedFor = req.headers?.["x-forwarded-for"];
  const forwardedForValue = Array.isArray(forwardedFor)
    ? forwardedFor[0]
    : forwardedFor;

  return (
    forwardedForValue?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    "unknown-client"
  );
};

const isRateLimited = (clientId: string) => {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;

  const recentRequests = (requestLog.get(clientId) ?? []).filter(
    (timestamp) => timestamp > windowStart,
  );

  if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
    requestLog.set(clientId, recentRequests);
    return true;
  }

  requestLog.set(clientId, [...recentRequests, now]);
  return false;
};

const normalizeDecision = (value: unknown): AgentDecision => {
  if (!value || typeof value !== "object") {
    return fallbackDecision;
  }

  const candidate = value as Partial<AgentDecision>;

  const action = ALLOWED_ACTIONS.includes(candidate.action as AgentAction)
    ? (candidate.action as AgentAction)
    : "HOLD";

  const confidence = ALLOWED_CONFIDENCE.includes(
    candidate.confidence as AgentConfidence,
  )
    ? (candidate.confidence as AgentConfidence)
    : "LOW";

  return {
    action,
    confidence,
    reasoning: normalizeString(
      candidate.reasoning,
      "The AI model did not provide a valid reasoning field.",
    ),
    recommendedNextStep: normalizeString(
      candidate.recommendedNextStep,
      "Review the dashboard manually before taking action.",
    ),
    executionHint: normalizeString(
      candidate.executionHint,
      "No automatic transaction will be executed. User confirmation is required.",
    ),
    riskNote: normalizeString(
      candidate.riskNote,
      "This is a decision-support response only and not financial advice.",
    ),
  };
};

const buildPrompt = (body: ValidationResult["sanitizedBody"]) => {
  const marketContext = body.marketContext;

  const marketContextText = marketContext
    ? `
Mock DeFi market context:
- APY: ${marketContext.mockApy ?? "unknown"}
- Gas condition: ${marketContext.gasCondition ?? "unknown"}
- Pool health: ${marketContext.poolHealth ?? "unknown"}
- Risk level: ${marketContext.riskLevel ?? "unknown"}
- Liquidity status: ${marketContext.liquidityStatus ?? "unknown"}
- Market note: ${marketContext.marketNote ?? "none"}
`
    : "No backend market context was provided.";

  return `
You are a cautious DeFi staking decision-support agent.

You analyze a user's staking dashboard state and return a structured recommendation.
You do not execute transactions.
You do not provide financial advice.
You must keep the user in control.
All blockchain actions require MetaMask confirmation by the user.

Current context:
- Network: ${body.network}
- Staked balance: ${body.stakedBalanceEth} ETH
- Earned rewards: ${body.earnedRewardsEth} ETH
- Contract reward pool balance: ${body.contractBalanceEth} ETH
${marketContextText}

Decision rules:
- If staked balance is 0, usually recommend STAKE_MORE.
- If rewards are 0 or very small, usually recommend HOLD.
- If rewards are meaningful and contract reward pool appears sufficient, consider CLAIM_REWARDS.
- If contract reward pool is too low, explain that rewards may not be claimable yet.
- WITHDRAW_ALL should be used cautiously and only when the reasoning supports exiting the position.
- Use backend market context as supporting context, not as financial advice.

Respond strictly as JSON with this exact shape:
{
  "action": "STAKE_MORE" | "CLAIM_REWARDS" | "WITHDRAW_ALL" | "HOLD",
  "confidence": "LOW" | "MEDIUM" | "HIGH",
  "reasoning": "Brief explanation",
  "recommendedNextStep": "What the user should consider next",
  "executionHint": "How execution would happen through MetaMask, if needed",
  "riskNote": "Important safety or limitation note"
}
`;
};

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed. Use POST.",
    });
  }

  const clientId = getClientId(req);

  if (isRateLimited(clientId)) {
    res.setHeader?.("Retry-After", "60");

    return res.status(429).json({
      error: "Rate limit exceeded. Try again later.",
      decision: fallbackDecision,
    });
  }

  const validation = validateRequestBody(req.body);

  if (!validation.isValid) {
    return res.status(400).json({
      error: "Invalid request body.",
      validationErrors: validation.errors,
      decision: fallbackDecision,
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

  if (!apiKey) {
    return res.status(500).json({
      error: "GEMINI_API_KEY is missing on the server.",
      decision: fallbackDecision,
    });
  }

  try {
    const prompt = buildPrompt(validation.sanitizedBody);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.1,
          },
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();

      return res.status(response.status).json({
        error: "Gemini API request failed.",
        details: errorText,
        decision: fallbackDecision,
      });
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (typeof text !== "string") {
      return res.status(502).json({
        error: "Gemini response did not include a text payload.",
        decision: fallbackDecision,
      });
    }

    const parsed = JSON.parse(text);
    const decision = normalizeDecision(parsed);

    return res.status(200).json({ decision });
  } catch (error) {
    return res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : "Unknown AI proxy server error.",
      decision: fallbackDecision,
    });
  }
}
