// @ts-nocheck

import { InContextSdkMethod } from "@graphql-mesh/types";
import { MeshContext } from "@graphql-mesh/runtime";

export namespace RbsTypes {
  export type Maybe<T> = T | null;
  export type InputMaybe<T> = Maybe<T>;
  export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
  export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
  export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
  export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
  export type Incremental<T> = T | { [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never };
  /** All built-in and custom scalars, mapped to their actual values */
  export type Scalars = {
    ID: { input: string; output: string };
    String: { input: string; output: string };
    Boolean: { input: boolean; output: boolean };
    Int: { input: number; output: number };
    Float: { input: number; output: number };
    BigDecimal: { input: any; output: any };
    BigInt: { input: any; output: any };
    Bytes: { input: any; output: any };
    Int8: { input: any; output: any };
    Timestamp: { input: any; output: any };
  };

  export type Aggregation_interval = "hour" | "day";

  export type Beat = {
    id: Scalars["ID"]["output"];
    blockchain: Scalars["String"]["output"];
    block: Scalars["BigInt"]["output"];
    transaction: Scalars["Bytes"]["output"];
    date: Scalars["String"]["output"];
    timestamp: Scalars["BigInt"]["output"];
  };

  export type BeatRewardIssued = {
    id: Scalars["ID"]["output"];
    blockchain: Scalars["String"]["output"];
    block: Scalars["BigInt"]["output"];
    transaction: Scalars["Bytes"]["output"];
    date: Scalars["String"]["output"];
    timestamp: Scalars["BigInt"]["output"];
    to: Scalars["Bytes"]["output"];
    rewardToken: Scalars["Bytes"]["output"];
    rewardAmount: Scalars["BigDecimal"]["output"];
  };

  export type BeatRewardIssued_filter = {
    id?: InputMaybe<Scalars["ID"]["input"]>;
    id_not?: InputMaybe<Scalars["ID"]["input"]>;
    id_gt?: InputMaybe<Scalars["ID"]["input"]>;
    id_lt?: InputMaybe<Scalars["ID"]["input"]>;
    id_gte?: InputMaybe<Scalars["ID"]["input"]>;
    id_lte?: InputMaybe<Scalars["ID"]["input"]>;
    id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
    id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
    blockchain?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_gt?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_lt?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_gte?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_lte?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    blockchain_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    blockchain_contains?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_contains?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_starts_with?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_ends_with?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    block?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_not?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
    block_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
    transaction?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_not?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
    transaction_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
    transaction_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
    date?: InputMaybe<Scalars["String"]["input"]>;
    date_not?: InputMaybe<Scalars["String"]["input"]>;
    date_gt?: InputMaybe<Scalars["String"]["input"]>;
    date_lt?: InputMaybe<Scalars["String"]["input"]>;
    date_gte?: InputMaybe<Scalars["String"]["input"]>;
    date_lte?: InputMaybe<Scalars["String"]["input"]>;
    date_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    date_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    date_contains?: InputMaybe<Scalars["String"]["input"]>;
    date_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_not_contains?: InputMaybe<Scalars["String"]["input"]>;
    date_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_starts_with?: InputMaybe<Scalars["String"]["input"]>;
    date_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
    date_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_ends_with?: InputMaybe<Scalars["String"]["input"]>;
    date_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
    date_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    timestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
    timestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
    timestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
    timestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
    timestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
    timestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
    timestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
    timestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
    to?: InputMaybe<Scalars["Bytes"]["input"]>;
    to_not?: InputMaybe<Scalars["Bytes"]["input"]>;
    to_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
    to_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
    to_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
    to_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
    to_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
    to_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
    to_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
    to_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
    rewardToken?: InputMaybe<Scalars["Bytes"]["input"]>;
    rewardToken_not?: InputMaybe<Scalars["Bytes"]["input"]>;
    rewardToken_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
    rewardToken_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
    rewardToken_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
    rewardToken_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
    rewardToken_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
    rewardToken_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
    rewardToken_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
    rewardToken_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
    rewardAmount?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    rewardAmount_not?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    rewardAmount_gt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    rewardAmount_lt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    rewardAmount_gte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    rewardAmount_lte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    rewardAmount_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
    rewardAmount_not_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>;
    and?: InputMaybe<Array<InputMaybe<BeatRewardIssued_filter>>>;
    or?: InputMaybe<Array<InputMaybe<BeatRewardIssued_filter>>>;
  };

  export type BeatRewardIssued_orderBy =
    | "id"
    | "blockchain"
    | "block"
    | "transaction"
    | "date"
    | "timestamp"
    | "to"
    | "rewardToken"
    | "rewardAmount";

  export type BeatRewardUpdated = {
    id: Scalars["ID"]["output"];
    blockchain: Scalars["String"]["output"];
    block: Scalars["BigInt"]["output"];
    transaction: Scalars["Bytes"]["output"];
    date: Scalars["String"]["output"];
    timestamp: Scalars["BigInt"]["output"];
    token: Scalars["Bytes"]["output"];
    rewardToken: Scalars["Bytes"]["output"];
    rewardAmount: Scalars["BigDecimal"]["output"];
    auctionDuration?: Maybe<Scalars["BigInt"]["output"]>;
  };

  export type BeatRewardUpdated_filter = {
    id?: InputMaybe<Scalars["ID"]["input"]>;
    id_not?: InputMaybe<Scalars["ID"]["input"]>;
    id_gt?: InputMaybe<Scalars["ID"]["input"]>;
    id_lt?: InputMaybe<Scalars["ID"]["input"]>;
    id_gte?: InputMaybe<Scalars["ID"]["input"]>;
    id_lte?: InputMaybe<Scalars["ID"]["input"]>;
    id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
    id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
    blockchain?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_gt?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_lt?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_gte?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_lte?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    blockchain_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    blockchain_contains?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_contains?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_starts_with?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_ends_with?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    block?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_not?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
    block_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
    transaction?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_not?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
    transaction_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
    transaction_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
    date?: InputMaybe<Scalars["String"]["input"]>;
    date_not?: InputMaybe<Scalars["String"]["input"]>;
    date_gt?: InputMaybe<Scalars["String"]["input"]>;
    date_lt?: InputMaybe<Scalars["String"]["input"]>;
    date_gte?: InputMaybe<Scalars["String"]["input"]>;
    date_lte?: InputMaybe<Scalars["String"]["input"]>;
    date_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    date_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    date_contains?: InputMaybe<Scalars["String"]["input"]>;
    date_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_not_contains?: InputMaybe<Scalars["String"]["input"]>;
    date_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_starts_with?: InputMaybe<Scalars["String"]["input"]>;
    date_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
    date_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_ends_with?: InputMaybe<Scalars["String"]["input"]>;
    date_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
    date_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    timestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
    timestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
    timestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
    timestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
    timestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
    timestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
    timestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
    timestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
    token?: InputMaybe<Scalars["Bytes"]["input"]>;
    token_not?: InputMaybe<Scalars["Bytes"]["input"]>;
    token_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
    token_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
    token_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
    token_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
    token_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
    token_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
    token_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
    token_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
    rewardToken?: InputMaybe<Scalars["Bytes"]["input"]>;
    rewardToken_not?: InputMaybe<Scalars["Bytes"]["input"]>;
    rewardToken_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
    rewardToken_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
    rewardToken_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
    rewardToken_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
    rewardToken_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
    rewardToken_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
    rewardToken_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
    rewardToken_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
    rewardAmount?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    rewardAmount_not?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    rewardAmount_gt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    rewardAmount_lt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    rewardAmount_gte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    rewardAmount_lte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    rewardAmount_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
    rewardAmount_not_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
    auctionDuration?: InputMaybe<Scalars["BigInt"]["input"]>;
    auctionDuration_not?: InputMaybe<Scalars["BigInt"]["input"]>;
    auctionDuration_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
    auctionDuration_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
    auctionDuration_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
    auctionDuration_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
    auctionDuration_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
    auctionDuration_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>;
    and?: InputMaybe<Array<InputMaybe<BeatRewardUpdated_filter>>>;
    or?: InputMaybe<Array<InputMaybe<BeatRewardUpdated_filter>>>;
  };

  export type BeatRewardUpdated_orderBy =
    | "id"
    | "blockchain"
    | "block"
    | "transaction"
    | "date"
    | "timestamp"
    | "token"
    | "rewardToken"
    | "rewardAmount"
    | "auctionDuration";

  export type Beat_filter = {
    id?: InputMaybe<Scalars["ID"]["input"]>;
    id_not?: InputMaybe<Scalars["ID"]["input"]>;
    id_gt?: InputMaybe<Scalars["ID"]["input"]>;
    id_lt?: InputMaybe<Scalars["ID"]["input"]>;
    id_gte?: InputMaybe<Scalars["ID"]["input"]>;
    id_lte?: InputMaybe<Scalars["ID"]["input"]>;
    id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
    id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
    blockchain?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_gt?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_lt?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_gte?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_lte?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    blockchain_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    blockchain_contains?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_contains?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_starts_with?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_ends_with?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    block?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_not?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
    block_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
    transaction?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_not?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
    transaction_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
    transaction_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
    date?: InputMaybe<Scalars["String"]["input"]>;
    date_not?: InputMaybe<Scalars["String"]["input"]>;
    date_gt?: InputMaybe<Scalars["String"]["input"]>;
    date_lt?: InputMaybe<Scalars["String"]["input"]>;
    date_gte?: InputMaybe<Scalars["String"]["input"]>;
    date_lte?: InputMaybe<Scalars["String"]["input"]>;
    date_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    date_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    date_contains?: InputMaybe<Scalars["String"]["input"]>;
    date_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_not_contains?: InputMaybe<Scalars["String"]["input"]>;
    date_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_starts_with?: InputMaybe<Scalars["String"]["input"]>;
    date_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
    date_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_ends_with?: InputMaybe<Scalars["String"]["input"]>;
    date_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
    date_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    timestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
    timestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
    timestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
    timestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
    timestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
    timestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
    timestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
    timestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>;
    and?: InputMaybe<Array<InputMaybe<Beat_filter>>>;
    or?: InputMaybe<Array<InputMaybe<Beat_filter>>>;
  };

  export type Beat_orderBy = "id" | "blockchain" | "block" | "transaction" | "date" | "timestamp";

  export type BlockChangedFilter = {
    number_gte: Scalars["Int"]["input"];
  };

  export type Block_height = {
    hash?: InputMaybe<Scalars["Bytes"]["input"]>;
    number?: InputMaybe<Scalars["Int"]["input"]>;
    number_gte?: InputMaybe<Scalars["Int"]["input"]>;
  };

  export type MinimumTargetPriceChanged = {
    id: Scalars["ID"]["output"];
    blockchain: Scalars["String"]["output"];
    block: Scalars["BigInt"]["output"];
    transaction: Scalars["Bytes"]["output"];
    date: Scalars["String"]["output"];
    timestamp: Scalars["BigInt"]["output"];
    minimumTargetPrice: Scalars["BigDecimal"]["output"];
  };

  export type MinimumTargetPriceChanged_filter = {
    id?: InputMaybe<Scalars["ID"]["input"]>;
    id_not?: InputMaybe<Scalars["ID"]["input"]>;
    id_gt?: InputMaybe<Scalars["ID"]["input"]>;
    id_lt?: InputMaybe<Scalars["ID"]["input"]>;
    id_gte?: InputMaybe<Scalars["ID"]["input"]>;
    id_lte?: InputMaybe<Scalars["ID"]["input"]>;
    id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
    id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
    blockchain?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_gt?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_lt?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_gte?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_lte?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    blockchain_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    blockchain_contains?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_contains?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_starts_with?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_ends_with?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    block?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_not?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
    block_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
    transaction?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_not?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
    transaction_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
    transaction_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
    date?: InputMaybe<Scalars["String"]["input"]>;
    date_not?: InputMaybe<Scalars["String"]["input"]>;
    date_gt?: InputMaybe<Scalars["String"]["input"]>;
    date_lt?: InputMaybe<Scalars["String"]["input"]>;
    date_gte?: InputMaybe<Scalars["String"]["input"]>;
    date_lte?: InputMaybe<Scalars["String"]["input"]>;
    date_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    date_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    date_contains?: InputMaybe<Scalars["String"]["input"]>;
    date_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_not_contains?: InputMaybe<Scalars["String"]["input"]>;
    date_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_starts_with?: InputMaybe<Scalars["String"]["input"]>;
    date_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
    date_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_ends_with?: InputMaybe<Scalars["String"]["input"]>;
    date_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
    date_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    timestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
    timestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
    timestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
    timestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
    timestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
    timestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
    timestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
    timestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
    minimumTargetPrice?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    minimumTargetPrice_not?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    minimumTargetPrice_gt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    minimumTargetPrice_lt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    minimumTargetPrice_gte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    minimumTargetPrice_lte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    minimumTargetPrice_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
    minimumTargetPrice_not_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>;
    and?: InputMaybe<Array<InputMaybe<MinimumTargetPriceChanged_filter>>>;
    or?: InputMaybe<Array<InputMaybe<MinimumTargetPriceChanged_filter>>>;
  };

  export type MinimumTargetPriceChanged_orderBy =
    | "id"
    | "blockchain"
    | "block"
    | "transaction"
    | "date"
    | "timestamp"
    | "minimumTargetPrice";

  export type MovingAverageDurationChanged = {
    id: Scalars["ID"]["output"];
    blockchain: Scalars["String"]["output"];
    block: Scalars["BigInt"]["output"];
    transaction: Scalars["Bytes"]["output"];
    date: Scalars["String"]["output"];
    timestamp: Scalars["BigInt"]["output"];
    movingAverageDuration: Scalars["BigInt"]["output"];
  };

  export type MovingAverageDurationChanged_filter = {
    id?: InputMaybe<Scalars["ID"]["input"]>;
    id_not?: InputMaybe<Scalars["ID"]["input"]>;
    id_gt?: InputMaybe<Scalars["ID"]["input"]>;
    id_lt?: InputMaybe<Scalars["ID"]["input"]>;
    id_gte?: InputMaybe<Scalars["ID"]["input"]>;
    id_lte?: InputMaybe<Scalars["ID"]["input"]>;
    id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
    id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
    blockchain?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_gt?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_lt?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_gte?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_lte?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    blockchain_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    blockchain_contains?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_contains?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_starts_with?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_ends_with?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    block?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_not?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
    block_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
    transaction?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_not?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
    transaction_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
    transaction_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
    date?: InputMaybe<Scalars["String"]["input"]>;
    date_not?: InputMaybe<Scalars["String"]["input"]>;
    date_gt?: InputMaybe<Scalars["String"]["input"]>;
    date_lt?: InputMaybe<Scalars["String"]["input"]>;
    date_gte?: InputMaybe<Scalars["String"]["input"]>;
    date_lte?: InputMaybe<Scalars["String"]["input"]>;
    date_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    date_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    date_contains?: InputMaybe<Scalars["String"]["input"]>;
    date_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_not_contains?: InputMaybe<Scalars["String"]["input"]>;
    date_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_starts_with?: InputMaybe<Scalars["String"]["input"]>;
    date_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
    date_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_ends_with?: InputMaybe<Scalars["String"]["input"]>;
    date_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
    date_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    timestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
    timestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
    timestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
    timestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
    timestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
    timestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
    timestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
    timestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
    movingAverageDuration?: InputMaybe<Scalars["BigInt"]["input"]>;
    movingAverageDuration_not?: InputMaybe<Scalars["BigInt"]["input"]>;
    movingAverageDuration_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
    movingAverageDuration_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
    movingAverageDuration_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
    movingAverageDuration_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
    movingAverageDuration_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
    movingAverageDuration_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>;
    and?: InputMaybe<Array<InputMaybe<MovingAverageDurationChanged_filter>>>;
    or?: InputMaybe<Array<InputMaybe<MovingAverageDurationChanged_filter>>>;
  };

  export type MovingAverageDurationChanged_orderBy =
    | "id"
    | "blockchain"
    | "block"
    | "transaction"
    | "date"
    | "timestamp"
    | "movingAverageDuration";

  export type NewObservation = {
    id: Scalars["ID"]["output"];
    blockchain: Scalars["String"]["output"];
    block: Scalars["BigInt"]["output"];
    transaction: Scalars["Bytes"]["output"];
    date: Scalars["String"]["output"];
    timestamp: Scalars["BigInt"]["output"];
    snapshot: RangeSnapshot;
  };

  export type NewObservation_filter = {
    id?: InputMaybe<Scalars["ID"]["input"]>;
    id_not?: InputMaybe<Scalars["ID"]["input"]>;
    id_gt?: InputMaybe<Scalars["ID"]["input"]>;
    id_lt?: InputMaybe<Scalars["ID"]["input"]>;
    id_gte?: InputMaybe<Scalars["ID"]["input"]>;
    id_lte?: InputMaybe<Scalars["ID"]["input"]>;
    id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
    id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
    blockchain?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_gt?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_lt?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_gte?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_lte?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    blockchain_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    blockchain_contains?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_contains?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_starts_with?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_ends_with?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    block?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_not?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
    block_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
    transaction?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_not?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
    transaction_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
    transaction_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
    date?: InputMaybe<Scalars["String"]["input"]>;
    date_not?: InputMaybe<Scalars["String"]["input"]>;
    date_gt?: InputMaybe<Scalars["String"]["input"]>;
    date_lt?: InputMaybe<Scalars["String"]["input"]>;
    date_gte?: InputMaybe<Scalars["String"]["input"]>;
    date_lte?: InputMaybe<Scalars["String"]["input"]>;
    date_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    date_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    date_contains?: InputMaybe<Scalars["String"]["input"]>;
    date_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_not_contains?: InputMaybe<Scalars["String"]["input"]>;
    date_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_starts_with?: InputMaybe<Scalars["String"]["input"]>;
    date_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
    date_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_ends_with?: InputMaybe<Scalars["String"]["input"]>;
    date_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
    date_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    timestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
    timestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
    timestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
    timestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
    timestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
    timestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
    timestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
    timestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
    snapshot?: InputMaybe<Scalars["String"]["input"]>;
    snapshot_not?: InputMaybe<Scalars["String"]["input"]>;
    snapshot_gt?: InputMaybe<Scalars["String"]["input"]>;
    snapshot_lt?: InputMaybe<Scalars["String"]["input"]>;
    snapshot_gte?: InputMaybe<Scalars["String"]["input"]>;
    snapshot_lte?: InputMaybe<Scalars["String"]["input"]>;
    snapshot_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    snapshot_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    snapshot_contains?: InputMaybe<Scalars["String"]["input"]>;
    snapshot_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
    snapshot_not_contains?: InputMaybe<Scalars["String"]["input"]>;
    snapshot_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
    snapshot_starts_with?: InputMaybe<Scalars["String"]["input"]>;
    snapshot_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    snapshot_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
    snapshot_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    snapshot_ends_with?: InputMaybe<Scalars["String"]["input"]>;
    snapshot_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    snapshot_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
    snapshot_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    snapshot_?: InputMaybe<RangeSnapshot_filter>;
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>;
    and?: InputMaybe<Array<InputMaybe<NewObservation_filter>>>;
    or?: InputMaybe<Array<InputMaybe<NewObservation_filter>>>;
  };

  export type NewObservation_orderBy =
    | "id"
    | "blockchain"
    | "block"
    | "transaction"
    | "date"
    | "timestamp"
    | "snapshot"
    | "snapshot__id"
    | "snapshot__blockchain"
    | "snapshot__block"
    | "snapshot__date"
    | "snapshot__timestamp"
    | "snapshot__ohmPrice"
    | "snapshot__ohmMovingAveragePrice"
    | "snapshot__thresholdFactor"
    | "snapshot__cushionSpread"
    | "snapshot__wallSpread"
    | "snapshot__highCushionSpread"
    | "snapshot__highWallSpread"
    | "snapshot__lowCushionSpread"
    | "snapshot__lowWallSpread"
    | "snapshot__highActive"
    | "snapshot__lowActive"
    | "snapshot__highLastActiveTimestamp"
    | "snapshot__lowLastActiveTimestamp"
    | "snapshot__highCapacityOhm"
    | "snapshot__lowCapacityReserve"
    | "snapshot__highCushionPrice"
    | "snapshot__lowCushionPrice"
    | "snapshot__highMarketId"
    | "snapshot__lowMarketId"
    | "snapshot__highWallPrice"
    | "snapshot__lowWallPrice"
    | "snapshot__treasuryReserveAddress"
    | "snapshot__treasuryReserveBalance"
    | "snapshot__treasuryDebtBalance"
    | "snapshot__operatorReserveFactor"
    | "snapshot__operatorCushionFactor";

  export type ObservationFrequencyChanged = {
    id: Scalars["ID"]["output"];
    blockchain: Scalars["String"]["output"];
    block: Scalars["BigInt"]["output"];
    transaction: Scalars["Bytes"]["output"];
    date: Scalars["String"]["output"];
    timestamp: Scalars["BigInt"]["output"];
    observationFrequencySeconds: Scalars["BigInt"]["output"];
  };

  export type ObservationFrequencyChanged_filter = {
    id?: InputMaybe<Scalars["ID"]["input"]>;
    id_not?: InputMaybe<Scalars["ID"]["input"]>;
    id_gt?: InputMaybe<Scalars["ID"]["input"]>;
    id_lt?: InputMaybe<Scalars["ID"]["input"]>;
    id_gte?: InputMaybe<Scalars["ID"]["input"]>;
    id_lte?: InputMaybe<Scalars["ID"]["input"]>;
    id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
    id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
    blockchain?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_gt?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_lt?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_gte?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_lte?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    blockchain_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    blockchain_contains?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_contains?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_starts_with?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_ends_with?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    block?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_not?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
    block_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
    transaction?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_not?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
    transaction_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
    transaction_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
    date?: InputMaybe<Scalars["String"]["input"]>;
    date_not?: InputMaybe<Scalars["String"]["input"]>;
    date_gt?: InputMaybe<Scalars["String"]["input"]>;
    date_lt?: InputMaybe<Scalars["String"]["input"]>;
    date_gte?: InputMaybe<Scalars["String"]["input"]>;
    date_lte?: InputMaybe<Scalars["String"]["input"]>;
    date_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    date_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    date_contains?: InputMaybe<Scalars["String"]["input"]>;
    date_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_not_contains?: InputMaybe<Scalars["String"]["input"]>;
    date_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_starts_with?: InputMaybe<Scalars["String"]["input"]>;
    date_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
    date_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_ends_with?: InputMaybe<Scalars["String"]["input"]>;
    date_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
    date_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    timestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
    timestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
    timestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
    timestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
    timestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
    timestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
    timestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
    timestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
    observationFrequencySeconds?: InputMaybe<Scalars["BigInt"]["input"]>;
    observationFrequencySeconds_not?: InputMaybe<Scalars["BigInt"]["input"]>;
    observationFrequencySeconds_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
    observationFrequencySeconds_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
    observationFrequencySeconds_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
    observationFrequencySeconds_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
    observationFrequencySeconds_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
    observationFrequencySeconds_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>;
    and?: InputMaybe<Array<InputMaybe<ObservationFrequencyChanged_filter>>>;
    or?: InputMaybe<Array<InputMaybe<ObservationFrequencyChanged_filter>>>;
  };

  export type ObservationFrequencyChanged_orderBy =
    | "id"
    | "blockchain"
    | "block"
    | "transaction"
    | "date"
    | "timestamp"
    | "observationFrequencySeconds";

  export type OperatorVersion = {
    id: Scalars["ID"]["output"];
    version: Scalars["BigDecimal"]["output"];
  };

  export type OperatorVersion_filter = {
    id?: InputMaybe<Scalars["ID"]["input"]>;
    id_not?: InputMaybe<Scalars["ID"]["input"]>;
    id_gt?: InputMaybe<Scalars["ID"]["input"]>;
    id_lt?: InputMaybe<Scalars["ID"]["input"]>;
    id_gte?: InputMaybe<Scalars["ID"]["input"]>;
    id_lte?: InputMaybe<Scalars["ID"]["input"]>;
    id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
    id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
    version?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    version_not?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    version_gt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    version_lt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    version_gte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    version_lte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    version_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
    version_not_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>;
    and?: InputMaybe<Array<InputMaybe<OperatorVersion_filter>>>;
    or?: InputMaybe<Array<InputMaybe<OperatorVersion_filter>>>;
  };

  export type OperatorVersion_orderBy = "id" | "version";

  /** Defines the order direction, either ascending or descending */
  export type OrderDirection = "asc" | "desc";

  export type PriceEvent = {
    id: Scalars["ID"]["output"];
    blockchain: Scalars["String"]["output"];
    block: Scalars["BigInt"]["output"];
    transaction: Scalars["Bytes"]["output"];
    date: Scalars["String"]["output"];
    type: PriceEventType;
    isHigh: Scalars["Boolean"]["output"];
    timestamp: Scalars["BigInt"]["output"];
    snapshot: RangeSnapshot;
  };

  export type PriceEventType = "CushionDown" | "CushionUp" | "WallDown" | "WallUp";

  export type PriceEvent_filter = {
    id?: InputMaybe<Scalars["ID"]["input"]>;
    id_not?: InputMaybe<Scalars["ID"]["input"]>;
    id_gt?: InputMaybe<Scalars["ID"]["input"]>;
    id_lt?: InputMaybe<Scalars["ID"]["input"]>;
    id_gte?: InputMaybe<Scalars["ID"]["input"]>;
    id_lte?: InputMaybe<Scalars["ID"]["input"]>;
    id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
    id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
    blockchain?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_gt?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_lt?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_gte?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_lte?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    blockchain_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    blockchain_contains?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_contains?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_starts_with?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_ends_with?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    block?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_not?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
    block_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
    transaction?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_not?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
    transaction_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
    transaction_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
    date?: InputMaybe<Scalars["String"]["input"]>;
    date_not?: InputMaybe<Scalars["String"]["input"]>;
    date_gt?: InputMaybe<Scalars["String"]["input"]>;
    date_lt?: InputMaybe<Scalars["String"]["input"]>;
    date_gte?: InputMaybe<Scalars["String"]["input"]>;
    date_lte?: InputMaybe<Scalars["String"]["input"]>;
    date_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    date_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    date_contains?: InputMaybe<Scalars["String"]["input"]>;
    date_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_not_contains?: InputMaybe<Scalars["String"]["input"]>;
    date_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_starts_with?: InputMaybe<Scalars["String"]["input"]>;
    date_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
    date_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_ends_with?: InputMaybe<Scalars["String"]["input"]>;
    date_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
    date_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    type?: InputMaybe<PriceEventType>;
    type_not?: InputMaybe<PriceEventType>;
    type_in?: InputMaybe<Array<PriceEventType>>;
    type_not_in?: InputMaybe<Array<PriceEventType>>;
    isHigh?: InputMaybe<Scalars["Boolean"]["input"]>;
    isHigh_not?: InputMaybe<Scalars["Boolean"]["input"]>;
    isHigh_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
    isHigh_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
    timestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
    timestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
    timestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
    timestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
    timestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
    timestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
    timestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
    timestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
    snapshot?: InputMaybe<Scalars["String"]["input"]>;
    snapshot_not?: InputMaybe<Scalars["String"]["input"]>;
    snapshot_gt?: InputMaybe<Scalars["String"]["input"]>;
    snapshot_lt?: InputMaybe<Scalars["String"]["input"]>;
    snapshot_gte?: InputMaybe<Scalars["String"]["input"]>;
    snapshot_lte?: InputMaybe<Scalars["String"]["input"]>;
    snapshot_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    snapshot_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    snapshot_contains?: InputMaybe<Scalars["String"]["input"]>;
    snapshot_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
    snapshot_not_contains?: InputMaybe<Scalars["String"]["input"]>;
    snapshot_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
    snapshot_starts_with?: InputMaybe<Scalars["String"]["input"]>;
    snapshot_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    snapshot_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
    snapshot_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    snapshot_ends_with?: InputMaybe<Scalars["String"]["input"]>;
    snapshot_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    snapshot_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
    snapshot_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    snapshot_?: InputMaybe<RangeSnapshot_filter>;
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>;
    and?: InputMaybe<Array<InputMaybe<PriceEvent_filter>>>;
    or?: InputMaybe<Array<InputMaybe<PriceEvent_filter>>>;
  };

  export type PriceEvent_orderBy =
    | "id"
    | "blockchain"
    | "block"
    | "transaction"
    | "date"
    | "type"
    | "isHigh"
    | "timestamp"
    | "snapshot"
    | "snapshot__id"
    | "snapshot__blockchain"
    | "snapshot__block"
    | "snapshot__date"
    | "snapshot__timestamp"
    | "snapshot__ohmPrice"
    | "snapshot__ohmMovingAveragePrice"
    | "snapshot__thresholdFactor"
    | "snapshot__cushionSpread"
    | "snapshot__wallSpread"
    | "snapshot__highCushionSpread"
    | "snapshot__highWallSpread"
    | "snapshot__lowCushionSpread"
    | "snapshot__lowWallSpread"
    | "snapshot__highActive"
    | "snapshot__lowActive"
    | "snapshot__highLastActiveTimestamp"
    | "snapshot__lowLastActiveTimestamp"
    | "snapshot__highCapacityOhm"
    | "snapshot__lowCapacityReserve"
    | "snapshot__highCushionPrice"
    | "snapshot__lowCushionPrice"
    | "snapshot__highMarketId"
    | "snapshot__lowMarketId"
    | "snapshot__highWallPrice"
    | "snapshot__lowWallPrice"
    | "snapshot__treasuryReserveAddress"
    | "snapshot__treasuryReserveBalance"
    | "snapshot__treasuryDebtBalance"
    | "snapshot__operatorReserveFactor"
    | "snapshot__operatorCushionFactor";

  export type PricesChangedEvent = {
    id: Scalars["ID"]["output"];
    blockchain: Scalars["String"]["output"];
    block: Scalars["BigInt"]["output"];
    transaction: Scalars["Bytes"]["output"];
    date: Scalars["String"]["output"];
    snapshot: RangeSnapshot;
  };

  export type PricesChangedEvent_filter = {
    id?: InputMaybe<Scalars["ID"]["input"]>;
    id_not?: InputMaybe<Scalars["ID"]["input"]>;
    id_gt?: InputMaybe<Scalars["ID"]["input"]>;
    id_lt?: InputMaybe<Scalars["ID"]["input"]>;
    id_gte?: InputMaybe<Scalars["ID"]["input"]>;
    id_lte?: InputMaybe<Scalars["ID"]["input"]>;
    id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
    id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
    blockchain?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_gt?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_lt?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_gte?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_lte?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    blockchain_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    blockchain_contains?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_contains?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_starts_with?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_ends_with?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    block?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_not?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
    block_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
    transaction?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_not?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
    transaction_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
    transaction_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
    date?: InputMaybe<Scalars["String"]["input"]>;
    date_not?: InputMaybe<Scalars["String"]["input"]>;
    date_gt?: InputMaybe<Scalars["String"]["input"]>;
    date_lt?: InputMaybe<Scalars["String"]["input"]>;
    date_gte?: InputMaybe<Scalars["String"]["input"]>;
    date_lte?: InputMaybe<Scalars["String"]["input"]>;
    date_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    date_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    date_contains?: InputMaybe<Scalars["String"]["input"]>;
    date_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_not_contains?: InputMaybe<Scalars["String"]["input"]>;
    date_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_starts_with?: InputMaybe<Scalars["String"]["input"]>;
    date_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
    date_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_ends_with?: InputMaybe<Scalars["String"]["input"]>;
    date_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
    date_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    snapshot?: InputMaybe<Scalars["String"]["input"]>;
    snapshot_not?: InputMaybe<Scalars["String"]["input"]>;
    snapshot_gt?: InputMaybe<Scalars["String"]["input"]>;
    snapshot_lt?: InputMaybe<Scalars["String"]["input"]>;
    snapshot_gte?: InputMaybe<Scalars["String"]["input"]>;
    snapshot_lte?: InputMaybe<Scalars["String"]["input"]>;
    snapshot_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    snapshot_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    snapshot_contains?: InputMaybe<Scalars["String"]["input"]>;
    snapshot_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
    snapshot_not_contains?: InputMaybe<Scalars["String"]["input"]>;
    snapshot_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
    snapshot_starts_with?: InputMaybe<Scalars["String"]["input"]>;
    snapshot_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    snapshot_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
    snapshot_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    snapshot_ends_with?: InputMaybe<Scalars["String"]["input"]>;
    snapshot_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    snapshot_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
    snapshot_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    snapshot_?: InputMaybe<RangeSnapshot_filter>;
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>;
    and?: InputMaybe<Array<InputMaybe<PricesChangedEvent_filter>>>;
    or?: InputMaybe<Array<InputMaybe<PricesChangedEvent_filter>>>;
  };

  export type PricesChangedEvent_orderBy =
    | "id"
    | "blockchain"
    | "block"
    | "transaction"
    | "date"
    | "snapshot"
    | "snapshot__id"
    | "snapshot__blockchain"
    | "snapshot__block"
    | "snapshot__date"
    | "snapshot__timestamp"
    | "snapshot__ohmPrice"
    | "snapshot__ohmMovingAveragePrice"
    | "snapshot__thresholdFactor"
    | "snapshot__cushionSpread"
    | "snapshot__wallSpread"
    | "snapshot__highCushionSpread"
    | "snapshot__highWallSpread"
    | "snapshot__lowCushionSpread"
    | "snapshot__lowWallSpread"
    | "snapshot__highActive"
    | "snapshot__lowActive"
    | "snapshot__highLastActiveTimestamp"
    | "snapshot__lowLastActiveTimestamp"
    | "snapshot__highCapacityOhm"
    | "snapshot__lowCapacityReserve"
    | "snapshot__highCushionPrice"
    | "snapshot__lowCushionPrice"
    | "snapshot__highMarketId"
    | "snapshot__lowMarketId"
    | "snapshot__highWallPrice"
    | "snapshot__lowWallPrice"
    | "snapshot__treasuryReserveAddress"
    | "snapshot__treasuryReserveBalance"
    | "snapshot__treasuryDebtBalance"
    | "snapshot__operatorReserveFactor"
    | "snapshot__operatorCushionFactor";

  export type Query = {
    rangeSnapshot?: Maybe<RangeSnapshot>;
    rangeSnapshots: Array<RangeSnapshot>;
    priceEvent?: Maybe<PriceEvent>;
    priceEvents: Array<PriceEvent>;
    pricesChangedEvent?: Maybe<PricesChangedEvent>;
    pricesChangedEvents: Array<PricesChangedEvent>;
    spreadsChangedEvent?: Maybe<SpreadsChangedEvent>;
    spreadsChangedEvents: Array<SpreadsChangedEvent>;
    thresholdFactorChangedEvent?: Maybe<ThresholdFactorChangedEvent>;
    thresholdFactorChangedEvents: Array<ThresholdFactorChangedEvent>;
    movingAverageDurationChanged?: Maybe<MovingAverageDurationChanged>;
    movingAverageDurationChangeds: Array<MovingAverageDurationChanged>;
    newObservation?: Maybe<NewObservation>;
    newObservations: Array<NewObservation>;
    observationFrequencyChanged?: Maybe<ObservationFrequencyChanged>;
    observationFrequencyChangeds: Array<ObservationFrequencyChanged>;
    updateThresholdsChanged?: Maybe<UpdateThresholdsChanged>;
    updateThresholdsChangeds: Array<UpdateThresholdsChanged>;
    minimumTargetPriceChanged?: Maybe<MinimumTargetPriceChanged>;
    minimumTargetPriceChangeds: Array<MinimumTargetPriceChanged>;
    beat?: Maybe<Beat>;
    beats: Array<Beat>;
    beatRewardIssued?: Maybe<BeatRewardIssued>;
    beatRewardIssueds: Array<BeatRewardIssued>;
    beatRewardUpdated?: Maybe<BeatRewardUpdated>;
    beatRewardUpdateds: Array<BeatRewardUpdated>;
    operatorVersion?: Maybe<OperatorVersion>;
    operatorVersions: Array<OperatorVersion>;
    /** Access to subgraph metadata */
    _meta?: Maybe<_Meta_>;
  };

  export type QueryrangeSnapshotArgs = {
    id: Scalars["ID"]["input"];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type QueryrangeSnapshotsArgs = {
    skip?: InputMaybe<Scalars["Int"]["input"]>;
    first?: InputMaybe<Scalars["Int"]["input"]>;
    orderBy?: InputMaybe<RangeSnapshot_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<RangeSnapshot_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type QuerypriceEventArgs = {
    id: Scalars["ID"]["input"];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type QuerypriceEventsArgs = {
    skip?: InputMaybe<Scalars["Int"]["input"]>;
    first?: InputMaybe<Scalars["Int"]["input"]>;
    orderBy?: InputMaybe<PriceEvent_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<PriceEvent_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type QuerypricesChangedEventArgs = {
    id: Scalars["ID"]["input"];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type QuerypricesChangedEventsArgs = {
    skip?: InputMaybe<Scalars["Int"]["input"]>;
    first?: InputMaybe<Scalars["Int"]["input"]>;
    orderBy?: InputMaybe<PricesChangedEvent_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<PricesChangedEvent_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type QueryspreadsChangedEventArgs = {
    id: Scalars["ID"]["input"];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type QueryspreadsChangedEventsArgs = {
    skip?: InputMaybe<Scalars["Int"]["input"]>;
    first?: InputMaybe<Scalars["Int"]["input"]>;
    orderBy?: InputMaybe<SpreadsChangedEvent_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<SpreadsChangedEvent_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type QuerythresholdFactorChangedEventArgs = {
    id: Scalars["ID"]["input"];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type QuerythresholdFactorChangedEventsArgs = {
    skip?: InputMaybe<Scalars["Int"]["input"]>;
    first?: InputMaybe<Scalars["Int"]["input"]>;
    orderBy?: InputMaybe<ThresholdFactorChangedEvent_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<ThresholdFactorChangedEvent_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type QuerymovingAverageDurationChangedArgs = {
    id: Scalars["ID"]["input"];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type QuerymovingAverageDurationChangedsArgs = {
    skip?: InputMaybe<Scalars["Int"]["input"]>;
    first?: InputMaybe<Scalars["Int"]["input"]>;
    orderBy?: InputMaybe<MovingAverageDurationChanged_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<MovingAverageDurationChanged_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type QuerynewObservationArgs = {
    id: Scalars["ID"]["input"];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type QuerynewObservationsArgs = {
    skip?: InputMaybe<Scalars["Int"]["input"]>;
    first?: InputMaybe<Scalars["Int"]["input"]>;
    orderBy?: InputMaybe<NewObservation_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<NewObservation_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type QueryobservationFrequencyChangedArgs = {
    id: Scalars["ID"]["input"];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type QueryobservationFrequencyChangedsArgs = {
    skip?: InputMaybe<Scalars["Int"]["input"]>;
    first?: InputMaybe<Scalars["Int"]["input"]>;
    orderBy?: InputMaybe<ObservationFrequencyChanged_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<ObservationFrequencyChanged_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type QueryupdateThresholdsChangedArgs = {
    id: Scalars["ID"]["input"];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type QueryupdateThresholdsChangedsArgs = {
    skip?: InputMaybe<Scalars["Int"]["input"]>;
    first?: InputMaybe<Scalars["Int"]["input"]>;
    orderBy?: InputMaybe<UpdateThresholdsChanged_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<UpdateThresholdsChanged_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type QueryminimumTargetPriceChangedArgs = {
    id: Scalars["ID"]["input"];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type QueryminimumTargetPriceChangedsArgs = {
    skip?: InputMaybe<Scalars["Int"]["input"]>;
    first?: InputMaybe<Scalars["Int"]["input"]>;
    orderBy?: InputMaybe<MinimumTargetPriceChanged_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<MinimumTargetPriceChanged_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type QuerybeatArgs = {
    id: Scalars["ID"]["input"];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type QuerybeatsArgs = {
    skip?: InputMaybe<Scalars["Int"]["input"]>;
    first?: InputMaybe<Scalars["Int"]["input"]>;
    orderBy?: InputMaybe<Beat_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<Beat_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type QuerybeatRewardIssuedArgs = {
    id: Scalars["ID"]["input"];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type QuerybeatRewardIssuedsArgs = {
    skip?: InputMaybe<Scalars["Int"]["input"]>;
    first?: InputMaybe<Scalars["Int"]["input"]>;
    orderBy?: InputMaybe<BeatRewardIssued_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<BeatRewardIssued_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type QuerybeatRewardUpdatedArgs = {
    id: Scalars["ID"]["input"];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type QuerybeatRewardUpdatedsArgs = {
    skip?: InputMaybe<Scalars["Int"]["input"]>;
    first?: InputMaybe<Scalars["Int"]["input"]>;
    orderBy?: InputMaybe<BeatRewardUpdated_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<BeatRewardUpdated_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type QueryoperatorVersionArgs = {
    id: Scalars["ID"]["input"];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type QueryoperatorVersionsArgs = {
    skip?: InputMaybe<Scalars["Int"]["input"]>;
    first?: InputMaybe<Scalars["Int"]["input"]>;
    orderBy?: InputMaybe<OperatorVersion_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<OperatorVersion_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type Query_metaArgs = {
    block?: InputMaybe<Block_height>;
  };

  export type RangeSnapshot = {
    id: Scalars["ID"]["output"];
    blockchain: Scalars["String"]["output"];
    block: Scalars["BigInt"]["output"];
    date: Scalars["String"]["output"];
    timestamp: Scalars["BigInt"]["output"];
    ohmPrice?: Maybe<Scalars["BigDecimal"]["output"]>;
    ohmMovingAveragePrice?: Maybe<Scalars["BigDecimal"]["output"]>;
    thresholdFactor: Scalars["BigDecimal"]["output"];
    cushionSpread: Scalars["BigDecimal"]["output"];
    wallSpread: Scalars["BigDecimal"]["output"];
    highCushionSpread?: Maybe<Scalars["BigDecimal"]["output"]>;
    highWallSpread?: Maybe<Scalars["BigDecimal"]["output"]>;
    lowCushionSpread?: Maybe<Scalars["BigDecimal"]["output"]>;
    lowWallSpread?: Maybe<Scalars["BigDecimal"]["output"]>;
    highActive: Scalars["Boolean"]["output"];
    lowActive: Scalars["Boolean"]["output"];
    highLastActiveTimestamp: Scalars["BigInt"]["output"];
    lowLastActiveTimestamp: Scalars["BigInt"]["output"];
    highCapacityOhm: Scalars["BigDecimal"]["output"];
    lowCapacityReserve: Scalars["BigDecimal"]["output"];
    highCushionPrice: Scalars["BigDecimal"]["output"];
    lowCushionPrice: Scalars["BigDecimal"]["output"];
    highMarketId?: Maybe<Scalars["BigInt"]["output"]>;
    lowMarketId?: Maybe<Scalars["BigInt"]["output"]>;
    highWallPrice: Scalars["BigDecimal"]["output"];
    lowWallPrice: Scalars["BigDecimal"]["output"];
    treasuryReserveAddress?: Maybe<Scalars["Bytes"]["output"]>;
    treasuryReserveBalance?: Maybe<Scalars["BigDecimal"]["output"]>;
    treasuryDebtBalance?: Maybe<Scalars["BigDecimal"]["output"]>;
    operatorReserveFactor?: Maybe<Scalars["BigDecimal"]["output"]>;
    operatorCushionFactor?: Maybe<Scalars["BigDecimal"]["output"]>;
  };

  export type RangeSnapshot_filter = {
    id?: InputMaybe<Scalars["ID"]["input"]>;
    id_not?: InputMaybe<Scalars["ID"]["input"]>;
    id_gt?: InputMaybe<Scalars["ID"]["input"]>;
    id_lt?: InputMaybe<Scalars["ID"]["input"]>;
    id_gte?: InputMaybe<Scalars["ID"]["input"]>;
    id_lte?: InputMaybe<Scalars["ID"]["input"]>;
    id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
    id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
    blockchain?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_gt?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_lt?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_gte?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_lte?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    blockchain_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    blockchain_contains?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_contains?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_starts_with?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_ends_with?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    block?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_not?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
    block_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
    date?: InputMaybe<Scalars["String"]["input"]>;
    date_not?: InputMaybe<Scalars["String"]["input"]>;
    date_gt?: InputMaybe<Scalars["String"]["input"]>;
    date_lt?: InputMaybe<Scalars["String"]["input"]>;
    date_gte?: InputMaybe<Scalars["String"]["input"]>;
    date_lte?: InputMaybe<Scalars["String"]["input"]>;
    date_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    date_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    date_contains?: InputMaybe<Scalars["String"]["input"]>;
    date_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_not_contains?: InputMaybe<Scalars["String"]["input"]>;
    date_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_starts_with?: InputMaybe<Scalars["String"]["input"]>;
    date_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
    date_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_ends_with?: InputMaybe<Scalars["String"]["input"]>;
    date_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
    date_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    timestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
    timestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
    timestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
    timestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
    timestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
    timestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
    timestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
    timestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
    ohmPrice?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    ohmPrice_not?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    ohmPrice_gt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    ohmPrice_lt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    ohmPrice_gte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    ohmPrice_lte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    ohmPrice_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
    ohmPrice_not_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
    ohmMovingAveragePrice?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    ohmMovingAveragePrice_not?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    ohmMovingAveragePrice_gt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    ohmMovingAveragePrice_lt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    ohmMovingAveragePrice_gte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    ohmMovingAveragePrice_lte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    ohmMovingAveragePrice_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
    ohmMovingAveragePrice_not_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
    thresholdFactor?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    thresholdFactor_not?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    thresholdFactor_gt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    thresholdFactor_lt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    thresholdFactor_gte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    thresholdFactor_lte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    thresholdFactor_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
    thresholdFactor_not_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
    cushionSpread?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    cushionSpread_not?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    cushionSpread_gt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    cushionSpread_lt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    cushionSpread_gte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    cushionSpread_lte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    cushionSpread_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
    cushionSpread_not_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
    wallSpread?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    wallSpread_not?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    wallSpread_gt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    wallSpread_lt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    wallSpread_gte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    wallSpread_lte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    wallSpread_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
    wallSpread_not_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
    highCushionSpread?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    highCushionSpread_not?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    highCushionSpread_gt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    highCushionSpread_lt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    highCushionSpread_gte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    highCushionSpread_lte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    highCushionSpread_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
    highCushionSpread_not_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
    highWallSpread?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    highWallSpread_not?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    highWallSpread_gt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    highWallSpread_lt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    highWallSpread_gte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    highWallSpread_lte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    highWallSpread_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
    highWallSpread_not_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
    lowCushionSpread?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    lowCushionSpread_not?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    lowCushionSpread_gt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    lowCushionSpread_lt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    lowCushionSpread_gte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    lowCushionSpread_lte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    lowCushionSpread_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
    lowCushionSpread_not_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
    lowWallSpread?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    lowWallSpread_not?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    lowWallSpread_gt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    lowWallSpread_lt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    lowWallSpread_gte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    lowWallSpread_lte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    lowWallSpread_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
    lowWallSpread_not_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
    highActive?: InputMaybe<Scalars["Boolean"]["input"]>;
    highActive_not?: InputMaybe<Scalars["Boolean"]["input"]>;
    highActive_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
    highActive_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
    lowActive?: InputMaybe<Scalars["Boolean"]["input"]>;
    lowActive_not?: InputMaybe<Scalars["Boolean"]["input"]>;
    lowActive_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
    lowActive_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
    highLastActiveTimestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
    highLastActiveTimestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
    highLastActiveTimestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
    highLastActiveTimestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
    highLastActiveTimestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
    highLastActiveTimestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
    highLastActiveTimestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
    highLastActiveTimestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
    lowLastActiveTimestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
    lowLastActiveTimestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
    lowLastActiveTimestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
    lowLastActiveTimestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
    lowLastActiveTimestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
    lowLastActiveTimestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
    lowLastActiveTimestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
    lowLastActiveTimestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
    highCapacityOhm?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    highCapacityOhm_not?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    highCapacityOhm_gt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    highCapacityOhm_lt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    highCapacityOhm_gte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    highCapacityOhm_lte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    highCapacityOhm_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
    highCapacityOhm_not_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
    lowCapacityReserve?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    lowCapacityReserve_not?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    lowCapacityReserve_gt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    lowCapacityReserve_lt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    lowCapacityReserve_gte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    lowCapacityReserve_lte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    lowCapacityReserve_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
    lowCapacityReserve_not_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
    highCushionPrice?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    highCushionPrice_not?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    highCushionPrice_gt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    highCushionPrice_lt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    highCushionPrice_gte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    highCushionPrice_lte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    highCushionPrice_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
    highCushionPrice_not_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
    lowCushionPrice?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    lowCushionPrice_not?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    lowCushionPrice_gt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    lowCushionPrice_lt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    lowCushionPrice_gte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    lowCushionPrice_lte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    lowCushionPrice_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
    lowCushionPrice_not_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
    highMarketId?: InputMaybe<Scalars["BigInt"]["input"]>;
    highMarketId_not?: InputMaybe<Scalars["BigInt"]["input"]>;
    highMarketId_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
    highMarketId_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
    highMarketId_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
    highMarketId_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
    highMarketId_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
    highMarketId_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
    lowMarketId?: InputMaybe<Scalars["BigInt"]["input"]>;
    lowMarketId_not?: InputMaybe<Scalars["BigInt"]["input"]>;
    lowMarketId_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
    lowMarketId_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
    lowMarketId_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
    lowMarketId_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
    lowMarketId_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
    lowMarketId_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
    highWallPrice?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    highWallPrice_not?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    highWallPrice_gt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    highWallPrice_lt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    highWallPrice_gte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    highWallPrice_lte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    highWallPrice_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
    highWallPrice_not_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
    lowWallPrice?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    lowWallPrice_not?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    lowWallPrice_gt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    lowWallPrice_lt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    lowWallPrice_gte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    lowWallPrice_lte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    lowWallPrice_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
    lowWallPrice_not_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
    treasuryReserveAddress?: InputMaybe<Scalars["Bytes"]["input"]>;
    treasuryReserveAddress_not?: InputMaybe<Scalars["Bytes"]["input"]>;
    treasuryReserveAddress_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
    treasuryReserveAddress_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
    treasuryReserveAddress_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
    treasuryReserveAddress_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
    treasuryReserveAddress_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
    treasuryReserveAddress_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
    treasuryReserveAddress_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
    treasuryReserveAddress_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
    treasuryReserveBalance?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    treasuryReserveBalance_not?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    treasuryReserveBalance_gt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    treasuryReserveBalance_lt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    treasuryReserveBalance_gte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    treasuryReserveBalance_lte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    treasuryReserveBalance_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
    treasuryReserveBalance_not_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
    treasuryDebtBalance?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    treasuryDebtBalance_not?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    treasuryDebtBalance_gt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    treasuryDebtBalance_lt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    treasuryDebtBalance_gte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    treasuryDebtBalance_lte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    treasuryDebtBalance_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
    treasuryDebtBalance_not_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
    operatorReserveFactor?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    operatorReserveFactor_not?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    operatorReserveFactor_gt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    operatorReserveFactor_lt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    operatorReserveFactor_gte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    operatorReserveFactor_lte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    operatorReserveFactor_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
    operatorReserveFactor_not_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
    operatorCushionFactor?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    operatorCushionFactor_not?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    operatorCushionFactor_gt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    operatorCushionFactor_lt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    operatorCushionFactor_gte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    operatorCushionFactor_lte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    operatorCushionFactor_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
    operatorCushionFactor_not_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>;
    and?: InputMaybe<Array<InputMaybe<RangeSnapshot_filter>>>;
    or?: InputMaybe<Array<InputMaybe<RangeSnapshot_filter>>>;
  };

  export type RangeSnapshot_orderBy =
    | "id"
    | "blockchain"
    | "block"
    | "date"
    | "timestamp"
    | "ohmPrice"
    | "ohmMovingAveragePrice"
    | "thresholdFactor"
    | "cushionSpread"
    | "wallSpread"
    | "highCushionSpread"
    | "highWallSpread"
    | "lowCushionSpread"
    | "lowWallSpread"
    | "highActive"
    | "lowActive"
    | "highLastActiveTimestamp"
    | "lowLastActiveTimestamp"
    | "highCapacityOhm"
    | "lowCapacityReserve"
    | "highCushionPrice"
    | "lowCushionPrice"
    | "highMarketId"
    | "lowMarketId"
    | "highWallPrice"
    | "lowWallPrice"
    | "treasuryReserveAddress"
    | "treasuryReserveBalance"
    | "treasuryDebtBalance"
    | "operatorReserveFactor"
    | "operatorCushionFactor";

  export type SpreadsChangedEvent = {
    id: Scalars["ID"]["output"];
    blockchain: Scalars["String"]["output"];
    block: Scalars["BigInt"]["output"];
    transaction: Scalars["Bytes"]["output"];
    date: Scalars["String"]["output"];
    high?: Maybe<Scalars["Boolean"]["output"]>;
    cushionSpread: Scalars["BigDecimal"]["output"];
    wallSpread: Scalars["BigDecimal"]["output"];
  };

  export type SpreadsChangedEvent_filter = {
    id?: InputMaybe<Scalars["ID"]["input"]>;
    id_not?: InputMaybe<Scalars["ID"]["input"]>;
    id_gt?: InputMaybe<Scalars["ID"]["input"]>;
    id_lt?: InputMaybe<Scalars["ID"]["input"]>;
    id_gte?: InputMaybe<Scalars["ID"]["input"]>;
    id_lte?: InputMaybe<Scalars["ID"]["input"]>;
    id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
    id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
    blockchain?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_gt?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_lt?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_gte?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_lte?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    blockchain_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    blockchain_contains?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_contains?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_starts_with?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_ends_with?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    block?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_not?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
    block_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
    transaction?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_not?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
    transaction_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
    transaction_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
    date?: InputMaybe<Scalars["String"]["input"]>;
    date_not?: InputMaybe<Scalars["String"]["input"]>;
    date_gt?: InputMaybe<Scalars["String"]["input"]>;
    date_lt?: InputMaybe<Scalars["String"]["input"]>;
    date_gte?: InputMaybe<Scalars["String"]["input"]>;
    date_lte?: InputMaybe<Scalars["String"]["input"]>;
    date_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    date_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    date_contains?: InputMaybe<Scalars["String"]["input"]>;
    date_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_not_contains?: InputMaybe<Scalars["String"]["input"]>;
    date_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_starts_with?: InputMaybe<Scalars["String"]["input"]>;
    date_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
    date_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_ends_with?: InputMaybe<Scalars["String"]["input"]>;
    date_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
    date_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    high?: InputMaybe<Scalars["Boolean"]["input"]>;
    high_not?: InputMaybe<Scalars["Boolean"]["input"]>;
    high_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
    high_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
    cushionSpread?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    cushionSpread_not?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    cushionSpread_gt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    cushionSpread_lt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    cushionSpread_gte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    cushionSpread_lte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    cushionSpread_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
    cushionSpread_not_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
    wallSpread?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    wallSpread_not?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    wallSpread_gt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    wallSpread_lt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    wallSpread_gte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    wallSpread_lte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    wallSpread_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
    wallSpread_not_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>;
    and?: InputMaybe<Array<InputMaybe<SpreadsChangedEvent_filter>>>;
    or?: InputMaybe<Array<InputMaybe<SpreadsChangedEvent_filter>>>;
  };

  export type SpreadsChangedEvent_orderBy =
    | "id"
    | "blockchain"
    | "block"
    | "transaction"
    | "date"
    | "high"
    | "cushionSpread"
    | "wallSpread";

  export type Subscription = {
    rangeSnapshot?: Maybe<RangeSnapshot>;
    rangeSnapshots: Array<RangeSnapshot>;
    priceEvent?: Maybe<PriceEvent>;
    priceEvents: Array<PriceEvent>;
    pricesChangedEvent?: Maybe<PricesChangedEvent>;
    pricesChangedEvents: Array<PricesChangedEvent>;
    spreadsChangedEvent?: Maybe<SpreadsChangedEvent>;
    spreadsChangedEvents: Array<SpreadsChangedEvent>;
    thresholdFactorChangedEvent?: Maybe<ThresholdFactorChangedEvent>;
    thresholdFactorChangedEvents: Array<ThresholdFactorChangedEvent>;
    movingAverageDurationChanged?: Maybe<MovingAverageDurationChanged>;
    movingAverageDurationChangeds: Array<MovingAverageDurationChanged>;
    newObservation?: Maybe<NewObservation>;
    newObservations: Array<NewObservation>;
    observationFrequencyChanged?: Maybe<ObservationFrequencyChanged>;
    observationFrequencyChangeds: Array<ObservationFrequencyChanged>;
    updateThresholdsChanged?: Maybe<UpdateThresholdsChanged>;
    updateThresholdsChangeds: Array<UpdateThresholdsChanged>;
    minimumTargetPriceChanged?: Maybe<MinimumTargetPriceChanged>;
    minimumTargetPriceChangeds: Array<MinimumTargetPriceChanged>;
    beat?: Maybe<Beat>;
    beats: Array<Beat>;
    beatRewardIssued?: Maybe<BeatRewardIssued>;
    beatRewardIssueds: Array<BeatRewardIssued>;
    beatRewardUpdated?: Maybe<BeatRewardUpdated>;
    beatRewardUpdateds: Array<BeatRewardUpdated>;
    operatorVersion?: Maybe<OperatorVersion>;
    operatorVersions: Array<OperatorVersion>;
    /** Access to subgraph metadata */
    _meta?: Maybe<_Meta_>;
  };

  export type SubscriptionrangeSnapshotArgs = {
    id: Scalars["ID"]["input"];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type SubscriptionrangeSnapshotsArgs = {
    skip?: InputMaybe<Scalars["Int"]["input"]>;
    first?: InputMaybe<Scalars["Int"]["input"]>;
    orderBy?: InputMaybe<RangeSnapshot_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<RangeSnapshot_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type SubscriptionpriceEventArgs = {
    id: Scalars["ID"]["input"];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type SubscriptionpriceEventsArgs = {
    skip?: InputMaybe<Scalars["Int"]["input"]>;
    first?: InputMaybe<Scalars["Int"]["input"]>;
    orderBy?: InputMaybe<PriceEvent_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<PriceEvent_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type SubscriptionpricesChangedEventArgs = {
    id: Scalars["ID"]["input"];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type SubscriptionpricesChangedEventsArgs = {
    skip?: InputMaybe<Scalars["Int"]["input"]>;
    first?: InputMaybe<Scalars["Int"]["input"]>;
    orderBy?: InputMaybe<PricesChangedEvent_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<PricesChangedEvent_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type SubscriptionspreadsChangedEventArgs = {
    id: Scalars["ID"]["input"];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type SubscriptionspreadsChangedEventsArgs = {
    skip?: InputMaybe<Scalars["Int"]["input"]>;
    first?: InputMaybe<Scalars["Int"]["input"]>;
    orderBy?: InputMaybe<SpreadsChangedEvent_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<SpreadsChangedEvent_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type SubscriptionthresholdFactorChangedEventArgs = {
    id: Scalars["ID"]["input"];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type SubscriptionthresholdFactorChangedEventsArgs = {
    skip?: InputMaybe<Scalars["Int"]["input"]>;
    first?: InputMaybe<Scalars["Int"]["input"]>;
    orderBy?: InputMaybe<ThresholdFactorChangedEvent_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<ThresholdFactorChangedEvent_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type SubscriptionmovingAverageDurationChangedArgs = {
    id: Scalars["ID"]["input"];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type SubscriptionmovingAverageDurationChangedsArgs = {
    skip?: InputMaybe<Scalars["Int"]["input"]>;
    first?: InputMaybe<Scalars["Int"]["input"]>;
    orderBy?: InputMaybe<MovingAverageDurationChanged_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<MovingAverageDurationChanged_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type SubscriptionnewObservationArgs = {
    id: Scalars["ID"]["input"];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type SubscriptionnewObservationsArgs = {
    skip?: InputMaybe<Scalars["Int"]["input"]>;
    first?: InputMaybe<Scalars["Int"]["input"]>;
    orderBy?: InputMaybe<NewObservation_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<NewObservation_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type SubscriptionobservationFrequencyChangedArgs = {
    id: Scalars["ID"]["input"];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type SubscriptionobservationFrequencyChangedsArgs = {
    skip?: InputMaybe<Scalars["Int"]["input"]>;
    first?: InputMaybe<Scalars["Int"]["input"]>;
    orderBy?: InputMaybe<ObservationFrequencyChanged_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<ObservationFrequencyChanged_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type SubscriptionupdateThresholdsChangedArgs = {
    id: Scalars["ID"]["input"];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type SubscriptionupdateThresholdsChangedsArgs = {
    skip?: InputMaybe<Scalars["Int"]["input"]>;
    first?: InputMaybe<Scalars["Int"]["input"]>;
    orderBy?: InputMaybe<UpdateThresholdsChanged_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<UpdateThresholdsChanged_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type SubscriptionminimumTargetPriceChangedArgs = {
    id: Scalars["ID"]["input"];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type SubscriptionminimumTargetPriceChangedsArgs = {
    skip?: InputMaybe<Scalars["Int"]["input"]>;
    first?: InputMaybe<Scalars["Int"]["input"]>;
    orderBy?: InputMaybe<MinimumTargetPriceChanged_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<MinimumTargetPriceChanged_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type SubscriptionbeatArgs = {
    id: Scalars["ID"]["input"];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type SubscriptionbeatsArgs = {
    skip?: InputMaybe<Scalars["Int"]["input"]>;
    first?: InputMaybe<Scalars["Int"]["input"]>;
    orderBy?: InputMaybe<Beat_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<Beat_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type SubscriptionbeatRewardIssuedArgs = {
    id: Scalars["ID"]["input"];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type SubscriptionbeatRewardIssuedsArgs = {
    skip?: InputMaybe<Scalars["Int"]["input"]>;
    first?: InputMaybe<Scalars["Int"]["input"]>;
    orderBy?: InputMaybe<BeatRewardIssued_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<BeatRewardIssued_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type SubscriptionbeatRewardUpdatedArgs = {
    id: Scalars["ID"]["input"];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type SubscriptionbeatRewardUpdatedsArgs = {
    skip?: InputMaybe<Scalars["Int"]["input"]>;
    first?: InputMaybe<Scalars["Int"]["input"]>;
    orderBy?: InputMaybe<BeatRewardUpdated_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<BeatRewardUpdated_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type SubscriptionoperatorVersionArgs = {
    id: Scalars["ID"]["input"];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type SubscriptionoperatorVersionsArgs = {
    skip?: InputMaybe<Scalars["Int"]["input"]>;
    first?: InputMaybe<Scalars["Int"]["input"]>;
    orderBy?: InputMaybe<OperatorVersion_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<OperatorVersion_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
  };

  export type Subscription_metaArgs = {
    block?: InputMaybe<Block_height>;
  };

  export type ThresholdFactorChangedEvent = {
    id: Scalars["ID"]["output"];
    blockchain: Scalars["String"]["output"];
    block: Scalars["BigInt"]["output"];
    transaction: Scalars["Bytes"]["output"];
    date: Scalars["String"]["output"];
    thresholdFactor: Scalars["BigDecimal"]["output"];
  };

  export type ThresholdFactorChangedEvent_filter = {
    id?: InputMaybe<Scalars["ID"]["input"]>;
    id_not?: InputMaybe<Scalars["ID"]["input"]>;
    id_gt?: InputMaybe<Scalars["ID"]["input"]>;
    id_lt?: InputMaybe<Scalars["ID"]["input"]>;
    id_gte?: InputMaybe<Scalars["ID"]["input"]>;
    id_lte?: InputMaybe<Scalars["ID"]["input"]>;
    id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
    id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
    blockchain?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_gt?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_lt?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_gte?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_lte?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    blockchain_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    blockchain_contains?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_contains?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_starts_with?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_ends_with?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    block?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_not?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
    block_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
    transaction?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_not?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
    transaction_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
    transaction_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
    date?: InputMaybe<Scalars["String"]["input"]>;
    date_not?: InputMaybe<Scalars["String"]["input"]>;
    date_gt?: InputMaybe<Scalars["String"]["input"]>;
    date_lt?: InputMaybe<Scalars["String"]["input"]>;
    date_gte?: InputMaybe<Scalars["String"]["input"]>;
    date_lte?: InputMaybe<Scalars["String"]["input"]>;
    date_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    date_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    date_contains?: InputMaybe<Scalars["String"]["input"]>;
    date_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_not_contains?: InputMaybe<Scalars["String"]["input"]>;
    date_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_starts_with?: InputMaybe<Scalars["String"]["input"]>;
    date_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
    date_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_ends_with?: InputMaybe<Scalars["String"]["input"]>;
    date_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
    date_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    thresholdFactor?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    thresholdFactor_not?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    thresholdFactor_gt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    thresholdFactor_lt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    thresholdFactor_gte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    thresholdFactor_lte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
    thresholdFactor_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
    thresholdFactor_not_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>;
    and?: InputMaybe<Array<InputMaybe<ThresholdFactorChangedEvent_filter>>>;
    or?: InputMaybe<Array<InputMaybe<ThresholdFactorChangedEvent_filter>>>;
  };

  export type ThresholdFactorChangedEvent_orderBy =
    | "id"
    | "blockchain"
    | "block"
    | "transaction"
    | "date"
    | "thresholdFactor";

  export type UpdateThresholdsChanged = {
    id: Scalars["ID"]["output"];
    blockchain: Scalars["String"]["output"];
    block: Scalars["BigInt"]["output"];
    transaction: Scalars["Bytes"]["output"];
    date: Scalars["String"]["output"];
    timestamp: Scalars["BigInt"]["output"];
    ohmEthUpdateThresholdSeconds: Scalars["BigInt"]["output"];
    reserveEthUpdateThresholdSeconds: Scalars["BigInt"]["output"];
  };

  export type UpdateThresholdsChanged_filter = {
    id?: InputMaybe<Scalars["ID"]["input"]>;
    id_not?: InputMaybe<Scalars["ID"]["input"]>;
    id_gt?: InputMaybe<Scalars["ID"]["input"]>;
    id_lt?: InputMaybe<Scalars["ID"]["input"]>;
    id_gte?: InputMaybe<Scalars["ID"]["input"]>;
    id_lte?: InputMaybe<Scalars["ID"]["input"]>;
    id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
    id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
    blockchain?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_gt?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_lt?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_gte?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_lte?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    blockchain_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    blockchain_contains?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_contains?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_starts_with?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_ends_with?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
    blockchain_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    block?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_not?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
    block_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
    block_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
    transaction?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_not?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
    transaction_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
    transaction_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
    transaction_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
    date?: InputMaybe<Scalars["String"]["input"]>;
    date_not?: InputMaybe<Scalars["String"]["input"]>;
    date_gt?: InputMaybe<Scalars["String"]["input"]>;
    date_lt?: InputMaybe<Scalars["String"]["input"]>;
    date_gte?: InputMaybe<Scalars["String"]["input"]>;
    date_lte?: InputMaybe<Scalars["String"]["input"]>;
    date_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    date_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    date_contains?: InputMaybe<Scalars["String"]["input"]>;
    date_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_not_contains?: InputMaybe<Scalars["String"]["input"]>;
    date_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_starts_with?: InputMaybe<Scalars["String"]["input"]>;
    date_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
    date_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_ends_with?: InputMaybe<Scalars["String"]["input"]>;
    date_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    date_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
    date_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
    timestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
    timestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
    timestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
    timestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
    timestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
    timestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
    timestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
    timestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
    ohmEthUpdateThresholdSeconds?: InputMaybe<Scalars["BigInt"]["input"]>;
    ohmEthUpdateThresholdSeconds_not?: InputMaybe<Scalars["BigInt"]["input"]>;
    ohmEthUpdateThresholdSeconds_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
    ohmEthUpdateThresholdSeconds_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
    ohmEthUpdateThresholdSeconds_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
    ohmEthUpdateThresholdSeconds_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
    ohmEthUpdateThresholdSeconds_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
    ohmEthUpdateThresholdSeconds_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
    reserveEthUpdateThresholdSeconds?: InputMaybe<Scalars["BigInt"]["input"]>;
    reserveEthUpdateThresholdSeconds_not?: InputMaybe<Scalars["BigInt"]["input"]>;
    reserveEthUpdateThresholdSeconds_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
    reserveEthUpdateThresholdSeconds_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
    reserveEthUpdateThresholdSeconds_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
    reserveEthUpdateThresholdSeconds_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
    reserveEthUpdateThresholdSeconds_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
    reserveEthUpdateThresholdSeconds_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>;
    and?: InputMaybe<Array<InputMaybe<UpdateThresholdsChanged_filter>>>;
    or?: InputMaybe<Array<InputMaybe<UpdateThresholdsChanged_filter>>>;
  };

  export type UpdateThresholdsChanged_orderBy =
    | "id"
    | "blockchain"
    | "block"
    | "transaction"
    | "date"
    | "timestamp"
    | "ohmEthUpdateThresholdSeconds"
    | "reserveEthUpdateThresholdSeconds";

  export type _Block_ = {
    /** The hash of the block */
    hash?: Maybe<Scalars["Bytes"]["output"]>;
    /** The block number */
    number: Scalars["Int"]["output"];
    /** Integer representation of the timestamp stored in blocks for the chain */
    timestamp?: Maybe<Scalars["Int"]["output"]>;
    /** The hash of the parent block */
    parentHash?: Maybe<Scalars["Bytes"]["output"]>;
  };

  /** The type for the top-level _meta field */
  export type _Meta_ = {
    /**
     * Information about a specific subgraph block. The hash of the block
     * will be null if the _meta field has a block constraint that asks for
     * a block number. It will be filled if the _meta field has no block constraint
     * and therefore asks for the latest  block
     *
     */
    block: _Block_;
    /** The deployment ID */
    deployment: Scalars["String"]["output"];
    /** If `true`, the subgraph encountered indexing errors at some past block */
    hasIndexingErrors: Scalars["Boolean"]["output"];
  };

  export type _SubgraphErrorPolicy_ =
    /** Data will be returned even if the subgraph has indexing errors */
    | "allow"
    /** If the subgraph has indexing errors, data will be omitted. The default. */
    | "deny";

  export type QuerySdk = {
    /** null **/
    rangeSnapshot: InContextSdkMethod<Query["rangeSnapshot"], QueryrangeSnapshotArgs, MeshContext>;
    /** null **/
    rangeSnapshots: InContextSdkMethod<Query["rangeSnapshots"], QueryrangeSnapshotsArgs, MeshContext>;
    /** null **/
    priceEvent: InContextSdkMethod<Query["priceEvent"], QuerypriceEventArgs, MeshContext>;
    /** null **/
    priceEvents: InContextSdkMethod<Query["priceEvents"], QuerypriceEventsArgs, MeshContext>;
    /** null **/
    pricesChangedEvent: InContextSdkMethod<Query["pricesChangedEvent"], QuerypricesChangedEventArgs, MeshContext>;
    /** null **/
    pricesChangedEvents: InContextSdkMethod<Query["pricesChangedEvents"], QuerypricesChangedEventsArgs, MeshContext>;
    /** null **/
    spreadsChangedEvent: InContextSdkMethod<Query["spreadsChangedEvent"], QueryspreadsChangedEventArgs, MeshContext>;
    /** null **/
    spreadsChangedEvents: InContextSdkMethod<Query["spreadsChangedEvents"], QueryspreadsChangedEventsArgs, MeshContext>;
    /** null **/
    thresholdFactorChangedEvent: InContextSdkMethod<
      Query["thresholdFactorChangedEvent"],
      QuerythresholdFactorChangedEventArgs,
      MeshContext
    >;
    /** null **/
    thresholdFactorChangedEvents: InContextSdkMethod<
      Query["thresholdFactorChangedEvents"],
      QuerythresholdFactorChangedEventsArgs,
      MeshContext
    >;
    /** null **/
    movingAverageDurationChanged: InContextSdkMethod<
      Query["movingAverageDurationChanged"],
      QuerymovingAverageDurationChangedArgs,
      MeshContext
    >;
    /** null **/
    movingAverageDurationChangeds: InContextSdkMethod<
      Query["movingAverageDurationChangeds"],
      QuerymovingAverageDurationChangedsArgs,
      MeshContext
    >;
    /** null **/
    newObservation: InContextSdkMethod<Query["newObservation"], QuerynewObservationArgs, MeshContext>;
    /** null **/
    newObservations: InContextSdkMethod<Query["newObservations"], QuerynewObservationsArgs, MeshContext>;
    /** null **/
    observationFrequencyChanged: InContextSdkMethod<
      Query["observationFrequencyChanged"],
      QueryobservationFrequencyChangedArgs,
      MeshContext
    >;
    /** null **/
    observationFrequencyChangeds: InContextSdkMethod<
      Query["observationFrequencyChangeds"],
      QueryobservationFrequencyChangedsArgs,
      MeshContext
    >;
    /** null **/
    updateThresholdsChanged: InContextSdkMethod<
      Query["updateThresholdsChanged"],
      QueryupdateThresholdsChangedArgs,
      MeshContext
    >;
    /** null **/
    updateThresholdsChangeds: InContextSdkMethod<
      Query["updateThresholdsChangeds"],
      QueryupdateThresholdsChangedsArgs,
      MeshContext
    >;
    /** null **/
    minimumTargetPriceChanged: InContextSdkMethod<
      Query["minimumTargetPriceChanged"],
      QueryminimumTargetPriceChangedArgs,
      MeshContext
    >;
    /** null **/
    minimumTargetPriceChangeds: InContextSdkMethod<
      Query["minimumTargetPriceChangeds"],
      QueryminimumTargetPriceChangedsArgs,
      MeshContext
    >;
    /** null **/
    beat: InContextSdkMethod<Query["beat"], QuerybeatArgs, MeshContext>;
    /** null **/
    beats: InContextSdkMethod<Query["beats"], QuerybeatsArgs, MeshContext>;
    /** null **/
    beatRewardIssued: InContextSdkMethod<Query["beatRewardIssued"], QuerybeatRewardIssuedArgs, MeshContext>;
    /** null **/
    beatRewardIssueds: InContextSdkMethod<Query["beatRewardIssueds"], QuerybeatRewardIssuedsArgs, MeshContext>;
    /** null **/
    beatRewardUpdated: InContextSdkMethod<Query["beatRewardUpdated"], QuerybeatRewardUpdatedArgs, MeshContext>;
    /** null **/
    beatRewardUpdateds: InContextSdkMethod<Query["beatRewardUpdateds"], QuerybeatRewardUpdatedsArgs, MeshContext>;
    /** null **/
    operatorVersion: InContextSdkMethod<Query["operatorVersion"], QueryoperatorVersionArgs, MeshContext>;
    /** null **/
    operatorVersions: InContextSdkMethod<Query["operatorVersions"], QueryoperatorVersionsArgs, MeshContext>;
    /** Access to subgraph metadata **/
    _meta: InContextSdkMethod<Query["_meta"], Query_metaArgs, MeshContext>;
  };

  export type MutationSdk = {};

  export type SubscriptionSdk = {
    /** null **/
    rangeSnapshot: InContextSdkMethod<Subscription["rangeSnapshot"], SubscriptionrangeSnapshotArgs, MeshContext>;
    /** null **/
    rangeSnapshots: InContextSdkMethod<Subscription["rangeSnapshots"], SubscriptionrangeSnapshotsArgs, MeshContext>;
    /** null **/
    priceEvent: InContextSdkMethod<Subscription["priceEvent"], SubscriptionpriceEventArgs, MeshContext>;
    /** null **/
    priceEvents: InContextSdkMethod<Subscription["priceEvents"], SubscriptionpriceEventsArgs, MeshContext>;
    /** null **/
    pricesChangedEvent: InContextSdkMethod<
      Subscription["pricesChangedEvent"],
      SubscriptionpricesChangedEventArgs,
      MeshContext
    >;
    /** null **/
    pricesChangedEvents: InContextSdkMethod<
      Subscription["pricesChangedEvents"],
      SubscriptionpricesChangedEventsArgs,
      MeshContext
    >;
    /** null **/
    spreadsChangedEvent: InContextSdkMethod<
      Subscription["spreadsChangedEvent"],
      SubscriptionspreadsChangedEventArgs,
      MeshContext
    >;
    /** null **/
    spreadsChangedEvents: InContextSdkMethod<
      Subscription["spreadsChangedEvents"],
      SubscriptionspreadsChangedEventsArgs,
      MeshContext
    >;
    /** null **/
    thresholdFactorChangedEvent: InContextSdkMethod<
      Subscription["thresholdFactorChangedEvent"],
      SubscriptionthresholdFactorChangedEventArgs,
      MeshContext
    >;
    /** null **/
    thresholdFactorChangedEvents: InContextSdkMethod<
      Subscription["thresholdFactorChangedEvents"],
      SubscriptionthresholdFactorChangedEventsArgs,
      MeshContext
    >;
    /** null **/
    movingAverageDurationChanged: InContextSdkMethod<
      Subscription["movingAverageDurationChanged"],
      SubscriptionmovingAverageDurationChangedArgs,
      MeshContext
    >;
    /** null **/
    movingAverageDurationChangeds: InContextSdkMethod<
      Subscription["movingAverageDurationChangeds"],
      SubscriptionmovingAverageDurationChangedsArgs,
      MeshContext
    >;
    /** null **/
    newObservation: InContextSdkMethod<Subscription["newObservation"], SubscriptionnewObservationArgs, MeshContext>;
    /** null **/
    newObservations: InContextSdkMethod<Subscription["newObservations"], SubscriptionnewObservationsArgs, MeshContext>;
    /** null **/
    observationFrequencyChanged: InContextSdkMethod<
      Subscription["observationFrequencyChanged"],
      SubscriptionobservationFrequencyChangedArgs,
      MeshContext
    >;
    /** null **/
    observationFrequencyChangeds: InContextSdkMethod<
      Subscription["observationFrequencyChangeds"],
      SubscriptionobservationFrequencyChangedsArgs,
      MeshContext
    >;
    /** null **/
    updateThresholdsChanged: InContextSdkMethod<
      Subscription["updateThresholdsChanged"],
      SubscriptionupdateThresholdsChangedArgs,
      MeshContext
    >;
    /** null **/
    updateThresholdsChangeds: InContextSdkMethod<
      Subscription["updateThresholdsChangeds"],
      SubscriptionupdateThresholdsChangedsArgs,
      MeshContext
    >;
    /** null **/
    minimumTargetPriceChanged: InContextSdkMethod<
      Subscription["minimumTargetPriceChanged"],
      SubscriptionminimumTargetPriceChangedArgs,
      MeshContext
    >;
    /** null **/
    minimumTargetPriceChangeds: InContextSdkMethod<
      Subscription["minimumTargetPriceChangeds"],
      SubscriptionminimumTargetPriceChangedsArgs,
      MeshContext
    >;
    /** null **/
    beat: InContextSdkMethod<Subscription["beat"], SubscriptionbeatArgs, MeshContext>;
    /** null **/
    beats: InContextSdkMethod<Subscription["beats"], SubscriptionbeatsArgs, MeshContext>;
    /** null **/
    beatRewardIssued: InContextSdkMethod<
      Subscription["beatRewardIssued"],
      SubscriptionbeatRewardIssuedArgs,
      MeshContext
    >;
    /** null **/
    beatRewardIssueds: InContextSdkMethod<
      Subscription["beatRewardIssueds"],
      SubscriptionbeatRewardIssuedsArgs,
      MeshContext
    >;
    /** null **/
    beatRewardUpdated: InContextSdkMethod<
      Subscription["beatRewardUpdated"],
      SubscriptionbeatRewardUpdatedArgs,
      MeshContext
    >;
    /** null **/
    beatRewardUpdateds: InContextSdkMethod<
      Subscription["beatRewardUpdateds"],
      SubscriptionbeatRewardUpdatedsArgs,
      MeshContext
    >;
    /** null **/
    operatorVersion: InContextSdkMethod<Subscription["operatorVersion"], SubscriptionoperatorVersionArgs, MeshContext>;
    /** null **/
    operatorVersions: InContextSdkMethod<
      Subscription["operatorVersions"],
      SubscriptionoperatorVersionsArgs,
      MeshContext
    >;
    /** Access to subgraph metadata **/
    _meta: InContextSdkMethod<Subscription["_meta"], Subscription_metaArgs, MeshContext>;
  };

  export type Context = {
    ["rbs"]: { Query: QuerySdk; Mutation: MutationSdk; Subscription: SubscriptionSdk };
  };
}
