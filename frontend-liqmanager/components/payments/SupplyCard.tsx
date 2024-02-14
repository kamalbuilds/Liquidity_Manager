import React, { useEffect, useState } from "react"
import Image from "next/image"
import { InterestRate, Pool, PoolBundle } from "@aave/contract-helpers"
import {  AaveV3Sepolia , AaveV3Fuji } from "@bgd-labs/aave-address-book"
import { useAccountInfo } from "@particle-network/connect-react-ui"
import { ethers } from "ethers"
import { toast } from "react-toastify"

import { SupplyAssetToken } from "@/config/asset"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Button, buttonVariants } from "../ui/button"

const SupplyCard = ({ aaprovider , smartAccount  } : any) => {

  const [amount, setAmount] = useState<number>()
  const [selectedToken, setSelectedToken] = useState<any>();
  const [address,setAddress ] = useState('0x869706f26A2F6353AeB49a7633d3f9F8345228E1');
  const [tokenaddr, setTokenaddr] = useState();

  useEffect(() => {
      const fetchAddress = async () => {
          if (smartAccount) {
              const addr = await smartAccount?.getAddress();
              setAddress(addr);
          }
      };
      const getAssets = async () => {
          if (selectedToken) {
              // @ts-ignore
              const asset = AaveV3Fuji.ASSETS[selectedToken.name];
              console.log(asset);
              if (asset) {
                  setTokenaddr(asset.UNDERLYING);
              } else {
                  console.log("Asset not found for", selectedToken.name);
              }
          }
      };
      fetchAddress();
      getAssets();
  }, [smartAccount,selectedToken]);


  const handleSupply = async () => {
    console.log("Input in func", amount, selectedToken)

    if (!amount) {
      toast.error("Please fill Amount")
      return
    }
    if (!selectedToken) {
      toast.error("Select Token")
      return
    }

    if (aaprovider) {
      const signer = await aaprovider.getSigner();
      console.log("Signer", signer)

      try {
        const pool = new PoolBundle(aaprovider, {
          POOL: AaveV3Fuji.POOL,
        })

        const s_amount = amount.toString();
        console.log(ethers.utils
            .parseUnits(s_amount, selectedToken.decimal)
            .toString(),"amount");

        const supply = await pool.supplyTxBuilder.generateTxData({
          user: address || "",
          reserve: tokenaddr!,
          amount: ethers.utils
            .parseUnits(s_amount, selectedToken.decimal)
            .toString(),
          onBehalfOf: address,
        })

        const tx = {
            to: supply.to,
            value: supply.value,
            data: supply.data,
        }

        console.log("Supply", supply)

        const userOpBundle = await smartAccount.buildUserOperation({ tx }) 
        const userOp = userOpBundle.userOp;  
        const userOpHash = userOpBundle.userOpHash;

        const txHash = await smartAccount.sendUserOperation({ userOp, userOpHash }); 
        

        toast.success(txHash);

      } catch (error) {
        console.log("Error in supplying", error)
        toast.error("Cannot supply. Check console for more reason")
      }
    }
  }

  const handleSelect = (value: string) => {
    const selectedToken = SupplyAssetToken.find((obj) => obj.name === value)
    console.log("Selected Token", selectedToken)
    setSelectedToken(selectedToken)
  }

  const handleApprove = async () => {
    if (!amount) {
      toast.error("Please fill Amount")
      return
    }
    if (selectedToken) {
      const signer = aaprovider?.getSigner()


      const contract = new ethers.Contract(
        tokenaddr!,
        ["function approve(address spender, uint256 amount)"],
        signer
      )

      const s_amount = amount?.toString()
      const data = contract.interface.encodeFunctionData("approve", [
        AaveV3Fuji.POOL,
        ethers.utils.parseUnits(s_amount, selectedToken.decimal).toString(),
      ])

      const tx = {
        to: tokenaddr,
        data: data,
      }

      const txResponse = await signer.sendTransaction(tx)
      const txReceipt = await txResponse.wait();



      console.log("txResult", txReceipt)
      if (txResponse) {
        toast.success("Approved Successfully")
      }
    }
  }

  return (
    <Card className="flex flex-col flex-1">
      <CardHeader>
        <CardTitle>Supply Asset</CardTitle>
        <CardDescription>
          Supply the asset that you want to add in the reserve
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label
                className="text-lg font-[600] tracking-tight"
                htmlFor="amount"
              >
                Amount
              </Label>
              <Input
                className="text-lg font-[400] tracking-tight"
                id="amount"
                placeholder="Enter Amount"
                value={amount}
                onChange={(e) => {
                  const inputText = e.target.value
                  const numericValue = parseFloat(inputText)
                  console.log("Input", inputText, numericValue)

                  if (!isNaN(numericValue) || 0) {
                    setAmount(numericValue)
                  } else {
                    console.log("Please enter a valid number")
                  }
                }}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label
                className="text-lg font-[600] tracking-tight"
                htmlFor="token"
              >
                Token
              </Label>
              <Select onValueChange={handleSelect}>
                <SelectTrigger id="token">
                  <SelectValue
                    className="text-lg font-[400] tracking-tight"
                    placeholder="Select Token"
                  />
                </SelectTrigger>
                <SelectContent position="popper">
                  {SupplyAssetToken.map((token: any) => {
                    return (
                      <SelectItem key={token.id} value={token.name}>
                        <div className="flex flex-row gap-2 justify-center">
                          <Image
                            src={token.logo}
                            alt={token.name}
                            height={24}
                            width={24}
                          />
                          <div className="text-xl scroll-m-20 font-[500] tracking-tight">
                            {token.name}
                          </div>
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        {selectedToken && (
          <button
            className={buttonVariants({ variant: "outline" })}
            onClick={handleApprove}
          >
            Approve {selectedToken.name}
          </button>
        )}
        {selectedToken ? (
          <button className={buttonVariants()} onClick={handleSupply}>
            Supply {selectedToken.name}
          </button>
        ) : (
          <Button variant="outline" disabled={true} className="">
            Supply Token from AAVEV3 Pool
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

export default SupplyCard
