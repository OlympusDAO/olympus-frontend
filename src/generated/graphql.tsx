import { useInfiniteQuery, UseInfiniteQueryOptions, useQuery, UseQueryOptions } from "@tanstack/react-query";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };

function fetcher<TData, TVariables>(endpoint: string, requestInit: RequestInit, query: string, variables?: TVariables) {
  return async (): Promise<TData> => {
    const res = await fetch(endpoint, {
      method: "POST",
      ...requestInit,
      body: JSON.stringify({ query, variables }),
    });

    const json = await res.json();

    if (json.errors) {
      const { message } = json.errors[0];

      throw new Error(message);
    }

    return json.data;
  };
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigDecimal: number;
  BigInt: number;
  Bytes: any;
};

export type BlockChangedFilter = {
  number_gte: Scalars["Int"];
};

export type Block_Height = {
  hash?: InputMaybe<Scalars["Bytes"]>;
  number?: InputMaybe<Scalars["Int"]>;
  number_gte?: InputMaybe<Scalars["Int"]>;
};

export type BondDiscount = {
  __typename?: "BondDiscount";
  dai_discount: Scalars["BigDecimal"];
  eth_discount: Scalars["BigDecimal"];
  frax_discount: Scalars["BigDecimal"];
  id: Scalars["ID"];
  lusd_discount: Scalars["BigDecimal"];
  ohmdai_discount: Scalars["BigDecimal"];
  ohmfrax_discount: Scalars["BigDecimal"];
  ohmlusd_discount: Scalars["BigDecimal"];
  timestamp: Scalars["BigInt"];
};

export type BondDiscount_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  dai_discount?: InputMaybe<Scalars["BigDecimal"]>;
  dai_discount_gt?: InputMaybe<Scalars["BigDecimal"]>;
  dai_discount_gte?: InputMaybe<Scalars["BigDecimal"]>;
  dai_discount_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  dai_discount_lt?: InputMaybe<Scalars["BigDecimal"]>;
  dai_discount_lte?: InputMaybe<Scalars["BigDecimal"]>;
  dai_discount_not?: InputMaybe<Scalars["BigDecimal"]>;
  dai_discount_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  eth_discount?: InputMaybe<Scalars["BigDecimal"]>;
  eth_discount_gt?: InputMaybe<Scalars["BigDecimal"]>;
  eth_discount_gte?: InputMaybe<Scalars["BigDecimal"]>;
  eth_discount_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  eth_discount_lt?: InputMaybe<Scalars["BigDecimal"]>;
  eth_discount_lte?: InputMaybe<Scalars["BigDecimal"]>;
  eth_discount_not?: InputMaybe<Scalars["BigDecimal"]>;
  eth_discount_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  frax_discount?: InputMaybe<Scalars["BigDecimal"]>;
  frax_discount_gt?: InputMaybe<Scalars["BigDecimal"]>;
  frax_discount_gte?: InputMaybe<Scalars["BigDecimal"]>;
  frax_discount_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  frax_discount_lt?: InputMaybe<Scalars["BigDecimal"]>;
  frax_discount_lte?: InputMaybe<Scalars["BigDecimal"]>;
  frax_discount_not?: InputMaybe<Scalars["BigDecimal"]>;
  frax_discount_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  lusd_discount?: InputMaybe<Scalars["BigDecimal"]>;
  lusd_discount_gt?: InputMaybe<Scalars["BigDecimal"]>;
  lusd_discount_gte?: InputMaybe<Scalars["BigDecimal"]>;
  lusd_discount_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  lusd_discount_lt?: InputMaybe<Scalars["BigDecimal"]>;
  lusd_discount_lte?: InputMaybe<Scalars["BigDecimal"]>;
  lusd_discount_not?: InputMaybe<Scalars["BigDecimal"]>;
  lusd_discount_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  ohmdai_discount?: InputMaybe<Scalars["BigDecimal"]>;
  ohmdai_discount_gt?: InputMaybe<Scalars["BigDecimal"]>;
  ohmdai_discount_gte?: InputMaybe<Scalars["BigDecimal"]>;
  ohmdai_discount_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  ohmdai_discount_lt?: InputMaybe<Scalars["BigDecimal"]>;
  ohmdai_discount_lte?: InputMaybe<Scalars["BigDecimal"]>;
  ohmdai_discount_not?: InputMaybe<Scalars["BigDecimal"]>;
  ohmdai_discount_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  ohmfrax_discount?: InputMaybe<Scalars["BigDecimal"]>;
  ohmfrax_discount_gt?: InputMaybe<Scalars["BigDecimal"]>;
  ohmfrax_discount_gte?: InputMaybe<Scalars["BigDecimal"]>;
  ohmfrax_discount_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  ohmfrax_discount_lt?: InputMaybe<Scalars["BigDecimal"]>;
  ohmfrax_discount_lte?: InputMaybe<Scalars["BigDecimal"]>;
  ohmfrax_discount_not?: InputMaybe<Scalars["BigDecimal"]>;
  ohmfrax_discount_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  ohmlusd_discount?: InputMaybe<Scalars["BigDecimal"]>;
  ohmlusd_discount_gt?: InputMaybe<Scalars["BigDecimal"]>;
  ohmlusd_discount_gte?: InputMaybe<Scalars["BigDecimal"]>;
  ohmlusd_discount_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  ohmlusd_discount_lt?: InputMaybe<Scalars["BigDecimal"]>;
  ohmlusd_discount_lte?: InputMaybe<Scalars["BigDecimal"]>;
  ohmlusd_discount_not?: InputMaybe<Scalars["BigDecimal"]>;
  ohmlusd_discount_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  timestamp?: InputMaybe<Scalars["BigInt"]>;
  timestamp_gt?: InputMaybe<Scalars["BigInt"]>;
  timestamp_gte?: InputMaybe<Scalars["BigInt"]>;
  timestamp_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  timestamp_lt?: InputMaybe<Scalars["BigInt"]>;
  timestamp_lte?: InputMaybe<Scalars["BigInt"]>;
  timestamp_not?: InputMaybe<Scalars["BigInt"]>;
  timestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
};

export enum BondDiscount_OrderBy {
  DaiDiscount = "dai_discount",
  EthDiscount = "eth_discount",
  FraxDiscount = "frax_discount",
  Id = "id",
  LusdDiscount = "lusd_discount",
  OhmdaiDiscount = "ohmdai_discount",
  OhmfraxDiscount = "ohmfrax_discount",
  OhmlusdDiscount = "ohmlusd_discount",
  Timestamp = "timestamp",
}

export type DailyBond = {
  __typename?: "DailyBond";
  amount: Scalars["BigDecimal"];
  id: Scalars["ID"];
  timestamp: Scalars["BigInt"];
  token: Token;
  value: Scalars["BigDecimal"];
};

export type DailyBond_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars["BigDecimal"]>;
  amount_gt?: InputMaybe<Scalars["BigDecimal"]>;
  amount_gte?: InputMaybe<Scalars["BigDecimal"]>;
  amount_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  amount_lt?: InputMaybe<Scalars["BigDecimal"]>;
  amount_lte?: InputMaybe<Scalars["BigDecimal"]>;
  amount_not?: InputMaybe<Scalars["BigDecimal"]>;
  amount_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  timestamp?: InputMaybe<Scalars["BigInt"]>;
  timestamp_gt?: InputMaybe<Scalars["BigInt"]>;
  timestamp_gte?: InputMaybe<Scalars["BigInt"]>;
  timestamp_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  timestamp_lt?: InputMaybe<Scalars["BigInt"]>;
  timestamp_lte?: InputMaybe<Scalars["BigInt"]>;
  timestamp_not?: InputMaybe<Scalars["BigInt"]>;
  timestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  token?: InputMaybe<Scalars["String"]>;
  token_?: InputMaybe<Token_Filter>;
  token_contains?: InputMaybe<Scalars["String"]>;
  token_contains_nocase?: InputMaybe<Scalars["String"]>;
  token_ends_with?: InputMaybe<Scalars["String"]>;
  token_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  token_gt?: InputMaybe<Scalars["String"]>;
  token_gte?: InputMaybe<Scalars["String"]>;
  token_in?: InputMaybe<Array<Scalars["String"]>>;
  token_lt?: InputMaybe<Scalars["String"]>;
  token_lte?: InputMaybe<Scalars["String"]>;
  token_not?: InputMaybe<Scalars["String"]>;
  token_not_contains?: InputMaybe<Scalars["String"]>;
  token_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  token_not_ends_with?: InputMaybe<Scalars["String"]>;
  token_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  token_not_in?: InputMaybe<Array<Scalars["String"]>>;
  token_not_starts_with?: InputMaybe<Scalars["String"]>;
  token_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  token_starts_with?: InputMaybe<Scalars["String"]>;
  token_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  value?: InputMaybe<Scalars["BigDecimal"]>;
  value_gt?: InputMaybe<Scalars["BigDecimal"]>;
  value_gte?: InputMaybe<Scalars["BigDecimal"]>;
  value_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  value_lt?: InputMaybe<Scalars["BigDecimal"]>;
  value_lte?: InputMaybe<Scalars["BigDecimal"]>;
  value_not?: InputMaybe<Scalars["BigDecimal"]>;
  value_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
};

export enum DailyBond_OrderBy {
  Amount = "amount",
  Id = "id",
  Timestamp = "timestamp",
  Token = "token",
  Value = "value",
}

export type DailyStakingReward = {
  __typename?: "DailyStakingReward";
  amount: Scalars["BigDecimal"];
  id: Scalars["ID"];
  timestamp: Scalars["BigInt"];
  value: Scalars["BigDecimal"];
};

export type DailyStakingReward_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars["BigDecimal"]>;
  amount_gt?: InputMaybe<Scalars["BigDecimal"]>;
  amount_gte?: InputMaybe<Scalars["BigDecimal"]>;
  amount_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  amount_lt?: InputMaybe<Scalars["BigDecimal"]>;
  amount_lte?: InputMaybe<Scalars["BigDecimal"]>;
  amount_not?: InputMaybe<Scalars["BigDecimal"]>;
  amount_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  timestamp?: InputMaybe<Scalars["BigInt"]>;
  timestamp_gt?: InputMaybe<Scalars["BigInt"]>;
  timestamp_gte?: InputMaybe<Scalars["BigInt"]>;
  timestamp_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  timestamp_lt?: InputMaybe<Scalars["BigInt"]>;
  timestamp_lte?: InputMaybe<Scalars["BigInt"]>;
  timestamp_not?: InputMaybe<Scalars["BigInt"]>;
  timestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  value?: InputMaybe<Scalars["BigDecimal"]>;
  value_gt?: InputMaybe<Scalars["BigDecimal"]>;
  value_gte?: InputMaybe<Scalars["BigDecimal"]>;
  value_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  value_lt?: InputMaybe<Scalars["BigDecimal"]>;
  value_lte?: InputMaybe<Scalars["BigDecimal"]>;
  value_not?: InputMaybe<Scalars["BigDecimal"]>;
  value_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
};

export enum DailyStakingReward_OrderBy {
  Amount = "amount",
  Id = "id",
  Timestamp = "timestamp",
  Value = "value",
}

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = "asc",
  Desc = "desc",
}

export type ProtocolMetric = {
  __typename?: "ProtocolMetric";
  block: Scalars["BigInt"];
  currentAPY: Scalars["BigDecimal"];
  currentIndex: Scalars["BigDecimal"];
  gOhmPrice: Scalars["BigDecimal"];
  gOhmTotalSupply: Scalars["BigDecimal"];
  id: Scalars["ID"];
  marketCap: Scalars["BigDecimal"];
  nextDistributedOhm: Scalars["BigDecimal"];
  nextEpochRebase: Scalars["BigDecimal"];
  ohmCirculatingSupply: Scalars["BigDecimal"];
  ohmCirculatingSupplyBreakdown: TokenRecordsWrapper;
  ohmFloatingSupply: Scalars["BigDecimal"];
  ohmFloatingSupplyBreakdown: TokenRecordsWrapper;
  ohmPrice: Scalars["BigDecimal"];
  runway2dot5k?: Maybe<Scalars["BigDecimal"]>;
  runway5k?: Maybe<Scalars["BigDecimal"]>;
  runway7dot5k?: Maybe<Scalars["BigDecimal"]>;
  runway10k?: Maybe<Scalars["BigDecimal"]>;
  runway20k?: Maybe<Scalars["BigDecimal"]>;
  runway50k?: Maybe<Scalars["BigDecimal"]>;
  runway70k?: Maybe<Scalars["BigDecimal"]>;
  runway100k?: Maybe<Scalars["BigDecimal"]>;
  runwayCurrent?: Maybe<Scalars["BigDecimal"]>;
  sOhmCirculatingSupply: Scalars["BigDecimal"];
  timestamp: Scalars["BigInt"];
  timestampISO8901: Scalars["String"];
  totalSupply: Scalars["BigDecimal"];
  totalValueLocked: Scalars["BigDecimal"];
  treasuryCVXMarketValue: Scalars["BigDecimal"];
  treasuryCVXMarketValueComponents: TokenRecordsWrapper;
  treasuryDaiMarketValue: Scalars["BigDecimal"];
  treasuryDaiMarketValueComponents: TokenRecordsWrapper;
  treasuryDaiRiskFreeValue: Scalars["BigDecimal"];
  treasuryDaiRiskFreeValueComponents: TokenRecordsWrapper;
  treasuryFXSMarketValue: Scalars["BigDecimal"];
  treasuryFXSMarketValueComponents: TokenRecordsWrapper;
  treasuryFeiMarketValue: Scalars["BigDecimal"];
  treasuryFeiMarketValueComponents: TokenRecordsWrapper;
  treasuryFeiRiskFreeValue: Scalars["BigDecimal"];
  treasuryFeiRiskFreeValueComponents: TokenRecordsWrapper;
  treasuryFraxMarketValue: Scalars["BigDecimal"];
  treasuryFraxMarketValueComponents: TokenRecordsWrapper;
  treasuryFraxRiskFreeValue: Scalars["BigDecimal"];
  treasuryFraxRiskFreeValueComponents: TokenRecordsWrapper;
  treasuryLPValue: Scalars["BigDecimal"];
  treasuryLPValueComponents: TokenRecordsWrapper;
  treasuryLiquidBacking: Scalars["BigDecimal"];
  treasuryLiquidBackingComponents: TokenRecordsWrapper;
  treasuryLiquidBackingPerGOhm: Scalars["BigDecimal"];
  treasuryLiquidBackingPerOhmCirculating: Scalars["BigDecimal"];
  treasuryLiquidBackingPerOhmFloating: Scalars["BigDecimal"];
  treasuryLiquidBackingProtocolOwnedLiquidity: Scalars["BigDecimal"];
  treasuryLiquidBackingProtocolOwnedLiquidityComponents: TokenRecordsWrapper;
  treasuryLiquidBackingStable: Scalars["BigDecimal"];
  treasuryLiquidBackingStableComponents: TokenRecordsWrapper;
  treasuryLiquidBackingVolatile: Scalars["BigDecimal"];
  treasuryLiquidBackingVolatileComponents: TokenRecordsWrapper;
  treasuryLusdMarketValue: Scalars["BigDecimal"];
  treasuryLusdMarketValueComponents: TokenRecordsWrapper;
  treasuryLusdRiskFreeValue: Scalars["BigDecimal"];
  treasuryLusdRiskFreeValueComponents: TokenRecordsWrapper;
  treasuryMarketValue: Scalars["BigDecimal"];
  treasuryMarketValueComponents: TokenRecordsWrapper;
  treasuryOhmDaiPOL: Scalars["BigDecimal"];
  treasuryOhmEthPOL: Scalars["BigDecimal"];
  treasuryOhmFraxPOL: Scalars["BigDecimal"];
  treasuryOhmLusdPOL: Scalars["BigDecimal"];
  treasuryOtherMarketValue: Scalars["BigDecimal"];
  treasuryOtherMarketValueComponents: TokenRecordsWrapper;
  treasuryProtocolOwnedLiquidityBacking: Scalars["BigDecimal"];
  treasuryProtocolOwnedLiquidityBackingComponents: TokenRecordsWrapper;
  treasuryRiskFreeValue: Scalars["BigDecimal"];
  treasuryRiskFreeValueComponents: TokenRecordsWrapper;
  treasuryStableBacking: Scalars["BigDecimal"];
  treasuryStableBackingComponents: TokenRecordsWrapper;
  treasuryStableValue: Scalars["BigDecimal"];
  treasuryStableValueComponents: TokenRecordsWrapper;
  treasuryTotalBacking: Scalars["BigDecimal"];
  treasuryTotalBackingComponents: TokenRecordsWrapper;
  treasuryUstMarketValue: Scalars["BigDecimal"];
  treasuryUstMarketValueComponents: TokenRecordsWrapper;
  treasuryVolatileBacking: Scalars["BigDecimal"];
  treasuryVolatileBackingComponents: TokenRecordsWrapper;
  treasuryVolatileValue: Scalars["BigDecimal"];
  treasuryVolatileValueComponents: TokenRecordsWrapper;
  treasuryWBTCMarketValue: Scalars["BigDecimal"];
  treasuryWBTCMarketValueComponents: TokenRecordsWrapper;
  treasuryWETHMarketValue: Scalars["BigDecimal"];
  treasuryWETHMarketValueComponents: TokenRecordsWrapper;
  treasuryWETHRiskFreeValue: Scalars["BigDecimal"];
  treasuryWETHRiskFreeValueComponents: TokenRecordsWrapper;
  treasuryXsushiMarketValue: Scalars["BigDecimal"];
  treasuryXsushiMarketValueComponents: TokenRecordsWrapper;
};

