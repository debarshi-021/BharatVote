import { http, createConfig } from 'wagmi';
import { polygonMumbai } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';
import BharatVoteABI from '../../contracts/BharatVote.json';

export const config = createConfig({
  chains: [polygonMumbai],
  connectors: [injected()],
  ssr: true,
  transports: {
    [polygonMumbai.id]: http(),
  },
});

export const contractConfig = {
  address: '0x9cA5179B5f5023e09E6646584A3b029CE284a455',
  abi: BharatVoteABI.abi,
} as const;
