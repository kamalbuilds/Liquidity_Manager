import React, { useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button, buttonVariants } from '../ui/button';
import { InterestRate, Pool, PoolBundle } from "@aave/contract-helpers";
import { AaveV3Sepolia , AaveV3Ethereum} from "@bgd-labs/aave-address-book";
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import { SupplyAssetToken } from '@/config/asset';
import Image from 'next/image';
import { useAccountInfo } from '@particle-network/connect-react-ui';

const SupplyCard = () => {

    const { particleProvider } = useAccountInfo();
    
    const { provider, safeSDKKit, selectedSafe } = useAuth();

    console.log(safeSDKKit, selectedSafe, "signer");

    const [amount, setAmount] = useState<number>();
    const [selectedToken, setSelectedToken] = useState<any>();

    const handleSupply = async () => {

        console.log("Input in func", amount, selectedToken);

        if (!amount) {
            toast.error("Please fill Amount");
            return;
        }
        if (!selectedToken) {
            toast.error("Select Token");
            return;
        }

        if (provider && safeSDKKit) {
            const signer = provider?.getSigner();
            console.log("Signer", signer);

            try {
                const pool = new PoolBundle(provider, {
                    POOL: AaveV3Ethereum.POOL,
                });

                const s_amount = amount.toString();
                const supply = await pool.supplyTxBuilder.generateTxData({
                    user: selectedSafe || "",
                    reserve: selectedToken.contractAddress,  // dai address
                    amount: ethers.utils.parseUnits(s_amount, selectedToken.decimal).toString(),
                    onBehalfOf: selectedSafe,
                });

                console.log("Supply", supply);

                const safeTransactionData = {
                    to: supply.to,
                    value: ethers.utils.parseUnits("0", 18).toString(), // ethers BigNumber
                    data: supply.data,
                    safeTxGas: supply.gasLimit?.toString()
                }
                console.log("Safe transaction data", safeTransactionData);
                // @ts-ignore
                const safeTransaction = await safeSDKKit?.createTransaction({ safeTransactionData });
                console.log("safeTransaction", safeTransaction);

                const tx = await safeSDKKit?.signTransaction(safeTransaction);
                console.log("tx", tx);

                const txResult = await safeSDKKit?.executeTransaction(tx);
                console.log("txResult", txResult)

                txResult ? toast.success("Successfully supplied") : toast.error("Transaction Failed");

            } catch (error) {
                console.log("Error in supplying", error);
                toast.error("Cannot supply. Check console for more reason");
            }

        }
    }


    const handleSelect = (value: string) => {
        const selectedToken = SupplyAssetToken.find(obj => obj.name === value);
        console.log("Selected Token", selectedToken);
        setSelectedToken(selectedToken);

    }

    const handleApprove = async () => {
        if (!amount) {
            toast.error("Please fill Amount");
            return;
        }
        if (selectedToken && safeSDKKit) {
            const signer = provider?.getSigner();

            const tokenAddress = selectedToken.contractAddress;
            const contract = new ethers.Contract(tokenAddress, ['function approve(address spender, uint256 amount)'], signer);

            const s_amount = amount?.toString();
            const data = contract.interface.encodeFunctionData('approve', [AaveV3Ethereum.POOL, ethers.utils.parseUnits(s_amount, selectedToken.decimal).toString()]);

            const safeTransactionData = {
                to: tokenAddress,
                data: data,
                value: ethers.utils.parseUnits("0", 18).toString(),
            };

            const safeTransaction = await safeSDKKit.createTransaction({ safeTransactionData });
            console.log("safeTransaction", safeTransaction);

            const tx = await safeSDKKit.signTransaction(safeTransaction);

            console.log("tx", tx);

            const txResult = await safeSDKKit.executeTransaction(tx);

            console.log("txResult", txResult)
            if (txResult) {
                toast.success("Approved Successfully");
            }

        }

    }

    return (
        <Card className='flex flex-col flex-1'>
            <CardHeader>
                <CardTitle>Supply Asset</CardTitle>
                <CardDescription>Supply the asset that you want to add in the reserve</CardDescription>
            </CardHeader>
            <CardContent>
                <form>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label className='text-lg font-[600] tracking-tight' htmlFor="amount" >Amount</Label>
                            <Input
                                className='text-lg font-[400] tracking-tight'
                                id="amount"
                                placeholder="Enter Amount"
                                value={amount}
                                onChange={(e) => {
                                    const inputText = e.target.value;
                                    const numericValue = parseFloat(inputText);
                                    console.log("Input", inputText, numericValue);

                                    if (!isNaN(numericValue) || 0) {
                                        setAmount(numericValue);
                                    } else {
                                        console.log('Please enter a valid number');
                                    }
                                }} />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label className='text-lg font-[600] tracking-tight' htmlFor="token">Token</Label>
                            <Select onValueChange={handleSelect}>
                                <SelectTrigger id="token">
                                    <SelectValue className='text-lg font-[400] tracking-tight' placeholder="Select Token" />
                                </SelectTrigger>
                                <SelectContent position="popper">

                                    {SupplyAssetToken.map((token: any) => {
                                        return (
                                            <SelectItem key={token.id} value={token.name}>
                                                <div className='flex flex-row gap-2 justify-center'>
                                                    <Image src={token.logo} alt={token.name} height={24} width={24} />
                                                    <div className='text-xl scroll-m-20 font-[500] tracking-tight'>{token.name}</div>
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
            <CardFooter className='flex flex-col gap-4'>
                {selectedToken &&
                    <button className={buttonVariants({ variant: "outline" })} onClick={handleApprove}>
                        Approve {selectedToken.name}
                    </button>
                }
                {selectedToken ?
                    <button className={buttonVariants()} onClick={handleSupply}>
                        Supply {selectedToken.name}
                    </button> :
                    <Button variant="outline" disabled={true} className=''>Supply Token from AAVEV3 Pool</Button>
                }

            </CardFooter>
        </Card>

    );
};

export default SupplyCard;