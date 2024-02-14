"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import {
  ChainId,
  InterestRate,
  Pool,
  PoolBundle,
  UiIncentiveDataProvider,
  UiPoolDataProvider,
} from "@aave/contract-helpers"
import {
  formatReserves,
  formatUserSummaryAndIncentives,
} from "@aave/math-utils"
import { AaveV3Fuji, AaveV3Sepolia } from "@bgd-labs/aave-address-book"
import * as markets from "@bgd-labs/aave-address-book"
import {
  AAWrapProvider,
  SendTransactionMode,
  SmartAccount,
} from "@particle-network/aa"
import { Avalanche, AvalancheTestnet } from "@particle-network/chains"
import { useAccountInfo } from "@particle-network/connect-react-ui"
import dayjs from "dayjs"
import { ethers } from "ethers"
import { parseUnits } from "ethers/lib/utils"
import { Activity, CreditCard, DollarSign, Users } from "lucide-react"
import { toast } from "react-toastify"

import { buttonVariants } from "@/components/ui/button"
import BarChart from "@/components/BarChart"
import Card, { CardContent, CardProps } from "@/components/Card"
import DebtPositionsCard, {
  DebtPositionsProps,
} from "@/components/DebtPostionsCard"
import PageTitle from "@/components/PageTitle"
import BorrowCard from "@/components/payments/BorrowCard"
import RepayCard from "@/components/payments/RepayCard"
import SupplyCard from "@/components/payments/SupplyCard"

