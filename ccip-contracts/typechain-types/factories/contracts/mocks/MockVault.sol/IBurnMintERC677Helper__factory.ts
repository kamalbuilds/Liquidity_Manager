/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IBurnMintERC677Helper,
  IBurnMintERC677HelperInterface,
} from "../../../../contracts/mocks/MockVault.sol/IBurnMintERC677Helper";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "drip",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class IBurnMintERC677Helper__factory {
  static readonly abi = _abi;
  static createInterface(): IBurnMintERC677HelperInterface {
    return new utils.Interface(_abi) as IBurnMintERC677HelperInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IBurnMintERC677Helper {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as IBurnMintERC677Helper;
  }
}
