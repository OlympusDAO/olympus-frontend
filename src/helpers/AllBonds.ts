import { NetworkId } from "src/constants";
import { LPBond } from "src/lib/Bond";

export const ohm_dai = new LPBond({
  networkAddrs: {
    [NetworkId.MAINNET]: {
      bondAddress: "0x956c43998316b6a2F21f89a1539f73fB5B78c151",
      reserveAddress: "0x055475920a8c93CfFb64d039A8205F7AcC7722d3",
    },
    [NetworkId.TESTNET_RINKEBY]: {
      bondAddress: "0xcF449dA417cC36009a1C6FbA78918c31594B9377",
      reserveAddress: "0x8D5a22Fb6A1840da602E56D1a260E56770e0bCE2",
    },
  },
});

export const allBonds = [ohm_dai];

export default allBonds;