export type ProtocolMetric_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  block?: InputMaybe<Scalars["BigInt"]>;
  block_gt?: InputMaybe<Scalars["BigInt"]>;
  block_gte?: InputMaybe<Scalars["BigInt"]>;
  block_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  block_lt?: InputMaybe<Scalars["BigInt"]>;
  block_lte?: InputMaybe<Scalars["BigInt"]>;
  block_not?: InputMaybe<Scalars["BigInt"]>;
  block_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  currentAPY?: InputMaybe<Scalars["BigDecimal"]>;
  currentAPY_gt?: InputMaybe<Scalars["BigDecimal"]>;
  currentAPY_gte?: InputMaybe<Scalars["BigDecimal"]>;
  currentAPY_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  currentAPY_lt?: InputMaybe<Scalars["BigDecimal"]>;
  currentAPY_lte?: InputMaybe<Scalars["BigDecimal"]>;
  currentAPY_not?: InputMaybe<Scalars["BigDecimal"]>;
  currentAPY_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  currentIndex?: InputMaybe<Scalars["BigDecimal"]>;
  currentIndex_gt?: InputMaybe<Scalars["BigDecimal"]>;
  currentIndex_gte?: InputMaybe<Scalars["BigDecimal"]>;
  currentIndex_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  currentIndex_lt?: InputMaybe<Scalars["BigDecimal"]>;
  currentIndex_lte?: InputMaybe<Scalars["BigDecimal"]>;
  currentIndex_not?: InputMaybe<Scalars["BigDecimal"]>;
  currentIndex_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  gOhmPrice?: InputMaybe<Scalars["BigDecimal"]>;
  gOhmPrice_gt?: InputMaybe<Scalars["BigDecimal"]>;
  gOhmPrice_gte?: InputMaybe<Scalars["BigDecimal"]>;
  gOhmPrice_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  gOhmPrice_lt?: InputMaybe<Scalars["BigDecimal"]>;
  gOhmPrice_lte?: InputMaybe<Scalars["BigDecimal"]>;
  gOhmPrice_not?: InputMaybe<Scalars["BigDecimal"]>;
  gOhmPrice_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  gOhmTotalSupply?: InputMaybe<Scalars["BigDecimal"]>;
  gOhmTotalSupply_gt?: InputMaybe<Scalars["BigDecimal"]>;
  gOhmTotalSupply_gte?: InputMaybe<Scalars["BigDecimal"]>;
  gOhmTotalSupply_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  gOhmTotalSupply_lt?: InputMaybe<Scalars["BigDecimal"]>;
  gOhmTotalSupply_lte?: InputMaybe<Scalars["BigDecimal"]>;
  gOhmTotalSupply_not?: InputMaybe<Scalars["BigDecimal"]>;
  gOhmTotalSupply_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  marketCap?: InputMaybe<Scalars["BigDecimal"]>;
  marketCap_gt?: InputMaybe<Scalars["BigDecimal"]>;
  marketCap_gte?: InputMaybe<Scalars["BigDecimal"]>;
  marketCap_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  marketCap_lt?: InputMaybe<Scalars["BigDecimal"]>;
  marketCap_lte?: InputMaybe<Scalars["BigDecimal"]>;
  marketCap_not?: InputMaybe<Scalars["BigDecimal"]>;
  marketCap_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  nextDistributedOhm?: InputMaybe<Scalars["BigDecimal"]>;
  nextDistributedOhm_gt?: InputMaybe<Scalars["BigDecimal"]>;
  nextDistributedOhm_gte?: InputMaybe<Scalars["BigDecimal"]>;
  nextDistributedOhm_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  nextDistributedOhm_lt?: InputMaybe<Scalars["BigDecimal"]>;
  nextDistributedOhm_lte?: InputMaybe<Scalars["BigDecimal"]>;
  nextDistributedOhm_not?: InputMaybe<Scalars["BigDecimal"]>;
  nextDistributedOhm_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  nextEpochRebase?: InputMaybe<Scalars["BigDecimal"]>;
  nextEpochRebase_gt?: InputMaybe<Scalars["BigDecimal"]>;
  nextEpochRebase_gte?: InputMaybe<Scalars["BigDecimal"]>;
  nextEpochRebase_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  nextEpochRebase_lt?: InputMaybe<Scalars["BigDecimal"]>;
  nextEpochRebase_lte?: InputMaybe<Scalars["BigDecimal"]>;
  nextEpochRebase_not?: InputMaybe<Scalars["BigDecimal"]>;
  nextEpochRebase_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  ohmCirculatingSupply?: InputMaybe<Scalars["BigDecimal"]>;
  ohmCirculatingSupplyBreakdown?: InputMaybe<Scalars["String"]>;
  ohmCirculatingSupplyBreakdown_?: InputMaybe<TokenRecordsWrapper_Filter>;
  ohmCirculatingSupplyBreakdown_contains?: InputMaybe<Scalars["String"]>;
  ohmCirculatingSupplyBreakdown_contains_nocase?: InputMaybe<Scalars["String"]>;
  ohmCirculatingSupplyBreakdown_ends_with?: InputMaybe<Scalars["String"]>;
  ohmCirculatingSupplyBreakdown_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  ohmCirculatingSupplyBreakdown_gt?: InputMaybe<Scalars["String"]>;
  ohmCirculatingSupplyBreakdown_gte?: InputMaybe<Scalars["String"]>;
  ohmCirculatingSupplyBreakdown_in?: InputMaybe<Array<Scalars["String"]>>;
  ohmCirculatingSupplyBreakdown_lt?: InputMaybe<Scalars["String"]>;
  ohmCirculatingSupplyBreakdown_lte?: InputMaybe<Scalars["String"]>;
  ohmCirculatingSupplyBreakdown_not?: InputMaybe<Scalars["String"]>;
  ohmCirculatingSupplyBreakdown_not_contains?: InputMaybe<Scalars["String"]>;
  ohmCirculatingSupplyBreakdown_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  ohmCirculatingSupplyBreakdown_not_ends_with?: InputMaybe<Scalars["String"]>;
  ohmCirculatingSupplyBreakdown_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  ohmCirculatingSupplyBreakdown_not_in?: InputMaybe<Array<Scalars["String"]>>;
  ohmCirculatingSupplyBreakdown_not_starts_with?: InputMaybe<Scalars["String"]>;
  ohmCirculatingSupplyBreakdown_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  ohmCirculatingSupplyBreakdown_starts_with?: InputMaybe<Scalars["String"]>;
  ohmCirculatingSupplyBreakdown_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  ohmCirculatingSupply_gt?: InputMaybe<Scalars["BigDecimal"]>;
  ohmCirculatingSupply_gte?: InputMaybe<Scalars["BigDecimal"]>;
  ohmCirculatingSupply_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  ohmCirculatingSupply_lt?: InputMaybe<Scalars["BigDecimal"]>;
  ohmCirculatingSupply_lte?: InputMaybe<Scalars["BigDecimal"]>;
  ohmCirculatingSupply_not?: InputMaybe<Scalars["BigDecimal"]>;
  ohmCirculatingSupply_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  ohmFloatingSupply?: InputMaybe<Scalars["BigDecimal"]>;
  ohmFloatingSupplyBreakdown?: InputMaybe<Scalars["String"]>;
  ohmFloatingSupplyBreakdown_?: InputMaybe<TokenRecordsWrapper_Filter>;
  ohmFloatingSupplyBreakdown_contains?: InputMaybe<Scalars["String"]>;
  ohmFloatingSupplyBreakdown_contains_nocase?: InputMaybe<Scalars["String"]>;
  ohmFloatingSupplyBreakdown_ends_with?: InputMaybe<Scalars["String"]>;
  ohmFloatingSupplyBreakdown_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  ohmFloatingSupplyBreakdown_gt?: InputMaybe<Scalars["String"]>;
  ohmFloatingSupplyBreakdown_gte?: InputMaybe<Scalars["String"]>;
  ohmFloatingSupplyBreakdown_in?: InputMaybe<Array<Scalars["String"]>>;
  ohmFloatingSupplyBreakdown_lt?: InputMaybe<Scalars["String"]>;
  ohmFloatingSupplyBreakdown_lte?: InputMaybe<Scalars["String"]>;
  ohmFloatingSupplyBreakdown_not?: InputMaybe<Scalars["String"]>;
  ohmFloatingSupplyBreakdown_not_contains?: InputMaybe<Scalars["String"]>;
  ohmFloatingSupplyBreakdown_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  ohmFloatingSupplyBreakdown_not_ends_with?: InputMaybe<Scalars["String"]>;
  ohmFloatingSupplyBreakdown_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  ohmFloatingSupplyBreakdown_not_in?: InputMaybe<Array<Scalars["String"]>>;
  ohmFloatingSupplyBreakdown_not_starts_with?: InputMaybe<Scalars["String"]>;
  ohmFloatingSupplyBreakdown_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  ohmFloatingSupplyBreakdown_starts_with?: InputMaybe<Scalars["String"]>;
  ohmFloatingSupplyBreakdown_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  ohmFloatingSupply_gt?: InputMaybe<Scalars["BigDecimal"]>;
  ohmFloatingSupply_gte?: InputMaybe<Scalars["BigDecimal"]>;
  ohmFloatingSupply_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  ohmFloatingSupply_lt?: InputMaybe<Scalars["BigDecimal"]>;
  ohmFloatingSupply_lte?: InputMaybe<Scalars["BigDecimal"]>;
  ohmFloatingSupply_not?: InputMaybe<Scalars["BigDecimal"]>;
  ohmFloatingSupply_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  ohmPrice?: InputMaybe<Scalars["BigDecimal"]>;
  ohmPrice_gt?: InputMaybe<Scalars["BigDecimal"]>;
  ohmPrice_gte?: InputMaybe<Scalars["BigDecimal"]>;
  ohmPrice_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  ohmPrice_lt?: InputMaybe<Scalars["BigDecimal"]>;
  ohmPrice_lte?: InputMaybe<Scalars["BigDecimal"]>;
  ohmPrice_not?: InputMaybe<Scalars["BigDecimal"]>;
  ohmPrice_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  runway2dot5k?: InputMaybe<Scalars["BigDecimal"]>;
  runway2dot5k_gt?: InputMaybe<Scalars["BigDecimal"]>;
  runway2dot5k_gte?: InputMaybe<Scalars["BigDecimal"]>;
  runway2dot5k_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  runway2dot5k_lt?: InputMaybe<Scalars["BigDecimal"]>;
  runway2dot5k_lte?: InputMaybe<Scalars["BigDecimal"]>;
  runway2dot5k_not?: InputMaybe<Scalars["BigDecimal"]>;
  runway2dot5k_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  runway5k?: InputMaybe<Scalars["BigDecimal"]>;
  runway5k_gt?: InputMaybe<Scalars["BigDecimal"]>;
  runway5k_gte?: InputMaybe<Scalars["BigDecimal"]>;
  runway5k_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  runway5k_lt?: InputMaybe<Scalars["BigDecimal"]>;
  runway5k_lte?: InputMaybe<Scalars["BigDecimal"]>;
  runway5k_not?: InputMaybe<Scalars["BigDecimal"]>;
  runway5k_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  runway7dot5k?: InputMaybe<Scalars["BigDecimal"]>;
  runway7dot5k_gt?: InputMaybe<Scalars["BigDecimal"]>;
  runway7dot5k_gte?: InputMaybe<Scalars["BigDecimal"]>;
  runway7dot5k_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  runway7dot5k_lt?: InputMaybe<Scalars["BigDecimal"]>;
  runway7dot5k_lte?: InputMaybe<Scalars["BigDecimal"]>;
  runway7dot5k_not?: InputMaybe<Scalars["BigDecimal"]>;
  runway7dot5k_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  runway10k?: InputMaybe<Scalars["BigDecimal"]>;
  runway10k_gt?: InputMaybe<Scalars["BigDecimal"]>;
  runway10k_gte?: InputMaybe<Scalars["BigDecimal"]>;
  runway10k_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  runway10k_lt?: InputMaybe<Scalars["BigDecimal"]>;
  runway10k_lte?: InputMaybe<Scalars["BigDecimal"]>;
  runway10k_not?: InputMaybe<Scalars["BigDecimal"]>;
  runway10k_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  runway20k?: InputMaybe<Scalars["BigDecimal"]>;
  runway20k_gt?: InputMaybe<Scalars["BigDecimal"]>;
  runway20k_gte?: InputMaybe<Scalars["BigDecimal"]>;
  runway20k_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  runway20k_lt?: InputMaybe<Scalars["BigDecimal"]>;
  runway20k_lte?: InputMaybe<Scalars["BigDecimal"]>;
  runway20k_not?: InputMaybe<Scalars["BigDecimal"]>;
  runway20k_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  runway50k?: InputMaybe<Scalars["BigDecimal"]>;
  runway50k_gt?: InputMaybe<Scalars["BigDecimal"]>;
  runway50k_gte?: InputMaybe<Scalars["BigDecimal"]>;
  runway50k_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  runway50k_lt?: InputMaybe<Scalars["BigDecimal"]>;
  runway50k_lte?: InputMaybe<Scalars["BigDecimal"]>;
  runway50k_not?: InputMaybe<Scalars["BigDecimal"]>;
  runway50k_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  runway70k?: InputMaybe<Scalars["BigDecimal"]>;
  runway70k_gt?: InputMaybe<Scalars["BigDecimal"]>;
  runway70k_gte?: InputMaybe<Scalars["BigDecimal"]>;
  runway70k_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  runway70k_lt?: InputMaybe<Scalars["BigDecimal"]>;
  runway70k_lte?: InputMaybe<Scalars["BigDecimal"]>;
  runway70k_not?: InputMaybe<Scalars["BigDecimal"]>;
  runway70k_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  runway100k?: InputMaybe<Scalars["BigDecimal"]>;
  runway100k_gt?: InputMaybe<Scalars["BigDecimal"]>;
  runway100k_gte?: InputMaybe<Scalars["BigDecimal"]>;
  runway100k_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  runway100k_lt?: InputMaybe<Scalars["BigDecimal"]>;
  runway100k_lte?: InputMaybe<Scalars["BigDecimal"]>;
  runway100k_not?: InputMaybe<Scalars["BigDecimal"]>;
  runway100k_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  runwayCurrent?: InputMaybe<Scalars["BigDecimal"]>;
  runwayCurrent_gt?: InputMaybe<Scalars["BigDecimal"]>;
  runwayCurrent_gte?: InputMaybe<Scalars["BigDecimal"]>;
  runwayCurrent_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  runwayCurrent_lt?: InputMaybe<Scalars["BigDecimal"]>;
  runwayCurrent_lte?: InputMaybe<Scalars["BigDecimal"]>;
  runwayCurrent_not?: InputMaybe<Scalars["BigDecimal"]>;
  runwayCurrent_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  sOhmCirculatingSupply?: InputMaybe<Scalars["BigDecimal"]>;
  sOhmCirculatingSupply_gt?: InputMaybe<Scalars["BigDecimal"]>;
  sOhmCirculatingSupply_gte?: InputMaybe<Scalars["BigDecimal"]>;
  sOhmCirculatingSupply_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  sOhmCirculatingSupply_lt?: InputMaybe<Scalars["BigDecimal"]>;
  sOhmCirculatingSupply_lte?: InputMaybe<Scalars["BigDecimal"]>;
  sOhmCirculatingSupply_not?: InputMaybe<Scalars["BigDecimal"]>;
  sOhmCirculatingSupply_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  timestamp?: InputMaybe<Scalars["BigInt"]>;
  timestampISO8901?: InputMaybe<Scalars["String"]>;
  timestampISO8901_contains?: InputMaybe<Scalars["String"]>;
  timestampISO8901_contains_nocase?: InputMaybe<Scalars["String"]>;
  timestampISO8901_ends_with?: InputMaybe<Scalars["String"]>;
  timestampISO8901_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  timestampISO8901_gt?: InputMaybe<Scalars["String"]>;
  timestampISO8901_gte?: InputMaybe<Scalars["String"]>;
  timestampISO8901_in?: InputMaybe<Array<Scalars["String"]>>;
  timestampISO8901_lt?: InputMaybe<Scalars["String"]>;
  timestampISO8901_lte?: InputMaybe<Scalars["String"]>;
  timestampISO8901_not?: InputMaybe<Scalars["String"]>;
  timestampISO8901_not_contains?: InputMaybe<Scalars["String"]>;
  timestampISO8901_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  timestampISO8901_not_ends_with?: InputMaybe<Scalars["String"]>;
  timestampISO8901_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  timestampISO8901_not_in?: InputMaybe<Array<Scalars["String"]>>;
  timestampISO8901_not_starts_with?: InputMaybe<Scalars["String"]>;
  timestampISO8901_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  timestampISO8901_starts_with?: InputMaybe<Scalars["String"]>;
  timestampISO8901_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  timestamp_gt?: InputMaybe<Scalars["BigInt"]>;
  timestamp_gte?: InputMaybe<Scalars["BigInt"]>;
  timestamp_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  timestamp_lt?: InputMaybe<Scalars["BigInt"]>;
  timestamp_lte?: InputMaybe<Scalars["BigInt"]>;
  timestamp_not?: InputMaybe<Scalars["BigInt"]>;
  timestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  totalSupply?: InputMaybe<Scalars["BigDecimal"]>;
  totalSupply_gt?: InputMaybe<Scalars["BigDecimal"]>;
  totalSupply_gte?: InputMaybe<Scalars["BigDecimal"]>;
  totalSupply_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  totalSupply_lt?: InputMaybe<Scalars["BigDecimal"]>;
  totalSupply_lte?: InputMaybe<Scalars["BigDecimal"]>;
  totalSupply_not?: InputMaybe<Scalars["BigDecimal"]>;
  totalSupply_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  totalValueLocked?: InputMaybe<Scalars["BigDecimal"]>;
  totalValueLocked_gt?: InputMaybe<Scalars["BigDecimal"]>;
  totalValueLocked_gte?: InputMaybe<Scalars["BigDecimal"]>;
  totalValueLocked_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  totalValueLocked_lt?: InputMaybe<Scalars["BigDecimal"]>;
  totalValueLocked_lte?: InputMaybe<Scalars["BigDecimal"]>;
  totalValueLocked_not?: InputMaybe<Scalars["BigDecimal"]>;
  totalValueLocked_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryCVXMarketValue?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryCVXMarketValueComponents?: InputMaybe<Scalars["String"]>;
  treasuryCVXMarketValueComponents_?: InputMaybe<TokenRecordsWrapper_Filter>;
  treasuryCVXMarketValueComponents_contains?: InputMaybe<Scalars["String"]>;
  treasuryCVXMarketValueComponents_contains_nocase?: InputMaybe<Scalars["String"]>;
  treasuryCVXMarketValueComponents_ends_with?: InputMaybe<Scalars["String"]>;
  treasuryCVXMarketValueComponents_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryCVXMarketValueComponents_gt?: InputMaybe<Scalars["String"]>;
  treasuryCVXMarketValueComponents_gte?: InputMaybe<Scalars["String"]>;
  treasuryCVXMarketValueComponents_in?: InputMaybe<Array<Scalars["String"]>>;
  treasuryCVXMarketValueComponents_lt?: InputMaybe<Scalars["String"]>;
  treasuryCVXMarketValueComponents_lte?: InputMaybe<Scalars["String"]>;
  treasuryCVXMarketValueComponents_not?: InputMaybe<Scalars["String"]>;
  treasuryCVXMarketValueComponents_not_contains?: InputMaybe<Scalars["String"]>;
  treasuryCVXMarketValueComponents_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  treasuryCVXMarketValueComponents_not_ends_with?: InputMaybe<Scalars["String"]>;
  treasuryCVXMarketValueComponents_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryCVXMarketValueComponents_not_in?: InputMaybe<Array<Scalars["String"]>>;
  treasuryCVXMarketValueComponents_not_starts_with?: InputMaybe<Scalars["String"]>;
  treasuryCVXMarketValueComponents_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryCVXMarketValueComponents_starts_with?: InputMaybe<Scalars["String"]>;
  treasuryCVXMarketValueComponents_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryCVXMarketValue_gt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryCVXMarketValue_gte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryCVXMarketValue_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryCVXMarketValue_lt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryCVXMarketValue_lte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryCVXMarketValue_not?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryCVXMarketValue_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryDaiMarketValue?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryDaiMarketValueComponents?: InputMaybe<Scalars["String"]>;
  treasuryDaiMarketValueComponents_?: InputMaybe<TokenRecordsWrapper_Filter>;
  treasuryDaiMarketValueComponents_contains?: InputMaybe<Scalars["String"]>;
  treasuryDaiMarketValueComponents_contains_nocase?: InputMaybe<Scalars["String"]>;
  treasuryDaiMarketValueComponents_ends_with?: InputMaybe<Scalars["String"]>;
  treasuryDaiMarketValueComponents_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryDaiMarketValueComponents_gt?: InputMaybe<Scalars["String"]>;
  treasuryDaiMarketValueComponents_gte?: InputMaybe<Scalars["String"]>;
  treasuryDaiMarketValueComponents_in?: InputMaybe<Array<Scalars["String"]>>;
  treasuryDaiMarketValueComponents_lt?: InputMaybe<Scalars["String"]>;
  treasuryDaiMarketValueComponents_lte?: InputMaybe<Scalars["String"]>;
  treasuryDaiMarketValueComponents_not?: InputMaybe<Scalars["String"]>;
  treasuryDaiMarketValueComponents_not_contains?: InputMaybe<Scalars["String"]>;
  treasuryDaiMarketValueComponents_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  treasuryDaiMarketValueComponents_not_ends_with?: InputMaybe<Scalars["String"]>;
  treasuryDaiMarketValueComponents_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryDaiMarketValueComponents_not_in?: InputMaybe<Array<Scalars["String"]>>;
  treasuryDaiMarketValueComponents_not_starts_with?: InputMaybe<Scalars["String"]>;
  treasuryDaiMarketValueComponents_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryDaiMarketValueComponents_starts_with?: InputMaybe<Scalars["String"]>;
  treasuryDaiMarketValueComponents_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryDaiMarketValue_gt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryDaiMarketValue_gte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryDaiMarketValue_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryDaiMarketValue_lt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryDaiMarketValue_lte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryDaiMarketValue_not?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryDaiMarketValue_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryDaiRiskFreeValue?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryDaiRiskFreeValueComponents?: InputMaybe<Scalars["String"]>;
  treasuryDaiRiskFreeValueComponents_?: InputMaybe<TokenRecordsWrapper_Filter>;
  treasuryDaiRiskFreeValueComponents_contains?: InputMaybe<Scalars["String"]>;
  treasuryDaiRiskFreeValueComponents_contains_nocase?: InputMaybe<Scalars["String"]>;
  treasuryDaiRiskFreeValueComponents_ends_with?: InputMaybe<Scalars["String"]>;
  treasuryDaiRiskFreeValueComponents_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryDaiRiskFreeValueComponents_gt?: InputMaybe<Scalars["String"]>;
  treasuryDaiRiskFreeValueComponents_gte?: InputMaybe<Scalars["String"]>;
  treasuryDaiRiskFreeValueComponents_in?: InputMaybe<Array<Scalars["String"]>>;
  treasuryDaiRiskFreeValueComponents_lt?: InputMaybe<Scalars["String"]>;
  treasuryDaiRiskFreeValueComponents_lte?: InputMaybe<Scalars["String"]>;
  treasuryDaiRiskFreeValueComponents_not?: InputMaybe<Scalars["String"]>;
  treasuryDaiRiskFreeValueComponents_not_contains?: InputMaybe<Scalars["String"]>;
  treasuryDaiRiskFreeValueComponents_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  treasuryDaiRiskFreeValueComponents_not_ends_with?: InputMaybe<Scalars["String"]>;
  treasuryDaiRiskFreeValueComponents_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryDaiRiskFreeValueComponents_not_in?: InputMaybe<Array<Scalars["String"]>>;
  treasuryDaiRiskFreeValueComponents_not_starts_with?: InputMaybe<Scalars["String"]>;
  treasuryDaiRiskFreeValueComponents_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryDaiRiskFreeValueComponents_starts_with?: InputMaybe<Scalars["String"]>;
  treasuryDaiRiskFreeValueComponents_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryDaiRiskFreeValue_gt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryDaiRiskFreeValue_gte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryDaiRiskFreeValue_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryDaiRiskFreeValue_lt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryDaiRiskFreeValue_lte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryDaiRiskFreeValue_not?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryDaiRiskFreeValue_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryFXSMarketValue?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryFXSMarketValueComponents?: InputMaybe<Scalars["String"]>;
  treasuryFXSMarketValueComponents_?: InputMaybe<TokenRecordsWrapper_Filter>;
  treasuryFXSMarketValueComponents_contains?: InputMaybe<Scalars["String"]>;
  treasuryFXSMarketValueComponents_contains_nocase?: InputMaybe<Scalars["String"]>;
  treasuryFXSMarketValueComponents_ends_with?: InputMaybe<Scalars["String"]>;
  treasuryFXSMarketValueComponents_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryFXSMarketValueComponents_gt?: InputMaybe<Scalars["String"]>;
  treasuryFXSMarketValueComponents_gte?: InputMaybe<Scalars["String"]>;
  treasuryFXSMarketValueComponents_in?: InputMaybe<Array<Scalars["String"]>>;
  treasuryFXSMarketValueComponents_lt?: InputMaybe<Scalars["String"]>;
  treasuryFXSMarketValueComponents_lte?: InputMaybe<Scalars["String"]>;
  treasuryFXSMarketValueComponents_not?: InputMaybe<Scalars["String"]>;
  treasuryFXSMarketValueComponents_not_contains?: InputMaybe<Scalars["String"]>;
  treasuryFXSMarketValueComponents_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  treasuryFXSMarketValueComponents_not_ends_with?: InputMaybe<Scalars["String"]>;
  treasuryFXSMarketValueComponents_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryFXSMarketValueComponents_not_in?: InputMaybe<Array<Scalars["String"]>>;
  treasuryFXSMarketValueComponents_not_starts_with?: InputMaybe<Scalars["String"]>;
  treasuryFXSMarketValueComponents_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryFXSMarketValueComponents_starts_with?: InputMaybe<Scalars["String"]>;
  treasuryFXSMarketValueComponents_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryFXSMarketValue_gt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryFXSMarketValue_gte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryFXSMarketValue_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryFXSMarketValue_lt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryFXSMarketValue_lte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryFXSMarketValue_not?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryFXSMarketValue_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryFeiMarketValue?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryFeiMarketValueComponents?: InputMaybe<Scalars["String"]>;
  treasuryFeiMarketValueComponents_?: InputMaybe<TokenRecordsWrapper_Filter>;
  treasuryFeiMarketValueComponents_contains?: InputMaybe<Scalars["String"]>;
  treasuryFeiMarketValueComponents_contains_nocase?: InputMaybe<Scalars["String"]>;
  treasuryFeiMarketValueComponents_ends_with?: InputMaybe<Scalars["String"]>;
  treasuryFeiMarketValueComponents_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryFeiMarketValueComponents_gt?: InputMaybe<Scalars["String"]>;
  treasuryFeiMarketValueComponents_gte?: InputMaybe<Scalars["String"]>;
  treasuryFeiMarketValueComponents_in?: InputMaybe<Array<Scalars["String"]>>;
  treasuryFeiMarketValueComponents_lt?: InputMaybe<Scalars["String"]>;
  treasuryFeiMarketValueComponents_lte?: InputMaybe<Scalars["String"]>;
  treasuryFeiMarketValueComponents_not?: InputMaybe<Scalars["String"]>;
  treasuryFeiMarketValueComponents_not_contains?: InputMaybe<Scalars["String"]>;
  treasuryFeiMarketValueComponents_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  treasuryFeiMarketValueComponents_not_ends_with?: InputMaybe<Scalars["String"]>;
  treasuryFeiMarketValueComponents_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryFeiMarketValueComponents_not_in?: InputMaybe<Array<Scalars["String"]>>;
  treasuryFeiMarketValueComponents_not_starts_with?: InputMaybe<Scalars["String"]>;
  treasuryFeiMarketValueComponents_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryFeiMarketValueComponents_starts_with?: InputMaybe<Scalars["String"]>;
  treasuryFeiMarketValueComponents_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryFeiMarketValue_gt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryFeiMarketValue_gte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryFeiMarketValue_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryFeiMarketValue_lt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryFeiMarketValue_lte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryFeiMarketValue_not?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryFeiMarketValue_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryFeiRiskFreeValue?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryFeiRiskFreeValueComponents?: InputMaybe<Scalars["String"]>;
  treasuryFeiRiskFreeValueComponents_?: InputMaybe<TokenRecordsWrapper_Filter>;
  treasuryFeiRiskFreeValueComponents_contains?: InputMaybe<Scalars["String"]>;
  treasuryFeiRiskFreeValueComponents_contains_nocase?: InputMaybe<Scalars["String"]>;
  treasuryFeiRiskFreeValueComponents_ends_with?: InputMaybe<Scalars["String"]>;
  treasuryFeiRiskFreeValueComponents_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryFeiRiskFreeValueComponents_gt?: InputMaybe<Scalars["String"]>;
  treasuryFeiRiskFreeValueComponents_gte?: InputMaybe<Scalars["String"]>;
  treasuryFeiRiskFreeValueComponents_in?: InputMaybe<Array<Scalars["String"]>>;
  treasuryFeiRiskFreeValueComponents_lt?: InputMaybe<Scalars["String"]>;
  treasuryFeiRiskFreeValueComponents_lte?: InputMaybe<Scalars["String"]>;
  treasuryFeiRiskFreeValueComponents_not?: InputMaybe<Scalars["String"]>;
  treasuryFeiRiskFreeValueComponents_not_contains?: InputMaybe<Scalars["String"]>;
  treasuryFeiRiskFreeValueComponents_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  treasuryFeiRiskFreeValueComponents_not_ends_with?: InputMaybe<Scalars["String"]>;
  treasuryFeiRiskFreeValueComponents_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryFeiRiskFreeValueComponents_not_in?: InputMaybe<Array<Scalars["String"]>>;
  treasuryFeiRiskFreeValueComponents_not_starts_with?: InputMaybe<Scalars["String"]>;
  treasuryFeiRiskFreeValueComponents_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryFeiRiskFreeValueComponents_starts_with?: InputMaybe<Scalars["String"]>;
  treasuryFeiRiskFreeValueComponents_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryFeiRiskFreeValue_gt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryFeiRiskFreeValue_gte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryFeiRiskFreeValue_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryFeiRiskFreeValue_lt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryFeiRiskFreeValue_lte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryFeiRiskFreeValue_not?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryFeiRiskFreeValue_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryFraxMarketValue?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryFraxMarketValueComponents?: InputMaybe<Scalars["String"]>;
  treasuryFraxMarketValueComponents_?: InputMaybe<TokenRecordsWrapper_Filter>;
  treasuryFraxMarketValueComponents_contains?: InputMaybe<Scalars["String"]>;
  treasuryFraxMarketValueComponents_contains_nocase?: InputMaybe<Scalars["String"]>;
  treasuryFraxMarketValueComponents_ends_with?: InputMaybe<Scalars["String"]>;
  treasuryFraxMarketValueComponents_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryFraxMarketValueComponents_gt?: InputMaybe<Scalars["String"]>;
  treasuryFraxMarketValueComponents_gte?: InputMaybe<Scalars["String"]>;
  treasuryFraxMarketValueComponents_in?: InputMaybe<Array<Scalars["String"]>>;
  treasuryFraxMarketValueComponents_lt?: InputMaybe<Scalars["String"]>;
  treasuryFraxMarketValueComponents_lte?: InputMaybe<Scalars["String"]>;
  treasuryFraxMarketValueComponents_not?: InputMaybe<Scalars["String"]>;
  treasuryFraxMarketValueComponents_not_contains?: InputMaybe<Scalars["String"]>;
  treasuryFraxMarketValueComponents_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  treasuryFraxMarketValueComponents_not_ends_with?: InputMaybe<Scalars["String"]>;
  treasuryFraxMarketValueComponents_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryFraxMarketValueComponents_not_in?: InputMaybe<Array<Scalars["String"]>>;
  treasuryFraxMarketValueComponents_not_starts_with?: InputMaybe<Scalars["String"]>;
  treasuryFraxMarketValueComponents_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryFraxMarketValueComponents_starts_with?: InputMaybe<Scalars["String"]>;
  treasuryFraxMarketValueComponents_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryFraxMarketValue_gt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryFraxMarketValue_gte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryFraxMarketValue_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryFraxMarketValue_lt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryFraxMarketValue_lte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryFraxMarketValue_not?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryFraxMarketValue_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryFraxRiskFreeValue?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryFraxRiskFreeValueComponents?: InputMaybe<Scalars["String"]>;
  treasuryFraxRiskFreeValueComponents_?: InputMaybe<TokenRecordsWrapper_Filter>;
  treasuryFraxRiskFreeValueComponents_contains?: InputMaybe<Scalars["String"]>;
  treasuryFraxRiskFreeValueComponents_contains_nocase?: InputMaybe<Scalars["String"]>;
  treasuryFraxRiskFreeValueComponents_ends_with?: InputMaybe<Scalars["String"]>;
  treasuryFraxRiskFreeValueComponents_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryFraxRiskFreeValueComponents_gt?: InputMaybe<Scalars["String"]>;
  treasuryFraxRiskFreeValueComponents_gte?: InputMaybe<Scalars["String"]>;
  treasuryFraxRiskFreeValueComponents_in?: InputMaybe<Array<Scalars["String"]>>;
  treasuryFraxRiskFreeValueComponents_lt?: InputMaybe<Scalars["String"]>;
  treasuryFraxRiskFreeValueComponents_lte?: InputMaybe<Scalars["String"]>;
  treasuryFraxRiskFreeValueComponents_not?: InputMaybe<Scalars["String"]>;
  treasuryFraxRiskFreeValueComponents_not_contains?: InputMaybe<Scalars["String"]>;
  treasuryFraxRiskFreeValueComponents_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  treasuryFraxRiskFreeValueComponents_not_ends_with?: InputMaybe<Scalars["String"]>;
  treasuryFraxRiskFreeValueComponents_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryFraxRiskFreeValueComponents_not_in?: InputMaybe<Array<Scalars["String"]>>;
  treasuryFraxRiskFreeValueComponents_not_starts_with?: InputMaybe<Scalars["String"]>;
  treasuryFraxRiskFreeValueComponents_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryFraxRiskFreeValueComponents_starts_with?: InputMaybe<Scalars["String"]>;
  treasuryFraxRiskFreeValueComponents_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryFraxRiskFreeValue_gt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryFraxRiskFreeValue_gte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryFraxRiskFreeValue_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryFraxRiskFreeValue_lt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryFraxRiskFreeValue_lte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryFraxRiskFreeValue_not?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryFraxRiskFreeValue_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryLPValue?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryLPValueComponents?: InputMaybe<Scalars["String"]>;
  treasuryLPValueComponents_?: InputMaybe<TokenRecordsWrapper_Filter>;
  treasuryLPValueComponents_contains?: InputMaybe<Scalars["String"]>;
  treasuryLPValueComponents_contains_nocase?: InputMaybe<Scalars["String"]>;
  treasuryLPValueComponents_ends_with?: InputMaybe<Scalars["String"]>;
  treasuryLPValueComponents_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryLPValueComponents_gt?: InputMaybe<Scalars["String"]>;
  treasuryLPValueComponents_gte?: InputMaybe<Scalars["String"]>;
  treasuryLPValueComponents_in?: InputMaybe<Array<Scalars["String"]>>;
  treasuryLPValueComponents_lt?: InputMaybe<Scalars["String"]>;
  treasuryLPValueComponents_lte?: InputMaybe<Scalars["String"]>;
  treasuryLPValueComponents_not?: InputMaybe<Scalars["String"]>;
  treasuryLPValueComponents_not_contains?: InputMaybe<Scalars["String"]>;
  treasuryLPValueComponents_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  treasuryLPValueComponents_not_ends_with?: InputMaybe<Scalars["String"]>;
  treasuryLPValueComponents_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryLPValueComponents_not_in?: InputMaybe<Array<Scalars["String"]>>;
  treasuryLPValueComponents_not_starts_with?: InputMaybe<Scalars["String"]>;
  treasuryLPValueComponents_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryLPValueComponents_starts_with?: InputMaybe<Scalars["String"]>;
  treasuryLPValueComponents_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryLPValue_gt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryLPValue_gte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryLPValue_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryLPValue_lt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryLPValue_lte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryLPValue_not?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryLPValue_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryLiquidBacking?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryLiquidBackingComponents?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingComponents_?: InputMaybe<TokenRecordsWrapper_Filter>;
  treasuryLiquidBackingComponents_contains?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingComponents_contains_nocase?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingComponents_ends_with?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingComponents_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingComponents_gt?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingComponents_gte?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingComponents_in?: InputMaybe<Array<Scalars["String"]>>;
  treasuryLiquidBackingComponents_lt?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingComponents_lte?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingComponents_not?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingComponents_not_contains?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingComponents_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingComponents_not_ends_with?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingComponents_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingComponents_not_in?: InputMaybe<Array<Scalars["String"]>>;
  treasuryLiquidBackingComponents_not_starts_with?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingComponents_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingComponents_starts_with?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingComponents_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingPerGOhm?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryLiquidBackingPerGOhm_gt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryLiquidBackingPerGOhm_gte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryLiquidBackingPerGOhm_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryLiquidBackingPerGOhm_lt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryLiquidBackingPerGOhm_lte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryLiquidBackingPerGOhm_not?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryLiquidBackingPerGOhm_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryLiquidBackingPerOhmCirculating?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryLiquidBackingPerOhmCirculating_gt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryLiquidBackingPerOhmCirculating_gte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryLiquidBackingPerOhmCirculating_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryLiquidBackingPerOhmCirculating_lt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryLiquidBackingPerOhmCirculating_lte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryLiquidBackingPerOhmCirculating_not?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryLiquidBackingPerOhmCirculating_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryLiquidBackingPerOhmFloating?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryLiquidBackingPerOhmFloating_gt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryLiquidBackingPerOhmFloating_gte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryLiquidBackingPerOhmFloating_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryLiquidBackingPerOhmFloating_lt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryLiquidBackingPerOhmFloating_lte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryLiquidBackingPerOhmFloating_not?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryLiquidBackingPerOhmFloating_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryLiquidBackingProtocolOwnedLiquidity?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryLiquidBackingProtocolOwnedLiquidityComponents?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingProtocolOwnedLiquidityComponents_?: InputMaybe<TokenRecordsWrapper_Filter>;
  treasuryLiquidBackingProtocolOwnedLiquidityComponents_contains?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingProtocolOwnedLiquidityComponents_contains_nocase?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingProtocolOwnedLiquidityComponents_ends_with?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingProtocolOwnedLiquidityComponents_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingProtocolOwnedLiquidityComponents_gt?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingProtocolOwnedLiquidityComponents_gte?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingProtocolOwnedLiquidityComponents_in?: InputMaybe<Array<Scalars["String"]>>;
  treasuryLiquidBackingProtocolOwnedLiquidityComponents_lt?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingProtocolOwnedLiquidityComponents_lte?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingProtocolOwnedLiquidityComponents_not?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingProtocolOwnedLiquidityComponents_not_contains?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingProtocolOwnedLiquidityComponents_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingProtocolOwnedLiquidityComponents_not_ends_with?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingProtocolOwnedLiquidityComponents_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingProtocolOwnedLiquidityComponents_not_in?: InputMaybe<Array<Scalars["String"]>>;
  treasuryLiquidBackingProtocolOwnedLiquidityComponents_not_starts_with?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingProtocolOwnedLiquidityComponents_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingProtocolOwnedLiquidityComponents_starts_with?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingProtocolOwnedLiquidityComponents_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingProtocolOwnedLiquidity_gt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryLiquidBackingProtocolOwnedLiquidity_gte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryLiquidBackingProtocolOwnedLiquidity_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryLiquidBackingProtocolOwnedLiquidity_lt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryLiquidBackingProtocolOwnedLiquidity_lte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryLiquidBackingProtocolOwnedLiquidity_not?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryLiquidBackingProtocolOwnedLiquidity_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryLiquidBackingStable?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryLiquidBackingStableComponents?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingStableComponents_?: InputMaybe<TokenRecordsWrapper_Filter>;
  treasuryLiquidBackingStableComponents_contains?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingStableComponents_contains_nocase?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingStableComponents_ends_with?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingStableComponents_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingStableComponents_gt?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingStableComponents_gte?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingStableComponents_in?: InputMaybe<Array<Scalars["String"]>>;
  treasuryLiquidBackingStableComponents_lt?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingStableComponents_lte?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingStableComponents_not?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingStableComponents_not_contains?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingStableComponents_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingStableComponents_not_ends_with?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingStableComponents_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingStableComponents_not_in?: InputMaybe<Array<Scalars["String"]>>;
  treasuryLiquidBackingStableComponents_not_starts_with?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingStableComponents_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingStableComponents_starts_with?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingStableComponents_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingStable_gt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryLiquidBackingStable_gte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryLiquidBackingStable_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryLiquidBackingStable_lt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryLiquidBackingStable_lte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryLiquidBackingStable_not?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryLiquidBackingStable_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryLiquidBackingVolatile?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryLiquidBackingVolatileComponents?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingVolatileComponents_?: InputMaybe<TokenRecordsWrapper_Filter>;
  treasuryLiquidBackingVolatileComponents_contains?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingVolatileComponents_contains_nocase?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingVolatileComponents_ends_with?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingVolatileComponents_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingVolatileComponents_gt?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingVolatileComponents_gte?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingVolatileComponents_in?: InputMaybe<Array<Scalars["String"]>>;
  treasuryLiquidBackingVolatileComponents_lt?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingVolatileComponents_lte?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingVolatileComponents_not?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingVolatileComponents_not_contains?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingVolatileComponents_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingVolatileComponents_not_ends_with?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingVolatileComponents_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingVolatileComponents_not_in?: InputMaybe<Array<Scalars["String"]>>;
  treasuryLiquidBackingVolatileComponents_not_starts_with?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingVolatileComponents_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingVolatileComponents_starts_with?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingVolatileComponents_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryLiquidBackingVolatile_gt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryLiquidBackingVolatile_gte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryLiquidBackingVolatile_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryLiquidBackingVolatile_lt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryLiquidBackingVolatile_lte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryLiquidBackingVolatile_not?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryLiquidBackingVolatile_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryLiquidBacking_gt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryLiquidBacking_gte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryLiquidBacking_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryLiquidBacking_lt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryLiquidBacking_lte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryLiquidBacking_not?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryLiquidBacking_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryLusdMarketValue?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryLusdMarketValueComponents?: InputMaybe<Scalars["String"]>;
  treasuryLusdMarketValueComponents_?: InputMaybe<TokenRecordsWrapper_Filter>;
  treasuryLusdMarketValueComponents_contains?: InputMaybe<Scalars["String"]>;
  treasuryLusdMarketValueComponents_contains_nocase?: InputMaybe<Scalars["String"]>;
  treasuryLusdMarketValueComponents_ends_with?: InputMaybe<Scalars["String"]>;
  treasuryLusdMarketValueComponents_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryLusdMarketValueComponents_gt?: InputMaybe<Scalars["String"]>;
  treasuryLusdMarketValueComponents_gte?: InputMaybe<Scalars["String"]>;
  treasuryLusdMarketValueComponents_in?: InputMaybe<Array<Scalars["String"]>>;
  treasuryLusdMarketValueComponents_lt?: InputMaybe<Scalars["String"]>;
  treasuryLusdMarketValueComponents_lte?: InputMaybe<Scalars["String"]>;
  treasuryLusdMarketValueComponents_not?: InputMaybe<Scalars["String"]>;
  treasuryLusdMarketValueComponents_not_contains?: InputMaybe<Scalars["String"]>;
  treasuryLusdMarketValueComponents_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  treasuryLusdMarketValueComponents_not_ends_with?: InputMaybe<Scalars["String"]>;
  treasuryLusdMarketValueComponents_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryLusdMarketValueComponents_not_in?: InputMaybe<Array<Scalars["String"]>>;
  treasuryLusdMarketValueComponents_not_starts_with?: InputMaybe<Scalars["String"]>;
  treasuryLusdMarketValueComponents_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryLusdMarketValueComponents_starts_with?: InputMaybe<Scalars["String"]>;
  treasuryLusdMarketValueComponents_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryLusdMarketValue_gt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryLusdMarketValue_gte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryLusdMarketValue_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryLusdMarketValue_lt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryLusdMarketValue_lte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryLusdMarketValue_not?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryLusdMarketValue_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryLusdRiskFreeValue?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryLusdRiskFreeValueComponents?: InputMaybe<Scalars["String"]>;
  treasuryLusdRiskFreeValueComponents_?: InputMaybe<TokenRecordsWrapper_Filter>;
  treasuryLusdRiskFreeValueComponents_contains?: InputMaybe<Scalars["String"]>;
  treasuryLusdRiskFreeValueComponents_contains_nocase?: InputMaybe<Scalars["String"]>;
  treasuryLusdRiskFreeValueComponents_ends_with?: InputMaybe<Scalars["String"]>;
  treasuryLusdRiskFreeValueComponents_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryLusdRiskFreeValueComponents_gt?: InputMaybe<Scalars["String"]>;
  treasuryLusdRiskFreeValueComponents_gte?: InputMaybe<Scalars["String"]>;
  treasuryLusdRiskFreeValueComponents_in?: InputMaybe<Array<Scalars["String"]>>;
  treasuryLusdRiskFreeValueComponents_lt?: InputMaybe<Scalars["String"]>;
  treasuryLusdRiskFreeValueComponents_lte?: InputMaybe<Scalars["String"]>;
  treasuryLusdRiskFreeValueComponents_not?: InputMaybe<Scalars["String"]>;
  treasuryLusdRiskFreeValueComponents_not_contains?: InputMaybe<Scalars["String"]>;
  treasuryLusdRiskFreeValueComponents_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  treasuryLusdRiskFreeValueComponents_not_ends_with?: InputMaybe<Scalars["String"]>;
  treasuryLusdRiskFreeValueComponents_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryLusdRiskFreeValueComponents_not_in?: InputMaybe<Array<Scalars["String"]>>;
  treasuryLusdRiskFreeValueComponents_not_starts_with?: InputMaybe<Scalars["String"]>;
  treasuryLusdRiskFreeValueComponents_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryLusdRiskFreeValueComponents_starts_with?: InputMaybe<Scalars["String"]>;
  treasuryLusdRiskFreeValueComponents_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryLusdRiskFreeValue_gt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryLusdRiskFreeValue_gte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryLusdRiskFreeValue_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryLusdRiskFreeValue_lt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryLusdRiskFreeValue_lte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryLusdRiskFreeValue_not?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryLusdRiskFreeValue_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryMarketValue?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryMarketValueComponents?: InputMaybe<Scalars["String"]>;
  treasuryMarketValueComponents_?: InputMaybe<TokenRecordsWrapper_Filter>;
  treasuryMarketValueComponents_contains?: InputMaybe<Scalars["String"]>;
  treasuryMarketValueComponents_contains_nocase?: InputMaybe<Scalars["String"]>;
  treasuryMarketValueComponents_ends_with?: InputMaybe<Scalars["String"]>;
  treasuryMarketValueComponents_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryMarketValueComponents_gt?: InputMaybe<Scalars["String"]>;
  treasuryMarketValueComponents_gte?: InputMaybe<Scalars["String"]>;
  treasuryMarketValueComponents_in?: InputMaybe<Array<Scalars["String"]>>;
  treasuryMarketValueComponents_lt?: InputMaybe<Scalars["String"]>;
  treasuryMarketValueComponents_lte?: InputMaybe<Scalars["String"]>;
  treasuryMarketValueComponents_not?: InputMaybe<Scalars["String"]>;
  treasuryMarketValueComponents_not_contains?: InputMaybe<Scalars["String"]>;
  treasuryMarketValueComponents_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  treasuryMarketValueComponents_not_ends_with?: InputMaybe<Scalars["String"]>;
  treasuryMarketValueComponents_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryMarketValueComponents_not_in?: InputMaybe<Array<Scalars["String"]>>;
  treasuryMarketValueComponents_not_starts_with?: InputMaybe<Scalars["String"]>;
  treasuryMarketValueComponents_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryMarketValueComponents_starts_with?: InputMaybe<Scalars["String"]>;
  treasuryMarketValueComponents_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryMarketValue_gt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryMarketValue_gte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryMarketValue_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryMarketValue_lt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryMarketValue_lte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryMarketValue_not?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryMarketValue_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryOhmDaiPOL?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryOhmDaiPOL_gt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryOhmDaiPOL_gte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryOhmDaiPOL_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryOhmDaiPOL_lt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryOhmDaiPOL_lte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryOhmDaiPOL_not?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryOhmDaiPOL_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryOhmEthPOL?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryOhmEthPOL_gt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryOhmEthPOL_gte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryOhmEthPOL_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryOhmEthPOL_lt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryOhmEthPOL_lte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryOhmEthPOL_not?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryOhmEthPOL_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryOhmFraxPOL?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryOhmFraxPOL_gt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryOhmFraxPOL_gte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryOhmFraxPOL_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryOhmFraxPOL_lt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryOhmFraxPOL_lte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryOhmFraxPOL_not?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryOhmFraxPOL_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryOhmLusdPOL?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryOhmLusdPOL_gt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryOhmLusdPOL_gte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryOhmLusdPOL_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryOhmLusdPOL_lt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryOhmLusdPOL_lte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryOhmLusdPOL_not?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryOhmLusdPOL_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryOtherMarketValue?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryOtherMarketValueComponents?: InputMaybe<Scalars["String"]>;
  treasuryOtherMarketValueComponents_?: InputMaybe<TokenRecordsWrapper_Filter>;
  treasuryOtherMarketValueComponents_contains?: InputMaybe<Scalars["String"]>;
  treasuryOtherMarketValueComponents_contains_nocase?: InputMaybe<Scalars["String"]>;
  treasuryOtherMarketValueComponents_ends_with?: InputMaybe<Scalars["String"]>;
  treasuryOtherMarketValueComponents_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryOtherMarketValueComponents_gt?: InputMaybe<Scalars["String"]>;
  treasuryOtherMarketValueComponents_gte?: InputMaybe<Scalars["String"]>;
  treasuryOtherMarketValueComponents_in?: InputMaybe<Array<Scalars["String"]>>;
  treasuryOtherMarketValueComponents_lt?: InputMaybe<Scalars["String"]>;
  treasuryOtherMarketValueComponents_lte?: InputMaybe<Scalars["String"]>;
  treasuryOtherMarketValueComponents_not?: InputMaybe<Scalars["String"]>;
  treasuryOtherMarketValueComponents_not_contains?: InputMaybe<Scalars["String"]>;
  treasuryOtherMarketValueComponents_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  treasuryOtherMarketValueComponents_not_ends_with?: InputMaybe<Scalars["String"]>;
  treasuryOtherMarketValueComponents_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryOtherMarketValueComponents_not_in?: InputMaybe<Array<Scalars["String"]>>;
  treasuryOtherMarketValueComponents_not_starts_with?: InputMaybe<Scalars["String"]>;
  treasuryOtherMarketValueComponents_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryOtherMarketValueComponents_starts_with?: InputMaybe<Scalars["String"]>;
  treasuryOtherMarketValueComponents_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryOtherMarketValue_gt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryOtherMarketValue_gte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryOtherMarketValue_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryOtherMarketValue_lt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryOtherMarketValue_lte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryOtherMarketValue_not?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryOtherMarketValue_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryProtocolOwnedLiquidityBacking?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryProtocolOwnedLiquidityBackingComponents?: InputMaybe<Scalars["String"]>;
  treasuryProtocolOwnedLiquidityBackingComponents_?: InputMaybe<TokenRecordsWrapper_Filter>;
  treasuryProtocolOwnedLiquidityBackingComponents_contains?: InputMaybe<Scalars["String"]>;
  treasuryProtocolOwnedLiquidityBackingComponents_contains_nocase?: InputMaybe<Scalars["String"]>;
  treasuryProtocolOwnedLiquidityBackingComponents_ends_with?: InputMaybe<Scalars["String"]>;
  treasuryProtocolOwnedLiquidityBackingComponents_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryProtocolOwnedLiquidityBackingComponents_gt?: InputMaybe<Scalars["String"]>;
  treasuryProtocolOwnedLiquidityBackingComponents_gte?: InputMaybe<Scalars["String"]>;
  treasuryProtocolOwnedLiquidityBackingComponents_in?: InputMaybe<Array<Scalars["String"]>>;
  treasuryProtocolOwnedLiquidityBackingComponents_lt?: InputMaybe<Scalars["String"]>;
  treasuryProtocolOwnedLiquidityBackingComponents_lte?: InputMaybe<Scalars["String"]>;
  treasuryProtocolOwnedLiquidityBackingComponents_not?: InputMaybe<Scalars["String"]>;
  treasuryProtocolOwnedLiquidityBackingComponents_not_contains?: InputMaybe<Scalars["String"]>;
  treasuryProtocolOwnedLiquidityBackingComponents_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  treasuryProtocolOwnedLiquidityBackingComponents_not_ends_with?: InputMaybe<Scalars["String"]>;
  treasuryProtocolOwnedLiquidityBackingComponents_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryProtocolOwnedLiquidityBackingComponents_not_in?: InputMaybe<Array<Scalars["String"]>>;
  treasuryProtocolOwnedLiquidityBackingComponents_not_starts_with?: InputMaybe<Scalars["String"]>;
  treasuryProtocolOwnedLiquidityBackingComponents_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryProtocolOwnedLiquidityBackingComponents_starts_with?: InputMaybe<Scalars["String"]>;
  treasuryProtocolOwnedLiquidityBackingComponents_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryProtocolOwnedLiquidityBacking_gt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryProtocolOwnedLiquidityBacking_gte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryProtocolOwnedLiquidityBacking_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryProtocolOwnedLiquidityBacking_lt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryProtocolOwnedLiquidityBacking_lte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryProtocolOwnedLiquidityBacking_not?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryProtocolOwnedLiquidityBacking_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryRiskFreeValue?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryRiskFreeValueComponents?: InputMaybe<Scalars["String"]>;
  treasuryRiskFreeValueComponents_?: InputMaybe<TokenRecordsWrapper_Filter>;
  treasuryRiskFreeValueComponents_contains?: InputMaybe<Scalars["String"]>;
  treasuryRiskFreeValueComponents_contains_nocase?: InputMaybe<Scalars["String"]>;
  treasuryRiskFreeValueComponents_ends_with?: InputMaybe<Scalars["String"]>;
  treasuryRiskFreeValueComponents_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryRiskFreeValueComponents_gt?: InputMaybe<Scalars["String"]>;
  treasuryRiskFreeValueComponents_gte?: InputMaybe<Scalars["String"]>;
  treasuryRiskFreeValueComponents_in?: InputMaybe<Array<Scalars["String"]>>;
  treasuryRiskFreeValueComponents_lt?: InputMaybe<Scalars["String"]>;
  treasuryRiskFreeValueComponents_lte?: InputMaybe<Scalars["String"]>;
  treasuryRiskFreeValueComponents_not?: InputMaybe<Scalars["String"]>;
  treasuryRiskFreeValueComponents_not_contains?: InputMaybe<Scalars["String"]>;
  treasuryRiskFreeValueComponents_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  treasuryRiskFreeValueComponents_not_ends_with?: InputMaybe<Scalars["String"]>;
  treasuryRiskFreeValueComponents_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryRiskFreeValueComponents_not_in?: InputMaybe<Array<Scalars["String"]>>;
  treasuryRiskFreeValueComponents_not_starts_with?: InputMaybe<Scalars["String"]>;
  treasuryRiskFreeValueComponents_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryRiskFreeValueComponents_starts_with?: InputMaybe<Scalars["String"]>;
  treasuryRiskFreeValueComponents_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryRiskFreeValue_gt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryRiskFreeValue_gte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryRiskFreeValue_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryRiskFreeValue_lt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryRiskFreeValue_lte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryRiskFreeValue_not?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryRiskFreeValue_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryStableBacking?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryStableBackingComponents?: InputMaybe<Scalars["String"]>;
  treasuryStableBackingComponents_?: InputMaybe<TokenRecordsWrapper_Filter>;
  treasuryStableBackingComponents_contains?: InputMaybe<Scalars["String"]>;
  treasuryStableBackingComponents_contains_nocase?: InputMaybe<Scalars["String"]>;
  treasuryStableBackingComponents_ends_with?: InputMaybe<Scalars["String"]>;
  treasuryStableBackingComponents_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryStableBackingComponents_gt?: InputMaybe<Scalars["String"]>;
  treasuryStableBackingComponents_gte?: InputMaybe<Scalars["String"]>;
  treasuryStableBackingComponents_in?: InputMaybe<Array<Scalars["String"]>>;
  treasuryStableBackingComponents_lt?: InputMaybe<Scalars["String"]>;
  treasuryStableBackingComponents_lte?: InputMaybe<Scalars["String"]>;
  treasuryStableBackingComponents_not?: InputMaybe<Scalars["String"]>;
  treasuryStableBackingComponents_not_contains?: InputMaybe<Scalars["String"]>;
  treasuryStableBackingComponents_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  treasuryStableBackingComponents_not_ends_with?: InputMaybe<Scalars["String"]>;
  treasuryStableBackingComponents_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryStableBackingComponents_not_in?: InputMaybe<Array<Scalars["String"]>>;
  treasuryStableBackingComponents_not_starts_with?: InputMaybe<Scalars["String"]>;
  treasuryStableBackingComponents_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryStableBackingComponents_starts_with?: InputMaybe<Scalars["String"]>;
  treasuryStableBackingComponents_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryStableBacking_gt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryStableBacking_gte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryStableBacking_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryStableBacking_lt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryStableBacking_lte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryStableBacking_not?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryStableBacking_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryStableValue?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryStableValueComponents?: InputMaybe<Scalars["String"]>;
  treasuryStableValueComponents_?: InputMaybe<TokenRecordsWrapper_Filter>;
  treasuryStableValueComponents_contains?: InputMaybe<Scalars["String"]>;
  treasuryStableValueComponents_contains_nocase?: InputMaybe<Scalars["String"]>;
  treasuryStableValueComponents_ends_with?: InputMaybe<Scalars["String"]>;
  treasuryStableValueComponents_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryStableValueComponents_gt?: InputMaybe<Scalars["String"]>;
  treasuryStableValueComponents_gte?: InputMaybe<Scalars["String"]>;
  treasuryStableValueComponents_in?: InputMaybe<Array<Scalars["String"]>>;
  treasuryStableValueComponents_lt?: InputMaybe<Scalars["String"]>;
  treasuryStableValueComponents_lte?: InputMaybe<Scalars["String"]>;
  treasuryStableValueComponents_not?: InputMaybe<Scalars["String"]>;
  treasuryStableValueComponents_not_contains?: InputMaybe<Scalars["String"]>;
  treasuryStableValueComponents_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  treasuryStableValueComponents_not_ends_with?: InputMaybe<Scalars["String"]>;
  treasuryStableValueComponents_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryStableValueComponents_not_in?: InputMaybe<Array<Scalars["String"]>>;
  treasuryStableValueComponents_not_starts_with?: InputMaybe<Scalars["String"]>;
  treasuryStableValueComponents_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryStableValueComponents_starts_with?: InputMaybe<Scalars["String"]>;
  treasuryStableValueComponents_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryStableValue_gt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryStableValue_gte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryStableValue_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryStableValue_lt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryStableValue_lte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryStableValue_not?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryStableValue_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryTotalBacking?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryTotalBackingComponents?: InputMaybe<Scalars["String"]>;
  treasuryTotalBackingComponents_?: InputMaybe<TokenRecordsWrapper_Filter>;
  treasuryTotalBackingComponents_contains?: InputMaybe<Scalars["String"]>;
  treasuryTotalBackingComponents_contains_nocase?: InputMaybe<Scalars["String"]>;
  treasuryTotalBackingComponents_ends_with?: InputMaybe<Scalars["String"]>;
  treasuryTotalBackingComponents_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryTotalBackingComponents_gt?: InputMaybe<Scalars["String"]>;
  treasuryTotalBackingComponents_gte?: InputMaybe<Scalars["String"]>;
  treasuryTotalBackingComponents_in?: InputMaybe<Array<Scalars["String"]>>;
  treasuryTotalBackingComponents_lt?: InputMaybe<Scalars["String"]>;
  treasuryTotalBackingComponents_lte?: InputMaybe<Scalars["String"]>;
  treasuryTotalBackingComponents_not?: InputMaybe<Scalars["String"]>;
  treasuryTotalBackingComponents_not_contains?: InputMaybe<Scalars["String"]>;
  treasuryTotalBackingComponents_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  treasuryTotalBackingComponents_not_ends_with?: InputMaybe<Scalars["String"]>;
  treasuryTotalBackingComponents_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryTotalBackingComponents_not_in?: InputMaybe<Array<Scalars["String"]>>;
  treasuryTotalBackingComponents_not_starts_with?: InputMaybe<Scalars["String"]>;
  treasuryTotalBackingComponents_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryTotalBackingComponents_starts_with?: InputMaybe<Scalars["String"]>;
  treasuryTotalBackingComponents_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryTotalBacking_gt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryTotalBacking_gte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryTotalBacking_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryTotalBacking_lt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryTotalBacking_lte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryTotalBacking_not?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryTotalBacking_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryUstMarketValue?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryUstMarketValueComponents?: InputMaybe<Scalars["String"]>;
  treasuryUstMarketValueComponents_?: InputMaybe<TokenRecordsWrapper_Filter>;
  treasuryUstMarketValueComponents_contains?: InputMaybe<Scalars["String"]>;
  treasuryUstMarketValueComponents_contains_nocase?: InputMaybe<Scalars["String"]>;
  treasuryUstMarketValueComponents_ends_with?: InputMaybe<Scalars["String"]>;
  treasuryUstMarketValueComponents_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryUstMarketValueComponents_gt?: InputMaybe<Scalars["String"]>;
  treasuryUstMarketValueComponents_gte?: InputMaybe<Scalars["String"]>;
  treasuryUstMarketValueComponents_in?: InputMaybe<Array<Scalars["String"]>>;
  treasuryUstMarketValueComponents_lt?: InputMaybe<Scalars["String"]>;
  treasuryUstMarketValueComponents_lte?: InputMaybe<Scalars["String"]>;
  treasuryUstMarketValueComponents_not?: InputMaybe<Scalars["String"]>;
  treasuryUstMarketValueComponents_not_contains?: InputMaybe<Scalars["String"]>;
  treasuryUstMarketValueComponents_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  treasuryUstMarketValueComponents_not_ends_with?: InputMaybe<Scalars["String"]>;
  treasuryUstMarketValueComponents_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryUstMarketValueComponents_not_in?: InputMaybe<Array<Scalars["String"]>>;
  treasuryUstMarketValueComponents_not_starts_with?: InputMaybe<Scalars["String"]>;
  treasuryUstMarketValueComponents_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryUstMarketValueComponents_starts_with?: InputMaybe<Scalars["String"]>;
  treasuryUstMarketValueComponents_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryUstMarketValue_gt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryUstMarketValue_gte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryUstMarketValue_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryUstMarketValue_lt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryUstMarketValue_lte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryUstMarketValue_not?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryUstMarketValue_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryVolatileBacking?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryVolatileBackingComponents?: InputMaybe<Scalars["String"]>;
  treasuryVolatileBackingComponents_?: InputMaybe<TokenRecordsWrapper_Filter>;
  treasuryVolatileBackingComponents_contains?: InputMaybe<Scalars["String"]>;
  treasuryVolatileBackingComponents_contains_nocase?: InputMaybe<Scalars["String"]>;
  treasuryVolatileBackingComponents_ends_with?: InputMaybe<Scalars["String"]>;
  treasuryVolatileBackingComponents_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryVolatileBackingComponents_gt?: InputMaybe<Scalars["String"]>;
  treasuryVolatileBackingComponents_gte?: InputMaybe<Scalars["String"]>;
  treasuryVolatileBackingComponents_in?: InputMaybe<Array<Scalars["String"]>>;
  treasuryVolatileBackingComponents_lt?: InputMaybe<Scalars["String"]>;
  treasuryVolatileBackingComponents_lte?: InputMaybe<Scalars["String"]>;
  treasuryVolatileBackingComponents_not?: InputMaybe<Scalars["String"]>;
  treasuryVolatileBackingComponents_not_contains?: InputMaybe<Scalars["String"]>;
  treasuryVolatileBackingComponents_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  treasuryVolatileBackingComponents_not_ends_with?: InputMaybe<Scalars["String"]>;
  treasuryVolatileBackingComponents_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryVolatileBackingComponents_not_in?: InputMaybe<Array<Scalars["String"]>>;
  treasuryVolatileBackingComponents_not_starts_with?: InputMaybe<Scalars["String"]>;
  treasuryVolatileBackingComponents_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryVolatileBackingComponents_starts_with?: InputMaybe<Scalars["String"]>;
  treasuryVolatileBackingComponents_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryVolatileBacking_gt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryVolatileBacking_gte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryVolatileBacking_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryVolatileBacking_lt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryVolatileBacking_lte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryVolatileBacking_not?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryVolatileBacking_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryVolatileValue?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryVolatileValueComponents?: InputMaybe<Scalars["String"]>;
  treasuryVolatileValueComponents_?: InputMaybe<TokenRecordsWrapper_Filter>;
  treasuryVolatileValueComponents_contains?: InputMaybe<Scalars["String"]>;
  treasuryVolatileValueComponents_contains_nocase?: InputMaybe<Scalars["String"]>;
  treasuryVolatileValueComponents_ends_with?: InputMaybe<Scalars["String"]>;
  treasuryVolatileValueComponents_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryVolatileValueComponents_gt?: InputMaybe<Scalars["String"]>;
  treasuryVolatileValueComponents_gte?: InputMaybe<Scalars["String"]>;
  treasuryVolatileValueComponents_in?: InputMaybe<Array<Scalars["String"]>>;
  treasuryVolatileValueComponents_lt?: InputMaybe<Scalars["String"]>;
  treasuryVolatileValueComponents_lte?: InputMaybe<Scalars["String"]>;
  treasuryVolatileValueComponents_not?: InputMaybe<Scalars["String"]>;
  treasuryVolatileValueComponents_not_contains?: InputMaybe<Scalars["String"]>;
  treasuryVolatileValueComponents_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  treasuryVolatileValueComponents_not_ends_with?: InputMaybe<Scalars["String"]>;
  treasuryVolatileValueComponents_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryVolatileValueComponents_not_in?: InputMaybe<Array<Scalars["String"]>>;
  treasuryVolatileValueComponents_not_starts_with?: InputMaybe<Scalars["String"]>;
  treasuryVolatileValueComponents_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryVolatileValueComponents_starts_with?: InputMaybe<Scalars["String"]>;
  treasuryVolatileValueComponents_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryVolatileValue_gt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryVolatileValue_gte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryVolatileValue_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryVolatileValue_lt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryVolatileValue_lte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryVolatileValue_not?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryVolatileValue_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryWBTCMarketValue?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryWBTCMarketValueComponents?: InputMaybe<Scalars["String"]>;
  treasuryWBTCMarketValueComponents_?: InputMaybe<TokenRecordsWrapper_Filter>;
  treasuryWBTCMarketValueComponents_contains?: InputMaybe<Scalars["String"]>;
  treasuryWBTCMarketValueComponents_contains_nocase?: InputMaybe<Scalars["String"]>;
  treasuryWBTCMarketValueComponents_ends_with?: InputMaybe<Scalars["String"]>;
  treasuryWBTCMarketValueComponents_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryWBTCMarketValueComponents_gt?: InputMaybe<Scalars["String"]>;
  treasuryWBTCMarketValueComponents_gte?: InputMaybe<Scalars["String"]>;
  treasuryWBTCMarketValueComponents_in?: InputMaybe<Array<Scalars["String"]>>;
  treasuryWBTCMarketValueComponents_lt?: InputMaybe<Scalars["String"]>;
  treasuryWBTCMarketValueComponents_lte?: InputMaybe<Scalars["String"]>;
  treasuryWBTCMarketValueComponents_not?: InputMaybe<Scalars["String"]>;
  treasuryWBTCMarketValueComponents_not_contains?: InputMaybe<Scalars["String"]>;
  treasuryWBTCMarketValueComponents_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  treasuryWBTCMarketValueComponents_not_ends_with?: InputMaybe<Scalars["String"]>;
  treasuryWBTCMarketValueComponents_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryWBTCMarketValueComponents_not_in?: InputMaybe<Array<Scalars["String"]>>;
  treasuryWBTCMarketValueComponents_not_starts_with?: InputMaybe<Scalars["String"]>;
  treasuryWBTCMarketValueComponents_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryWBTCMarketValueComponents_starts_with?: InputMaybe<Scalars["String"]>;
  treasuryWBTCMarketValueComponents_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryWBTCMarketValue_gt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryWBTCMarketValue_gte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryWBTCMarketValue_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryWBTCMarketValue_lt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryWBTCMarketValue_lte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryWBTCMarketValue_not?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryWBTCMarketValue_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryWETHMarketValue?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryWETHMarketValueComponents?: InputMaybe<Scalars["String"]>;
  treasuryWETHMarketValueComponents_?: InputMaybe<TokenRecordsWrapper_Filter>;
  treasuryWETHMarketValueComponents_contains?: InputMaybe<Scalars["String"]>;
  treasuryWETHMarketValueComponents_contains_nocase?: InputMaybe<Scalars["String"]>;
  treasuryWETHMarketValueComponents_ends_with?: InputMaybe<Scalars["String"]>;
  treasuryWETHMarketValueComponents_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryWETHMarketValueComponents_gt?: InputMaybe<Scalars["String"]>;
  treasuryWETHMarketValueComponents_gte?: InputMaybe<Scalars["String"]>;
  treasuryWETHMarketValueComponents_in?: InputMaybe<Array<Scalars["String"]>>;
  treasuryWETHMarketValueComponents_lt?: InputMaybe<Scalars["String"]>;
  treasuryWETHMarketValueComponents_lte?: InputMaybe<Scalars["String"]>;
  treasuryWETHMarketValueComponents_not?: InputMaybe<Scalars["String"]>;
  treasuryWETHMarketValueComponents_not_contains?: InputMaybe<Scalars["String"]>;
  treasuryWETHMarketValueComponents_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  treasuryWETHMarketValueComponents_not_ends_with?: InputMaybe<Scalars["String"]>;
  treasuryWETHMarketValueComponents_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryWETHMarketValueComponents_not_in?: InputMaybe<Array<Scalars["String"]>>;
  treasuryWETHMarketValueComponents_not_starts_with?: InputMaybe<Scalars["String"]>;
  treasuryWETHMarketValueComponents_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryWETHMarketValueComponents_starts_with?: InputMaybe<Scalars["String"]>;
  treasuryWETHMarketValueComponents_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryWETHMarketValue_gt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryWETHMarketValue_gte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryWETHMarketValue_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryWETHMarketValue_lt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryWETHMarketValue_lte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryWETHMarketValue_not?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryWETHMarketValue_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryWETHRiskFreeValue?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryWETHRiskFreeValueComponents?: InputMaybe<Scalars["String"]>;
  treasuryWETHRiskFreeValueComponents_?: InputMaybe<TokenRecordsWrapper_Filter>;
  treasuryWETHRiskFreeValueComponents_contains?: InputMaybe<Scalars["String"]>;
  treasuryWETHRiskFreeValueComponents_contains_nocase?: InputMaybe<Scalars["String"]>;
  treasuryWETHRiskFreeValueComponents_ends_with?: InputMaybe<Scalars["String"]>;
  treasuryWETHRiskFreeValueComponents_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryWETHRiskFreeValueComponents_gt?: InputMaybe<Scalars["String"]>;
  treasuryWETHRiskFreeValueComponents_gte?: InputMaybe<Scalars["String"]>;
  treasuryWETHRiskFreeValueComponents_in?: InputMaybe<Array<Scalars["String"]>>;
  treasuryWETHRiskFreeValueComponents_lt?: InputMaybe<Scalars["String"]>;
  treasuryWETHRiskFreeValueComponents_lte?: InputMaybe<Scalars["String"]>;
  treasuryWETHRiskFreeValueComponents_not?: InputMaybe<Scalars["String"]>;
  treasuryWETHRiskFreeValueComponents_not_contains?: InputMaybe<Scalars["String"]>;
  treasuryWETHRiskFreeValueComponents_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  treasuryWETHRiskFreeValueComponents_not_ends_with?: InputMaybe<Scalars["String"]>;
  treasuryWETHRiskFreeValueComponents_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryWETHRiskFreeValueComponents_not_in?: InputMaybe<Array<Scalars["String"]>>;
  treasuryWETHRiskFreeValueComponents_not_starts_with?: InputMaybe<Scalars["String"]>;
  treasuryWETHRiskFreeValueComponents_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryWETHRiskFreeValueComponents_starts_with?: InputMaybe<Scalars["String"]>;
  treasuryWETHRiskFreeValueComponents_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryWETHRiskFreeValue_gt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryWETHRiskFreeValue_gte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryWETHRiskFreeValue_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryWETHRiskFreeValue_lt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryWETHRiskFreeValue_lte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryWETHRiskFreeValue_not?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryWETHRiskFreeValue_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryXsushiMarketValue?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryXsushiMarketValueComponents?: InputMaybe<Scalars["String"]>;
  treasuryXsushiMarketValueComponents_?: InputMaybe<TokenRecordsWrapper_Filter>;
  treasuryXsushiMarketValueComponents_contains?: InputMaybe<Scalars["String"]>;
  treasuryXsushiMarketValueComponents_contains_nocase?: InputMaybe<Scalars["String"]>;
  treasuryXsushiMarketValueComponents_ends_with?: InputMaybe<Scalars["String"]>;
  treasuryXsushiMarketValueComponents_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryXsushiMarketValueComponents_gt?: InputMaybe<Scalars["String"]>;
  treasuryXsushiMarketValueComponents_gte?: InputMaybe<Scalars["String"]>;
  treasuryXsushiMarketValueComponents_in?: InputMaybe<Array<Scalars["String"]>>;
  treasuryXsushiMarketValueComponents_lt?: InputMaybe<Scalars["String"]>;
  treasuryXsushiMarketValueComponents_lte?: InputMaybe<Scalars["String"]>;
  treasuryXsushiMarketValueComponents_not?: InputMaybe<Scalars["String"]>;
  treasuryXsushiMarketValueComponents_not_contains?: InputMaybe<Scalars["String"]>;
  treasuryXsushiMarketValueComponents_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  treasuryXsushiMarketValueComponents_not_ends_with?: InputMaybe<Scalars["String"]>;
  treasuryXsushiMarketValueComponents_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryXsushiMarketValueComponents_not_in?: InputMaybe<Array<Scalars["String"]>>;
  treasuryXsushiMarketValueComponents_not_starts_with?: InputMaybe<Scalars["String"]>;
  treasuryXsushiMarketValueComponents_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryXsushiMarketValueComponents_starts_with?: InputMaybe<Scalars["String"]>;
  treasuryXsushiMarketValueComponents_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  treasuryXsushiMarketValue_gt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryXsushiMarketValue_gte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryXsushiMarketValue_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  treasuryXsushiMarketValue_lt?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryXsushiMarketValue_lte?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryXsushiMarketValue_not?: InputMaybe<Scalars["BigDecimal"]>;
  treasuryXsushiMarketValue_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
};

