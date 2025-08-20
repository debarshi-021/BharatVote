import { createConfig, http } from 'wagmi';
import { polygonAmoy } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

export const config = createConfig({
  chains: [polygonAmoy],
  connectors: [
    injected(),
    walletConnect({ 
      projectId: 'YOUR_PROJECT_ID' // Get from walletconnect.com
    }),
  ],
  transports: {
    [polygonAmoy.id]: http('https://rpc-amoy.polygon.technology'),
  },
});
