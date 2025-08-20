import { http, createConfig } from 'wagmi';
import { polygonAmoy } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

export const config = createConfig({
  chains: [polygonAmoy],
  connectors: [injected()],
  ssr: true,
  transports: {
    [polygonAmoy.id]: http(),
  },
});

export const contractAddress = '0x9cA5179B5f5023e09E6646584A3b029CE284a455';
