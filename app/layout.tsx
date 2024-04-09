"use client";
import { foundry } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, createConfig, http } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import Navbar from "@/components/mainComponent/navigation/navbar";
import Footer from "@/components/mainComponent/navigation/footer";

const chains = [foundry];

const config = createConfig(
  getDefaultConfig({
    chains,
    transports: {
      [foundry.id]: http(foundry.rpcUrls.default.http[0]), // or your own RPC url
    }
  })
);

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <ConnectKitProvider mode="dark">
            <body>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <Navbar />
                <div style={{ flexGrow: 1 }}>{children}</div>
                <Footer />
              </div>
            </body>
          </ConnectKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </html>
  );
}