export enum ProtocolMetric_OrderBy {
  Block = "block",
  CurrentApy = "currentAPY",
  CurrentIndex = "currentIndex",
  GOhmPrice = "gOhmPrice",
  GOhmTotalSupply = "gOhmTotalSupply",
  Id = "id",
  MarketCap = "marketCap",
  NextDistributedOhm = "nextDistributedOhm",
  NextEpochRebase = "nextEpochRebase",
  OhmCirculatingSupply = "ohmCirculatingSupply",
  OhmCirculatingSupplyBreakdown = "ohmCirculatingSupplyBreakdown",
  OhmFloatingSupply = "ohmFloatingSupply",
  OhmFloatingSupplyBreakdown = "ohmFloatingSupplyBreakdown",
  OhmPrice = "ohmPrice",
  Runway2dot5k = "runway2dot5k",
  Runway5k = "runway5k",
  Runway7dot5k = "runway7dot5k",
  Runway10k = "runway10k",
  Runway20k = "runway20k",
  Runway50k = "runway50k",
  Runway70k = "runway70k",
  Runway100k = "runway100k",
  RunwayCurrent = "runwayCurrent",
  SOhmCirculatingSupply = "sOhmCirculatingSupply",
  Timestamp = "timestamp",
  TimestampIso8901 = "timestampISO8901",
  TotalSupply = "totalSupply",
  TotalValueLocked = "totalValueLocked",
  TreasuryCvxMarketValue = "treasuryCVXMarketValue",
  TreasuryCvxMarketValueComponents = "treasuryCVXMarketValueComponents",
  TreasuryDaiMarketValue = "treasuryDaiMarketValue",
  TreasuryDaiMarketValueComponents = "treasuryDaiMarketValueComponents",
  TreasuryDaiRiskFreeValue = "treasuryDaiRiskFreeValue",
  TreasuryDaiRiskFreeValueComponents = "treasuryDaiRiskFreeValueComponents",
  TreasuryFxsMarketValue = "treasuryFXSMarketValue",
  TreasuryFxsMarketValueComponents = "treasuryFXSMarketValueComponents",
  TreasuryFeiMarketValue = "treasuryFeiMarketValue",
  TreasuryFeiMarketValueComponents = "treasuryFeiMarketValueComponents",
  TreasuryFeiRiskFreeValue = "treasuryFeiRiskFreeValue",
  TreasuryFeiRiskFreeValueComponents = "treasuryFeiRiskFreeValueComponents",
  TreasuryFraxMarketValue = "treasuryFraxMarketValue",
  TreasuryFraxMarketValueComponents = "treasuryFraxMarketValueComponents",
  TreasuryFraxRiskFreeValue = "treasuryFraxRiskFreeValue",
  TreasuryFraxRiskFreeValueComponents = "treasuryFraxRiskFreeValueComponents",
  TreasuryLpValue = "treasuryLPValue",
  TreasuryLpValueComponents = "treasuryLPValueComponents",
  TreasuryLiquidBacking = "treasuryLiquidBacking",
  TreasuryLiquidBackingComponents = "treasuryLiquidBackingComponents",
  TreasuryLiquidBackingPerGOhm = "treasuryLiquidBackingPerGOhm",
  TreasuryLiquidBackingPerOhmCirculating = "treasuryLiquidBackingPerOhmCirculating",
  TreasuryLiquidBackingPerOhmFloating = "treasuryLiquidBackingPerOhmFloating",
  TreasuryLiquidBackingProtocolOwnedLiquidity = "treasuryLiquidBackingProtocolOwnedLiquidity",
  TreasuryLiquidBackingProtocolOwnedLiquidityComponents = "treasuryLiquidBackingProtocolOwnedLiquidityComponents",
  TreasuryLiquidBackingStable = "treasuryLiquidBackingStable",
  TreasuryLiquidBackingStableComponents = "treasuryLiquidBackingStableComponents",
  TreasuryLiquidBackingVolatile = "treasuryLiquidBackingVolatile",
  TreasuryLiquidBackingVolatileComponents = "treasuryLiquidBackingVolatileComponents",
  TreasuryLusdMarketValue = "treasuryLusdMarketValue",
  TreasuryLusdMarketValueComponents = "treasuryLusdMarketValueComponents",
  TreasuryLusdRiskFreeValue = "treasuryLusdRiskFreeValue",
  TreasuryLusdRiskFreeValueComponents = "treasuryLusdRiskFreeValueComponents",
  TreasuryMarketValue = "treasuryMarketValue",
  TreasuryMarketValueComponents = "treasuryMarketValueComponents",
  TreasuryOhmDaiPol = "treasuryOhmDaiPOL",
  TreasuryOhmEthPol = "treasuryOhmEthPOL",
  TreasuryOhmFraxPol = "treasuryOhmFraxPOL",
  TreasuryOhmLusdPol = "treasuryOhmLusdPOL",
  TreasuryOtherMarketValue = "treasuryOtherMarketValue",
  TreasuryOtherMarketValueComponents = "treasuryOtherMarketValueComponents",
  TreasuryProtocolOwnedLiquidityBacking = "treasuryProtocolOwnedLiquidityBacking",
  TreasuryProtocolOwnedLiquidityBackingComponents = "treasuryProtocolOwnedLiquidityBackingComponents",
  TreasuryRiskFreeValue = "treasuryRiskFreeValue",
  TreasuryRiskFreeValueComponents = "treasuryRiskFreeValueComponents",
  TreasuryStableBacking = "treasuryStableBacking",
  TreasuryStableBackingComponents = "treasuryStableBackingComponents",
  TreasuryStableValue = "treasuryStableValue",
  TreasuryStableValueComponents = "treasuryStableValueComponents",
  TreasuryTotalBacking = "treasuryTotalBacking",
  TreasuryTotalBackingComponents = "treasuryTotalBackingComponents",
  TreasuryUstMarketValue = "treasuryUstMarketValue",
  TreasuryUstMarketValueComponents = "treasuryUstMarketValueComponents",
  TreasuryVolatileBacking = "treasuryVolatileBacking",
  TreasuryVolatileBackingComponents = "treasuryVolatileBackingComponents",
  TreasuryVolatileValue = "treasuryVolatileValue",
  TreasuryVolatileValueComponents = "treasuryVolatileValueComponents",
  TreasuryWbtcMarketValue = "treasuryWBTCMarketValue",
  TreasuryWbtcMarketValueComponents = "treasuryWBTCMarketValueComponents",
  TreasuryWethMarketValue = "treasuryWETHMarketValue",
  TreasuryWethMarketValueComponents = "treasuryWETHMarketValueComponents",
  TreasuryWethRiskFreeValue = "treasuryWETHRiskFreeValue",
  TreasuryWethRiskFreeValueComponents = "treasuryWETHRiskFreeValueComponents",
  TreasuryXsushiMarketValue = "treasuryXsushiMarketValue",
  TreasuryXsushiMarketValueComponents = "treasuryXsushiMarketValueComponents",
}

