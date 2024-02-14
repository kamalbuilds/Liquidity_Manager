import React from 'react';
import { FaHeartbeat } from "react-icons/fa";
import { FaWallet } from "react-icons/fa";
import AssetDetails from './AssetDetails';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from './ui/button';

const AssetBalance = ({ userDetails }: any) => {

    return (
        <div className='mx-8 my-8'>

            <h1 className='text-4xl font-[700]'>Asset Details</h1>

            <div className='flex gap-4 my-6'>
                <div className='flex gap-2 items-center '>
                    <div className='rounded-lg px-2 py-2 self-center'><FaHeartbeat size={30} /></div>
                    <div className='flex flex-col'>
                        <div className='text-sm font-[300] text-gray-600'>Health Factor</div>
                        <div className='text-lg font-[600]'>{parseFloat(userDetails.healthFactor).toFixed(2)}</div>
                    </div>
                </div>
                <div className='flex gap-2 items-center'>
                    <div className='rounded-lg px-2 py-2 self-center'> <FaWallet size={30} /></div>
                    <div className='flex flex-col'>
                        <div className='text-sm font-[300] text-gray-600'>Net worth</div>
                        <div className='text-lg font-[600]'>${parseFloat(userDetails.netWorthUSD).toFixed(2)}</div>
                    </div>
                </div>

            </div>
            <div className='flex gap-4'>
                <Card className='flex flex-col flex-1'>
                    <CardHeader>
                        <CardTitle>Your Borrows</CardTitle>
                        <CardDescription>Assets that you have borrowed from Pool</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className='flex flex-col gap-2 mb-8'>
                            <div className='flex gap-2 items-center justify-between'>
                                <div className='text-xl text-[700] text-gray-700'>Amount Supplied</div>
                                <Button variant='secondary'>${parseFloat(userDetails.totalLiquidityUSD).toFixed(2)}</Button>
                            </div>
                            <div className='flex gap-2 items-center justify-between'>
                                <div className='text-xl text-[700] text-gray-700'>Amount Borrowed</div>
                                <Button variant='secondary'>${parseFloat(userDetails.totalBorrowsUSD).toFixed(2)}</Button>
                            </div>
                            <div className='flex gap-2 items-center justify-between'>
                                <div className='text-xl text-[700] text-gray-700'>Collateral Amount</div>
                                <Button variant='secondary'>${parseFloat(userDetails.totalCollateralUSD).toFixed(2)}</Button>
                            </div>
                        </div>
                        <div className='flex flex-col gap-4'>
                            {userDetails.userReservesData.map((reserve : any, index : any)  => {
                                return (
                                    <div key={index}>
                                        <AssetDetails reserve={reserve} />
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>

            </div>

        </div>
    );
};

export default AssetBalance;