"use client"
import PageTitle from "@/components/PageTitle";
import Image from "next/image";
import { DollarSign, Users, CreditCard, Activity } from "lucide-react";
import Card, { CardContent, CardProps } from "@/components/Card";
import BarChart from "@/components/BarChart";
import DebtPositionsCard, { DebtPositionsProps } from "@/components/DebtPostionsCard";
import { ethers } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { useEffect, useState } from "react";
import { InterestRate, Pool, PoolBundle } from "@aave/contract-helpers";
import { AaveV3Fuji , AaveV3Sepolia  } from "@bgd-labs/aave-address-book";
import { buttonVariants } from "@/components/ui/button";
import { toast } from "react-toastify";
import { formatUserSummaryAndIncentives } from '@aave/math-utils';
import dayjs from 'dayjs';
import {
  UiPoolDataProvider,
  UiIncentiveDataProvider,
  ChainId,
} from '@aave/contract-helpers';
import * as markets from '@bgd-labs/aave-address-book';
import { formatReserves } from '@aave/math-utils';
import { useAccountInfo } from "@particle-network/connect-react-ui";
import dynamic from "next/dynamic";
import SupplyCard from "@/components/payments/SupplyCard";
import BorrowCard from "@/components/payments/BorrowCard";
import RepayCard from "@/components/payments/RepayCard";
import { AAWrapProvider, SendTransactionMode, SmartAccount } from '@particle-network/aa';

export default function Home() {

  const { particleProvider, account } = useAccountInfo();
  const [userDetails, setUserDetails] = useState<any>();
  const [aaveprotocol , setAaveprotocol] = useState<any>(AaveV3Fuji);
  const [customProvider, setCustomProvider] = useState<any>();
    const[address,setAddress] = useState<string>();
    const[balance,setBalance] = useState<string>();

  useEffect(() => {
    if (particleProvider && account) {
        // @ts-ignore
      const smartAccount = new SmartAccount(particleProvider, {
        projectId: process.env.NEXT_PUBLIC_PROJECT_ID || "",
        clientKey: process.env.NEXT_PUBLIC_CLIENT_KEY ||  "",
        appId: process.env.NEXT_PUBLIC_APP_ID || "",
        aaOptions: {
          simple: [{ chainId: ChainId.fuji, version: '1.0.0' }] 
        }
      });

      const wrappedProvider = new ethers.providers.Web3Provider(new AAWrapProvider(smartAccount, SendTransactionMode.Gasless), "any");
      setCustomProvider(wrappedProvider);

      const fetchBalance = async () => {
        const address = await smartAccount.getAddress();
        setAddress(address);
        const balanceResponse = await customProvider.getBalance(address);
        setBalance(ethers.utils.formatEther(balanceResponse));
      };

      fetchBalance();
    }
  }, [particleProvider, account]);

  const SideNavbarNoSSR = dynamic(() => import('../../components/SideNavbar'), { ssr: false });



  useEffect(() => {
    if (particleProvider && account) {
        // @ts-ignore
        const provider = new ethers.providers.Web3Provider(particleProvider, "any") ;

      (async () => {
        try {
          const chainName = await provider.getNetwork();
          const chainid = chainName.chainId;
          if(chainid == 11155111 ) {
            setAaveprotocol(AaveV3Sepolia);
          }

          const poolDataProviderContract = new UiPoolDataProvider({
            uiPoolDataProviderAddress: aaveprotocol.UI_POOL_DATA_PROVIDER,
            provider: provider,
            chainId: chainid,
          });

          const incentiveDataProviderContract = new UiIncentiveDataProvider({
            uiIncentiveDataProviderAddress: aaveprotocol.UI_INCENTIVE_DATA_PROVIDER,
            provider: provider,
            chainId: chainid,
          });

          // Fetch data using the contracts
          const reserves = await poolDataProviderContract.getReservesHumanized({
            lendingPoolAddressProvider: aaveprotocol.POOL_ADDRESSES_PROVIDER,
          });

          const userReserves = await poolDataProviderContract.getUserReservesHumanized({
            lendingPoolAddressProvider: aaveprotocol.POOL_ADDRESSES_PROVIDER,
            user: account,
          });

          // Process and display data as needed...
           // Array of incentive tokens with price feed and emission APR
          const reserveIncentives =
          await incentiveDataProviderContract.getReservesIncentivesDataHumanized({
            lendingPoolAddressProvider:
              aaveprotocol.POOL_ADDRESSES_PROVIDER,
          });

    // Dictionary of claimable user incentives
    const userIncentives =
      await incentiveDataProviderContract.getUserReservesIncentivesDataHumanized({
        lendingPoolAddressProvider:
          aaveprotocol.POOL_ADDRESSES_PROVIDER,
          user: account,
      });

    console.log({ reserves, userReserves, reserveIncentives, userIncentives });

    const reservesArray = reserves.reservesData;
    const baseCurrencyData = reserves.baseCurrencyData;
    const userReservesArray = userReserves.userReserves;

    const currentTimestamp = dayjs().unix();

    const formattedPoolReserves = formatReserves({
      reserves: reservesArray,
      currentTimestamp,
      marketReferenceCurrencyDecimals:
        baseCurrencyData.marketReferenceCurrencyDecimals,
      marketReferencePriceInUsd: baseCurrencyData.marketReferenceCurrencyPriceInUsd,
    });

    const userSummary = formatUserSummaryAndIncentives({
      currentTimestamp,
      marketReferencePriceInUsd: baseCurrencyData.marketReferenceCurrencyPriceInUsd,
      marketReferenceCurrencyDecimals:
      baseCurrencyData.marketReferenceCurrencyDecimals,
      userReserves: userReservesArray,
      formattedReserves: formattedPoolReserves,
      userEmodeCategoryId: userReserves.userEmodeCategoryId,
      reserveIncentives,
      userIncentives,
    });

    console.log("userSummary", userSummary);
    setUserDetails(userSummary);
        } catch (error) {
          console.error("Failed to fetch contract data:", error);
          // Handle errors, e.g., show an error message to the user
        }
      })();
    }
  }, [particleProvider, account]);


  return (
    <>
     <div className="flex">
    <SideNavbarNoSSR />
    <div className="flex flex-col gap-5  w-full p-4 my-16">
      <PageTitle title="AAVE Management" />
      <section className="grid grid-cols-1  gap-4 transition-all lg:grid-cols-2">
        <SupplyCard aaprovider={customProvider} account={address}/>
        <BorrowCard aaprovider={customProvider} account={address} />
        <RepayCard aaprovider={customProvider} account={address} />
      </section>
    </div>
</div>
    </>
  );
}
