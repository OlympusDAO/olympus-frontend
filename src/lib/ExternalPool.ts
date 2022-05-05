import { OHMTokenStackProps } from "@olympusdao/component-library";
import { NetworkId } from "src/constants";

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
  readonly rewarder: string;
  readonly poolId: number | string;
  readonly rewardGecko: string;
  readonly vault: string;
  readonly bonusGecko: string;

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
    this.rewarder = poolOpts.rewarder;
    this.poolId = poolOpts.poolId;
    this.rewardGecko = poolOpts.rewardGecko;
    this.bonusGecko = poolOpts.bonusGecko ? poolOpts.bonusGecko : "";
    this.vault = poolOpts.vault ? poolOpts.vault : "";
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
  rewarder: string;
  poolId: number | string;
  rewardGecko: string;
  bonusGecko?: string;
  vault?: string;
}

export interface ExternalPoolwBalance extends ExternalPool {
  userBalance?: string;
  apy?: string;
  tvl?: string;
}
