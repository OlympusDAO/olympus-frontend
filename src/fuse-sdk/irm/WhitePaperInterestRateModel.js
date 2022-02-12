import { ethers } from "ethers";

import { contracts } from "../contracts/compound-protocol.min.json";

export default class WhitePaperInterestRateModel {
  static RUNTIME_BYTECODE_HASH = "0xe3164248fb86cce0eb8037c9a5c8d05aac2b2ebdb46741939be466a7b17d0b83";

  initialized;

  baseRatePerBlock;
  multiplierPerBlock;

  reserveFactorMantissa;

  async init(provider, interestRateModelAddress, assetAddress) {
    var contract = new ethers.Contract(
      interestRateModelAddress,
      JSON.parse(contracts["contracts/WhitePaperInterestRateModel.sol:WhitePaperInterestRateModel"].abi),
      provider,
    );
    this.baseRatePerBlock = Number(await contract.baseRatePerBlock());
    this.multiplierPerBlock = Number(await contract.multiplierPerBlock());

    contract = new ethers.Contract(
      assetAddress,
      JSON.parse(contracts["contracts/CTokenInterfaces.sol:CTokenInterface"].abi),
      provider,
    );
    this.reserveFactorMantissa = Number(await contract.reserveFactorMantissa());
    this.reserveFactorMantissa += Number(await contract.adminFeeMantissa());
    this.reserveFactorMantissa += Number(await contract.fuseFeeMantissa());

    this.initialized = true;
  }

  // async _init(provider, interestRateModelAddress, reserveFactorMantissa, adminFeeMantissa, fuseFeeMantissa) {
  //   var contract = new web3.eth.Contract(
  //     JSON.parse(contracts["contracts/WhitePaperInterestRateModel.sol:WhitePaperInterestRateModel"].abi),
  //     interestRateModelAddress,
  //   );
  //   this.baseRatePerBlock = Web3.utils.toBN(await contract.methods.baseRatePerBlock().call());
  //   this.multiplierPerBlock = Web3.utils.toBN(await contract.methods.multiplierPerBlock().call());
  //
  //   this.reserveFactorMantissa = Web3.utils.toBN(reserveFactorMantissa);
  //   this.reserveFactorMantissa.iadd(Web3.utils.toBN(adminFeeMantissa));
  //   this.reserveFactorMantissa.iadd(Web3.utils.toBN(fuseFeeMantissa));
  //
  //   this.initialized = true;
  // }
  //
  // async __init(baseRatePerBlock, multiplierPerBlock, reserveFactorMantissa, adminFeeMantissa, fuseFeeMantissa) {
  //   this.baseRatePerBlock = Web3.utils.toBN(baseRatePerBlock);
  //   this.multiplierPerBlock = Web3.utils.toBN(multiplierPerBlock);
  //
  //   this.reserveFactorMantissa = Web3.utils.toBN(reserveFactorMantissa);
  //   this.reserveFactorMantissa.iadd(Web3.utils.toBN(adminFeeMantissa));
  //   this.reserveFactorMantissa.iadd(Web3.utils.toBN(fuseFeeMantissa));
  //
  //   this.initialized = true;
  // }

  getBorrowRate(utilizationRate) {
    if (!this.initialized) throw new Error("Interest rate model class not initialized.");
    return (utilizationRate * this.multiplierPerBlock) / 1e18 + this.baseRatePerBlock;
  }

  // getSupplyRate(utilizationRate) {
  //   if (!this.initialized) throw new Error("Interest rate model class not initialized.");
  //
  //   const oneMinusReserveFactor = ethers.BigNumber.from(1e18).sub(this.reserveFactorMantissa);
  //   const borrowRate = this.getBorrowRate(utilizationRate);
  //   const rateToPool = borrowRate.mul(oneMinusReserveFactor).div(Web3.utils.toBN(1e18));
  //   return utilizationRate.mul(rateToPool).div(Web3.utils.toBN(1e18));
  // }
}
