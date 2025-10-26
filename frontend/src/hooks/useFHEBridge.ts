import { useWriteContract, useReadContract, useAccount } from "wagmi";
import { FHE_BRIDGE_ADDRESS } from "@/lib/contracts/addresses";
import { encryptUint32 } from "@/lib/fhe";
import { keccak256, toBytes } from "viem";

// Simplified ABI - matches FHEBridge contract
const FHE_BRIDGE_ABI = [
  {
    inputs: [
      { name: "jobId", type: "uint256" },
      { name: "encryptedData", type: "bytes32" }, // externalEuint32 handle
      { name: "proof", type: "bytes" },
    ],
    name: "submitEncryptedInput",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "jobId", type: "uint256" },
      { name: "provider", type: "address" },
    ],
    name: "grantAccessToInput",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "jobId", type: "uint256" },
      { name: "provider", type: "address" },
    ],
    name: "revokeAccessToInput",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "jobId", type: "uint256" },
      { name: "encryptedResult", type: "bytes32" }, // externalEuint32 handle
      { name: "proof", type: "bytes" },
      { name: "proofHash", type: "bytes32" },
    ],
    name: "submitEncryptedResult",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "jobId", type: "uint256" }],
    name: "requestResultDecryption",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "", type: "uint256" }],
    name: "results",
    outputs: [
      { name: "provider", type: "address" },
      { name: "timestamp", type: "uint256" },
      { name: "proofHash", type: "bytes32" },
      { name: "decrypted", type: "bool" },
      { name: "decryptedValue", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export function useFHEBridge() {
  const { writeContractAsync } = useWriteContract();
  const { address } = useAccount();

  /**
   * Consumer submits encrypted input data
   * @param jobId Job ID from JobManager
   * @param data Raw uint32 number to encrypt
   */
  const submitEncryptedInput = async (jobId: number, data: number) => {
    if (!address) throw new Error("Wallet not connected");

    // Encrypt data with FHE SDK
    const { handle, proof } = await encryptUint32(
      data,
      FHE_BRIDGE_ADDRESS,
      address
    );

    // Submit to contract
    return await writeContractAsync({
      address: FHE_BRIDGE_ADDRESS as `0x${string}`,
      abi: FHE_BRIDGE_ABI,
      functionName: "submitEncryptedInput",
      args: [BigInt(jobId), handle as `0x${string}`, proof as `0x${string}`],
    });
  };

  /**
   * Consumer grants provider access to encrypted input
   */
  const grantAccessToInput = async (jobId: number, providerAddress: string) => {
    return await writeContractAsync({
      address: FHE_BRIDGE_ADDRESS as `0x${string}`,
      abi: FHE_BRIDGE_ABI,
      functionName: "grantAccessToInput",
      args: [BigInt(jobId), providerAddress as `0x${string}`],
    });
  };

  /**
   * Consumer revokes provider access
   */
  const revokeAccessToInput = async (jobId: number, providerAddress: string) => {
    return await writeContractAsync({
      address: FHE_BRIDGE_ADDRESS as `0x${string}`,
      abi: FHE_BRIDGE_ABI,
      functionName: "revokeAccessToInput",
      args: [BigInt(jobId), providerAddress as `0x${string}`],
    });
  };

  /**
   * Provider submits encrypted result
   * @param jobId Job ID
   * @param resultData Raw uint32 result to encrypt
   * @param proofData Computation proof (arbitrary string)
   */
  const submitEncryptedResult = async (
    jobId: number,
    resultData: number,
    proofData: string
  ) => {
    if (!address) throw new Error("Wallet not connected");

    // Encrypt result with FHE SDK
    const { handle, proof } = await encryptUint32(
      resultData,
      FHE_BRIDGE_ADDRESS,
      address
    );

    // Compute proof hash
    const proofHash = keccak256(toBytes(proofData));

    // Submit to contract
    return await writeContractAsync({
      address: FHE_BRIDGE_ADDRESS as `0x${string}`,
      abi: FHE_BRIDGE_ABI,
      functionName: "submitEncryptedResult",
      args: [
        BigInt(jobId),
        handle as `0x${string}`,
        proof as `0x${string}`,
        proofHash,
      ],
    });
  };

  /**
   * Consumer requests Gateway decryption of result
   */
  const requestResultDecryption = async (jobId: number) => {
    return await writeContractAsync({
      address: FHE_BRIDGE_ADDRESS as `0x${string}`,
      abi: FHE_BRIDGE_ABI,
      functionName: "requestResultDecryption",
      args: [BigInt(jobId)],
    });
  };

  return {
    submitEncryptedInput,
    grantAccessToInput,
    revokeAccessToInput,
    submitEncryptedResult,
    requestResultDecryption,
  };
}

/**
 * Read encrypted result status
 */
export function useEncryptedResult(jobId: number) {
  const { data, isLoading, refetch } = useReadContract({
    address: FHE_BRIDGE_ADDRESS as `0x${string}`,
    abi: FHE_BRIDGE_ABI,
    functionName: "results",
    args: [BigInt(jobId)],
  });

  return {
    result: data
      ? {
          provider: data[0],
          timestamp: data[1],
          proofHash: data[2],
          decrypted: data[3],
          decryptedValue: data[4],
        }
      : null,
    isLoading,
    refetch,
  };
}
