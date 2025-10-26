import { hexlify, getAddress } from "ethers";
import { keccak256, toBytes } from "viem";

declare global {
  interface Window {
    relayerSDK?: {
      initSDK: () => Promise<void>;
      createInstance: (config: Record<string, unknown>) => Promise<any>;
      SepoliaConfig: Record<string, unknown>;
    };
    ethereum?: any;
  }
}

let fheInstance: any = null;
let sdkPromise: Promise<any> | null = null;

const SDK_URL = 'https://cdn.zama.ai/relayer-sdk-js/0.2.0/relayer-sdk-js.js';

const loadSdk = async (): Promise<any> => {
  if (typeof window === 'undefined') {
    throw new Error('FHE SDK requires browser environment');
  }

  if (window.relayerSDK) {
    return window.relayerSDK;
  }

  if (!sdkPromise) {
    sdkPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${SDK_URL}"]`) as HTMLScriptElement | null;
      if (existing) {
        existing.addEventListener('load', () => resolve(window.relayerSDK));
        existing.addEventListener('error', () => reject(new Error('Failed to load FHE SDK')));
        return;
      }

      const script = document.createElement('script');
      script.src = SDK_URL;
      script.async = true;
      script.onload = () => {
        if (window.relayerSDK) {
          resolve(window.relayerSDK);
        } else {
          reject(new Error('relayerSDK unavailable after load'));
        }
      };
      script.onerror = () => reject(new Error('Failed to load FHE SDK'));
      document.body.appendChild(script);
    });
  }

  return sdkPromise;
};

export async function initializeFHE(provider?: any): Promise<any> {
  if (fheInstance) {
    return fheInstance;
  }

  if (typeof window === 'undefined') {
    throw new Error('FHE SDK requires browser environment');
  }

  // Get Ethereum provider from multiple sources
  // Priority: passed provider > window.ethereum > window.okxwallet > window.coinbaseWalletExtension
  const ethereumProvider = provider ||
    window.ethereum ||
    (window as any).okxwallet?.provider ||
    (window as any).okxwallet ||
    (window as any).coinbaseWalletExtension;

  if (!ethereumProvider) {
    throw new Error('Ethereum provider not found. Please connect your wallet first.');
  }

  console.log('🔌 Using Ethereum provider:', {
    isOKX: !!(window as any).okxwallet,
    isMetaMask: !!(window.ethereum as any)?.isMetaMask,
    provider: ethereumProvider
  });

  const sdk = await loadSdk();
  if (!sdk) {
    throw new Error('FHE SDK not available');
  }

  await sdk.initSDK();

  // Use the built-in SepoliaConfig from the SDK
  const config = {
    ...sdk.SepoliaConfig,
    network: ethereumProvider,
  };

  fheInstance = await sdk.createInstance(config);
  return fheInstance;
}

/**
 * Encrypt uint32 data - contract expects externalEuint32
 * Returns handle and proof for FHEBridge.submitEncryptedInput
 */
export async function encryptUint32(
  data: number,
  contractAddress: string,
  userAddress: string
): Promise<{ handle: string; proof: string }> {
  const fhe = await initializeFHE();
  const checksumAddress = getAddress(contractAddress);
  const input = fhe.createEncryptedInput(checksumAddress, userAddress);
  input.add32(data);

  const { handles, inputProof } = await input.encrypt();

  return {
    handle: hexlify(handles[0]),
    proof: hexlify(inputProof),
  };
}

/**
 * Encrypt string data as bytes - converts string to numeric representation
 * For Computation Data encryption
 */
export async function encryptComputationData(
  data: string,
  contractAddress: string,
  userAddress: string,
  provider?: any
): Promise<{ handle: string; proof: string; numericValue: number }> {
  const fhe = await initializeFHE(provider);
  const checksumAddress = getAddress(contractAddress);

  // Convert string to numeric value for FHE encryption
  // Method 1: Use first 4 bytes of keccak256 hash
  const dataHash = keccak256(toBytes(data));
  const numericValue = parseInt(dataHash.slice(0, 10), 16); // First 4 bytes as uint32

  // Method 2 alternative: Parse as number if it's numeric
  // const numericValue = parseInt(data) || parseInt(dataHash.slice(0, 10), 16);

  const input = fhe.createEncryptedInput(checksumAddress, userAddress);
  input.add32(numericValue);

  const { handles, inputProof } = await input.encrypt();

  return {
    handle: hexlify(handles[0]),
    proof: hexlify(inputProof),
    numericValue, // Return for reference
  };
}

/**
 * Compute hash commitment for JobManager (bytes32)
 * Uses proper keccak256 hashing
 */
export function computeCommitment(data: string): string {
  return keccak256(toBytes(data));
}
