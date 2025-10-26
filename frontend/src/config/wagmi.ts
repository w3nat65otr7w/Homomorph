import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Homomorph',
  projectId: 'c8e6f8e3c8e6f8e3c8e6f8e3c8e6f8e3', // Placeholder - Get your own from cloud.walletconnect.com
  chains: [sepolia],
  ssr: false,
});
