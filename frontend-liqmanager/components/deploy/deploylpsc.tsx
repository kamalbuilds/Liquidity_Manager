"use client";
import { ethers } from 'ethers';

// Your contract ABI and bytecode
import LPSC from '../../abi/LPSC.json'; // The JSON file containing ABI and bytecode

interface lpscargs {
    routeraddr : string,
    vaultaddr : string
}

export const DeployLPSC = async ( lpscconfig : lpscargs ) => {
  // Connect to the Ethereum network
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  
  // Prompt user to connect their wallet
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();

  // Create a factory for your contract
  const contractFactory = new ethers.ContractFactory(LPSC.abi, LPSC.bytecode, signer);

  // Deploy the contract with the required constructor arguments
  const contract = await contractFactory.deploy(
    lpscconfig.routeraddr,
    lpscconfig.vaultaddr
  );

  await contract.deployed();

  console.log(`Contract deployed to: ${contract.address}`);

  return contract;
};