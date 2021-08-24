import { StableBond, LPBond, NetworkID } from "./Bond";

const dai = new StableBond("dai", "DAI", "URL", "Contract", {
  [NetworkID.Mainnet]: { bondAddress: "address", reserveAddress: "address" },
  [NetworkID.Testnet]: { bondAddress: "address", reserveAddress: "address" },
});

const frax = new StableBond("frax", "FRAX", "iconURL", "Contract", {
  [NetworkID.Mainnet]: { bondAddress: "address", reserveAddress: "address" },
  [NetworkID.Testnet]: { bondAddress: "address", reserveAddress: "address" },
});

const eth = new StableBond("eth", "ETH", "iconURL", "Contract", {
  [NetworkID.Mainnet]: { bondAddress: "address", reserveAddress: "address" },
  [NetworkID.Testnet]: { bondAddress: "address", reserveAddress: "address" },
});

const ohm_dai = new LPBond("ohm_dai", "OHM-DAI SLP", "IConURL", "LPUrl", "BondContract", "SLP Contract", {
  [NetworkID.Mainnet]: { bondAddress: "address", reserveAddress: "address" },
  [NetworkID.Testnet]: { bondAddress: "address", reserveAddress: "address" },
});

const ohm_frax = new LPBond("ohm_frax", "OHM-FRAX SLP", "IConURL", "LPUrl", "BondContract", "SLP Contract", {
  [NetworkID.Mainnet]: { bondAddress: "address", reserveAddress: "address" },
  [NetworkID.Testnet]: { bondAddress: "address", reserveAddress: "address" },
});