export default function Home() {
  const { particleProvider, account } = useAccountInfo()
  const [userDetails, setUserDetails] = useState<any>()
  const [aaveprotocol, setAaveprotocol] = useState<any>(AaveV3Fuji)
  const [customProvider, setCustomProvider] = useState<any>()
  const [address, setAddress] = useState<string>()
  const [balance, setBalance] = useState<string>()
  const [smartAccount, setSmartAccount] = useState<any>()

  useEffect(() => {
    if (particleProvider && account) {
      // @ts-ignore
      const smartAccount = new SmartAccount(particleProvider, {
        projectId: process.env.NEXT_PUBLIC_PROJECT_ID || "",
        clientKey: process.env.NEXT_PUBLIC_CLIENT_KEY || "",
        appId: process.env.NEXT_PUBLIC_APP_ID || "",
        aaOptions: {
          accountContracts: {
            // 'BICONOMY', 'CYBERCONNECT', 'SIMPLE'
            BICONOMY: [
              {
                version: "1.0.0",
                chainIds: [AvalancheTestnet.id],
              },
              {
                version: "2.0.0",
                chainIds: AvalancheTestnet.id,
              },
            ],
            CYBERCONNECT: [
              {
                version: "1.0.0",
                chainIds: AvalancheTestnet.id,
              },
            ],
            SIMPLE: [
              {
                version: "1.0.0",
                chainIds: AvalancheTestnet.id,
              },
            ],
          },
          paymasterApiKeys: [
            {
              // Optional
              chainId: 1,
              apiKey: "Biconomy Paymaster API Key",
            },
          ],
        },
      })
      setSmartAccount(smartAccount)
      const wrappedProvider = new ethers.providers.Web3Provider(
        new AAWrapProvider(smartAccount, SendTransactionMode.Gasless),
        "any"
      )
      setCustomProvider(wrappedProvider)

      const fetchBalance = async () => {
        const address = await smartAccount.getAddress();
        setAddress(address);
        if(customProvider) {
          const balanceResponse = await customProvider.getBalance(address);
          setBalance(ethers.utils.formatEther(balanceResponse));
        }
      }

      fetchBalance()
    }
  }, [particleProvider, account])

  const SideNavbarNoSSR = dynamic(() => import("../../components/SideNavbar"), {
    ssr: false,
  })

  useEffect(() => {
    if (particleProvider && account) {
      const provider = new ethers.providers.Web3Provider(
              // @ts-ignore
        particleProvider,
        "any"
      )

      ;(async () => {
        try {
          const chainName = await provider.getNetwork()
          const chainid = chainName.chainId
          if (chainid == 11155111) {
            setAaveprotocol(AaveV3Sepolia)
          }

          const poolDataProviderContract = new UiPoolDataProvider({
            uiPoolDataProviderAddress: aaveprotocol.UI_POOL_DATA_PROVIDER,
            provider: provider,
            chainId: chainid,
          })

          const incentiveDataProviderContract = new UiIncentiveDataProvider({
            uiIncentiveDataProviderAddress:
              aaveprotocol.UI_INCENTIVE_DATA_PROVIDER,
            provider: provider,
            chainId: chainid,
          })

          // Fetch data using the contracts
          const reserves = await poolDataProviderContract.getReservesHumanized({
            lendingPoolAddressProvider: aaveprotocol.POOL_ADDRESSES_PROVIDER,
          })

          const userReserves =
            await poolDataProviderContract.getUserReservesHumanized({
              lendingPoolAddressProvider: aaveprotocol.POOL_ADDRESSES_PROVIDER,
              user: account,
            })

          // Process and display data as needed...
          // Array of incentive tokens with price feed and emission APR
          const reserveIncentives =
            await incentiveDataProviderContract.getReservesIncentivesDataHumanized(
              {
                lendingPoolAddressProvider:
                  aaveprotocol.POOL_ADDRESSES_PROVIDER,
              }
            )

          // Dictionary of claimable user incentives
          const userIncentives =
            await incentiveDataProviderContract.getUserReservesIncentivesDataHumanized(
              {
                lendingPoolAddressProvider:
                  aaveprotocol.POOL_ADDRESSES_PROVIDER,
                user: account,
              }
            )

          console.log({
            reserves,
            userReserves,
            reserveIncentives,
            userIncentives,
          })

          const reservesArray = reserves.reservesData
          const baseCurrencyData = reserves.baseCurrencyData
          const userReservesArray = userReserves.userReserves

          const currentTimestamp = dayjs().unix()

          const formattedPoolReserves = formatReserves({
            reserves: reservesArray,
            currentTimestamp,
            marketReferenceCurrencyDecimals:
              baseCurrencyData.marketReferenceCurrencyDecimals,
            marketReferencePriceInUsd:
              baseCurrencyData.marketReferenceCurrencyPriceInUsd,
          })

          const userSummary = formatUserSummaryAndIncentives({
            currentTimestamp,
            marketReferencePriceInUsd:
              baseCurrencyData.marketReferenceCurrencyPriceInUsd,
            marketReferenceCurrencyDecimals:
              baseCurrencyData.marketReferenceCurrencyDecimals,
            userReserves: userReservesArray,
            formattedReserves: formattedPoolReserves,
            userEmodeCategoryId: userReserves.userEmodeCategoryId,
            reserveIncentives,
            userIncentives,
          });
          setUserDetails(userSummary)
        } catch (error) {
          console.error("Failed to fetch contract data:", error)
          // Handle errors, e.g., show an error message to the user
        }
      })()
    }
  }, [particleProvider, account])

  return (
    <>
      <div className="flex">
        <SideNavbarNoSSR />
        <div className="flex flex-col gap-5  w-full p-4 my-16">
          <PageTitle title="AAVE Management" />
          {/* @ts-ignore */}
          {address && (
            <CardContent>
              <div>SmartAccount Address</div>
              {address}
              <div>{balance}</div>
              </CardContent>
          )}
          <section className="grid grid-cols-1  gap-4 transition-all lg:grid-cols-2">
          {
              smartAccount ? (
                <>
                  <SupplyCard
                    aaprovider={customProvider}
                    smartAccount={smartAccount}
                  />
                  <BorrowCard
                    aaprovider={customProvider}
                    smartAccount={smartAccount}
                  />
                  <RepayCard
                    aaprovider={customProvider}
                    smartAccount={smartAccount}
                  />
                </>
              ) : (
                <div>Loading</div>
              )
            }
          </section>
        </div>
      </div>
    </>
  )
}
