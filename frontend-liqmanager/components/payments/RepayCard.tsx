import React, { useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Label } from "../../components/ui/label"
import { Input } from '../../components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { BorrowTokenList } from '@/config/asset';
import { toast } from 'react-toastify';
import { InterestRate, PoolBundle } from '@aave/contract-helpers';
import { ethers } from 'ethers';
import { AaveV3Ethereum , AaveV3Sepolia } from '@bgd-labs/aave-address-book';
import Image from 'next/image';
import { Button } from '../ui/button';

const RepayCard = () => {

    const { provider, safeSDKKit, selectedSafe } = useAuth();

    const [amount, setAmount] = useState<any>();
    const [selectedToken, setSelectedToken] = useState<any>();
    const handleSelect = (value: string) => {
        const selectedToken = BorrowTokenList.find(obj => obj.name === value);
        setSelectedToken(selectedToken);
    }

    const handleRepay = async () => {

        if (!amount) {
            toast.error("Please fill Amount");
            return;
        }
        if (!selectedToken) {
            toast.error("Select Token");
            return;
        }

        if (provider && safeSDKKit) {

            const pool = new PoolBundle(provider, {
                POOL: AaveV3Ethereum.POOL,
            });
            const s_amount = amount.toString();
            const repay = await pool.repayTxBuilder.generateTxData({
                user: selectedSafe || "",
                reserve: selectedToken.contractAddress,
                amount: ethers.utils.parseUnits(s_amount, selectedToken.decimal).toString(),
                onBehalfOf: selectedSafe,
                interestRateMode: InterestRate.Variable,
            });

            console.log("repay", repay);

            const safeTransactionData = {
                to: repay.to,
                value: ethers.utils.parseUnits("0", 18).toString(), // ethers BigNumber
                data: repay.data,
                safeTxGas: repay.gasLimit?.toString() || "0"
            }

            // @ts-ignore
            const safeTransaction = await safeSDKKit?.createTransaction({ safeTransactionData });
            console.log("safeTransaction", safeTransaction);

            const tx = await safeSDKKit?.signTransaction(safeTransaction);

            console.log("tx", tx);

            const txResult = await safeSDKKit?.executeTransaction(tx);
            console.log("txResult", txResult)

            txResult ? toast.success("Successfully repayed ✅") : toast.error("Repayment Failed ❌");

        }
    };



    return (
        <Card className='flex flex-col flex-1'>
            <CardHeader>
                <CardTitle>Repay Token</CardTitle>
                <CardDescription>Form to Repay Amount</CardDescription>
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
                                    setAmount(inputText);
                                    // const numericValue = parseFloat(inputText);
                                    // console.log("Input", inputText, numericValue);

                                    // if (!isNaN(numericValue) || 0) {
                                    //     setAmount(numericValue);
                                    // } else {
                                    //     console.log('Please enter a valid number');
                                    // }
                                }} />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label className='text-lg font-[600] tracking-tight' htmlFor="token">Token</Label>
                            <Select onValueChange={handleSelect}>
                                <SelectTrigger id="token">
                                    <SelectValue className='text-lg font-[400] tracking-tight' placeholder="Select Token" />
                                </SelectTrigger>
                                <SelectContent position="popper">

                                    {BorrowTokenList.map((token: any) => {
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
            <CardFooter>
                <Button onClick={handleRepay} className=''>Repay Token</Button>
            </CardFooter>
        </Card>
    );
};

export default RepayCard;