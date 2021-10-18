/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { Policy, PolicyInterface } from "../Policy";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "policy",
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
    inputs: [],
    name: "pullPolicy",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newPolicy_",
        type: "address",
      },
    ],
    name: "pushPolicy",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renouncePolicy",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50600080546001600160a01b03191633178082556040516001600160a01b039190911691907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0908290a3610326806100696000396000f3fe608060405234801561001057600080fd5b506004361061004c5760003560e01c80630505c8c9146100515780635beede0814610075578063a15ad0771461007f578063a4b23980146100a5575b600080fd5b6100596100ad565b604080516001600160a01b039092168252519081900360200190f35b61007d6100bc565b005b61007d6004803603602081101561009557600080fd5b50356001600160a01b0316610141565b61007d610214565b6000546001600160a01b031690565b6001546001600160a01b031633146100d357600080fd5b600154600080546040516001600160a01b0393841693909116917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e091a36001546000805473ffffffffffffffffffffffffffffffffffffffff19166001600160a01b03909216919091179055565b6000546001600160a01b031633146101a0576040805162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015290519081900360640190fd5b6001600160a01b0381166101e55760405162461bcd60e51b81526004018080602001828103825260268152602001806102cb6026913960400191505060405180910390fd5b6001805473ffffffffffffffffffffffffffffffffffffffff19166001600160a01b0392909216919091179055565b6000546001600160a01b03163314610273576040805162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015290519081900360640190fd5b600080546040516001600160a01b03909116907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0908390a36000805473ffffffffffffffffffffffffffffffffffffffff1916905556fe4f776e61626c653a206e6577206f776e657220697320746865207a65726f2061646472657373a2646970667358221220a517c19c69557db17ea3bbfaf44a23ea2738a03669c407a7f9e50ad10cbd498564736f6c63430007050033";

export class Policy__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<Policy> {
    return super.deploy(overrides || {}) as Promise<Policy>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): Policy {
    return super.attach(address) as Policy;
  }
  connect(signer: Signer): Policy__factory {
    return super.connect(signer) as Policy__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): PolicyInterface {
    return new utils.Interface(_abi) as PolicyInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Policy {
    return new Contract(address, _abi, signerOrProvider) as Policy;
  }
}