export type Query = {
  __typename?: "Query";
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  bondDiscount?: Maybe<BondDiscount>;
  bondDiscounts: Array<BondDiscount>;
  dailyBond?: Maybe<DailyBond>;
  dailyBonds: Array<DailyBond>;
  dailyStakingReward?: Maybe<DailyStakingReward>;
  dailyStakingRewards: Array<DailyStakingReward>;
  protocolMetric?: Maybe<ProtocolMetric>;
  protocolMetrics: Array<ProtocolMetric>;
  rebase?: Maybe<Rebase>;
  rebases: Array<Rebase>;
  token?: Maybe<Token>;
  tokenRecord?: Maybe<TokenRecord>;
  tokenRecords: Array<TokenRecord>;
  tokenRecordsWrapper?: Maybe<TokenRecordsWrapper>;
  tokenRecordsWrappers: Array<TokenRecordsWrapper>;
  tokens: Array<Token>;
};

export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};

export type QueryBondDiscountArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryBondDiscountsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<BondDiscount_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<BondDiscount_Filter>;
};

export type QueryDailyBondArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryDailyBondsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<DailyBond_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DailyBond_Filter>;
};

export type QueryDailyStakingRewardArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryDailyStakingRewardsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<DailyStakingReward_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DailyStakingReward_Filter>;
};

