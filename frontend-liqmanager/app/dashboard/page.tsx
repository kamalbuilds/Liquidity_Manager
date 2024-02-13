"use client"
import PageTitle from "@/components/PageTitle";
import Image from "next/image";
import { DollarSign, Users, CreditCard, Activity } from "lucide-react";
import Card, { CardContent, CardProps } from "@/components/Card";
import BarChart from "@/components/BarChart";
import DebtPositionsCard, { DebtPositionsProps } from "@/components/DebtPostionsCard";
import SideNavbar from "@/components/SideNavbar";

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
