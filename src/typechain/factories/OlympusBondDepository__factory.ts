/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  OlympusBondDepository,
  OlympusBondDepositoryInterface,
} from "../OlympusBondDepository";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_OHM",
        type: "address",
      },
      {
        internalType: "address",
        name: "_principle",
        type: "address",
      },
      {
        internalType: "address",
        name: "_treasury",
        type: "address",
      },
      {
        internalType: "address",
        name: "_DAO",
        type: "address",
      },
      {
        internalType: "address",
        name: "_bondCalculator",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "deposit",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "payout",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "expires",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "priceInUSD",
        type: "uint256",
      },
    ],
    name: "BondCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "priceInUSD",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "internalPrice",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "debtRatio",
        type: "uint256",
      },
    ],
    name: "BondPriceChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "payout",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "remaining",
        type: "uint256",
      },
    ],
    name: "BondRedeemed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "initialBCV",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newBCV",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "adjustment",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "addition",
        type: "bool",
      },
    ],
    name: "ControlVariableAdjustment",
    type: "event",
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
    name: "OwnershipPulled",
    type: "event",
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
    name: "OwnershipPushed",
    type: "event",
  },
  {
    inputs: [],
    name: "DAO",
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
    inputs: [],
    name: "adjustment",
    outputs: [
      {
        internalType: "bool",
        name: "add",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "rate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "target",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "buffer",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "lastBlock",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "bondCalculator",
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
        name: "",
        type: "address",
      },
    ],
    name: "bondInfo",
    outputs: [
      {
        internalType: "uint256",
        name: "payout",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "vesting",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "lastBlock",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "pricePaid",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "bondPrice",
    outputs: [
      {
        internalType: "uint256",
        name: "price_",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "bondPriceInUSD",
    outputs: [
      {
        internalType: "uint256",
        name: "price_",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "currentDebt",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "debtDecay",
    outputs: [
      {
        internalType: "uint256",
        name: "decay_",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "debtRatio",
    outputs: [
      {
        internalType: "uint256",
        name: "debtRatio_",
        type: "uint256",
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
      {
        internalType: "uint256",
        name: "_maxPrice",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_depositor",
        type: "address",
      },
    ],
    name: "deposit",
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
        internalType: "uint256",
        name: "_controlVariable",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_vestingTerm",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_minimumPrice",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_maxPayout",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_fee",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_maxDebt",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_initialDebt",
        type: "uint256",
      },
    ],
    name: "initializeBondTerms",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "isLiquidityBond",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "lastDecay",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "maxPayout",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    name: "payoutFor",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_depositor",
        type: "address",
      },
    ],
    name: "pendingPayoutFor",
    outputs: [
      {
        internalType: "uint256",
        name: "pendingPayout_",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_depositor",
        type: "address",
      },
    ],
    name: "percentVestedFor",
    outputs: [
      {
        internalType: "uint256",
        name: "percentVested_",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
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
    name: "principle",
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
    name: "pullManagement",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner_",
        type: "address",
      },
    ],
    name: "pushManagement",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
    ],
    name: "recoverLostToken",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_recipient",
        type: "address",
      },
      {
        internalType: "bool",
        name: "_stake",
        type: "bool",
      },
    ],
    name: "redeem",
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
    inputs: [],
    name: "renounceManagement",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "_addition",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "_increment",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_target",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_buffer",
        type: "uint256",
      },
    ],
    name: "setAdjustment",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum OlympusBondDepository.PARAMETER",
        name: "_parameter",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "_input",
        type: "uint256",
      },
    ],
    name: "setBondTerms",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_staking",
        type: "address",
      },
      {
        internalType: "bool",
        name: "_helper",
        type: "bool",
      },
    ],
    name: "setStaking",
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
  {
    inputs: [],
    name: "stakingHelper",
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
    name: "standardizedDebtRatio",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "terms",
    outputs: [
      {
        internalType: "uint256",
        name: "controlVariable",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "vestingTerm",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "minimumPrice",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maxPayout",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "fee",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maxDebt",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalDebt",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "treasury",
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
    name: "useHelper",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x6101406040523480156200001257600080fd5b5060405162002d0438038062002d04833981810160405260a08110156200003857600080fd5b50805160208201516040808401516060850151608090950151600080546001600160a01b031916331780825593519596949592949391926001600160a01b0392909216917fea8258f2d9ddb679928cf34b78cf645b7feda9acc828e4dd82d014eaae270eba908290a36001600160a01b038516620000b557600080fd5b6001600160601b0319606086901b166080526001600160a01b038416620000db57600080fd5b6001600160601b0319606085901b1660a0526001600160a01b0383166200010157600080fd5b6001600160601b0319606084901b1660c0526001600160a01b0382166200012757600080fd5b6001600160601b0319606092831b811660e0529181901b909116610120526001600160a01b0316151560f81b6101005250505060805160601c60a05160601c60c05160601c60e05160601c6101005160f81c6101205160601c612ad66200022e60003980610fec52806117a652806119ed525080610fbe52806117755280611bda52508061161b528061186f528061193a525080610e42528061126c528061148d528061156f5250806105cb528061101b52806110c2528061129b5280611434528061145e528061153e52806117d552806118f85250806115f9528061189352806118b95280611a3b5280611c4f5280611dd45280611eb95280611fce5250612ad66000f3fe608060405234801561001057600080fd5b50600436106102415760003560e01c80637927ebf811610145578063cea55f57116100bd578063d7ccfb0b1161008c578063e392a26211610071578063e392a262146105b1578063f5c2ab5b146105b9578063fc7b9c18146105c157610241565b8063d7ccfb0b146105a1578063e0176de8146105a957610241565b8063cea55f5714610528578063d4d863ce14610530578063d50256251461055e578063d79690601461059957610241565b806398fabd3a11610114578063b4abccba116100f9578063b4abccba146104ae578063c5332b7c146104d4578063cd1234b3146104dc57610241565b806398fabd3a1461049e578063a6c41fec146104a657610241565b80637927ebf81461043f578063844b5c7c1461045c5780638dbdbe6d14610464578063904b3ece1461049657610241565b8063451ee4a1116101d85780635a96ac0a116101a7578063715350081161018c57806371535008146103ee578063759076e51461042f57806377b818951461043757610241565b80635a96ac0a146103de57806361d027b3146103e657610241565b8063451ee4a11461035557806346f68ee91461038a5780634cf088d9146103b0578063507930ec146103b857610241565b80631a3d0068116102145780631a3d0068146102b45780631e321a0f146102e55780631feed31f1461030b5780632f3f470a1461033957610241565b8063016a42841461024657806301b88ee81461026a5780630505c8c9146102a2578063089208d8146102aa575b600080fd5b61024e6105c9565b604080516001600160a01b039092168252519081900360200190f35b6102906004803603602081101561028057600080fd5b50356001600160a01b03166105ed565b60408051918252519081900360200190f35b61024e610646565b6102b2610656565b005b6102b2600480360360808110156102ca57600080fd5b508035151590602081013590604081013590606001356106ff565b6102b2600480360360408110156102fb57600080fd5b5060ff8135169060200135610813565b6102906004803603604081101561032157600080fd5b506001600160a01b03813516906020013515156109d9565b610341610bce565b604080519115158252519081900360200190f35b61035d610bde565b60408051951515865260208601949094528484019290925260608401526080830152519081900360a00190f35b6102b2600480360360208110156103a057600080fd5b50356001600160a01b0316610bf6565b61024e610cf5565b610290600480360360208110156103ce57600080fd5b50356001600160a01b0316610d04565b6102b2610d96565b61024e610e40565b6102b2600480360360e081101561040457600080fd5b5080359060208101359060408101359060608101359060808101359060a08101359060c00135610e64565b610290610f6a565b61024e610f85565b6102906004803603602081101561045557600080fd5b5035610f94565b610290610fba565b6102906004803603606081101561047a57600080fd5b50803590602081013590604001356001600160a01b0316611153565b610290611771565b61024e61186d565b61024e611891565b610341600480360360208110156104c457600080fd5b50356001600160a01b03166118b5565b61024e6119eb565b610502600480360360208110156104f257600080fd5b50356001600160a01b0316611a0f565b604080519485526020850193909352838301919091526060830152519081900360800190f35b610290611a36565b6102b26004803603604081101561054657600080fd5b506001600160a01b0381351690602001351515611aee565b610566611bc3565b604080519687526020870195909552858501939093526060850191909152608084015260a0830152519081900360c00190f35b610341611bd8565b610290611bfc565b610290611c3b565b610290611cd8565b610290611d1d565b610290611d23565b7f000000000000000000000000000000000000000000000000000000000000000081565b6000806105f983610d04565b6001600160a01b0384166000908152600f602052604090205490915061271082106106265780925061063f565b61063c6127106106368385611d29565b90611d89565b92505b5050919050565b6000546001600160a01b03165b90565b6000546001600160a01b031633146106b5576040805162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015290519081900360640190fd5b600080546040516001600160a01b03909116907fea8258f2d9ddb679928cf34b78cf645b7feda9acc828e4dd82d014eaae270eba908390a3600080546001600160a01b0319169055565b6000546001600160a01b0316331461075e576040805162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015290519081900360640190fd5b600454610774906103e890610636906019611d29565b8311156107c8576040805162461bcd60e51b815260206004820152601360248201527f496e6372656d656e7420746f6f206c6172676500000000000000000000000000604482015290519081900360640190fd5b6040805160a0810182529415158086526020860185905290850183905260608501829052436080909501859052600a805460ff19169091179055600b92909255600c55600d55600e55565b6000546001600160a01b03163314610872576040805162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015290519081900360640190fd5b600082600381111561088057fe5b14156108d1576127108110156108c75760405162461bcd60e51b8152600401808060200182810382526024815260200180612a536024913960400191505060405180910390fd5b60058190556109d5565b60018260038111156108df57fe5b1415610946576103e881111561093c576040805162461bcd60e51b815260206004820181905260248201527f5061796f75742063616e6e6f742062652061626f766520312070657263656e74604482015290519081900360640190fd5b60078190556109d5565b600282600381111561095457fe5b14156109bb576127108111156109b1576040805162461bcd60e51b815260206004820152601c60248201527f44414f206665652063616e6e6f7420657863656564207061796f757400000000604482015290519081900360640190fd5b60088190556109d5565b60038260038111156109c957fe5b14156109d55760098190555b5050565b60006109e3612966565b506001600160a01b0383166000908152600f6020908152604080832081516080810183528154815260018201549381019390935260028101549183019190915260030154606082015290610a3685610d04565b90506127108110610ac6576001600160a01b0385166000818152600f602090815260408083208381556001810184905560028101849055600301839055855181519081529182019290925281517f51c99f515c87b0d95ba97f616edd182e8f161c4932eac17c6fefe9dab58b77b1929181900390910190a2610abd85858460000151611dcb565b92505050610bc8565b8151600090610add90612710906106369085611d29565b90506040518060800160405280610b018386600001516120cf90919063ffffffff16565b8152602001610b2b610b208660400151436120cf90919063ffffffff16565b6020870151906120cf565b8152436020808301919091526060808701516040938401526001600160a01b038a166000818152600f84528490208551808255868501516001830155868601516002830155959092015160039092019190915582518581529182019390935281517f51c99f515c87b0d95ba97f616edd182e8f161c4932eac17c6fefe9dab58b77b1929181900390910190a2610bc2868683611dcb565b93505050505b92915050565b600354600160a01b900460ff1681565b600a54600b54600c54600d54600e5460ff9094169385565b6000546001600160a01b03163314610c55576040805162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015290519081900360640190fd5b6001600160a01b038116610c9a5760405162461bcd60e51b81526004018080602001828103825260268152602001806129a16026913960400191505060405180910390fd5b600080546040516001600160a01b03808516939216917fea8258f2d9ddb679928cf34b78cf645b7feda9acc828e4dd82d014eaae270eba91a3600180546001600160a01b0319166001600160a01b0392909216919091179055565b6002546001600160a01b031681565b6000610d0e612966565b506001600160a01b0382166000908152600f602090815260408083208151608081018352815481526001820154938101939093526002810154918301829052600301546060830152909190610d649043906120cf565b60208301519091508015610d8957610d828161063684612710611d29565b9350610d8e565b600093505b505050919050565b6001546001600160a01b03163314610ddf5760405162461bcd60e51b81526004018080602001828103825260228152602001806129c76022913960400191505060405180910390fd5b600154600080546040516001600160a01b0393841693909116917faa151555690c956fc3ea32f106bb9f119b5237a061eaa8557cff3e51e3792c8d91a3600154600080546001600160a01b0319166001600160a01b03909216919091179055565b7f000000000000000000000000000000000000000000000000000000000000000081565b6000546001600160a01b03163314610ec3576040805162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015290519081900360640190fd5b60045415610f18576040805162461bcd60e51b815260206004820181905260248201527f426f6e6473206d75737420626520696e697469616c697a65642066726f6d2030604482015290519081900360640190fd5b6040805160c08101825288815260208101889052908101869052606081018590526080810184905260a00182905260049690965560059490945560069290925560075560085560095560105543601155565b6000610f80610f77611cd8565b601054906120cf565b905090565b6003546001600160a01b031681565b6000610bc8662386f26fc10000610636610fb585610fb0611bfc565b612111565b612293565b60007f0000000000000000000000000000000000000000000000000000000000000000156110b8576110b160646106367f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03166332da80a37f00000000000000000000000000000000000000000000000000000000000000006040518263ffffffff1660e01b815260040180826001600160a01b0316815260200191505060206040518083038186803b15801561107757600080fd5b505afa15801561108b573d6000803e3d6000fd5b505050506040513d60208110156110a157600080fd5b50516110ab611bfc565b90611d29565b9050610653565b610f8060646106367f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663313ce5676040518163ffffffff1660e01b815260040160206040518083038186803b15801561111957600080fd5b505afa15801561112d573d6000803e3d6000fd5b505050506040513d602081101561114357600080fd5b505160ff16600a0a6110ab611bfc565b60006001600160a01b0382166111b0576040805162461bcd60e51b815260206004820152600f60248201527f496e76616c696420616464726573730000000000000000000000000000000000604482015290519081900360640190fd5b6111b86122ab565b6009546010541115611211576040805162461bcd60e51b815260206004820152601460248201527f4d61782063617061636974792072656163686564000000000000000000000000604482015290519081900360640190fd5b600061121b610fba565b905060006112276122bf565b9050808510156112685760405162461bcd60e51b8152600401808060200182810382526023815260200180612a306023913960400191505060405180910390fd5b60007f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316631eec5a9a7f0000000000000000000000000000000000000000000000000000000000000000896040518363ffffffff1660e01b815260040180836001600160a01b031681526020018281526020019250505060206040518083038186803b1580156112ff57600080fd5b505afa158015611313573d6000803e3d6000fd5b505050506040513d602081101561132957600080fd5b50519050600061133882610f94565b905062989680811015611392576040805162461bcd60e51b815260206004820152600e60248201527f426f6e6420746f6f20736d616c6c000000000000000000000000000000000000604482015290519081900360640190fd5b61139a611c3b565b8111156113ee576040805162461bcd60e51b815260206004820152600e60248201527f426f6e6420746f6f206c61726765000000000000000000000000000000000000604482015290519081900360640190fd5b600061140d612710610636600480015485611d2990919063ffffffff16565b905060006114258261141f86866120cf565b906120cf565b905061145c6001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001633308d612301565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663095ea7b37f00000000000000000000000000000000000000000000000000000000000000008c6040518363ffffffff1660e01b815260040180836001600160a01b0316815260200182815260200192505050602060405180830381600087803b1580156114f357600080fd5b505af1158015611507573d6000803e3d6000fd5b505050506040513d602081101561151d57600080fd5b50506040805163bc157ac160e01b8152600481018c90526001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000811660248301526044820184905291517f00000000000000000000000000000000000000000000000000000000000000009092169163bc157ac1916064808201926020929091908290030181600087803b1580156115ba57600080fd5b505af11580156115ce573d6000803e3d6000fd5b505050506040513d60208110156115e457600080fd5b50508115611640576116406001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000167f000000000000000000000000000000000000000000000000000000000000000084612361565b60105461164d90856123b8565b601055604080516080810182526001600160a01b038a166000908152600f6020529190912054819061167f90866123b8565b81526005805460208084019190915243604080850182905260609485018c90526001600160a01b038e166000908152600f845281902086518155928601516001840155850151600283015593909201516003909201919091555487916116e4916123b8565b604080518d8152905186917f1fec6dc81f140574bf43f6b1e420ae1dd47928b9d57db8cbd7b8611063b85ae5919081900360200190a4611722611a36565b61172a6122bf565b611732610fba565b6040517f375b221f40939bfd8f49723a17cf7bc6d576ebf72efe2cc3e991826f5b3f390a90600090a4611763612412565b509098975050505050505050565b60007f000000000000000000000000000000000000000000000000000000000000000015611865576110b1633b9aca006106367f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03166332da80a37f00000000000000000000000000000000000000000000000000000000000000006040518263ffffffff1660e01b815260040180826001600160a01b0316815260200191505060206040518083038186803b15801561183157600080fd5b505afa158015611845573d6000803e3d6000fd5b505050506040513d602081101561185b57600080fd5b50516110ab611a36565b6110b1611a36565b7f000000000000000000000000000000000000000000000000000000000000000081565b7f000000000000000000000000000000000000000000000000000000000000000081565b60007f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316826001600160a01b031614156118f657600080fd5b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316826001600160a01b0316141561193557600080fd5b6119e37f0000000000000000000000000000000000000000000000000000000000000000836001600160a01b03166370a08231306040518263ffffffff1660e01b815260040180826001600160a01b0316815260200191505060206040518083038186803b1580156119a657600080fd5b505afa1580156119ba573d6000803e3d6000fd5b505050506040513d60208110156119d057600080fd5b50516001600160a01b0385169190612361565b506001919050565b7f000000000000000000000000000000000000000000000000000000000000000081565b600f6020526000908152604090208054600182015460028301546003909301549192909184565b6000807f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03166318160ddd6040518163ffffffff1660e01b815260040160206040518083038186803b158015611a9257600080fd5b505afa158015611aa6573d6000803e3d6000fd5b505050506040513d6020811015611abc57600080fd5b50519050611ae8670de0b6b3a7640000610636610fb5611ae2633b9aca006110ab610f6a565b85612111565b91505090565b6000546001600160a01b03163314611b4d576040805162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015290519081900360640190fd5b6001600160a01b038216611b6057600080fd5b8015611b955760038054600160a01b60ff60a01b19909116176001600160a01b0319166001600160a01b0384161790556109d5565b6003805460ff60a01b19169055600280546001600160a01b0384166001600160a01b03199091161790555050565b60045460055460065460075460085460095486565b7f000000000000000000000000000000000000000000000000000000000000000081565b6000611c2762989680610636633b9aca00611c21611c18611a36565b60045490611d29565b906123b8565b600654909150811015610653575060065490565b6000610f80620186a06106366004600301547f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03166318160ddd6040518163ffffffff1660e01b815260040160206040518083038186803b158015611ca657600080fd5b505afa158015611cba573d6000803e3d6000fd5b505050506040513d6020811015611cd057600080fd5b505190611d29565b600080611cf0601154436120cf90919063ffffffff16565b600554601054919250611d07916106369084611d29565b9150601054821115611d195760105491505b5090565b60115481565b60105481565b600082611d3857506000610bc8565b82820282848281611d4557fe5b0414611d825760405162461bcd60e51b8152600401808060200182810382526021815260200180612a0f6021913960400191505060405180910390fd5b9392505050565b6000611d8283836040518060400160405280601a81526020017f536166654d6174683a206469766973696f6e206279207a65726f0000000000008152506124f2565b600082611e7b577f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663a9059cbb85846040518363ffffffff1660e01b815260040180836001600160a01b0316815260200182815260200192505050602060405180830381600087803b158015611e4957600080fd5b505af1158015611e5d573d6000803e3d6000fd5b505050506040513d6020811015611e7357600080fd5b506120c89050565b600354600160a01b900460ff1615611fa2576003546040805163095ea7b360e01b81526001600160a01b0392831660048201526024810185905290517f00000000000000000000000000000000000000000000000000000000000000009092169163095ea7b3916044808201926020929091908290030181600087803b158015611f0457600080fd5b505af1158015611f18573d6000803e3d6000fd5b505050506040513d6020811015611f2e57600080fd5b505060035460408051637acb775760e01b8152600481018590526001600160a01b03878116602483015291519190921691637acb775791604480830192600092919082900301818387803b158015611f8557600080fd5b505af1158015611f99573d6000803e3d6000fd5b505050506120c8565b6002546040805163095ea7b360e01b81526001600160a01b0392831660048201526024810185905290517f00000000000000000000000000000000000000000000000000000000000000009092169163095ea7b3916044808201926020929091908290030181600087803b15801561201957600080fd5b505af115801561202d573d6000803e3d6000fd5b505050506040513d602081101561204357600080fd5b505060025460408051637acb775760e01b8152600481018590526001600160a01b03878116602483015291519190921691637acb77579160448083019260209291908290030181600087803b15801561209b57600080fd5b505af11580156120af573d6000803e3d6000fd5b505050506040513d60208110156120c557600080fd5b50505b5092915050565b6000611d8283836040518060400160405280601e81526020017f536166654d6174683a207375627472616374696f6e206f766572666c6f770000815250612594565b61211961298e565b600082116121585760405162461bcd60e51b81526004018080602001828103825260268152602001806129e96026913960400191505060405180910390fd5b826121725750604080516020810190915260008152610bc8565b71ffffffffffffffffffffffffffffffffffff831161221957600082607085901b8161219a57fe5b0490506001600160e01b038111156121f9576040805162461bcd60e51b815260206004820152601e60248201527f4669786564506f696e743a3a6672616374696f6e3a206f766572666c6f770000604482015290519081900360640190fd5b6040518060200160405280826001600160e01b0316815250915050610bc8565b6000612235846e010000000000000000000000000000856125ee565b90506001600160e01b038111156121f9576040805162461bcd60e51b815260206004820152601e60248201527f4669786564506f696e743a3a6672616374696f6e3a206f766572666c6f770000604482015290519081900360640190fd5b516612725dd1d243ab6001600160e01b039091160490565b6122b6610f77611cd8565b60105543601155565b60006122db62989680610636633b9aca00611c21611c18611a36565b6006549091508110156122f15750600654610653565b6006541561065357600060065590565b604080516001600160a01b0380861660248301528416604482015260648082018490528251808303909101815260849091019091526020810180516001600160e01b03166323b872dd60e01b17905261235b90859061268e565b50505050565b604080516001600160a01b038416602482015260448082018490528251808303909101815260649091019091526020810180516001600160e01b031663a9059cbb60e01b1790526123b390849061268e565b505050565b600082820183811015611d82576040805162461bcd60e51b815260206004820152601b60248201527f536166654d6174683a206164646974696f6e206f766572666c6f770000000000604482015290519081900360640190fd5b600d54600e5460009161242591906123b8565b600b54909150158015906124395750804310155b156124ef57600454600a5460ff161561247357600b5460045461245b916123b8565b6004819055600c541161246e576000600b555b612495565b600b54600454612482916120cf565b6004819055600c5410612495576000600b555b43600e55600454600b54600a546040805185815260208101949094528381019290925260ff1615156060830152517fb923e581a0f83128e9e1d8297aa52b18d6744310476e0b54509c054cd7a93b2a9181900360800190a1505b50565b6000818361257e5760405162461bcd60e51b81526004018080602001828103825283818151815260200191508051906020019080838360005b8381101561254357818101518382015260200161252b565b50505050905090810190601f1680156125705780820380516001836020036101000a031916815260200191505b509250505060405180910390fd5b50600083858161258a57fe5b0495945050505050565b600081848411156125e65760405162461bcd60e51b815260206004820181815283516024840152835190928392604490910191908501908083836000831561254357818101518382015260200161252b565b505050900390565b60008060006125fd868661273f565b915091506000848061260b57fe5b86880990508281111561261f576001820391505b8083039250848210612678576040805162461bcd60e51b815260206004820152601a60248201527f46756c6c4d6174683a3a6d756c4469763a206f766572666c6f77000000000000604482015290519081900360640190fd5b61268383838761276c565b979650505050505050565b60606126e3826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b03166127dc9092919063ffffffff16565b8051909150156123b35780806020019051602081101561270257600080fd5b50516123b35760405162461bcd60e51b815260040180806020018281038252602a815260200180612a77602a913960400191505060405180910390fd5b6000808060001984860990508385029250828103915082811015612764576001820391505b509250929050565b6000818103821680838161277c57fe5b04925080858161278857fe5b04945080816000038161279757fe5b60028581038087028203028087028203028087028203028087028203028087028203028087028203029586029003909402930460010193909302939093010292915050565b60606127eb84846000856127f3565b949350505050565b60606127fe85612960565b61284f576040805162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e7472616374000000604482015290519081900360640190fd5b60006060866001600160a01b031685876040518082805190602001908083835b6020831061288e5780518252601f19909201916020918201910161286f565b6001836020036101000a03801982511681845116808217855250505050505090500191505060006040518083038185875af1925050503d80600081146128f0576040519150601f19603f3d011682016040523d82523d6000602084013e6128f5565b606091505b509150915081156129095791506127eb9050565b8051156129195780518082602001fd5b60405162461bcd60e51b815260206004820181815286516024840152865187939192839260440191908501908083836000831561254357818101518382015260200161252b565b3b151590565b6040518060800160405280600081526020016000815260200160008152602001600081525090565b6040805160208101909152600081529056fe4f776e61626c653a206e6577206f776e657220697320746865207a65726f20616464726573734f776e61626c653a206d757374206265206e6577206f776e657220746f2070756c6c4669786564506f696e743a3a6672616374696f6e3a206469766973696f6e206279207a65726f536166654d6174683a206d756c7469706c69636174696f6e206f766572666c6f77536c697070616765206c696d69743a206d6f7265207468616e206d617820707269636556657374696e67206d757374206265206c6f6e676572207468616e20333620686f7572735361666545524332303a204552433230206f7065726174696f6e20646964206e6f742073756363656564a264697066735822122001b71b8b368881c7d0deb95b633fc5b9f62c1fe3cbcb0062638e21ebaadf34d564736f6c63430007050033";

export class OlympusBondDepository__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    _OHM: string,
    _principle: string,
    _treasury: string,
    _DAO: string,
    _bondCalculator: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<OlympusBondDepository> {
    return super.deploy(
      _OHM,
      _principle,
      _treasury,
      _DAO,
      _bondCalculator,
      overrides || {}
    ) as Promise<OlympusBondDepository>;
  }
  getDeployTransaction(
    _OHM: string,
    _principle: string,
    _treasury: string,
    _DAO: string,
    _bondCalculator: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _OHM,
      _principle,
      _treasury,
      _DAO,
      _bondCalculator,
      overrides || {}
    );
  }
  attach(address: string): OlympusBondDepository {
    return super.attach(address) as OlympusBondDepository;
  }
  connect(signer: Signer): OlympusBondDepository__factory {
    return super.connect(signer) as OlympusBondDepository__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): OlympusBondDepositoryInterface {
    return new utils.Interface(_abi) as OlympusBondDepositoryInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): OlympusBondDepository {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as OlympusBondDepository;
  }
}
