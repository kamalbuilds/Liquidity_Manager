import React, { useEffect, useState } from 'react';
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
import { BorrowTokenList } from '@/config/asset';
import Image from 'next/image';
import { Button } from '../ui/button';
import { InterestRate, PoolBundle } from '@aave/contract-helpers';
import { AaveV3Ethereum , AaveV3Fuji, AaveV3Sepolia } from '@bgd-labs/aave-address-book';
import { parseUnits } from 'ethers/lib/utils';
import { toast } from 'react-toastify';
import { useAccountInfo } from '@particle-network/connect-react-ui';


const BorrowCard = ({ aaprovider , smartAccount  } : any) => {

    const [amount, setAmount] = useState<any>();
    const [selectedToken, setSelectedToken] = useState<any>();
    const [tokenaddr, setTokenaddr] = useState();
    const [address,setAddress ] = useState('0x869706f26A2F6353AeB49a7633d3f9F8345228E1');

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

    const handleBorrow = async () => {

        console.log("account",address);

        if (!amount) {
            toast.error("Please fill Amount");
            return;
        }
        if (!selectedToken) {
            toast.error("Select Token");
            return;
        }

        if (aaprovider) {

            const pool = new PoolBundle(aaprovider, {
                POOL: AaveV3Fuji.POOL,
            });


            const s_amount = amount.toString();
            console.log(                address!,
                tokenaddr,
                    parseUnits(s_amount, selectedToken.decimal).toString(),
                  InterestRate.Variable)
            const borrowTx = pool.borrowTxBuilder.generateTxData({
                user: address!,
                reserve: tokenaddr!,
                amount: parseUnits(s_amount, selectedToken.decimal).toString(),
                interestRateMode: InterestRate.Variable,
            });
            console.log("Borrow Tx", borrowTx);

            const safeTransactionData = {
                to: borrowTx.to,
                value: parseUnits("0", 18).toString(),
                data: borrowTx.data,
                safeTxGas: borrowTx.gasLimit?.toString()
            }

            const tx = {
                to: safeTransactionData.to,
                value: safeTransactionData.value,
                data: safeTransactionData.data,
            }
            
            const userOpBundle = await smartAccount.buildUserOperation({ tx }) 
            const userOp = userOpBundle.userOp;  
            const userOpHash = userOpBundle.userOpHash;

            const txHash = await smartAccount.sendUserOperation({ userOp, userOpHash }); 
            

            toast.success(txHash);
            txHash ? toast.success("Successfully repayed ✅") : toast.error("Repayment Failed ❌");
        }
    };

    console.log(AaveV3Fuji,"fuji")

    const handleSelect = (value: string) => {
        const selectedToken = BorrowTokenList.find(obj => obj.name === value);
        setSelectedToken(selectedToken);
    }

    return (
        <Card className='flex flex-col flex-1'>
            <CardHeader>
                <CardTitle>Borrow Asset</CardTitle>
                <CardDescription>Borrow asset based on supply</CardDescription>
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
                <Button onClick={handleBorrow} className=''>Borrow Token from AAVEV3 POOL</Button>
            </CardFooter>
        </Card>

    );
};

export default BorrowCard;