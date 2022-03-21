import { Token } from "src/helpers/contracts/Token/Token";

export interface BondConfig {
  baseToken: Token;
  quoteToken: Token;
}

export class Bond {
  /**
   * The token the user buys from the protocol
   */
  baseToken: Token;

  /**
   * The token that the user sells to the protocol
   */
  quoteToken: Token;

  constructor(config: BondConfig) {
    this.quoteToken = config.quoteToken;
    this.baseToken = config.baseToken;
  }
}
