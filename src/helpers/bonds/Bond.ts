import { Token } from "src/helpers/contracts/Token";

import { LPToken } from "../contracts/LPToken";

export interface BondConfig {
  id: string;
  baseToken: Token;
  quoteToken: Token | LPToken;
}

export class Bond {
  /**
   * Bond market id
   */
  id: BondConfig["id"];

  /**
   * The token the market buys from the protocol
   */
  baseToken: BondConfig["baseToken"];

  /**
   * The token that the market sells to the protocol
   */
  quoteToken: BondConfig["quoteToken"];

  constructor(config: BondConfig) {
    this.id = config.id;
    this.baseToken = config.baseToken;
    this.quoteToken = config.quoteToken;
  }
}
