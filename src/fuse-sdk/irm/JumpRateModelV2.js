import { ethers } from "ethers";

import { contracts } from "../contracts/compound-protocol.min.json";

export default class JumpRateModelV2 {
  static RUNTIME_BYTECODE_HASH = "0xc6df64d77d18236fa0e3a1bb939e979d14453af5c8287891decfb67710972c3c";

  initialized;

  baseRatePerBlock;
  multiplierPerBlock;
  jumpMultiplierPerBlock;
  kink;

  reserveFactorMantissa;

  async init(provider, interestRateModelAddress, assetAddress) {
    var contract = new ethers.Contract(
      interestRateModelAddress,
      JSON.parse(contracts["contracts/JumpRateModel.sol:JumpRateModel"].abi),
      provider,
    );
    this.baseRatePerBlock = Number(await contract.baseRatePerBlock());
    this.multiplierPerBlock = Number(await contract.multiplierPerBlock());
    this.jumpMultiplierPerBlock = Number(await contract.jumpMultiplierPerBlock());
    this.kink = Number(await contract.kink());

    contract = new provider.eth.Contract(
      JSON.parse(contracts["contracts/CTokenInterfaces.sol:CTokenInterface"].abi),
      assetAddress,
    );
    this.reserveFactorMantissa = Number(await contract.reserveFactorMantissa());
    this.reserveFactorMantissa += Number(await contract.adminFeeMantissa());
    this.reserveFactorMantissa += Number(await contract.fuseFeeMantissa());

    this.initialized = true;
  }

  // async _init(web3, interestRateModelAddress, reserveFactorMantissa, adminFeeMantissa, fuseFeeMantissa) {
  //   var contract = new web3.eth.Contract(
  //     JSON.parse(contracts["contracts/JumpRateModel.sol:JumpRateModel"].abi),
  //     interestRateModelAddress,
  //   );
  //   this.baseRatePerBlock = Web3.utils.toBN(await contract.methods.baseRatePerBlock().call());
  //   this.multiplierPerBlock = Web3.utils.toBN(await contract.methods.multiplierPerBlock().call());
  //   this.jumpMultiplierPerBlock = Web3.utils.toBN(await contract.methods.jumpMultiplierPerBlock().call());
  //   this.kink = Web3.utils.toBN(await contract.methods.kink().call());
  //
  //   this.reserveFactorMantissa = Web3.utils.toBN(reserveFactorMantissa);
  //   this.reserveFactorMantissa.iadd(Web3.utils.toBN(adminFeeMantissa));
  //   this.reserveFactorMantissa.iadd(Web3.utils.toBN(fuseFeeMantissa));
  //
  //   this.initialized = true;
  // }

  // async __init(
  //   baseRatePerBlock,
  //   multiplierPerBlock,
  //   jumpMultiplierPerBlock,
  //   kink,
  //   reserveFactorMantissa,
  //   adminFeeMantissa,
  //   fuseFeeMantissa,
  // ) {
  //   this.baseRatePerBlock = Web3.utils.toBN(baseRatePerBlock);
  //   this.multiplierPerBlock = Web3.utils.toBN(multiplierPerBlock);
  //   this.jumpMultiplierPerBlock = Web3.utils.toBN(jumpMultiplierPerBlock);
  //   this.kink = Web3.utils.toBN(kink);
  //
  //   this.reserveFactorMantissa = Web3.utils.toBN(reserveFactorMantissa);
  //   this.reserveFactorMantissa.iadd(Web3.utils.toBN(adminFeeMantissa));
  //   this.reserveFactorMantissa.iadd(Web3.utils.toBN(fuseFeeMantissa));
  //
  //   this.initialized = true;
  // }

  getBorrowRate(utilizationRate) {
    if (!this.initialized) throw new Error("Interest rate model class not initialized.");

    if (utilizationRate <= this.kink) {
      return (utilizationRate * this.multiplierPerBlock) / 1e18 + this.baseRatePerBlock;
    } else {
      const normalRate = (this.kink * this.multiplierPerBlock) / 1e18 + this.baseRatePerBlock;
      const excessUtil = utilizationRate - this.kink;
      return (excessUtil * this.jumpMultiplierPerBlock) / 1e18 + normalRate;
    }
  }

  getSupplyRate(utilizationRate) {
    if (!this.initialized) throw new Error("Interest rate model class not initialized.");

    const oneMinusReserveFactor = 1e18 - this.reserveFactorMantissa;
    const borrowRate = this.getBorrowRate(utilizationRate);
    const rateToPool = (borrowRate * oneMinusReserveFactor) / 1e18;
    return (utilizationRate * rateToPool) / 1e18;
  }
}
