"use client";
import { ethers } from 'ethers';

// Assuming MonitorAaveV3.json contains both ABI and bytecode
import MonitorAaveV3 from '../../abi/MontitorAAVE.json';

interface MonitorArg {
  router: string;
  onBehalfOf: string;
  lendingPoolAddress: string;
  linkTokenAddress: string;
  minHealthFactor: string;
  tokenAddress: string;
  lpsc: string;
  sourceChainSelector: string;
}

export const DeployMonitorAaveV3 = async (args: MonitorArg, provider : any) => {


// @ts-ignore
  const ethersProvider = new ethers.providers.Web3Provider(provider, "any");


  // Connect to the Ethereum network
  // const provider = new ethers.providers.Web3Provider(window.ethereum);

  // Prompt user to connect their wallet
  await ethersProvider.send("eth_requestAccounts", []);
  const signer = ethersProvider.getSigner();

  // Create a factory for your contract
  const contractFactory = new ethers.ContractFactory(MonitorAaveV3.abi, MonitorAaveV3.bytecode, signer);

  // Deploy the contract with the required constructor arguments
  const contract = await contractFactory.deploy(
    args.router,
    args.onBehalfOf,
    args.lendingPoolAddress,
    args.linkTokenAddress,
    ethers.BigNumber.from(args.minHealthFactor),
    args.tokenAddress,
    args.lpsc,
    ethers.BigNumber.from(args.sourceChainSelector)
  );

  await contract.deployed();

  console.log(`Contract deployed to: ${contract.address}`);

  return contract;
};
