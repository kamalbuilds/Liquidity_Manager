'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTheme } from 'next-themes'
import { CSSProperties, useEffect, useState } from 'react'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { DateRange } from './DateRange'
import { CovalentClient } from "@covalenthq/client-sdk";
import { Button } from '@/components/ui/button'
import Dropdown from './Dropdown'

const data = [
    { month: 'Jan', total: 900, positive: 880 },
    { month: 'Feb', total: 700, positive: 600 },
    { month: 'Mar', total: 1700, positive: 1200 },
    { month: 'Apr', total: 700, positive: 500 },
    { month: 'May', total: 900, positive: 700 },
    { month: 'Jun', total: 1000, positive: 100 },
    { month: 'Jul', total: 1200, positive: 1100 }
]

interface IHistoricalData {
    timestamp: string;
    balance: number;
}

interface ITokenData {
    token: string;
    logo: string;
    tokenSymbol: string;
}


export function Reports() {
    const { theme: mode } = useTheme()
    const [portfolioItem, setPortfolioItem] = useState<any>([]);
    const [historicalData, setHistoricalData] = useState<IHistoricalData[]>([]);

    const [tokens, setTokens] = useState<ITokenData[]>([]);

    const ApiServices = async () => {
        const client = new CovalentClient("cqt_rQdDRhX8FP9gX7jB9rhBgkY46Pxq");
        // const resp = await client.BalanceService.getHistoricalPortfolioForWalletAddress(
        //     "avalanche-mainnet",
        //     "0x3ABDCd346dB73bEB3e9BBE2cB336c91eec507a28"
        // );

        //TODO: Change the chain below to get the data
        const resp = await client.BalanceService.getHistoricalPortfolioForWalletAddress("eth-mainnet", "0xE0df81bCd466D88bd86790Ead30cd5c34a17c929");

        console.log("Response", resp);


        const { items } = resp.data;
        console.log("Items", items);
        setPortfolioItem(items);

        const newTokens = items.map(item => ({
            token: item.contract_name,
            logo: item.logo_url,
            tokenSymbol: item.contract_ticker_symbol
        }));
        setTokens(newTokens);




    }

    console.log("portfolioItem", portfolioItem, tokens);

    const filterItem = (tokenSelected?: ITokenData) => {
        let selectedTokenData;

        if (!tokenSelected) {
            selectedTokenData = portfolioItem[0];
        } else {
            selectedTokenData = portfolioItem.find((tokenItem: any) => tokenItem.contract_name === tokenSelected.token);
        }

        if (selectedTokenData) {
            const { holdings }: any = selectedTokenData;
            const newHistoricalData = holdings.map((holding: any) => {
                const date = new Date(holding.timestamp);
                const ddMMyyyy = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
                return {
                    timestamp: ddMMyyyy,
                    balance: holding.open.quote,
                };
            });
            setHistoricalData(newHistoricalData); // Update historical data based on selected token
        }
    };

    useEffect(() => {

        if (portfolioItem.length > 0) {
            filterItem();
        }

    }, [portfolioItem])




    console.log("historicalData", historicalData);

    return (
        <div>

            <div className="text-md font-semibold text-primary pb-4 -pt-2">
                We analyses your Historical data in realtime to provide you with actionable insights. Get Your historical data based on different tokens that you hold
            </div>


            {historicalData.length > 0 ? (
                <Card>
                    <CardHeader>
                        <div className="flex flex-row justify-between">
                            <CardTitle>Portfolio Data Over time</CardTitle>
                            <div className='flex gap-2 items-center'>
                                <Dropdown tokens={tokens} filterItem={filterItem} setHistoricalData={setHistoricalData} />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pb-4">
                        <div className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={historicalData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                                    <XAxis dataKey="timestamp" />
                                    <YAxis />
                                    <Tooltip
                                        content={({ active, payload }: any) => {
                                            if (active && payload && payload.length) {
                                                return (
                                                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <div className="flex flex-col">
                                                                <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                                    Timestamp
                                                                </span>
                                                                <span className="font-bold text-muted-foreground">
                                                                    {payload[0]?.payload.timestamp}
                                                                </span>
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                                    Balance
                                                                </span>
                                                                <span className="font-bold">${payload[0]?.value?.toFixed(2)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                            return null
                                        }}
                                    />
                                    <Line
                                        stroke="#8884d8"
                                        type="monotone"
                                        strokeWidth={2}
                                        dataKey="balance"
                                        activeDot={{
                                            r: 8,
                                            style: { fill: 'var(--theme-primary)', opacity: 0.25 }
                                        }}
                                        style={
                                            {
                                                stroke: 'var(--theme-primary)',
                                                opacity: 0.25,
                                                '--theme-primary': `hsl(${mode === 'dark' ? '0 0% 98%' : '240 5.9% 10%'})`
                                            } as CSSProperties
                                        }
                                    />
                                    {/* <Line
                                    type="monotone"
                                    dataKey="balance"
                                    strokeWidth={2}
                                    activeDot={{
                                        r: 8,
                                        style: { fill: 'var(--theme-primary)' }
                                    }}
                                    style={
                                        {
                                            stroke: 'var(--theme-primary)',
                                            '--theme-primary': `hsl(${mode === 'dark' ? '0 0% 98%' : '240 5.9% 10%'})`
                                        } as CSSProperties
                                    }
                                /> */}
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Button onClick={ApiServices}>Get Historical Data</Button>
            )}


        </div>
    )
}