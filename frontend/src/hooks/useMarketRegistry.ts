import { useWriteContract, useReadContract } from "wagmi";
import { MARKET_REGISTRY_ADDRESS } from "@/lib/contracts/addresses";
import { parseEther } from "viem";

// Simplified ABI - matches MarketRegistry contract
const MARKET_REGISTRY_ABI = [
  {
    inputs: [
      { name: "metadataURI", type: "string" },
      { name: "basePriceWei", type: "uint256" },
    ],
    name: "registerProvider",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "metadataURI", type: "string" },
      { name: "basePriceWei", type: "uint256" },
      { name: "active", type: "bool" },
    ],
    name: "updateProvider",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getProviders",
    outputs: [
      {
        components: [
          { name: "account", type: "address" },
          { name: "metadataURI", type: "string" },
          { name: "basePriceWei", type: "uint256" },
          { name: "active", type: "bool" },
        ],
        name: "list",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "", type: "address" }],
    name: "providers",
    outputs: [
      { name: "account", type: "address" },
      { name: "metadataURI", type: "string" },
      { name: "basePriceWei", type: "uint256" },
      { name: "active", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export interface Provider {
  account: string;
  metadataURI: string;
  basePriceWei: bigint;
  active: boolean;
}

export function useMarketRegistry() {
  const { writeContractAsync } = useWriteContract();

  /**
   * Register as a provider
   * @param metadataURI IPFS/HTTP URL to provider profile JSON
   * @param basePriceETH Base price per job in ETH
   */
  const registerProvider = async (metadataURI: string, basePriceETH: string) => {
    return await writeContractAsync({
      address: MARKET_REGISTRY_ADDRESS as `0x${string}`,
      abi: MARKET_REGISTRY_ABI,
      functionName: "registerProvider",
      args: [metadataURI, parseEther(basePriceETH)],
    });
  };

  /**
   * Update provider information
   */
  const updateProvider = async (
    metadataURI: string,
    basePriceETH: string,
    active: boolean
  ) => {
    return await writeContractAsync({
      address: MARKET_REGISTRY_ADDRESS as `0x${string}`,
      abi: MARKET_REGISTRY_ABI,
      functionName: "updateProvider",
      args: [metadataURI, parseEther(basePriceETH), active],
    });
  };

  return { registerProvider, updateProvider };
}

/**
 * Get all registered providers
 */
export function useProviderList() {
  const { data, isLoading, refetch } = useReadContract({
    address: MARKET_REGISTRY_ADDRESS as `0x${string}`,
    abi: MARKET_REGISTRY_ABI,
    functionName: "getProviders",
  });

  return {
    providers: (data as Provider[]) || [],
    isLoading,
    refetch,
  };
}

/**
 * Get single provider info
 */
export function useProvider(providerAddress?: string) {
  const { data, isLoading } = useReadContract({
    address: MARKET_REGISTRY_ADDRESS as `0x${string}`,
    abi: MARKET_REGISTRY_ABI,
    functionName: "providers",
    args: providerAddress ? [providerAddress as `0x${string}`] : undefined,
  });

  return {
    provider: data
      ? {
          account: data[0],
          metadataURI: data[1],
          basePriceWei: data[2],
          active: data[3],
        }
      : null,
    isLoading,
  };
}
