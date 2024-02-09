/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../common";
import type {
  ConfirmedOwnerUpgradeable,
  ConfirmedOwnerUpgradeableInterface,
} from "../../../../contracts/dev/functions/ConfirmedOwnerUpgradeable";

const _abi = [
  {
    inputs: [],
    name: "CannotSelfTransfer",
    type: "error",
  },
  {
    inputs: [],
    name: "NotProposedOwner",
    type: "error",
  },
  {
    inputs: [],
    name: "OnlyCallableByOwner",
    type: "error",
  },
  {
    inputs: [],
    name: "OwnerMustBeSet",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "OwnershipTransferRequested",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "acceptOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b506104f2806100206000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c806379ba5097146100465780638da5cb5b14610050578063f2fde38b1461006e575b600080fd5b61004e61008a565b005b610058610217565b6040516100659190610443565b60405180910390f35b6100886004803603810190610083919061048f565b610240565b005b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610111576040517f0f22ca5f00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60008060029054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905033600060026101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506000600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055503373ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a350565b60008060029054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b610248610254565b610251816102dd565b50565b600060029054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146102db576040517f2b5c74de00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b565b3373ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603610342576040517f282010c300000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b80600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508073ffffffffffffffffffffffffffffffffffffffff16600060029054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167fed8889f560326eb138920d842192f0eb3dd22b4f139c87a2c57538e05bae127860405160405180910390a350565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061042d82610402565b9050919050565b61043d81610422565b82525050565b60006020820190506104586000830184610434565b92915050565b600080fd5b61046c81610422565b811461047757600080fd5b50565b60008135905061048981610463565b92915050565b6000602082840312156104a5576104a461045e565b5b60006104b38482850161047a565b9150509291505056fea264697066735822122077ca96913618a87cf64e1302a5b381ef400fa59d7b4a5f8521b43ef56d75aea364736f6c63430008130033";

type ConfirmedOwnerUpgradeableConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ConfirmedOwnerUpgradeableConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ConfirmedOwnerUpgradeable__factory extends ContractFactory {
  constructor(...args: ConfirmedOwnerUpgradeableConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ConfirmedOwnerUpgradeable> {
    return super.deploy(overrides || {}) as Promise<ConfirmedOwnerUpgradeable>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): ConfirmedOwnerUpgradeable {
    return super.attach(address) as ConfirmedOwnerUpgradeable;
  }
  override connect(signer: Signer): ConfirmedOwnerUpgradeable__factory {
    return super.connect(signer) as ConfirmedOwnerUpgradeable__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ConfirmedOwnerUpgradeableInterface {
    return new utils.Interface(_abi) as ConfirmedOwnerUpgradeableInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ConfirmedOwnerUpgradeable {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as ConfirmedOwnerUpgradeable;
  }
}
