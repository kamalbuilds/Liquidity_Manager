"use client"
import PageTitle from "@/components/PageTitle";
import Image from "next/image";
import { DollarSign, Users, CreditCard, Activity } from "lucide-react";
import Card, { CardContent, CardProps } from "@/components/Card";
import BarChart from "@/components/BarChart";
import DebtPositionsCard, { DebtPositionsProps } from "@/components/DebtPostionsCard";
import SideNavbar from "@/components/SideNavbar";

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


const cardData: CardProps[] = [
  {
    label: "Total Debt Positions",
    amount: "$1000",
    discription: "+20.1% from last month",
    icon: DollarSign
  },
  {
    label: "Number of Chains",
    amount: "3",
    discription: "+180.1% from last month",
    icon: Users
  },
  {
    label: "Number of Protocols",
    amount: "+4",
    discription: "+19% from last month",
    icon: CreditCard
  },
  {
    label: "Active Debt Positions Now",
    amount: "4",
    discription: "+1 since last month",
    icon: Activity
  }
];

const uesrDebtPositionsData: DebtPositionsProps[] = [
  {
    name: "AAVE V3",
    saleAmount: "+$1,999.00"
  },
];

export default function Home() {

  const { particleProvider, account } = useAccountInfo();
  const [userDetails, setUserDetails] = useState<any>();
  const [aaveprotocol , setAaveprotocol] = useState<any>(AaveV3Fuji);

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
    <SideNavbar />
    <div className="flex flex-col gap-5  w-full p-4">
      <PageTitle title="Dashboard" />
      <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4">
        {cardData.map((d, i) => (
          <Card
            key={i}
            amount={d.amount}
            discription={d.discription}
            icon={d.icon}
            label={d.label}
          />
        ))}
      </section>
      <section className="grid grid-cols-1  gap-4 transition-all lg:grid-cols-2">
        <CardContent>
          <p className="p-4 font-semibold">Overview</p>

          <BarChart />
        </CardContent>
        <CardContent className="flex justify-between gap-4">
          <section>
            <p>Recent Debt Position Opened</p>
            <p className="text-sm text-gray-400">
              You made 4 positions this month.
            </p>
          </section>
          {uesrDebtPositionsData.map((d, i) => (
            <DebtPositionsCard
              key={i}
              name={d.name}
              saleAmount={d.saleAmount}
            />
          ))}
        </CardContent>

        {/*  */}
      </section>
    </div>
</div>
    </>
  );
}
