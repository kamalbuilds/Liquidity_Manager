"use client";
import { ethers } from 'ethers';

// Your contract ABI and bytecode
import LPSC from '../../abi/LPSC.json'; // The JSON file containing ABI and bytecode
import { useEthereum } from '@particle-network/auth-core-modal';

interface lpscargs {
  routeraddr: string,
  vaultaddr: string
}

export const DeployLPSC = async (lpscconfig: lpscargs) => {
  const { provider } = useEthereum();
  const ethersProvider = new ethers.providers.Web3Provider(provider, "any");

  // Connect to the Ethereum network
  // const provider = new ethers.providers.Web3Provider(window.ethereum);

  // Prompt user to connect their wallet
  await ethersProvider.send("eth_requestAccounts", []);
  const signer = ethersProvider.getSigner();

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