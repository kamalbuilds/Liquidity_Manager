"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import {
  useAccountInfo,
  useConnectId,
  useParticleProvider,
} from "@particle-network/connect-react-ui"
import { ethers } from "ethers"
import { Activity, CreditCard, DollarSign, Users } from "lucide-react"
import { toast } from "react-toastify"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import BarChart from "@/components/BarChart"
import Card, { CardContent, CardProps } from "@/components/Card"
import DebtPositionsCard, {
  DebtPositionsProps,
} from "@/components/DebtPostionsCard"
import PageTitle from "@/components/PageTitle"
import Lpscimg from "@/components/assets/LPSC.png"
import vault from "@/components/assets/vault.png"
import { DeployLPSC } from "@/components/deploy/deploylpsc"
import { DeployMonitorAaveV3 } from "@/components/deploy/deploymonitoraavev3"
import { DeployVault } from "@/components/deploy/deployvault"

import { networkConstants } from "../../constants"

export default function Home() {
  const { account, particleProvider } = useAccountInfo();
  const [vaultaddr, setVaultaddr] = useState()
  const [routeraddr, setRouteraddr] = useState(
    "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59"
  )
  const [linkaddr, setLinkaddr] = useState();
  const [formData, setFormData] = useState({
    router: "",
    onBehalfOf: "",
    lendingPoolAddress: "",
    linkTokenAddress: linkaddr!,
    minHealthFactor: "",
    tokenAddress: "",
    lpsc: "",
    sourceChainSelector: "",
  })

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    try {
      // Pass formData as props to your DeployMonitorAaveV3 function
      const ans = await DeployMonitorAaveV3(formData, particleProvider)
      console.log("MonitorAAVEV3 Deployment Result:", ans)
      toast.success("MonitorAAVEV3 deployed successfully!")
    } catch (error) {
      console.error("Deployment Error:", error)
      toast.error("Failed to deploy MonitorAAVEV3 Contract.")
    }
  }

  if (particleProvider) {
    //@ts-ignore
    async function getchainname() {
      const ethersProvider = new ethers.providers.Web3Provider(
              //@ts-ignore
        particleProvider,
        "any"
      )
      const chainName = await ethersProvider.getNetwork()
      //@ts-ignore
      const chainInfo = networkConstants[chainName.chainId]
      setRouteraddr(chainInfo.router)
      setLinkaddr(chainInfo.linkTokenAddress)
    }
    getchainname()
  }

  const deployvault = async () => {
    try {
      const vault = await DeployVault(particleProvider)
      console.log(vault)
      toast.success("Vault deployed successfully!")
    } catch (error) {
      console.error(error)
      toast.error("Failed to deploy vault.")
    }
  }

  const deploylpsc = async () => {
    try {
      const ans = await DeployLPSC(
        { routeraddr: routeraddr, vaultaddr: vaultaddr! },
        particleProvider
      )
      console.log("Ans", ans)
      toast.success("LPSC deployed successfully!")
    } catch (error) {
      console.error(error)
      toast.error("Failed to deploy LPSC.")
    }
  }

  const handleAddressChange = (event: any) => {
    setVaultaddr(event.target.value)
  }

  const SideNavbarNoSSR = dynamic(() => import("../../components/SideNavbar"), {
    ssr: false,
  })
  return (
    <>
      <div className="flex">
        <SideNavbarNoSSR />
        <div className="flex flex-col gap-5  w-full p-4 my-16">
          <PageTitle title="Deployments" />
          <section className="grid grid-cols-1  gap-4 transition-all lg:grid-cols-3">
            <CardContent>
              <div className="text-center mb-4">
                <p className="p-4 font-semibold">Deploy a Vault Contract</p>
                <div className="flex justify-center">
                                    <Image
                                        src={vault}
                                        alt="Vault"
                                        width={150}
                                        height={150}
                                        className="rounded-lg"
                                    />
                                </div>
              </div>

              <Button
                onClick={deployvault}
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Deploy Vault
              </Button>
            </CardContent>

            <CardContent>
              <p className="p-4 font-semibold">
                Deploy LiquidityPosition Protector Contract on Source Chain
              </p>
              <div className="flex justify-center">
                <Image
                  src={Lpscimg}
                  alt="LPSC img"
                  width={200} // Adjust based on your preference
                  height={200} // Adjust to maintain aspect ratio
                  className="object-cover rounded-lg" // TailwindCSS classes
                />
              </div>
              <Input
                placeholder="enter vault address"
                onChange={handleAddressChange}
              />
              <Button onClick={deploylpsc}>Deploy LPSC</Button>
            </CardContent>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="p-4 font-semibold">
                  Deploy Monitor AAVEV3 Position Contract
                </p>

                <Input
                  name="router"
                  placeholder="Router Address"
                  value={formData.router}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
                <Input
                  name="onBehalfOf"
                  placeholder="On Behalf Of Address"
                  value={formData.onBehalfOf}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
                <Input
                  name="lendingPoolAddress"
                  placeholder="Lending Pool Address"
                  value={formData.lendingPoolAddress}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
                <Input
                  name="minHealthFactor"
                  placeholder="Minimum Health Factor"
                  type="number"
                  value={formData.minHealthFactor}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
                <Input
                  name="tokenAddress"
                  placeholder="Token Address to Repay"
                  value={formData.tokenAddress}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
                <Input
                  name="lpsc"
                  placeholder="LPSC Address"
                  value={formData.lpsc}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
                <Input
                  name="sourceChainSelector"
                  placeholder="Source Chain Selector"
                  value={formData.sourceChainSelector}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />

                <Button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Deploy MonitorAAVEV3 Contract
                </Button>
              </form>
            </CardContent>
            {/*  */}
          </section>
        </div>
      </div>
    </>
  )
}
