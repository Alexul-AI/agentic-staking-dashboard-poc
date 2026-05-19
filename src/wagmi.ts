import { createConfig, http } from "wagmi";
import { arbitrum, base, mainnet, polygon, sepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";

export const config = createConfig({
  chains: [sepolia, mainnet, base, polygon, arbitrum],
  connectors: [
    injected({
      target: "metaMask",
    }),
  ],
  transports: {
    [sepolia.id]: http(),
    [mainnet.id]: http(),
    [base.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
  },
});
