"use client";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { Chain, mainnet } from "viem/chains";
import { http, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();
export const localChain: Chain = {
  id: 0x40000,
  name: "Hardhat Local",
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://3d45-1-230-147-237.ngrok-free.app/"], // ✅ 로컬 주소
    },
  },
  blockExplorers: {
    default: { name: "None", url: "" },
  },
  testnet: true,
};
const config = getDefaultConfig({
  appName: "RainbowKit demo22",
  projectId: "aa0d1ef1aedb2c84662541b77f5379f2",
  chains: [localChain] as const,
  transports: {
    [localChain.id]: http(),
  },
});
export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
