import { ElementType } from "react";
import { NetworkId } from "src/constants";
import { OHMTokenStackProps } from "@olympusdao/component-library";

/**
 * an External Staking Pool
 */
export class ExternalPool {
  readonly poolName: string;
  readonly icons: OHMTokenStackProps["tokens"];
  readonly stakeOn: string;
  readonly pairGecko: string;
  readonly href: string;
  readonly address: string;
  readonly masterchef: string;
  readonly networkID: NetworkId;

  constructor(poolOpts: StakePoolOpts) {
    this.poolName = poolOpts.poolName;
    this.icons = poolOpts.icons;
    this.stakeOn = poolOpts.stakeOn;
    //coingecko's token identifier string for their price lookup API
    this.pairGecko = poolOpts.pairGecko;
    this.href = poolOpts.href;
    this.address = poolOpts.address;
    this.masterchef = poolOpts.masterchef;
    this.networkID = poolOpts.networkID;
  }
}

export interface StakePoolOpts {
  poolName: string;
  icons: OHMTokenStackProps["tokens"];
  stakeOn: string;
  pairGecko: string;
  href: string;
  address: string;
  masterchef: string;
  networkID: NetworkId;
}

export interface ExternalPoolwBalance extends ExternalPool {
  userBalance?: string;
  apy?: string;
  tvl?: string;
}