export type QueryProtocolMetricArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryProtocolMetricsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ProtocolMetric_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProtocolMetric_Filter>;
};

export type QueryRebaseArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryRebasesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Rebase_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Rebase_Filter>;
};

export type QueryTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryTokenRecordArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryTokenRecordsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<TokenRecord_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokenRecord_Filter>;
};

export type QueryTokenRecordsWrapperArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryTokenRecordsWrappersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<TokenRecordsWrapper_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokenRecordsWrapper_Filter>;
};

export type QueryTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Token_Filter>;
};

export type Rebase = {
  __typename?: "Rebase";
  amount: Scalars["BigDecimal"];
  contract: Scalars["String"];
  id: Scalars["ID"];
  percentage: Scalars["BigDecimal"];
  stakedOhms: Scalars["BigDecimal"];
  timestamp: Scalars["BigInt"];
  value: Scalars["BigDecimal"];
};

export type Rebase_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars["BigDecimal"]>;
  amount_gt?: InputMaybe<Scalars["BigDecimal"]>;
  amount_gte?: InputMaybe<Scalars["BigDecimal"]>;
  amount_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  amount_lt?: InputMaybe<Scalars["BigDecimal"]>;
  amount_lte?: InputMaybe<Scalars["BigDecimal"]>;
  amount_not?: InputMaybe<Scalars["BigDecimal"]>;
  amount_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  contract?: InputMaybe<Scalars["String"]>;
  contract_contains?: InputMaybe<Scalars["String"]>;
  contract_contains_nocase?: InputMaybe<Scalars["String"]>;
  contract_ends_with?: InputMaybe<Scalars["String"]>;
  contract_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  contract_gt?: InputMaybe<Scalars["String"]>;
  contract_gte?: InputMaybe<Scalars["String"]>;
  contract_in?: InputMaybe<Array<Scalars["String"]>>;
  contract_lt?: InputMaybe<Scalars["String"]>;
  contract_lte?: InputMaybe<Scalars["String"]>;
  contract_not?: InputMaybe<Scalars["String"]>;
  contract_not_contains?: InputMaybe<Scalars["String"]>;
  contract_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  contract_not_ends_with?: InputMaybe<Scalars["String"]>;
  contract_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  contract_not_in?: InputMaybe<Array<Scalars["String"]>>;
  contract_not_starts_with?: InputMaybe<Scalars["String"]>;
  contract_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  contract_starts_with?: InputMaybe<Scalars["String"]>;
  contract_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  percentage?: InputMaybe<Scalars["BigDecimal"]>;
  percentage_gt?: InputMaybe<Scalars["BigDecimal"]>;
  percentage_gte?: InputMaybe<Scalars["BigDecimal"]>;
  percentage_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  percentage_lt?: InputMaybe<Scalars["BigDecimal"]>;
  percentage_lte?: InputMaybe<Scalars["BigDecimal"]>;
  percentage_not?: InputMaybe<Scalars["BigDecimal"]>;
  percentage_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  stakedOhms?: InputMaybe<Scalars["BigDecimal"]>;
  stakedOhms_gt?: InputMaybe<Scalars["BigDecimal"]>;
  stakedOhms_gte?: InputMaybe<Scalars["BigDecimal"]>;
  stakedOhms_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  stakedOhms_lt?: InputMaybe<Scalars["BigDecimal"]>;
  stakedOhms_lte?: InputMaybe<Scalars["BigDecimal"]>;
  stakedOhms_not?: InputMaybe<Scalars["BigDecimal"]>;
  stakedOhms_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  timestamp?: InputMaybe<Scalars["BigInt"]>;
  timestamp_gt?: InputMaybe<Scalars["BigInt"]>;
  timestamp_gte?: InputMaybe<Scalars["BigInt"]>;
  timestamp_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  timestamp_lt?: InputMaybe<Scalars["BigInt"]>;
  timestamp_lte?: InputMaybe<Scalars["BigInt"]>;
  timestamp_not?: InputMaybe<Scalars["BigInt"]>;
  timestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  value?: InputMaybe<Scalars["BigDecimal"]>;
  value_gt?: InputMaybe<Scalars["BigDecimal"]>;
  value_gte?: InputMaybe<Scalars["BigDecimal"]>;
  value_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  value_lt?: InputMaybe<Scalars["BigDecimal"]>;
  value_lte?: InputMaybe<Scalars["BigDecimal"]>;
  value_not?: InputMaybe<Scalars["BigDecimal"]>;
  value_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
};

