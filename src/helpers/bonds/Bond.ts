import { ERC20 } from "src/helpers/contracts/ERC20";

export interface BondConfig {
  baseToken: ERC20;
  quoteToken: ERC20;
}

export class Bond {
  /**
   * The token the user buys from the protocol
   */
  baseToken: ERC20;

  /**
   * The token that the user sells to the protocol
   */
  quoteToken: ERC20;

  constructor(config: BondConfig) {
    this.quoteToken = config.quoteToken;
    this.baseToken = config.baseToken;
  }
}
