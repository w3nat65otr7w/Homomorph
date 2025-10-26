import { useWriteContract, useReadContract, useAccount } from "wagmi";
import { JOB_MANAGER_ADDRESS } from "@/lib/contracts/addresses";
import { parseEther } from "viem";
import { computeCommitment } from "@/lib/fhe";

// Simplified ABI - matches JobManager contract
const JOB_MANAGER_ABI = [
  {
    inputs: [],
    name: "stakeAsProvider",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ name: "amount", type: "uint256" }],
    name: "unstakeProvider",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "inputCommitment", type: "bytes32" },
      { name: "deadline", type: "uint256" },
    ],
    name: "postJob",
    outputs: [{ name: "jobId", type: "uint256" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ name: "jobId", type: "uint256" }],
    name: "acceptJob",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "jobId", type: "uint256" },
      { name: "resultCommitment", type: "bytes32" },
    ],
    name: "submitResult",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "jobId", type: "uint256" }],
    name: "settle",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "", type: "uint256" }],
    name: "jobs",
    outputs: [
      { name: "consumer", type: "address" },
      { name: "provider", type: "address" },
      { name: "priceWei", type: "uint256" },
      { name: "inputCommitment", type: "bytes32" },
      { name: "resultCommitment", type: "bytes32" },
      { name: "submissionTime", type: "uint256" },
      { name: "deadline", type: "uint256" },
      { name: "status", type: "uint8" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "", type: "address" }],
    name: "providerStake",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "", type: "address" }],
    name: "providerReputation",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export function useJobManager() {
  const { writeContractAsync } = useWriteContract();
  const { address } = useAccount();

  /**
   * Provider stakes ETH to be eligible for jobs
   * MIN_STAKE = 0.1 ETH
   */
  const stakeAsProvider = async (amountETH: string) => {
    return await writeContractAsync({
      address: JOB_MANAGER_ADDRESS as `0x${string}`,
      abi: JOB_MANAGER_ABI,
      functionName: "stakeAsProvider",
      value: parseEther(amountETH),
    });
  };

  /**
   * Provider withdraws stake
   */
  const unstakeProvider = async (amountETH: string) => {
    return await writeContractAsync({
      address: JOB_MANAGER_ADDRESS as `0x${string}`,
      abi: JOB_MANAGER_ABI,
      functionName: "unstakeProvider",
      args: [parseEther(amountETH)],
    });
  };

  /**
   * Consumer posts a job with encrypted input commitment
   * inputData will be encrypted and stored in FHEBridge separately
   */
  const postJob = async (inputData: string, deadlineTimestamp: number, paymentETH: string) => {
    // Compute commitment from input data
    const commitment = computeCommitment(inputData);

    return await writeContractAsync({
      address: JOB_MANAGER_ADDRESS as `0x${string}`,
      abi: JOB_MANAGER_ABI,
      functionName: "postJob",
      args: [commitment as `0x${string}`, BigInt(deadlineTimestamp)],
      value: parseEther(paymentETH),
    });
  };

  /**
   * Provider accepts a job
   */
  const acceptJob = async (jobId: number) => {
    return await writeContractAsync({
      address: JOB_MANAGER_ADDRESS as `0x${string}`,
      abi: JOB_MANAGER_ABI,
      functionName: "acceptJob",
      args: [BigInt(jobId)],
    });
  };

  /**
   * Provider submits result commitment
   */
  const submitResult = async (jobId: number, resultData: string) => {
    const commitment = computeCommitment(resultData);

    return await writeContractAsync({
      address: JOB_MANAGER_ADDRESS as `0x${string}`,
      abi: JOB_MANAGER_ABI,
      functionName: "submitResult",
      args: [BigInt(jobId), commitment as `0x${string}`],
    });
  };

  /**
   * Consumer settles payment to provider
   */
  const settle = async (jobId: number) => {
    return await writeContractAsync({
      address: JOB_MANAGER_ADDRESS as `0x${string}`,
      abi: JOB_MANAGER_ABI,
      functionName: "settle",
      args: [BigInt(jobId)],
    });
  };

  return {
    stakeAsProvider,
    unstakeProvider,
    postJob,
    acceptJob,
    submitResult,
    settle,
  };
}

/**
 * Read job details
 */
export function useJob(jobId: number) {
  const { data, isLoading, refetch } = useReadContract({
    address: JOB_MANAGER_ADDRESS as `0x${string}`,
    abi: JOB_MANAGER_ABI,
    functionName: "jobs",
    args: [BigInt(jobId)],
  });

  return {
    job: data
      ? {
          consumer: data[0],
          provider: data[1],
          priceWei: data[2],
          inputCommitment: data[3],
          resultCommitment: data[4],
          submissionTime: data[5],
          deadline: data[6],
          status: data[7],
        }
      : null,
    isLoading,
    refetch,
  };
}

/**
 * Read provider stake
 */
export function useProviderStake(providerAddress?: string) {
  const { address } = useAccount();
  const targetAddress = providerAddress || address;

  const { data, isLoading } = useReadContract({
    address: JOB_MANAGER_ADDRESS as `0x${string}`,
    abi: JOB_MANAGER_ABI,
    functionName: "providerStake",
    args: targetAddress ? [targetAddress as `0x${string}`] : undefined,
  });

  return { stake: data || BigInt(0), isLoading };
}

/**
 * Read provider reputation
 */
export function useProviderReputation(providerAddress?: string) {
  const { address } = useAccount();
  const targetAddress = providerAddress || address;

  const { data, isLoading } = useReadContract({
    address: JOB_MANAGER_ADDRESS as `0x${string}`,
    abi: JOB_MANAGER_ABI,
    functionName: "providerReputation",
    args: targetAddress ? [targetAddress as `0x${string}`] : undefined,
  });

  return { reputation: data || BigInt(0), isLoading };
}