export enum Rebase_OrderBy {
  Amount = "amount",
  Contract = "contract",
  Id = "id",
  Percentage = "percentage",
  StakedOhms = "stakedOhms",
  Timestamp = "timestamp",
  Value = "value",
}

export type Subscription = {
  __typename?: "Subscription";
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  bondDiscount?: Maybe<BondDiscount>;
  bondDiscounts: Array<BondDiscount>;
  dailyBond?: Maybe<DailyBond>;
  dailyBonds: Array<DailyBond>;
  dailyStakingReward?: Maybe<DailyStakingReward>;
  dailyStakingRewards: Array<DailyStakingReward>;
  protocolMetric?: Maybe<ProtocolMetric>;
  protocolMetrics: Array<ProtocolMetric>;
  rebase?: Maybe<Rebase>;
  rebases: Array<Rebase>;
  token?: Maybe<Token>;
  tokenRecord?: Maybe<TokenRecord>;
  tokenRecords: Array<TokenRecord>;
  tokenRecordsWrapper?: Maybe<TokenRecordsWrapper>;
  tokenRecordsWrappers: Array<TokenRecordsWrapper>;
  tokens: Array<Token>;
};

export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};

export type SubscriptionBondDiscountArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionBondDiscountsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<BondDiscount_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<BondDiscount_Filter>;
};

