"use client";
import * as React from "react";
import "@covalenthq/goldrush-kit/styles.css";
import {
    GoldRushProvider,
    NFTWalletTokenListView,
    TokenBalancesListView,
    TokenTransfersListView,
    AddressActivityListView,
} from "@covalenthq/goldrush-kit";
import { DeployLPSC } from "@/components/deploy/deploylpsc";
import { useAccountInfo } from "@particle-network/connect-react-ui";
import { Input } from "@/components/ui/input";
import { useParticleProvider } from "@particle-network/connect-react-ui";

export default function GoldRushExample() {
    const [userEnteredAddress, setUserEnteredAddress] = React.useState('');
    const { account, particleProvider } = useAccountInfo();
    const a = useParticleProvider();


    const func = async () => {
        const ans = await DeployLPSC({ routeraddr: '0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59', vaultaddr: '0x70A185DC70Be79c9717543CC48aB9AbCd8E84Bbf' } , particleProvider);
        console.log("Ans", ans);
    }

    console.log(account, particleProvider,a, "provider");

    const handleAddressChange = (event : any) => {
        setUserEnteredAddress(event.target.value);
    };

    const effectiveAddress = userEnteredAddress || account;

    return (
        <div className="">
            <Input type="text" placeholder="Enter Address to search" onChange={handleAddressChange} />

            <button onClick={func}>deploy</button>
            <TokenBalancesListView
                chain_names={[
                    "eth-mainnet",
                    "matic-mainnet",
                    "bsc-mainnet",
                    "avalanche-mainnet",
                ]}
                hide_small_balances
                address={effectiveAddress}
            />
            <TokenTransfersListView
                chain_name="eth-mainnet"
                address={effectiveAddress}
                contract_address="0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
            />
            <AddressActivityListView address={effectiveAddress} />
            <NFTWalletTokenListView
                address={effectiveAddress}
                chain_names={[
                    "eth-mainnet",
                    "matic-mainnet",
                    "bsc-mainnet",
                    "avalanche-mainnet",
                ]}
            />
        </div>
    );
}
