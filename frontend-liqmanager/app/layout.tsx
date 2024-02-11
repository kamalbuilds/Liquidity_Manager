"use client";
import "@/styles/globals.css"

import { siteConfig } from "@/config/site"
import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { SiteHeader } from "@/components/site-header"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"
import { AvalancheTestnet, Avalanche } from '@particle-network/chains';
import { WalletEntryPosition } from '@particle-network/auth';
import { evmWallets } from '@particle-network/connect';
import { ModalProvider } from '@particle-network/connect-react-ui';

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {

  const particleAuthOptions = {
    projectId: 'f0ee0b90-b5cb-40dc-91f1-595138ba0e88',
    clientKey: 'cgtRr3dUckCXCGgM2srnJiAF9hzmIcJUYjJT3x7iy',
    appId: '0a03e7aa-c9ae-40f2-8869-f0953becd803',
    chains: [
      Avalanche,
      AvalancheTestnet
    ],
    particleWalletEntry: {    //optional: particle wallet config
      displayWalletEntry: true, //display wallet button when connect particle success.
      defaultWalletEntryPosition: WalletEntryPosition.BR,
      supportChains: [
        Avalanche,
        AvalancheTestnet,
      ],
      customStyle: {}, //optional: custom wallet style
    },
    securityAccount: { //optional: particle security account config
      //prompt set payment password. 0: None, 1: Once(default), 2: Always  
      promptSettingWhenSign: 1,
      //prompt set master password. 0: None(default), 1: Once, 2: Always
      promptMasterPasswordSettingWhenLogin: 1
    },
    wallets: evmWallets({
      projectId: 'walletconnect projectId', //replace with walletconnect projectId
      showQrModal: false
    }),
  }


  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <ModalProvider options={particleAuthOptions}>
              <>
                <div className="relative flex min-h-screen flex-col">
                  <SiteHeader />
                  <div className="flex-1">{children}</div>
                </div>
                <TailwindIndicator />
              </>
            </ModalProvider>
          </ThemeProvider>
        </body>
      </html>
    </>
  )
}
