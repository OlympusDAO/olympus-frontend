import { ElementType } from "react";
import { NetworkId } from "src/constants";

/**
 * an External Staking Pool
 */
export class ExternalPool {
  readonly poolName: string;
  readonly icons: ElementType[];
  readonly stakeOn: string;
  readonly href: string;
  readonly apy: string;
  readonly address: string;
  readonly networkID: NetworkId;

  constructor(poolOpts: StakePoolOpts) {
    this.poolName = poolOpts.poolName;
    this.icons = poolOpts.icons;
    this.stakeOn = poolOpts.stakeOn;
    this.href = poolOpts.href;
    this.apy = poolOpts.apy;
    this.address = poolOpts.address;
    this.networkID = poolOpts.networkID;
  }
}

export interface StakePoolOpts {
  poolName: string;
  icons: ElementType[];
  stakeOn: string;
  href: string;
  apy: string;
  address: string;
  networkID: NetworkId;
}
