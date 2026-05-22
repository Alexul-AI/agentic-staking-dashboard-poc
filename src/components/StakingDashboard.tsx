import { useState } from "react";
import { formatEther } from "viem";
import { useDeFiMarketContext } from "../hooks/useDeFiMarketContext";
import {
  useChainId,
  useConnect,
  useConnectors,
  useDisconnect,
  useConnection,
  useSwitchChain,
} from "wagmi";
import { sepolia } from "wagmi/chains";
import { useStaking } from "../hooks/useStaking";
import { useDeFiAgent } from "../hooks/useDeFiAgent";

const SEPOLIA_ETHERSCAN_BASE_URL = "https://sepolia.etherscan.io";

type TransactionAction =
  | "Stake"
  | "Claim Rewards"
  | "Withdraw All"
  | "Fund Reward Pool";

const Spinner = () => (
  <svg
    className="animate-spin -ml-1 mr-2 h-5 w-5 text-current"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

interface StakingDashboardProps {
  contractAddress: `0x${string}`;
}

export const StakingDashboard = ({
  contractAddress,
}: StakingDashboardProps) => {
  const { address, isConnected } = useConnection();
  const chainId = useChainId();
  const connectors = useConnectors();

  const {
    mutateAsync: connectWalletAsync,
    isPending: isConnecting,
    error: connectError,
  } = useConnect();

  const {
    mutateAsync: disconnectWalletAsync,
    isPending: isDisconnecting,
    error: disconnectError,
  } = useDisconnect();

  const {
    mutateAsync: switchChainAsync,
    isPending: isSwitchingNetwork,
    error: switchChainError,
  } = useSwitchChain();

  const {
    stakedBalance,
    earnedRewards,
    contractBalance,
    isLoading,
    error,
    txHash,
    stake,
    withdraw,
    claimReward,
    fundRewards,
  } = useStaking(contractAddress);

  const { analyzePosition, isAnalyzing, decision } = useDeFiAgent();
  const {
    marketContext,
    isLoadingMarketContext,
    marketContextError,
    fetchMarketContext,
  } = useDeFiMarketContext();

  const [stakeAmount, setStakeAmount] = useState("");
  const [rewardFundingAmount, setRewardFundingAmount] = useState("");
  const [lastAction, setLastAction] = useState<TransactionAction | null>(null);

  const formattedStaked = stakedBalance ? formatEther(stakedBalance) : "0.0";
  const formattedRewards = earnedRewards ? formatEther(earnedRewards) : "0.0";
  const formattedContractBalance = contractBalance
    ? formatEther(contractBalance)
    : "0.0";

  const isSepolia = chainId === sepolia.id;
  const isWrongNetwork = isConnected && !isSepolia;
  const canExecuteTransaction = isConnected && isSepolia;

  const canStake =
    canExecuteTransaction && Boolean(stakeAmount) && Number(stakeAmount) > 0;

  const canFundRewards =
    canExecuteTransaction &&
    Boolean(rewardFundingAmount) &&
    Number(rewardFundingAmount) > 0;

  const canClaimRewards =
    canExecuteTransaction && Boolean(earnedRewards && earnedRewards > 0n);

  const canWithdraw =
    canExecuteTransaction && Boolean(stakedBalance && stakedBalance > 0n);

  const hasRewardsWithoutPool =
    earnedRewards !== undefined &&
    earnedRewards > 0n &&
    (contractBalance === undefined || contractBalance < earnedRewards);

  const shortAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";

  const contractUrl = `${SEPOLIA_ETHERSCAN_BASE_URL}/address/${contractAddress}`;

  const lastTransactionUrl = txHash
    ? `${SEPOLIA_ETHERSCAN_BASE_URL}/tx/${txHash}`
    : null;

  const shortTxHash = txHash
    ? `${txHash.slice(0, 10)}...${txHash.slice(-6)}`
    : null;

  const combinedError =
    error ??
    connectError?.message ??
    disconnectError?.message ??
    switchChainError?.message ??
    null;

  const transactionStatusTitle = combinedError
    ? "Transaction failed or rejected"
    : isLoading && txHash
      ? "Waiting for Sepolia confirmation"
      : isLoading
        ? "Waiting for wallet confirmation"
        : txHash
          ? "Last transaction submitted"
          : "Ready for transaction";

  const transactionStatusDescription = combinedError
    ? "The transaction did not complete. Check the error message and try again if needed."
    : isLoading && txHash
      ? "The transaction was submitted to Sepolia. Waiting for the network to confirm it."
      : isLoading
        ? "MetaMask should open a confirmation request. Review and approve the transaction in your wallet."
        : txHash
          ? "The latest transaction from this session is available for review on Sepolia Etherscan."
          : "No transaction is currently in progress.";

  const handleConnectWallet = async () => {
    try {
      const metaMaskConnector =
        connectors.find((connector) =>
          connector.name.toLowerCase().includes("metamask"),
        ) ?? connectors[0];

      if (!metaMaskConnector) {
        alert("MetaMask connector was not found.");
        return;
      }

      const result = await connectWalletAsync({
        connector: metaMaskConnector,
        chainId: sepolia.id,
      });

      console.log("Wallet connected:", result);
    } catch (connectionError) {
      console.error("Wallet connection failed:", connectionError);

      alert(
        connectionError instanceof Error
          ? connectionError.message
          : "Wallet connection failed. Check browser console.",
      );
    }
  };

  const handleDisconnectWallet = async () => {
    try {
      await disconnectWalletAsync();
    } catch (disconnectError) {
      console.error("Wallet disconnect failed:", disconnectError);
    }
  };

  const handleSwitchToSepolia = async () => {
    try {
      await switchChainAsync({ chainId: sepolia.id });
    } catch (networkError) {
      console.error("Failed to switch network:", networkError);

      alert(
        networkError instanceof Error
          ? networkError.message
          : "Failed to switch to Sepolia. Check MetaMask.",
      );
    }
  };

  const handleStake = async () => {
    if (!canStake) return;

    setLastAction("Stake");
    await stake(stakeAmount);
    setStakeAmount("");
  };

  const handleFundRewards = async () => {
    if (!canFundRewards) return;

    setLastAction("Fund Reward Pool");
    await fundRewards(rewardFundingAmount);
    setRewardFundingAmount("");
  };

  const handleClaimReward = async () => {
    if (!canClaimRewards) return;

    setLastAction("Claim Rewards");
    await claimReward();
  };

  const handleWithdraw = async () => {
    if (!canWithdraw) return;

    setLastAction("Withdraw All");
    await withdraw();
  };

  const handleAgentAnalyze = async () => {
    const context = await fetchMarketContext();

    const agentDecision = await analyzePosition(
      formattedStaked,
      formattedRewards,
      formattedContractBalance,
      context,
    );

    if (agentDecision) {
      console.log("Agent decision:", agentDecision);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-900 rounded-2xl shadow-2xl border border-gray-800 text-gray-100 font-sans">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
          ETH Staking
        </h2>

        {isConnected ? (
          <button
            type="button"
            onClick={handleDisconnectWallet}
            disabled={isDisconnecting}
            className="text-sm bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl px-4 py-2 text-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDisconnecting ? "Disconnecting..." : shortAddress}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleConnectWallet}
            disabled={isConnecting}
            className="flex items-center justify-center text-sm bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl px-4 py-2 text-white font-medium transition-colors"
          >
            {isConnecting ? (
              <>
                <Spinner />
                Connecting...
              </>
            ) : (
              "Connect Wallet"
            )}
          </button>
        )}
      </div>

      {isWrongNetwork && (
        <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              />
            </svg>

            <div className="flex-1">
              <p className="text-yellow-200 font-semibold text-sm">
                Wrong network
              </p>
              <p className="text-yellow-100/80 text-sm mt-1">
                This dashboard is connected to a Sepolia staking contract.
                Please switch MetaMask to Ethereum Sepolia before sending
                transactions.
              </p>

              <button
                type="button"
                onClick={handleSwitchToSepolia}
                disabled={isSwitchingNetwork}
                className="mt-3 inline-flex items-center justify-center bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-100 border border-yellow-400/30 rounded-lg px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSwitchingNetwork ? "Switching..." : "Switch to Sepolia"}
              </button>
            </div>
          </div>
        </div>
      )}

      {(isLoading || txHash || lastAction) && (
        <div className="mb-6 p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-xl">
          <div className="flex items-start gap-3">
            {isLoading && <Spinner />}

            <div className="flex-1">
              <div className="flex items-center justify-between gap-3">
                <p className="text-indigo-200 font-semibold text-sm">
                  Transaction Status
                </p>

                {lastAction && (
                  <span className="text-xs px-2 py-1 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-400/30">
                    {lastAction}
                  </span>
                )}
              </div>

              <p className="text-white text-sm mt-2">
                {transactionStatusTitle}
              </p>

              <p className="text-indigo-100/80 text-sm mt-1">
                {transactionStatusDescription}
              </p>

              {txHash && lastTransactionUrl && (
                <div className="mt-3 flex flex-col gap-1">
                  <p className="text-xs text-gray-400">
                    Transaction hash:{" "}
                    <span className="text-gray-200">{shortTxHash}</span>
                  </p>

                  <a
                    href={lastTransactionUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-green-300 hover:text-green-200 underline underline-offset-4 text-sm"
                  >
                    View transaction on Sepolia Etherscan
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {combinedError && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
          <svg
            className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>

          <span className="text-red-400 text-sm">{combinedError}</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700/50 backdrop-blur-sm">
          <p className="text-sm text-gray-400 mb-1">Staked ETH</p>
          <p className="text-xl font-semibold tracking-wide">
            {formattedStaked}
          </p>
        </div>

        <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700/50 backdrop-blur-sm overflow-hidden">
          <p className="text-sm text-gray-400 mb-1">Earned Rewards</p>
          <p className="text-xl font-semibold tracking-wide text-green-400 truncate">
            {formattedRewards}
          </p>
        </div>
      </div>

      <div className="mb-8 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div>
            <p className="text-sm text-emerald-300 font-semibold">
              Reward Pool
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Funds available in the contract for paying staking rewards.
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs text-gray-500">Contract Balance</p>
            <p className="text-lg font-semibold text-emerald-300">
              {formattedContractBalance} ETH
            </p>
          </div>
        </div>

        {hasRewardsWithoutPool && (
          <div className="mb-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3">
            <p className="text-yellow-200 text-sm font-medium">
              Reward pool may be too low
            </p>
            <p className="text-yellow-100/80 text-xs mt-1">
              Earned rewards are visible, but the contract may not have enough
              ETH to pay them. Fund the reward pool before claiming.
            </p>
          </div>
        )}

        <label
          htmlFor="rewardFundingAmount"
          className="block text-sm text-gray-400 mb-2"
        >
          Reward Funding Amount
        </label>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <input
              id="rewardFundingAmount"
              type="number"
              min="0"
              step="0.001"
              value={rewardFundingAmount}
              onChange={(event) => setRewardFundingAmount(event.target.value)}
              disabled={isLoading || isWrongNetwork}
              placeholder="0.00"
              className="w-full bg-gray-950 text-white border border-gray-700 rounded-xl py-3 px-4 pr-14 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all disabled:opacity-50"
            />

            <span className="absolute right-4 top-3.5 text-gray-500 font-medium pointer-events-none">
              ETH
            </span>
          </div>

          <button
            type="button"
            onClick={handleFundRewards}
            disabled={isLoading || !canFundRewards}
            className="flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-600/20"
          >
            {isLoading && lastAction === "Fund Reward Pool" ? (
              <>
                <Spinner />
                Fund
              </>
            ) : (
              "Fund Pool"
            )}
          </button>
        </div>

        {isWrongNetwork && (
          <p className="text-xs text-yellow-200/80 mt-2">
            Reward pool funding is disabled until the wallet is connected to
            Sepolia.
          </p>
        )}
      </div>

      <div className="mb-8 rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <p className="text-sm text-purple-300 font-semibold">
              DeFi Market Context
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Mock backend context used by the AI Auto-Pilot recommendation
              layer.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchMarketContext}
            disabled={isLoadingMarketContext}
            className="text-xs bg-purple-500/20 hover:bg-purple-500/30 text-purple-100 border border-purple-400/30 rounded-lg px-3 py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoadingMarketContext ? "Loading..." : "Refresh Context"}
          </button>
        </div>

        {marketContext ? (
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-gray-950/60 border border-gray-800 p-3">
              <p className="text-gray-500 text-xs">Mock APY</p>
              <p className="text-purple-200 font-semibold">
                {marketContext.mockApy}
              </p>
            </div>

            <div className="rounded-lg bg-gray-950/60 border border-gray-800 p-3">
              <p className="text-gray-500 text-xs">Gas Condition</p>
              <p className="text-purple-200 font-semibold">
                {marketContext.gasCondition}
              </p>
            </div>

            <div className="rounded-lg bg-gray-950/60 border border-gray-800 p-3">
              <p className="text-gray-500 text-xs">Pool Health</p>
              <p className="text-purple-200 font-semibold">
                {marketContext.poolHealth}
              </p>
            </div>

            <div className="rounded-lg bg-gray-950/60 border border-gray-800 p-3">
              <p className="text-gray-500 text-xs">Risk Level</p>
              <p className="text-purple-200 font-semibold">
                {marketContext.riskLevel}
              </p>
            </div>

            <div className="col-span-2 rounded-lg bg-gray-950/60 border border-gray-800 p-3">
              <p className="text-gray-500 text-xs">Market Note</p>
              <p className="text-gray-300 text-sm mt-1">
                {marketContext.marketNote}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">
            No DeFi market context loaded yet. Run AI Auto-Pilot or refresh the
            context manually.
          </p>
        )}

        {marketContextError && (
          <p className="text-yellow-200/80 text-xs mt-3">
            Market context fallback used: {marketContextError}
          </p>
        )}
      </div>

      <div className="mb-8 rounded-xl border border-gray-800 bg-gray-950/70 p-4">
        <p className="text-sm text-gray-400 mb-3">On-chain References</p>

        <div className="flex flex-col gap-2 text-sm">
          <a
            href={contractUrl}
            target="_blank"
            rel="noreferrer"
            className="text-indigo-300 hover:text-indigo-200 underline underline-offset-4"
          >
            View staking contract on Sepolia Etherscan
          </a>

          {lastTransactionUrl ? (
            <a
              href={lastTransactionUrl}
              target="_blank"
              rel="noreferrer"
              className="text-green-300 hover:text-green-200 underline underline-offset-4"
            >
              View last transaction on Sepolia Etherscan
            </a>
          ) : (
            <p className="text-gray-500">
              No transaction submitted in this session yet.
            </p>
          )}
        </div>
      </div>

      <div className="mb-8">
        <label
          htmlFor="stakeAmount"
          className="block text-sm text-gray-400 mb-2"
        >
          Deposit Amount
        </label>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <input
              id="stakeAmount"
              type="number"
              min="0"
              step="0.001"
              value={stakeAmount}
              onChange={(event) => setStakeAmount(event.target.value)}
              disabled={isLoading || isWrongNetwork}
              placeholder="0.00"
              className="w-full bg-gray-950 text-white border border-gray-700 rounded-xl py-3 px-4 pr-14 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all disabled:opacity-50"
            />

            <span className="absolute right-4 top-3.5 text-gray-500 font-medium pointer-events-none">
              ETH
            </span>
          </div>

          <button
            type="button"
            onClick={handleStake}
            disabled={isLoading || !canStake}
            className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/20"
          >
            {isLoading && lastAction === "Stake" ? (
              <>
                <Spinner />
                Stake
              </>
            ) : (
              "Stake"
            )}
          </button>
        </div>

        {isWrongNetwork && (
          <p className="text-xs text-yellow-200/80 mt-2">
            Staking is disabled until the wallet is connected to Sepolia.
          </p>
        )}
      </div>

      <div className="border-t border-gray-800 pt-6">
        <p className="text-sm text-gray-400 mb-4">Position Management</p>

        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={handleClaimReward}
            disabled={isLoading || !canClaimRewards}
            className="flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-xl border border-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading && lastAction === "Claim Rewards" ? (
              <>
                <Spinner />
                Claim
              </>
            ) : (
              "Claim Rewards"
            )}
          </button>

          <button
            type="button"
            onClick={handleAgentAnalyze}
            disabled={isLoading || isAnalyzing || isLoadingMarketContext}
            className="flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-xl shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing || isLoadingMarketContext
              ? "Analyzing..."
              : "🤖 AI Auto-Pilot"}
          </button>

          <button
            type="button"
            onClick={handleWithdraw}
            disabled={isLoading || !canWithdraw}
            className="flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium py-3 px-4 rounded-xl border border-red-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading && lastAction === "Withdraw All" ? (
              <>
                <Spinner />
                Withdraw
              </>
            ) : (
              "Withdraw All"
            )}
          </button>
        </div>

        {isWrongNetwork && (
          <p className="text-xs text-yellow-200/80 mt-3">
            Claim and withdraw actions are disabled until the wallet is
            connected to Sepolia.
          </p>
        )}

        {decision && (
          <div className="mt-4 p-4 bg-indigo-900/30 border border-indigo-500/50 rounded-xl space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-indigo-300 text-sm font-semibold">
                AI Action: {decision.action}
              </p>

              <span className="text-xs px-2 py-1 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-400/30">
                Confidence: {decision.confidence}
              </span>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                Reasoning
              </p>
              <p className="text-gray-300 text-sm">{decision.reasoning}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                Recommended Next Step
              </p>
              <p className="text-gray-300 text-sm">
                {decision.recommendedNextStep}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                Execution
              </p>
              <p className="text-gray-300 text-sm">{decision.executionHint}</p>
            </div>

            <div className="pt-3 border-t border-indigo-500/20">
              <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                Risk Note
              </p>
              <p className="text-gray-400 text-xs">{decision.riskNote}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
