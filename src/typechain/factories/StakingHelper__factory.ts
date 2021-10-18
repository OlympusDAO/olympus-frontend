/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { StakingHelper, StakingHelperInterface } from "../StakingHelper";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_staking",
        type: "address",
      },
      {
        internalType: "address",
        name: "_OHM",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "OHM",
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
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "stake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "staking",
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
];

const _bytecode =
  "0x60c060405234801561001057600080fd5b506040516104573803806104578339818101604052604081101561003357600080fd5b5080516020909101516001600160a01b03821661004f57600080fd5b6001600160601b0319606083901b166080526001600160a01b03811661007457600080fd5b606081811b6001600160601b03191660a052608051901c91506001600160a01b031661038d6100ca6000398060e2528061019f52806103355250806093528061016e528061023d52806102d1525061038d6000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c80634cf088d914610046578063a694fc3a1461006a578063a6c41fec14610089575b600080fd5b61004e610091565b604080516001600160a01b039092168252519081900360200190f35b6100876004803603602081101561008057600080fd5b50356100b5565b005b61004e610333565b7f000000000000000000000000000000000000000000000000000000000000000081565b604080516323b872dd60e01b81523360048201523060248201526044810183905290516001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016916323b872dd9160648083019260209291908290030181600087803b15801561012a57600080fd5b505af115801561013e573d6000803e3d6000fd5b505050506040513d602081101561015457600080fd5b50506040805163095ea7b360e01b81526001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000811660048301526024820184905291517f00000000000000000000000000000000000000000000000000000000000000009092169163095ea7b3916044808201926020929091908290030181600087803b1580156101ea57600080fd5b505af11580156101fe573d6000803e3d6000fd5b505050506040513d602081101561021457600080fd5b505060408051637acb775760e01b81526004810183905233602482015290516001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001691637acb77579160448083019260209291908290030181600087803b15801561028557600080fd5b505af1158015610299573d6000803e3d6000fd5b505050506040513d60208110156102af57600080fd5b505060408051630f41a04d60e11b815233600482015290516001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001691631e83409a91602480830192600092919082900301818387803b15801561031857600080fd5b505af115801561032c573d6000803e3d6000fd5b5050505050565b7f00000000000000000000000000000000000000000000000000000000000000008156fea264697066735822122057baabc5c6384abe19ec637ef90520bb5ee094d9845d4b0a844a7fef2c1cd6d464736f6c63430007050033";

export class StakingHelper__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    _staking: string,
    _OHM: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<StakingHelper> {
    return super.deploy(
      _staking,
      _OHM,
      overrides || {}
    ) as Promise<StakingHelper>;
  }
  getDeployTransaction(
    _staking: string,
    _OHM: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_staking, _OHM, overrides || {});
  }
  attach(address: string): StakingHelper {
    return super.attach(address) as StakingHelper;
  }
  connect(signer: Signer): StakingHelper__factory {
    return super.connect(signer) as StakingHelper__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): StakingHelperInterface {
    return new utils.Interface(_abi) as StakingHelperInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): StakingHelper {
    return new Contract(address, _abi, signerOrProvider) as StakingHelper;
  }
}
