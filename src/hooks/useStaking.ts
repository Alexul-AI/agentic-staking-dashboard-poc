import { useState, useCallback, useEffect } from "react";
import {
  useConnection,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther, BaseError, UserRejectedRequestError } from "viem";

const STAKING_ABI = [
  {
    inputs: [],
    name: "stake",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "claimReward",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "fundRewards",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "getContractBalance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "stakes",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "rewards",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

interface UseStakingReturn {
  stakedBalance: bigint | undefined;
  earnedRewards: bigint | undefined;
  contractBalance: bigint | undefined;
  isLoading: boolean;
  error: string | null;
  txHash: `0x${string}` | undefined;
  stake: (amountEth: string) => Promise<void>;
  withdraw: () => Promise<void>;
  claimReward: () => Promise<void>;
  fundRewards: (amountEth: string) => Promise<void>;
  refetchData: () => void;
}

export const useStaking = (
  contractAddress: `0x${string}`,
): UseStakingReturn => {
  const { address, isConnected } = useConnection();

  const { mutateAsync: writeContractAsync, isPending: isWritePending } =
    useWriteContract();

  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);
  const [isWriting, setIsWriting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const { data: stakedBalance, refetch: refetchBalance } = useReadContract({
    address: contractAddress,
    abi: STAKING_ABI,
    functionName: "stakes",
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && Boolean(address),
    },
  });

  const { data: earnedRewards, refetch: refetchRewards } = useReadContract({
    address: contractAddress,
    abi: STAKING_ABI,
    functionName: "rewards",
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && Boolean(address),
    },
  });

  const { data: contractBalance, refetch: refetchContractBalance } =
    useReadContract({
      address: contractAddress,
      abi: STAKING_ABI,
      functionName: "getContractBalance",
      query: {
        enabled: isConnected,
      },
    });

  const {
    isPending: isReceiptPending,
    isSuccess: isConfirmed,
    isError: isReceiptError,
  } = useWaitForTransactionReceipt({
    hash: txHash,
    query: {
      enabled: Boolean(txHash),
    },
  });

  const isConfirming = Boolean(txHash) && isReceiptPending;
  const isLoading = isWriting || isWritePending || isConfirming;

  const handleError = useCallback((err: unknown) => {
    if (err instanceof BaseError) {
      const isRejected = err.walk(
        (error) => error instanceof UserRejectedRequestError,
      );

      if (isRejected) {
        setLocalError("Transaction rejected by the user.");
        return;
      }

      if (err.message.toLowerCase().includes("insufficient funds")) {
        setLocalError("Insufficient funds for the transaction.");
        return;
      }
    }

    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";

    if (errorMessage.includes("No funds to withdraw")) {
      setLocalError("No funds available to withdraw.");
    } else if (errorMessage.includes("No rewards available")) {
      setLocalError("No rewards available to claim.");
    } else if (
      errorMessage.includes("Contract has insufficient reward funds")
    ) {
      setLocalError("The contract does not have enough ETH to pay rewards.");
    } else if (
      errorMessage.includes("Stake amount must be greater than zero")
    ) {
      setLocalError("Stake amount must be greater than zero.");
    } else if (
      errorMessage.includes("Funding amount must be greater than zero")
    ) {
      setLocalError("Reward funding amount must be greater than zero.");
    } else {
      setLocalError("An error occurred during the transaction.");
    }
  }, []);

  const refetchData = useCallback(() => {
    refetchBalance();
    refetchRewards();
    refetchContractBalance();
  }, [refetchBalance, refetchRewards, refetchContractBalance]);

  useEffect(() => {
    if (isConfirmed) {
      refetchData();
    }
  }, [isConfirmed, refetchData]);

  const executeTransaction = useCallback(
    async (action: () => Promise<`0x${string}`>) => {
      setIsWriting(true);
      setLocalError(null);
      setTxHash(undefined);

      try {
        const hash = await action();
        setTxHash(hash);
      } catch (err) {
        handleError(err);
      } finally {
        setIsWriting(false);
      }
    },
    [handleError],
  );

  const stake = useCallback(
    async (amountEth: string) => {
      if (!isConnected || !address) {
        setLocalError("Please connect your wallet first.");
        return;
      }

      if (
        !amountEth ||
        Number.isNaN(Number(amountEth)) ||
        Number(amountEth) <= 0
      ) {
        setLocalError("Invalid deposit amount.");
        return;
      }

      await executeTransaction(() =>
        writeContractAsync({
          address: contractAddress,
          abi: STAKING_ABI,
          functionName: "stake",
          value: parseEther(amountEth),
        }),
      );
    },
    [
      address,
      contractAddress,
      executeTransaction,
      isConnected,
      writeContractAsync,
    ],
  );

  const withdraw = useCallback(async () => {
    if (!isConnected || !address) {
      setLocalError("Please connect your wallet first.");
      return;
    }

    if (!stakedBalance || stakedBalance === 0n) {
      setLocalError("No funds available to withdraw.");
      return;
    }

    await executeTransaction(() =>
      writeContractAsync({
        address: contractAddress,
        abi: STAKING_ABI,
        functionName: "withdraw",
      }),
    );
  }, [
    address,
    contractAddress,
    executeTransaction,
    isConnected,
    stakedBalance,
    writeContractAsync,
  ]);

  const claimReward = useCallback(async () => {
    if (!isConnected || !address) {
      setLocalError("Please connect your wallet first.");
      return;
    }

    if (!earnedRewards || earnedRewards === 0n) {
      setLocalError("No rewards available to claim.");
      return;
    }

    if (!contractBalance || contractBalance < earnedRewards) {
      setLocalError("The contract does not have enough ETH to pay rewards.");
      return;
    }

    await executeTransaction(() =>
      writeContractAsync({
        address: contractAddress,
        abi: STAKING_ABI,
        functionName: "claimReward",
      }),
    );
  }, [
    address,
    contractAddress,
    contractBalance,
    earnedRewards,
    executeTransaction,
    isConnected,
    writeContractAsync,
  ]);

  const fundRewards = useCallback(
    async (amountEth: string) => {
      if (!isConnected || !address) {
        setLocalError("Please connect your wallet first.");
        return;
      }

      if (
        !amountEth ||
        Number.isNaN(Number(amountEth)) ||
        Number(amountEth) <= 0
      ) {
        setLocalError("Invalid reward funding amount.");
        return;
      }

      await executeTransaction(() =>
        writeContractAsync({
          address: contractAddress,
          abi: STAKING_ABI,
          functionName: "fundRewards",
          value: parseEther(amountEth),
        }),
      );
    },
    [
      address,
      contractAddress,
      executeTransaction,
      isConnected,
      writeContractAsync,
    ],
  );

  const error = isReceiptError ? "Transaction reverted on-chain." : localError;

  return {
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
    refetchData,
  };
};
