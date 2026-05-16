import { useState } from "react";
import { formatEther } from "viem";
import { useStaking } from "../hooks/useStaking";

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
  const {
    stakedBalance,
    earnedRewards,
    isLoading,
    error,
    stake,
    withdraw,
    claimReward,
  } = useStaking(contractAddress);

  const [stakeAmount, setStakeAmount] = useState("");

  const formattedStaked = stakedBalance ? formatEther(stakedBalance) : "0.0";
  const formattedRewards = earnedRewards ? formatEther(earnedRewards) : "0.0";

  const canStake = Boolean(stakeAmount) && Number(stakeAmount) > 0;
  const canClaimRewards = Boolean(earnedRewards && earnedRewards > 0n);
  const canWithdraw = Boolean(stakedBalance && stakedBalance > 0n);

  const handleStake = async () => {
    if (!canStake) return;

    await stake(stakeAmount);
    setStakeAmount("");
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-900 rounded-2xl shadow-2xl border border-gray-800 text-gray-100 font-sans">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
          ETH Staking
        </h2>

        {isLoading && (
          <div className="flex items-center text-sm text-indigo-400 font-medium">
            <Spinner />
            Processing...
          </div>
        )}
      </div>

      {error && (
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

          <span className="text-red-400 text-sm">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700/50 backdrop-blur-sm">
          <p className="text-sm text-gray-400 mb-1">Staked ETH</p>
          <p className="text-xl font-semibold tracking-wide">
            {formattedStaked}
          </p>
        </div>

        <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700/50 backdrop-blur-sm">
          <p className="text-sm text-gray-400 mb-1">Earned Rewards</p>
          <p className="text-xl font-semibold tracking-wide text-green-400">
            {formattedRewards}
          </p>
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
              step="0.01"
              value={stakeAmount}
              onChange={(event) => setStakeAmount(event.target.value)}
              disabled={isLoading}
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
            {isLoading ? (
              <>
                <Spinner />
                Stake
              </>
            ) : (
              "Stake"
            )}
          </button>
        </div>
      </div>

      <div className="border-t border-gray-800 pt-6">
        <p className="text-sm text-gray-400 mb-4">Position Management</p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={claimReward}
            disabled={isLoading || !canClaimRewards}
            className="flex-1 flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-xl border border-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
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
            onClick={withdraw}
            disabled={isLoading || !canWithdraw}
            className="flex-1 flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium py-3 px-4 rounded-xl border border-red-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Spinner />
                Withdraw
              </>
            ) : (
              "Withdraw All"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
