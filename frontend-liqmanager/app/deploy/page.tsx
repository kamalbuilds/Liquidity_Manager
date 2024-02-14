"use client";

import PageTitle from "@/components/PageTitle";
import Image from "next/image";
import { DollarSign, Users, CreditCard, Activity } from "lucide-react";
import Card, { CardContent, CardProps } from "@/components/Card";
import BarChart from "@/components/BarChart";
import DebtPositionsCard, { DebtPositionsProps } from "@/components/DebtPostionsCard";
import { Button } from "@/components/ui/button";
import { useAccountInfo, useConnectId, useParticleProvider } from "@particle-network/connect-react-ui";
import { DeployLPSC } from "@/components/deploy/deploylpsc";
import { DeployVault } from "@/components/deploy/deployvault";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ethers } from "ethers";
import { networkConstants } from "../../constants";
import dynamic from "next/dynamic";

const uesrDebtPositionsData: DebtPositionsProps[] = [
  {
    name: "AAVE V3",
    saleAmount: "+$1,999.00"
  },
];

export default function Home() {

    const { account, particleProvider } = useAccountInfo();
    const [vaultaddr,setVaultaddr] = useState();
    const[routeraddr,setRouteraddr] = useState('0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59');

    console.log(particleProvider,"provider");

    if(particleProvider){
        //@ts-ignore
        async function getchainname (){
             //@ts-ignore
            const ethersProvider = new ethers.providers.Web3Provider(particleProvider, "any");
            console.log(ethersProvider, ethersProvider._network)
            const chainName = await ethersProvider.getNetwork();
            console.log(chainName);
            //@ts-ignore
            const chainInfo = networkConstants[chainName.chainId];
            setRouteraddr(chainInfo.router);
        }
        getchainname();
    }   



    const deployvault = async () => {
        const vault = await DeployVault(particleProvider);
        console.log(vault);
    }

    const deploylpsc = async () => {
        const ans = await DeployLPSC({ routeraddr: routeraddr, vaultaddr: vaultaddr! } , particleProvider);
        console.log("Ans", ans);
    }

    const handleAddressChange = (event : any) => {
        setVaultaddr(event.target.value);
    };

    const SideNavbarNoSSR = dynamic(() => import('../../components/SideNavbar'), { ssr: false });
  return (
    <>
     <div className="flex">
    <SideNavbarNoSSR />
    <div className="flex flex-col gap-5  w-full p-4 my-16">
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