export type SubscriptionDailyBondArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionDailyBondsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<DailyBond_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DailyBond_Filter>;
};

export type SubscriptionDailyStakingRewardArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionDailyStakingRewardsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<DailyStakingReward_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DailyStakingReward_Filter>;
};

export type SubscriptionProtocolMetricArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionProtocolMetricsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ProtocolMetric_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProtocolMetric_Filter>;
};

export type SubscriptionRebaseArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionRebasesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Rebase_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Rebase_Filter>;
};

export type SubscriptionTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionTokenRecordArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionTokenRecordsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<TokenRecord_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokenRecord_Filter>;
};

export type SubscriptionTokenRecordsWrapperArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionTokenRecordsWrappersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<TokenRecordsWrapper_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokenRecordsWrapper_Filter>;
};

export type SubscriptionTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Token_Filter>;
};

export type Token = {
  __typename?: "Token";
  id: Scalars["ID"];
};

export type TokenRecord = {
  __typename?: "TokenRecord";
  balance: Scalars["BigDecimal"];
  block: Scalars["BigInt"];
  category: Scalars["String"];
  date: Scalars["String"];
  id: Scalars["ID"];
  isBluechip: Scalars["Boolean"];
  isLiquid: Scalars["Boolean"];
  multiplier: Scalars["BigDecimal"];
  rate: Scalars["BigDecimal"];
  source: Scalars["String"];
  sourceAddress: Scalars["String"];
  token: Scalars["String"];
  tokenAddress: Scalars["String"];
  value: Scalars["BigDecimal"];
};

export type TokenRecord_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  balance?: InputMaybe<Scalars["BigDecimal"]>;
  balance_gt?: InputMaybe<Scalars["BigDecimal"]>;
  balance_gte?: InputMaybe<Scalars["BigDecimal"]>;
  balance_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  balance_lt?: InputMaybe<Scalars["BigDecimal"]>;
  balance_lte?: InputMaybe<Scalars["BigDecimal"]>;
  balance_not?: InputMaybe<Scalars["BigDecimal"]>;
  balance_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  block?: InputMaybe<Scalars["BigInt"]>;
  block_gt?: InputMaybe<Scalars["BigInt"]>;
  block_gte?: InputMaybe<Scalars["BigInt"]>;
  block_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  block_lt?: InputMaybe<Scalars["BigInt"]>;
  block_lte?: InputMaybe<Scalars["BigInt"]>;
  block_not?: InputMaybe<Scalars["BigInt"]>;
  block_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  category?: InputMaybe<Scalars["String"]>;
  category_contains?: InputMaybe<Scalars["String"]>;
  category_contains_nocase?: InputMaybe<Scalars["String"]>;
  category_ends_with?: InputMaybe<Scalars["String"]>;
  category_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  category_gt?: InputMaybe<Scalars["String"]>;
  category_gte?: InputMaybe<Scalars["String"]>;
  category_in?: InputMaybe<Array<Scalars["String"]>>;
  category_lt?: InputMaybe<Scalars["String"]>;
  category_lte?: InputMaybe<Scalars["String"]>;
  category_not?: InputMaybe<Scalars["String"]>;
  category_not_contains?: InputMaybe<Scalars["String"]>;
  category_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  category_not_ends_with?: InputMaybe<Scalars["String"]>;
  category_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  category_not_in?: InputMaybe<Array<Scalars["String"]>>;
  category_not_starts_with?: InputMaybe<Scalars["String"]>;
  category_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  category_starts_with?: InputMaybe<Scalars["String"]>;
  category_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  date?: InputMaybe<Scalars["String"]>;
  date_contains?: InputMaybe<Scalars["String"]>;
  date_contains_nocase?: InputMaybe<Scalars["String"]>;
  date_ends_with?: InputMaybe<Scalars["String"]>;
  date_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  date_gt?: InputMaybe<Scalars["String"]>;
  date_gte?: InputMaybe<Scalars["String"]>;
  date_in?: InputMaybe<Array<Scalars["String"]>>;
  date_lt?: InputMaybe<Scalars["String"]>;
  date_lte?: InputMaybe<Scalars["String"]>;
  date_not?: InputMaybe<Scalars["String"]>;
  date_not_contains?: InputMaybe<Scalars["String"]>;
  date_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  date_not_ends_with?: InputMaybe<Scalars["String"]>;
  date_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  date_not_in?: InputMaybe<Array<Scalars["String"]>>;
  date_not_starts_with?: InputMaybe<Scalars["String"]>;
  date_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  date_starts_with?: InputMaybe<Scalars["String"]>;
  date_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  isBluechip?: InputMaybe<Scalars["Boolean"]>;
  isBluechip_in?: InputMaybe<Array<Scalars["Boolean"]>>;
  isBluechip_not?: InputMaybe<Scalars["Boolean"]>;
  isBluechip_not_in?: InputMaybe<Array<Scalars["Boolean"]>>;
  isLiquid?: InputMaybe<Scalars["Boolean"]>;
  isLiquid_in?: InputMaybe<Array<Scalars["Boolean"]>>;
  isLiquid_not?: InputMaybe<Scalars["Boolean"]>;
  isLiquid_not_in?: InputMaybe<Array<Scalars["Boolean"]>>;
  multiplier?: InputMaybe<Scalars["BigDecimal"]>;
  multiplier_gt?: InputMaybe<Scalars["BigDecimal"]>;
  multiplier_gte?: InputMaybe<Scalars["BigDecimal"]>;
  multiplier_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  multiplier_lt?: InputMaybe<Scalars["BigDecimal"]>;
  multiplier_lte?: InputMaybe<Scalars["BigDecimal"]>;
  multiplier_not?: InputMaybe<Scalars["BigDecimal"]>;
  multiplier_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  rate?: InputMaybe<Scalars["BigDecimal"]>;
  rate_gt?: InputMaybe<Scalars["BigDecimal"]>;
  rate_gte?: InputMaybe<Scalars["BigDecimal"]>;
  rate_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  rate_lt?: InputMaybe<Scalars["BigDecimal"]>;
  rate_lte?: InputMaybe<Scalars["BigDecimal"]>;
  rate_not?: InputMaybe<Scalars["BigDecimal"]>;
  rate_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  source?: InputMaybe<Scalars["String"]>;
  sourceAddress?: InputMaybe<Scalars["String"]>;
  sourceAddress_contains?: InputMaybe<Scalars["String"]>;
  sourceAddress_contains_nocase?: InputMaybe<Scalars["String"]>;
  sourceAddress_ends_with?: InputMaybe<Scalars["String"]>;
  sourceAddress_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  sourceAddress_gt?: InputMaybe<Scalars["String"]>;
  sourceAddress_gte?: InputMaybe<Scalars["String"]>;
  sourceAddress_in?: InputMaybe<Array<Scalars["String"]>>;
  sourceAddress_lt?: InputMaybe<Scalars["String"]>;
  sourceAddress_lte?: InputMaybe<Scalars["String"]>;
  sourceAddress_not?: InputMaybe<Scalars["String"]>;
  sourceAddress_not_contains?: InputMaybe<Scalars["String"]>;
  sourceAddress_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  sourceAddress_not_ends_with?: InputMaybe<Scalars["String"]>;
  sourceAddress_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  sourceAddress_not_in?: InputMaybe<Array<Scalars["String"]>>;
  sourceAddress_not_starts_with?: InputMaybe<Scalars["String"]>;
  sourceAddress_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  sourceAddress_starts_with?: InputMaybe<Scalars["String"]>;
  sourceAddress_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  source_contains?: InputMaybe<Scalars["String"]>;
  source_contains_nocase?: InputMaybe<Scalars["String"]>;
  source_ends_with?: InputMaybe<Scalars["String"]>;
  source_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  source_gt?: InputMaybe<Scalars["String"]>;
  source_gte?: InputMaybe<Scalars["String"]>;
  source_in?: InputMaybe<Array<Scalars["String"]>>;
  source_lt?: InputMaybe<Scalars["String"]>;
  source_lte?: InputMaybe<Scalars["String"]>;
  source_not?: InputMaybe<Scalars["String"]>;
  source_not_contains?: InputMaybe<Scalars["String"]>;
  source_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  source_not_ends_with?: InputMaybe<Scalars["String"]>;
  source_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  source_not_in?: InputMaybe<Array<Scalars["String"]>>;
  source_not_starts_with?: InputMaybe<Scalars["String"]>;
  source_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  source_starts_with?: InputMaybe<Scalars["String"]>;
  source_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  token?: InputMaybe<Scalars["String"]>;
  tokenAddress?: InputMaybe<Scalars["String"]>;
  tokenAddress_contains?: InputMaybe<Scalars["String"]>;
  tokenAddress_contains_nocase?: InputMaybe<Scalars["String"]>;
  tokenAddress_ends_with?: InputMaybe<Scalars["String"]>;
  tokenAddress_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  tokenAddress_gt?: InputMaybe<Scalars["String"]>;
  tokenAddress_gte?: InputMaybe<Scalars["String"]>;
  tokenAddress_in?: InputMaybe<Array<Scalars["String"]>>;
  tokenAddress_lt?: InputMaybe<Scalars["String"]>;
  tokenAddress_lte?: InputMaybe<Scalars["String"]>;
  tokenAddress_not?: InputMaybe<Scalars["String"]>;
  tokenAddress_not_contains?: InputMaybe<Scalars["String"]>;
  tokenAddress_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  tokenAddress_not_ends_with?: InputMaybe<Scalars["String"]>;
  tokenAddress_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  tokenAddress_not_in?: InputMaybe<Array<Scalars["String"]>>;
  tokenAddress_not_starts_with?: InputMaybe<Scalars["String"]>;
  tokenAddress_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  tokenAddress_starts_with?: InputMaybe<Scalars["String"]>;
  tokenAddress_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  token_contains?: InputMaybe<Scalars["String"]>;
  token_contains_nocase?: InputMaybe<Scalars["String"]>;
  token_ends_with?: InputMaybe<Scalars["String"]>;
  token_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  token_gt?: InputMaybe<Scalars["String"]>;
  token_gte?: InputMaybe<Scalars["String"]>;
  token_in?: InputMaybe<Array<Scalars["String"]>>;
  token_lt?: InputMaybe<Scalars["String"]>;
  token_lte?: InputMaybe<Scalars["String"]>;
  token_not?: InputMaybe<Scalars["String"]>;
  token_not_contains?: InputMaybe<Scalars["String"]>;
  token_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  token_not_ends_with?: InputMaybe<Scalars["String"]>;
  token_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  token_not_in?: InputMaybe<Array<Scalars["String"]>>;
  token_not_starts_with?: InputMaybe<Scalars["String"]>;
  token_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  token_starts_with?: InputMaybe<Scalars["String"]>;
  token_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  value?: InputMaybe<Scalars["BigDecimal"]>;
  value_gt?: InputMaybe<Scalars["BigDecimal"]>;
  value_gte?: InputMaybe<Scalars["BigDecimal"]>;
  value_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  value_lt?: InputMaybe<Scalars["BigDecimal"]>;
  value_lte?: InputMaybe<Scalars["BigDecimal"]>;
  value_not?: InputMaybe<Scalars["BigDecimal"]>;
  value_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
};

export enum TokenRecord_OrderBy {
  Balance = "balance",
  Block = "block",
  Category = "category",
  Date = "date",
  Id = "id",
  IsBluechip = "isBluechip",
  IsLiquid = "isLiquid",
  Multiplier = "multiplier",
  Rate = "rate",
  Source = "source",
  SourceAddress = "sourceAddress",
  Token = "token",
  TokenAddress = "tokenAddress",
  Value = "value",
}

export type TokenRecordsWrapper = {
  __typename?: "TokenRecordsWrapper";
  balance: Scalars["BigDecimal"];
  id: Scalars["ID"];
  records: Array<TokenRecord>;
  value: Scalars["BigDecimal"];
};

export type TokenRecordsWrapperRecordsArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<TokenRecord_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<TokenRecord_Filter>;
};

export type TokenRecordsWrapper_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  balance?: InputMaybe<Scalars["BigDecimal"]>;
  balance_gt?: InputMaybe<Scalars["BigDecimal"]>;
  balance_gte?: InputMaybe<Scalars["BigDecimal"]>;
  balance_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  balance_lt?: InputMaybe<Scalars["BigDecimal"]>;
  balance_lte?: InputMaybe<Scalars["BigDecimal"]>;
  balance_not?: InputMaybe<Scalars["BigDecimal"]>;
  balance_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  records?: InputMaybe<Array<Scalars["String"]>>;
  records_?: InputMaybe<TokenRecord_Filter>;
  records_contains?: InputMaybe<Array<Scalars["String"]>>;
  records_contains_nocase?: InputMaybe<Array<Scalars["String"]>>;
  records_not?: InputMaybe<Array<Scalars["String"]>>;
  records_not_contains?: InputMaybe<Array<Scalars["String"]>>;
  records_not_contains_nocase?: InputMaybe<Array<Scalars["String"]>>;
  value?: InputMaybe<Scalars["BigDecimal"]>;
  value_gt?: InputMaybe<Scalars["BigDecimal"]>;
  value_gte?: InputMaybe<Scalars["BigDecimal"]>;
  value_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  value_lt?: InputMaybe<Scalars["BigDecimal"]>;
  value_lte?: InputMaybe<Scalars["BigDecimal"]>;
  value_not?: InputMaybe<Scalars["BigDecimal"]>;
  value_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
};

export enum TokenRecordsWrapper_OrderBy {
  Balance = "balance",
  Id = "id",
  Records = "records",
  Value = "value",
}

export type Token_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
};

export enum Token_OrderBy {
  Id = "id",
}

export type _Block_ = {
  __typename?: "_Block_";
  /** The hash of the block */
  hash?: Maybe<Scalars["Bytes"]>;
  /** The block number */
  number: Scalars["Int"];
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  __typename?: "_Meta_";
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars["String"];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars["Boolean"];
};

export enum _SubgraphErrorPolicy_ {
  /** Data will be returned even if the subgraph has indexing errors */
  Allow = "allow",
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  Deny = "deny",
}

export type MetricsBarLatestOnlyQueryVariables = Exact<{ [key: string]: never }>;

export type MetricsBarLatestOnlyQuery = {
  __typename?: "Query";
  protocolMetrics: Array<{
    __typename?: "ProtocolMetric";
    id: string;
    block: number;
    currentIndex: number;
    gOhmPrice: number;
    gOhmTotalSupply: number;
    marketCap: number;
    ohmCirculatingSupply: number;
    ohmFloatingSupply: number;
    ohmPrice: number;
    totalSupply: number;
    totalValueLocked: number;
    treasuryLiquidBackingPerGOhm: number;
    treasuryLiquidBackingPerOhmFloating: number;
    treasuryMarketValue: number;
  }>;
};

export type KeyMetricsQueryVariables = Exact<{
  records?: InputMaybe<Scalars["Int"]>;
}>;

export type KeyMetricsQuery = {
  __typename?: "Query";
  protocolMetrics: Array<{
    __typename?: "ProtocolMetric";
    id: string;
    block: number;
    currentIndex: number;
    gOhmPrice: number;
    gOhmTotalSupply: number;
    marketCap: number;
    ohmCirculatingSupply: number;
    ohmFloatingSupply: number;
    ohmPrice: number;
    timestamp: number;
    timestampISO8901: string;
    totalSupply: number;
    totalValueLocked: number;
    treasuryLiquidBacking: number;
    treasuryLiquidBackingPerGOhm: number;
    treasuryLiquidBackingPerOhmFloating: number;
    treasuryMarketValue: number;
  }>;
};

