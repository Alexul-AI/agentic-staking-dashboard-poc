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

interface DefiAgentRequestBody {
  walletAddress?: string;
  contractAddress?: string;
  network?: string;
  stakedBalanceEth?: string;
  earnedRewardsEth?: string;
  contractBalanceEth?: string;
  lastTransactionHash?: string | null;
}

interface ApiRequest {
  method?: string;
  body?: DefiAgentRequestBody;
}

interface ApiResponse {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
}

const ALLOWED_ACTIONS: AgentAction[] = [
  "STAKE_MORE",
  "CLAIM_REWARDS",
  "WITHDRAW_ALL",
  "HOLD",
];

const ALLOWED_CONFIDENCE: AgentConfidence[] = ["LOW", "MEDIUM", "HIGH"];

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

const buildPrompt = (body: DefiAgentRequestBody) => {
  const stakedBalanceEth = body.stakedBalanceEth ?? "0";
  const earnedRewardsEth = body.earnedRewardsEth ?? "0";
  const contractBalanceEth = body.contractBalanceEth ?? "0";
  const network = body.network ?? "unknown";

  return `
You are a cautious DeFi staking decision-support agent.

You analyze a user's staking dashboard state and return a structured recommendation.
You do not execute transactions.
You do not provide financial advice.
You must keep the user in control.
All blockchain actions require MetaMask confirmation by the user.

Current context:
- Network: ${network}
- Staked balance: ${stakedBalanceEth} ETH
- Earned rewards: ${earnedRewardsEth} ETH
- Contract reward pool balance: ${contractBalanceEth} ETH

Decision rules:
- If staked balance is 0, usually recommend STAKE_MORE.
- If rewards are 0 or very small, usually recommend HOLD.
- If rewards are meaningful and contract reward pool appears sufficient, consider CLAIM_REWARDS.
- If contract reward pool is too low, explain that rewards may not be claimable yet.
- WITHDRAW_ALL should be used cautiously and only when the reasoning supports exiting the position.

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

  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

  if (!apiKey) {
    return res.status(500).json({
      error: "GEMINI_API_KEY is missing on the server.",
      decision: fallbackDecision,
    });
  }

  try {
    const body = req.body ?? {};
    const prompt = buildPrompt(body);

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
