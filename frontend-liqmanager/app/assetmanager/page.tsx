"use client";
import * as React from "react";
import {
    GoldRushProvider,
    NFTWalletTokenListView,
    TokenBalancesListView,
    TokenTransfersListView,
    AddressActivityListView,
} from "@covalenthq/goldrush-kit";
import { useAccountInfo } from "@particle-network/connect-react-ui";
import { Input } from "@/components/ui/input";
import dynamic from "next/dynamic";

export default function GoldRushExample() {
    const [userEnteredAddress, setUserEnteredAddress] = React.useState('');
    const { account } = useAccountInfo();

    const handleAddressChange = (event : any) => {
        setUserEnteredAddress(event.target.value);
    };

    const effectiveAddress = userEnteredAddress || account;
    const SideNavbarNoSSR = dynamic(() => import('../../components/SideNavbar'), { ssr: false });
    return (
        <div className="flex h-full">
            <SideNavbarNoSSR />
            <div className="flex flex-col gap-4 p-4 w-full">
                <div className="p-4">
                    <Input
                        type="text"
                        placeholder="Enter Address to search"
                        onChange={handleAddressChange}
                        className="mb-4 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="space-y-4">
                    <TokenBalancesListView
                        chain_names={["eth-mainnet", "matic-mainnet", "bsc-mainnet", "avalanche-mainnet"]}
                        hide_small_balances
                        address={effectiveAddress}
                        className="shadow-lg rounded-lg p-4"
                    />
                    <TokenTransfersListView
                        chain_name="eth-mainnet"
                        address={effectiveAddress}
                        contract_address="0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
                        className="shadow-lg rounded-lg p-4"
                    />
                    <AddressActivityListView
                        address={effectiveAddress}
                        className="shadow-lg rounded-lg p-4"
                    />
                    <NFTWalletTokenListView
                        address={effectiveAddress}
                        chain_names={["eth-mainnet", "matic-mainnet", "bsc-mainnet", "avalanche-mainnet"]}
                        className="shadow-lg rounded-lg p-4"
                    />
                </div>
            </div>
        </div>
    );
}
