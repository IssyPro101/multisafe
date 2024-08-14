"use client";
import { foundry } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, createConfig, http } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import Navbar from "@/components/mainComponent/navigation/navbar";
import Footer from "@/components/mainComponent/navigation/footer";
import { Layout, ConfigProvider, theme } from "antd";
import { useServerInsertedHTML } from 'next/navigation';
import { StyleProvider, createCache, extractStyle } from '@ant-design/cssinjs';
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { FoundryChainTestnet } from "@thirdweb-dev/chains";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import Chain from "connectkit/build/components/Common/Chain";

const chains = [foundry];

const config = createConfig(
  getDefaultConfig({
    // @ts-ignore
    chains,
    transports: {
      [foundry.id]: http(foundry.rpcUrls.default.http[0]), // or your own RPC url
    },
    ssr: true
  })
);

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const { darkAlgorithm } = theme;

  return (
    <html lang="en">

      <ConfigProvider
        theme={{
          algorithm: darkAlgorithm
        }}
      >


        <QueryClientProvider client={queryClient}>
          <WagmiProvider config={config}>
            <ConnectKitProvider mode="dark">

              <ThirdwebProvider
                clientId="03bf55fe8b1a940b7474a736f1d3fc61" // You can get a client id from dashboard settings
                activeChain={FoundryChainTestnet}>

                <body>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <Navbar />
                    <AntdRegistry>

                      <div style={{ flexGrow: 1 }}>{children}</div>

                    </AntdRegistry>
                    <Footer />
                  </div>
                </body>

              </ThirdwebProvider>

            </ConnectKitProvider>
          </WagmiProvider>
        </QueryClientProvider>


      </ConfigProvider>

    </html>
  );
}
