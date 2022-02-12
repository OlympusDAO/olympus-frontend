import { ethers } from "ethers";

import { contracts } from "../contracts/compound-protocol.min.json";

export default class JumpRateModel {
  static RUNTIME_BYTECODE_HASHES = [
    "0x00f083d6c0022358b6b3565c026e815cfd6fc9dcd6c3ad1125e72cbb81f41b2a",
    "0x47d7a0e70c9e049792bb96abf3c7527c7543154450c6267f31b52e2c379badc7",
  ];

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

  async _init(provider, interestRateModelAddress, reserveFactorMantissa, adminFeeMantissa, fuseFeeMantissa) {
    var contract = ethers.Contract(
      interestRateModelAddress,
      JSON.parse(contracts["contracts/JumpRateModel.sol:JumpRateModel"].abi),
      provider,
    );
    this.baseRatePerBlock = Number(await contract.baseRatePerBlock());
    this.multiplierPerBlock = Number(await contract.multiplierPerBlock());
    this.jumpMultiplierPerBlock = Number(await contract.jumpMultiplierPerBlock());
    this.kink = Number(await contract.kink());

    this.reserveFactorMantissa = Number(reserveFactorMantissa);
    this.reserveFactorMantissa += Number(adminFeeMantissa);
    this.reserveFactorMantissa += Number(fuseFeeMantissa);

    this.initialized = true;
  }

  async __init(
    baseRatePerBlock,
    multiplierPerBlock,
    jumpMultiplierPerBlock,
    kink,
    reserveFactorMantissa,
    adminFeeMantissa,
    fuseFeeMantissa,
  ) {
    this.baseRatePerBlock = Number(baseRatePerBlock);
    this.multiplierPerBlock = Number(multiplierPerBlock);
    this.jumpMultiplierPerBlock = Number(jumpMultiplierPerBlock);
    this.kink = Number(kink);

    this.reserveFactorMantissa = Number(reserveFactorMantissa);
    this.reserveFactorMantissa += Number(adminFeeMantissa);
    this.reserveFactorMantissa += Number(fuseFeeMantissa);

    this.initialized = true;
  }

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
