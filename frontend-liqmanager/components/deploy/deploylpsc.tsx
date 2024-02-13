"use client";
import { ethers } from 'ethers';

import LPSC from '../../abi/LPSC.json'; // The JSON file containing ABI and bytecode

interface lpscargs {
  routeraddr: string,
  vaultaddr: string
}

export const DeployLPSC = async (lpscconfig: lpscargs , provider : any) => {

  // const { particleProvider } = useAccountInfo();
// @ts-ignore
  const ethersProvider = new ethers.providers.Web3Provider(provider, "any");

  // Prompt user to connect their wallet
  await ethersProvider.send("eth_requestAccounts", []);
  const signer = ethersProvider.getSigner();

  console.log(signer,"signer");

  // Create a factory for your contract
  const contractFactory = new ethers.ContractFactory(LPSC.abi, LPSC.bytecode, signer);

  // Deploy the contract with the required constructor arguments
  const lpsccontract = await contractFactory.deploy( lpscconfig.routeraddr , lpscconfig.vaultaddr);

  await lpsccontract.deployed();

  console.log(`Contract deployed to: ${lpsccontract.address}`);

  return lpsccontract;
};