"use client";
import { ethers } from 'ethers';

import Vault from '../../abi/EnhancedVault.json'; // The JSON file containing ABI and bytecode


export const DeployVault = async ( provider : any) => {

  // const { particleProvider } = useAccountInfo();
// @ts-ignore
  const ethersProvider = new ethers.providers.Web3Provider(provider, "any");

  console.log(ethersProvider,"ethers provider");
  // Prompt user to connect their wallet
  await ethersProvider.send("eth_requestAccounts", []);
  const signer = ethersProvider.getSigner();

  console.log(signer,"signer");

  // Create a factory for your contract
  const contractFactory = new ethers.ContractFactory(Vault.abi, Vault.bytecode, signer);

  // Deploy the contract with the required constructor arguments
  const contract = await contractFactory.deploy();

  await contract.deployed();

  console.log(`Contract deployed to: ${contract.address}`);

  return contract;
};