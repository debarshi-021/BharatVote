import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { polygonAmoy } from "wagmi/chains";

const chains = [polygonAmoy] as const;

export const wagmiConfig = getDefaultConfig({
  appName: "BharatVote",
  projectId: "2c0dca4142539a3083baf970fa503a92",
  chains: chains,
  ssr: true, // For Next.js App Router
});

export { chains };
