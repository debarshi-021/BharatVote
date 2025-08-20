import { configureChains, createConfig } from 'wagmi';
import { polygonAmoy } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { getDefaultWallets } from '@rainbow-me/rainbowkit';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [polygonAmoy],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'BharatVote',
  projectId: 'YOUR_PROJECT_ID', // Get from walletconnect.com
  chains,
});

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

export { chains };
