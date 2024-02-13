"use client";

import PageTitle from "@/components/PageTitle";
import Image from "next/image";
import { DollarSign, Users, CreditCard, Activity } from "lucide-react";
import Card, { CardContent, CardProps } from "@/components/Card";
import BarChart from "@/components/BarChart";
import DebtPositionsCard, { DebtPositionsProps } from "@/components/DebtPostionsCard";
import SideNavbar from "@/components/SideNavbar";
import { Button } from "@/components/ui/button";
import { useAccountInfo } from "@particle-network/connect-react-ui";
import { DeployLPSC } from "@/components/deploy/deploylpsc";
import { DeployVault } from "@/components/deploy/deployvault";
import { useState } from "react";
import { Input } from "@/components/ui/input";

const uesrDebtPositionsData: DebtPositionsProps[] = [
  {
    name: "AAVE V3",
    saleAmount: "+$1,999.00"
  },
];

export default function Home() {

    const { account, particleProvider } = useAccountInfo();
    const [vaultaddr,setVaultaddr] = useState();

    const deployvault = async () => {
        const vault = await DeployVault(particleProvider);
        console.log(vault);
    }

    const deploylpsc = async () => {
        const ans = await DeployLPSC({ routeraddr: '0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59', vaultaddr: '0x70A185DC70Be79c9717543CC48aB9AbCd8E84Bbf' } , particleProvider);
        console.log("Ans", ans);
    }

    const handleAddressChange = (event : any) => {
        setVaultaddr(event.target.value);
    };
  return (
    <>
     <div className="flex">
    <SideNavbar />
    <div className="flex flex-col gap-5  w-full p-4">
      <PageTitle title="Deployments" />
      <section className="grid grid-cols-1  gap-4 transition-all lg:grid-cols-3">
      <CardContent>
          <p className="p-4 font-semibold">Deploy a Vault Contract</p>

            <Button onClick={deployvault}>Deploy Vault</Button>
        </CardContent>

        <CardContent>
          <p className="p-4 font-semibold">Deploy LiquidityPosition Protector Contract on Source Chain</p>

            <Input placeholder="enter vault address" onChange={handleAddressChange} />
            <Button onClick={deploylpsc}>Deploy LPSC</Button>
        </CardContent>
        <CardContent>
          <p className="p-4 font-semibold">Deploy Monitor AAVEV3 Position Contract</p>

            <Button>Deploy MonitorAAVEV3 Contract</Button>
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
