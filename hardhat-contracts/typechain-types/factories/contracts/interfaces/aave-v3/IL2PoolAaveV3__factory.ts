/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IL2PoolAaveV3,
  IL2PoolAaveV3Interface,
} from "../../../../contracts/interfaces/aave-v3/IL2PoolAaveV3";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getUserAccountData",
    outputs: [
      {
        internalType: "uint256",
        name: "totalCollateralBase",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalDebtBase",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "availableBorrowsBase",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "currentLiquidationThreshold",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "ltv",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "healthFactor",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "args",
        type: "bytes32",
      },
    ],
    name: "repay",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "args",
        type: "bytes32",
      },
    ],
    name: "supply",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class IL2PoolAaveV3__factory {
  static readonly abi = _abi;
  static createInterface(): IL2PoolAaveV3Interface {
    return new utils.Interface(_abi) as IL2PoolAaveV3Interface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IL2PoolAaveV3 {
    return new Contract(address, _abi, signerOrProvider) as IL2PoolAaveV3;
  }
}