export type MarketValueMetricsQueryVariables = Exact<{
  records?: InputMaybe<Scalars["Int"]>;
}>;

export type MarketValueMetricsQuery = {
  __typename?: "Query";
  protocolMetrics: Array<{
    __typename?: "ProtocolMetric";
    id: string;
    block: number;
    timestamp: number;
    timestampISO8901: string;
    treasuryMarketValue: number;
    treasuryStableValue: number;
    treasuryVolatileValue: number;
    treasuryLPValue: number;
    treasuryLiquidBacking: number;
    treasuryLiquidBackingStable: number;
    treasuryLiquidBackingVolatile: number;
    treasuryLiquidBackingProtocolOwnedLiquidity: number;
  }>;
};

export type MarketValueMetricsComponentsQueryVariables = Exact<{
  records?: InputMaybe<Scalars["Int"]>;
}>;

export type MarketValueMetricsComponentsQuery = {
  __typename?: "Query";
  protocolMetrics: Array<{
    __typename?: "ProtocolMetric";
    id: string;
    block: number;
    timestamp: number;
    timestampISO8901: string;
    treasuryStableValueComponents: {
      __typename?: "TokenRecordsWrapper";
      records: Array<{ __typename?: "TokenRecord"; token: string; value: number }>;
    };
    treasuryVolatileValueComponents: {
      __typename?: "TokenRecordsWrapper";
      records: Array<{ __typename?: "TokenRecord"; token: string; value: number }>;
    };
    treasuryLPValueComponents: {
      __typename?: "TokenRecordsWrapper";
      records: Array<{ __typename?: "TokenRecord"; token: string; value: number }>;
    };
    treasuryLiquidBackingStableComponents: {
      __typename?: "TokenRecordsWrapper";
      records: Array<{ __typename?: "TokenRecord"; token: string; value: number }>;
    };
    treasuryLiquidBackingVolatileComponents: {
      __typename?: "TokenRecordsWrapper";
      records: Array<{ __typename?: "TokenRecord"; token: string; value: number }>;
    };
    treasuryLiquidBackingProtocolOwnedLiquidityComponents: {
      __typename?: "TokenRecordsWrapper";
      records: Array<{ __typename?: "TokenRecord"; token: string; value: number }>;
    };
  }>;
};

export type ProtocolOwnedLiquidityComponentsQueryVariables = Exact<{
  records?: InputMaybe<Scalars["Int"]>;
}>;

export type ProtocolOwnedLiquidityComponentsQuery = {
  __typename?: "Query";
  protocolMetrics: Array<{
    __typename?: "ProtocolMetric";
    id: string;
    block: number;
    timestamp: number;
    timestampISO8901: string;
    treasuryLPValueComponents: {
      __typename?: "TokenRecordsWrapper";
      value: number;
      records: Array<{
        __typename?: "TokenRecord";
        id: string;
        token: string;
        tokenAddress: string;
        source: string;
        sourceAddress: string;
        balance: number;
        rate: number;
        multiplier: number;
        value: number;
      }>;
    };
  }>;
};

export type TokenRecordsQueryVariables = Exact<{
  startDate: Scalars["String"];
  finishDate: Scalars["String"];
  recordCount: Scalars["Int"];
  startingRecord?: InputMaybe<Scalars["Int"]>;
}>;

export type TokenRecordsQuery = {
  __typename?: "Query";
  tokenRecords: Array<{
    __typename?: "TokenRecord";
    block: number;
    date: string;
    id: string;
    token: string;
    tokenAddress: string;
    source: string;
    sourceAddress: string;
    balance: number;
    rate: number;
    multiplier: number;
    value: number;
    category: string;
    isLiquid: boolean;
    isBluechip: boolean;
  }>;
};

export const MetricsBarLatestOnlyDocument = `
    query MetricsBarLatestOnly {
  protocolMetrics(first: 1, orderBy: timestamp, orderDirection: desc) {
    id
    block
    currentIndex
    gOhmPrice
    gOhmTotalSupply
    marketCap
    ohmCirculatingSupply
    ohmFloatingSupply
    ohmPrice
    totalSupply
    totalValueLocked
    treasuryLiquidBackingPerGOhm
    treasuryLiquidBackingPerOhmFloating
    treasuryMarketValue
  }
}
    `;
export const useMetricsBarLatestOnlyQuery = <TData = MetricsBarLatestOnlyQuery, TError = unknown>(
  dataSource: { endpoint: string; fetchParams?: RequestInit },
  variables?: MetricsBarLatestOnlyQueryVariables,
  options?: UseQueryOptions<MetricsBarLatestOnlyQuery, TError, TData>,
) =>
  useQuery<MetricsBarLatestOnlyQuery, TError, TData>(
    variables === undefined ? ["MetricsBarLatestOnly"] : ["MetricsBarLatestOnly", variables],
    fetcher<MetricsBarLatestOnlyQuery, MetricsBarLatestOnlyQueryVariables>(
      dataSource.endpoint,
      dataSource.fetchParams || {},
      MetricsBarLatestOnlyDocument,
      variables,
    ),
    options,
  );
export const useInfiniteMetricsBarLatestOnlyQuery = <TData = MetricsBarLatestOnlyQuery, TError = unknown>(
  dataSource: { endpoint: string; fetchParams?: RequestInit },
  _pageParamKey: keyof MetricsBarLatestOnlyQueryVariables,
  variables?: MetricsBarLatestOnlyQueryVariables,
  options?: UseInfiniteQueryOptions<MetricsBarLatestOnlyQuery, TError, TData>,
) =>
  useInfiniteQuery<MetricsBarLatestOnlyQuery, TError, TData>(
    variables === undefined ? ["MetricsBarLatestOnly.infinite"] : ["MetricsBarLatestOnly.infinite", variables],
    metaData =>
      fetcher<MetricsBarLatestOnlyQuery, MetricsBarLatestOnlyQueryVariables>(
        dataSource.endpoint,
        dataSource.fetchParams || {},
        MetricsBarLatestOnlyDocument,
        { ...variables, ...(metaData.pageParam ?? {}) },
      )(),
    options,
  );

export const KeyMetricsDocument = `
    query KeyMetrics($records: Int = 100) {
  protocolMetrics(first: $records, orderBy: timestamp, orderDirection: desc) {
    id
    block
    currentIndex
    gOhmPrice
    gOhmTotalSupply
    marketCap
    ohmCirculatingSupply
    ohmFloatingSupply
    ohmPrice
    timestamp
    timestampISO8901
    totalSupply
    totalValueLocked
    treasuryLiquidBacking
    treasuryLiquidBackingPerGOhm
    treasuryLiquidBackingPerOhmFloating
    treasuryMarketValue
  }
}
    `;
export const useKeyMetricsQuery = <TData = KeyMetricsQuery, TError = unknown>(
  dataSource: { endpoint: string; fetchParams?: RequestInit },
  variables?: KeyMetricsQueryVariables,
  options?: UseQueryOptions<KeyMetricsQuery, TError, TData>,
) =>
  useQuery<KeyMetricsQuery, TError, TData>(
    variables === undefined ? ["KeyMetrics"] : ["KeyMetrics", variables],
    fetcher<KeyMetricsQuery, KeyMetricsQueryVariables>(
      dataSource.endpoint,
      dataSource.fetchParams || {},
      KeyMetricsDocument,
      variables,
    ),
    options,
  );
export const useInfiniteKeyMetricsQuery = <TData = KeyMetricsQuery, TError = unknown>(
  dataSource: { endpoint: string; fetchParams?: RequestInit },
  _pageParamKey: keyof KeyMetricsQueryVariables,
  variables?: KeyMetricsQueryVariables,
  options?: UseInfiniteQueryOptions<KeyMetricsQuery, TError, TData>,
) =>
  useInfiniteQuery<KeyMetricsQuery, TError, TData>(
    variables === undefined ? ["KeyMetrics.infinite"] : ["KeyMetrics.infinite", variables],
    metaData =>
      fetcher<KeyMetricsQuery, KeyMetricsQueryVariables>(
        dataSource.endpoint,
        dataSource.fetchParams || {},
        KeyMetricsDocument,
        { ...variables, ...(metaData.pageParam ?? {}) },
      )(),
    options,
  );

export const MarketValueMetricsDocument = `
    query MarketValueMetrics($records: Int = 100) {
  protocolMetrics(first: $records, orderBy: timestamp, orderDirection: desc) {
    id
    block
    timestamp
    timestampISO8901
    treasuryMarketValue
    treasuryStableValue
    treasuryVolatileValue
    treasuryLPValue
    treasuryLiquidBacking
    treasuryLiquidBackingStable
    treasuryLiquidBackingVolatile
    treasuryLiquidBackingProtocolOwnedLiquidity
  }
}
    `;
export const useMarketValueMetricsQuery = <TData = MarketValueMetricsQuery, TError = unknown>(
  dataSource: { endpoint: string; fetchParams?: RequestInit },
  variables?: MarketValueMetricsQueryVariables,
  options?: UseQueryOptions<MarketValueMetricsQuery, TError, TData>,
) =>
  useQuery<MarketValueMetricsQuery, TError, TData>(
    variables === undefined ? ["MarketValueMetrics"] : ["MarketValueMetrics", variables],
    fetcher<MarketValueMetricsQuery, MarketValueMetricsQueryVariables>(
      dataSource.endpoint,
      dataSource.fetchParams || {},
      MarketValueMetricsDocument,
      variables,
    ),
    options,
  );
export const useInfiniteMarketValueMetricsQuery = <TData = MarketValueMetricsQuery, TError = unknown>(
  dataSource: { endpoint: string; fetchParams?: RequestInit },
  _pageParamKey: keyof MarketValueMetricsQueryVariables,
  variables?: MarketValueMetricsQueryVariables,
  options?: UseInfiniteQueryOptions<MarketValueMetricsQuery, TError, TData>,
) =>
  useInfiniteQuery<MarketValueMetricsQuery, TError, TData>(
    variables === undefined ? ["MarketValueMetrics.infinite"] : ["MarketValueMetrics.infinite", variables],
    metaData =>
      fetcher<MarketValueMetricsQuery, MarketValueMetricsQueryVariables>(
        dataSource.endpoint,
        dataSource.fetchParams || {},
        MarketValueMetricsDocument,
        { ...variables, ...(metaData.pageParam ?? {}) },
      )(),
    options,
  );

export const MarketValueMetricsComponentsDocument = `
    query MarketValueMetricsComponents($records: Int = 100) {
  protocolMetrics(first: $records, orderBy: timestamp, orderDirection: desc) {
    id
    block
    timestamp
    timestampISO8901
    treasuryStableValueComponents {
      records {
        token
        value
      }
    }
    treasuryVolatileValueComponents {
      records {
        token
        value
      }
    }
    treasuryLPValueComponents {
      records {
        token
        value
      }
    }
    treasuryLiquidBackingStableComponents {
      records {
        token
        value
      }
    }
    treasuryLiquidBackingVolatileComponents {
      records {
        token
        value
      }
    }
    treasuryLiquidBackingProtocolOwnedLiquidityComponents {
      records {
        token
        value
      }
    }
  }
}
    `;
export const useMarketValueMetricsComponentsQuery = <TData = MarketValueMetricsComponentsQuery, TError = unknown>(
  dataSource: { endpoint: string; fetchParams?: RequestInit },
  variables?: MarketValueMetricsComponentsQueryVariables,
  options?: UseQueryOptions<MarketValueMetricsComponentsQuery, TError, TData>,
) =>
  useQuery<MarketValueMetricsComponentsQuery, TError, TData>(
    variables === undefined ? ["MarketValueMetricsComponents"] : ["MarketValueMetricsComponents", variables],
    fetcher<MarketValueMetricsComponentsQuery, MarketValueMetricsComponentsQueryVariables>(
      dataSource.endpoint,
      dataSource.fetchParams || {},
      MarketValueMetricsComponentsDocument,
      variables,
    ),
    options,
  );
export const useInfiniteMarketValueMetricsComponentsQuery = <
  TData = MarketValueMetricsComponentsQuery,
  TError = unknown,
>(
  dataSource: { endpoint: string; fetchParams?: RequestInit },
  _pageParamKey: keyof MarketValueMetricsComponentsQueryVariables,
  variables?: MarketValueMetricsComponentsQueryVariables,
  options?: UseInfiniteQueryOptions<MarketValueMetricsComponentsQuery, TError, TData>,
) =>
  useInfiniteQuery<MarketValueMetricsComponentsQuery, TError, TData>(
    variables === undefined
      ? ["MarketValueMetricsComponents.infinite"]
      : ["MarketValueMetricsComponents.infinite", variables],
    metaData =>
      fetcher<MarketValueMetricsComponentsQuery, MarketValueMetricsComponentsQueryVariables>(
        dataSource.endpoint,
        dataSource.fetchParams || {},
        MarketValueMetricsComponentsDocument,
        { ...variables, ...(metaData.pageParam ?? {}) },
      )(),
    options,
  );

export const ProtocolOwnedLiquidityComponentsDocument = `
    query ProtocolOwnedLiquidityComponents($records: Int = 100) {
  protocolMetrics(first: $records, orderBy: timestamp, orderDirection: desc) {
    id
    block
    timestamp
    timestampISO8901
    treasuryLPValueComponents {
      value
      records {
        id
        token
        tokenAddress
        source
        sourceAddress
        balance
        rate
        multiplier
        value
      }
    }
  }
}
    `;
export const useProtocolOwnedLiquidityComponentsQuery = <
  TData = ProtocolOwnedLiquidityComponentsQuery,
  TError = unknown,
>(
  dataSource: { endpoint: string; fetchParams?: RequestInit },
  variables?: ProtocolOwnedLiquidityComponentsQueryVariables,
  options?: UseQueryOptions<ProtocolOwnedLiquidityComponentsQuery, TError, TData>,
) =>
  useQuery<ProtocolOwnedLiquidityComponentsQuery, TError, TData>(
    variables === undefined ? ["ProtocolOwnedLiquidityComponents"] : ["ProtocolOwnedLiquidityComponents", variables],
    fetcher<ProtocolOwnedLiquidityComponentsQuery, ProtocolOwnedLiquidityComponentsQueryVariables>(
      dataSource.endpoint,
      dataSource.fetchParams || {},
      ProtocolOwnedLiquidityComponentsDocument,
      variables,
    ),
    options,
  );
export const useInfiniteProtocolOwnedLiquidityComponentsQuery = <
  TData = ProtocolOwnedLiquidityComponentsQuery,
  TError = unknown,
>(
  dataSource: { endpoint: string; fetchParams?: RequestInit },
  _pageParamKey: keyof ProtocolOwnedLiquidityComponentsQueryVariables,
  variables?: ProtocolOwnedLiquidityComponentsQueryVariables,
  options?: UseInfiniteQueryOptions<ProtocolOwnedLiquidityComponentsQuery, TError, TData>,
) =>
  useInfiniteQuery<ProtocolOwnedLiquidityComponentsQuery, TError, TData>(
    variables === undefined
      ? ["ProtocolOwnedLiquidityComponents.infinite"]
      : ["ProtocolOwnedLiquidityComponents.infinite", variables],
    metaData =>
      fetcher<ProtocolOwnedLiquidityComponentsQuery, ProtocolOwnedLiquidityComponentsQueryVariables>(
        dataSource.endpoint,
        dataSource.fetchParams || {},
        ProtocolOwnedLiquidityComponentsDocument,
        { ...variables, ...(metaData.pageParam ?? {}) },
      )(),
    options,
  );

export const TokenRecordsDocument = `
    query TokenRecords($startDate: String!, $finishDate: String!, $recordCount: Int!, $startingRecord: Int = 0) {
  tokenRecords(
    first: $recordCount
    skip: $startingRecord
    where: {date_gte: $startDate, date_lt: $finishDate}
    orderBy: date
    orderDirection: desc
  ) {
    block
    date
    id
    token
    tokenAddress
    source
    sourceAddress
    balance
    rate
    multiplier
    value
    category
    isLiquid
    isBluechip
  }
}
    `;
export const useTokenRecordsQuery = <TData = TokenRecordsQuery, TError = unknown>(
  dataSource: { endpoint: string; fetchParams?: RequestInit },
  variables: TokenRecordsQueryVariables,
  options?: UseQueryOptions<TokenRecordsQuery, TError, TData>,
) =>
  useQuery<TokenRecordsQuery, TError, TData>(
    ["TokenRecords", variables],
    fetcher<TokenRecordsQuery, TokenRecordsQueryVariables>(
      dataSource.endpoint,
      dataSource.fetchParams || {},
      TokenRecordsDocument,
      variables,
    ),
    options,
  );
export const useInfiniteTokenRecordsQuery = <TData = TokenRecordsQuery, TError = unknown>(
  dataSource: { endpoint: string; fetchParams?: RequestInit },
  _pageParamKey: keyof TokenRecordsQueryVariables,
  variables: TokenRecordsQueryVariables,
  options?: UseInfiniteQueryOptions<TokenRecordsQuery, TError, TData>,
) =>
  useInfiniteQuery<TokenRecordsQuery, TError, TData>(
    ["TokenRecords.infinite", variables],
    metaData =>
      fetcher<TokenRecordsQuery, TokenRecordsQueryVariables>(
        dataSource.endpoint,
        dataSource.fetchParams || {},
        TokenRecordsDocument,
        { ...variables, ...(metaData.pageParam ?? {}) },
      )(),
    options,
  );
