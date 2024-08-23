// @ts-nocheck
import { GraphQLResolveInfo, SelectionSetNode, FieldNode, GraphQLScalarType, GraphQLScalarTypeConfig } from "graphql";
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
import { gql } from "@graphql-mesh/utils";

import type { GetMeshOptions } from "@graphql-mesh/runtime";
import type { YamlConfig } from "@graphql-mesh/types";
import { PubSub } from "@graphql-mesh/utils";
import { DefaultLogger } from "@graphql-mesh/utils";
import MeshCache from "@graphql-mesh/cache-localforage";
import { fetch as fetchFn } from "@whatwg-node/fetch";

import { MeshResolvedSource } from "@graphql-mesh/runtime";
import { MeshTransform, MeshPlugin } from "@graphql-mesh/types";
import GraphqlHandler from "@graphql-mesh/graphql";
import AutoPaginationTransform from "@graphprotocol/client-auto-pagination";
import BareMerger from "@graphql-mesh/merger-bare";
import { printWithCache } from "@graphql-mesh/utils";
import { usePersistedOperations } from "@graphql-yoga/plugin-persisted-operations";
import { createMeshHTTPHandler, MeshHTTPHandler } from "@graphql-mesh/http";
import {
  getMesh,
  ExecuteMeshFn,
  SubscribeMeshFn,
  MeshContext as BaseMeshContext,
  MeshInstance,
} from "@graphql-mesh/runtime";
import { MeshStore, FsStoreStorageAdapter } from "@graphql-mesh/store";
import { path as pathModule } from "@graphql-mesh/cross-helpers";
import { ImportFn } from "@graphql-mesh/types";
import type { RbsTypes } from "./sources/rbs/types";
import * as importedModule$0 from "./sources/rbs/introspectionSchema";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };

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

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string | ((fieldNode: FieldNode) => SelectionSetNode);
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> =
  | LegacyStitchingResolver<TResult, TParent, TContext, TArgs>
  | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo,
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Aggregation_interval: Aggregation_interval;
  Beat: ResolverTypeWrapper<Beat>;
  BeatRewardIssued: ResolverTypeWrapper<BeatRewardIssued>;
  BeatRewardIssued_filter: BeatRewardIssued_filter;
  BeatRewardIssued_orderBy: BeatRewardIssued_orderBy;
  BeatRewardUpdated: ResolverTypeWrapper<BeatRewardUpdated>;
  BeatRewardUpdated_filter: BeatRewardUpdated_filter;
  BeatRewardUpdated_orderBy: BeatRewardUpdated_orderBy;
  Beat_filter: Beat_filter;
  Beat_orderBy: Beat_orderBy;
  BigDecimal: ResolverTypeWrapper<Scalars["BigDecimal"]["output"]>;
  BigInt: ResolverTypeWrapper<Scalars["BigInt"]["output"]>;
  BlockChangedFilter: BlockChangedFilter;
  Block_height: Block_height;
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]["output"]>;
  Bytes: ResolverTypeWrapper<Scalars["Bytes"]["output"]>;
  Float: ResolverTypeWrapper<Scalars["Float"]["output"]>;
  ID: ResolverTypeWrapper<Scalars["ID"]["output"]>;
  Int: ResolverTypeWrapper<Scalars["Int"]["output"]>;
  Int8: ResolverTypeWrapper<Scalars["Int8"]["output"]>;
  MinimumTargetPriceChanged: ResolverTypeWrapper<MinimumTargetPriceChanged>;
  MinimumTargetPriceChanged_filter: MinimumTargetPriceChanged_filter;
  MinimumTargetPriceChanged_orderBy: MinimumTargetPriceChanged_orderBy;
  MovingAverageDurationChanged: ResolverTypeWrapper<MovingAverageDurationChanged>;
  MovingAverageDurationChanged_filter: MovingAverageDurationChanged_filter;
  MovingAverageDurationChanged_orderBy: MovingAverageDurationChanged_orderBy;
  NewObservation: ResolverTypeWrapper<NewObservation>;
  NewObservation_filter: NewObservation_filter;
  NewObservation_orderBy: NewObservation_orderBy;
  ObservationFrequencyChanged: ResolverTypeWrapper<ObservationFrequencyChanged>;
  ObservationFrequencyChanged_filter: ObservationFrequencyChanged_filter;
  ObservationFrequencyChanged_orderBy: ObservationFrequencyChanged_orderBy;
  OperatorVersion: ResolverTypeWrapper<OperatorVersion>;
  OperatorVersion_filter: OperatorVersion_filter;
  OperatorVersion_orderBy: OperatorVersion_orderBy;
  OrderDirection: OrderDirection;
  PriceEvent: ResolverTypeWrapper<PriceEvent>;
  PriceEventType: PriceEventType;
  PriceEvent_filter: PriceEvent_filter;
  PriceEvent_orderBy: PriceEvent_orderBy;
  PricesChangedEvent: ResolverTypeWrapper<PricesChangedEvent>;
  PricesChangedEvent_filter: PricesChangedEvent_filter;
  PricesChangedEvent_orderBy: PricesChangedEvent_orderBy;
  Query: ResolverTypeWrapper<{}>;
  RangeSnapshot: ResolverTypeWrapper<RangeSnapshot>;
  RangeSnapshot_filter: RangeSnapshot_filter;
  RangeSnapshot_orderBy: RangeSnapshot_orderBy;
  SpreadsChangedEvent: ResolverTypeWrapper<SpreadsChangedEvent>;
  SpreadsChangedEvent_filter: SpreadsChangedEvent_filter;
  SpreadsChangedEvent_orderBy: SpreadsChangedEvent_orderBy;
  String: ResolverTypeWrapper<Scalars["String"]["output"]>;
  Subscription: ResolverTypeWrapper<{}>;
  ThresholdFactorChangedEvent: ResolverTypeWrapper<ThresholdFactorChangedEvent>;
  ThresholdFactorChangedEvent_filter: ThresholdFactorChangedEvent_filter;
  ThresholdFactorChangedEvent_orderBy: ThresholdFactorChangedEvent_orderBy;
  Timestamp: ResolverTypeWrapper<Scalars["Timestamp"]["output"]>;
  UpdateThresholdsChanged: ResolverTypeWrapper<UpdateThresholdsChanged>;
  UpdateThresholdsChanged_filter: UpdateThresholdsChanged_filter;
  UpdateThresholdsChanged_orderBy: UpdateThresholdsChanged_orderBy;
  _Block_: ResolverTypeWrapper<_Block_>;
  _Meta_: ResolverTypeWrapper<_Meta_>;
  _SubgraphErrorPolicy_: _SubgraphErrorPolicy_;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Beat: Beat;
  BeatRewardIssued: BeatRewardIssued;
  BeatRewardIssued_filter: BeatRewardIssued_filter;
  BeatRewardUpdated: BeatRewardUpdated;
  BeatRewardUpdated_filter: BeatRewardUpdated_filter;
  Beat_filter: Beat_filter;
  BigDecimal: Scalars["BigDecimal"]["output"];
  BigInt: Scalars["BigInt"]["output"];
  BlockChangedFilter: BlockChangedFilter;
  Block_height: Block_height;
  Boolean: Scalars["Boolean"]["output"];
  Bytes: Scalars["Bytes"]["output"];
  Float: Scalars["Float"]["output"];
  ID: Scalars["ID"]["output"];
  Int: Scalars["Int"]["output"];
  Int8: Scalars["Int8"]["output"];
  MinimumTargetPriceChanged: MinimumTargetPriceChanged;
  MinimumTargetPriceChanged_filter: MinimumTargetPriceChanged_filter;
  MovingAverageDurationChanged: MovingAverageDurationChanged;
  MovingAverageDurationChanged_filter: MovingAverageDurationChanged_filter;
  NewObservation: NewObservation;
  NewObservation_filter: NewObservation_filter;
  ObservationFrequencyChanged: ObservationFrequencyChanged;
  ObservationFrequencyChanged_filter: ObservationFrequencyChanged_filter;
  OperatorVersion: OperatorVersion;
  OperatorVersion_filter: OperatorVersion_filter;
  PriceEvent: PriceEvent;
  PriceEvent_filter: PriceEvent_filter;
  PricesChangedEvent: PricesChangedEvent;
  PricesChangedEvent_filter: PricesChangedEvent_filter;
  Query: {};
  RangeSnapshot: RangeSnapshot;
  RangeSnapshot_filter: RangeSnapshot_filter;
  SpreadsChangedEvent: SpreadsChangedEvent;
  SpreadsChangedEvent_filter: SpreadsChangedEvent_filter;
  String: Scalars["String"]["output"];
  Subscription: {};
  ThresholdFactorChangedEvent: ThresholdFactorChangedEvent;
  ThresholdFactorChangedEvent_filter: ThresholdFactorChangedEvent_filter;
  Timestamp: Scalars["Timestamp"]["output"];
  UpdateThresholdsChanged: UpdateThresholdsChanged;
  UpdateThresholdsChanged_filter: UpdateThresholdsChanged_filter;
  _Block_: _Block_;
  _Meta_: _Meta_;
}>;

export type entityDirectiveArgs = {};

export type entityDirectiveResolver<
  Result,
  Parent,
  ContextType = MeshContext,
  Args = entityDirectiveArgs,
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type subgraphIdDirectiveArgs = {
  id: Scalars["String"]["input"];
};

export type subgraphIdDirectiveResolver<
  Result,
  Parent,
  ContextType = MeshContext,
  Args = subgraphIdDirectiveArgs,
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type derivedFromDirectiveArgs = {
  field: Scalars["String"]["input"];
};

export type derivedFromDirectiveResolver<
  Result,
  Parent,
  ContextType = MeshContext,
  Args = derivedFromDirectiveArgs,
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type BeatResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes["Beat"] = ResolversParentTypes["Beat"],
> = ResolversObject<{
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  blockchain?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  block?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  transaction?: Resolver<ResolversTypes["Bytes"], ParentType, ContextType>;
  date?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BeatRewardIssuedResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes["BeatRewardIssued"] = ResolversParentTypes["BeatRewardIssued"],
> = ResolversObject<{
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  blockchain?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  block?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  transaction?: Resolver<ResolversTypes["Bytes"], ParentType, ContextType>;
  date?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  to?: Resolver<ResolversTypes["Bytes"], ParentType, ContextType>;
  rewardToken?: Resolver<ResolversTypes["Bytes"], ParentType, ContextType>;
  rewardAmount?: Resolver<ResolversTypes["BigDecimal"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BeatRewardUpdatedResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes["BeatRewardUpdated"] = ResolversParentTypes["BeatRewardUpdated"],
> = ResolversObject<{
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  blockchain?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  block?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  transaction?: Resolver<ResolversTypes["Bytes"], ParentType, ContextType>;
  date?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  token?: Resolver<ResolversTypes["Bytes"], ParentType, ContextType>;
  rewardToken?: Resolver<ResolversTypes["Bytes"], ParentType, ContextType>;
  rewardAmount?: Resolver<ResolversTypes["BigDecimal"], ParentType, ContextType>;
  auctionDuration?: Resolver<Maybe<ResolversTypes["BigInt"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface BigDecimalScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["BigDecimal"], any> {
  name: "BigDecimal";
}

export interface BigIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["BigInt"], any> {
  name: "BigInt";
}

export interface BytesScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["Bytes"], any> {
  name: "Bytes";
}

export interface Int8ScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["Int8"], any> {
  name: "Int8";
}

export type MinimumTargetPriceChangedResolvers<
  ContextType = MeshContext,
  ParentType extends
    ResolversParentTypes["MinimumTargetPriceChanged"] = ResolversParentTypes["MinimumTargetPriceChanged"],
> = ResolversObject<{
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  blockchain?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  block?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  transaction?: Resolver<ResolversTypes["Bytes"], ParentType, ContextType>;
  date?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  minimumTargetPrice?: Resolver<ResolversTypes["BigDecimal"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MovingAverageDurationChangedResolvers<
  ContextType = MeshContext,
  ParentType extends
    ResolversParentTypes["MovingAverageDurationChanged"] = ResolversParentTypes["MovingAverageDurationChanged"],
> = ResolversObject<{
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  blockchain?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  block?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  transaction?: Resolver<ResolversTypes["Bytes"], ParentType, ContextType>;
  date?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  movingAverageDuration?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type NewObservationResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes["NewObservation"] = ResolversParentTypes["NewObservation"],
> = ResolversObject<{
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  blockchain?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  block?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  transaction?: Resolver<ResolversTypes["Bytes"], ParentType, ContextType>;
  date?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  snapshot?: Resolver<ResolversTypes["RangeSnapshot"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ObservationFrequencyChangedResolvers<
  ContextType = MeshContext,
  ParentType extends
    ResolversParentTypes["ObservationFrequencyChanged"] = ResolversParentTypes["ObservationFrequencyChanged"],
> = ResolversObject<{
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  blockchain?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  block?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  transaction?: Resolver<ResolversTypes["Bytes"], ParentType, ContextType>;
  date?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  observationFrequencySeconds?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type OperatorVersionResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes["OperatorVersion"] = ResolversParentTypes["OperatorVersion"],
> = ResolversObject<{
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  version?: Resolver<ResolversTypes["BigDecimal"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PriceEventResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes["PriceEvent"] = ResolversParentTypes["PriceEvent"],
> = ResolversObject<{
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  blockchain?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  block?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  transaction?: Resolver<ResolversTypes["Bytes"], ParentType, ContextType>;
  date?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  type?: Resolver<ResolversTypes["PriceEventType"], ParentType, ContextType>;
  isHigh?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  snapshot?: Resolver<ResolversTypes["RangeSnapshot"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PricesChangedEventResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes["PricesChangedEvent"] = ResolversParentTypes["PricesChangedEvent"],
> = ResolversObject<{
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  blockchain?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  block?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  transaction?: Resolver<ResolversTypes["Bytes"], ParentType, ContextType>;
  date?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  snapshot?: Resolver<ResolversTypes["RangeSnapshot"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes["Query"] = ResolversParentTypes["Query"],
> = ResolversObject<{
  rangeSnapshot?: Resolver<
    Maybe<ResolversTypes["RangeSnapshot"]>,
    ParentType,
    ContextType,
    RequireFields<QueryrangeSnapshotArgs, "id" | "subgraphError">
  >;
  rangeSnapshots?: Resolver<
    Array<ResolversTypes["RangeSnapshot"]>,
    ParentType,
    ContextType,
    RequireFields<QueryrangeSnapshotsArgs, "skip" | "first" | "subgraphError">
  >;
  priceEvent?: Resolver<
    Maybe<ResolversTypes["PriceEvent"]>,
    ParentType,
    ContextType,
    RequireFields<QuerypriceEventArgs, "id" | "subgraphError">
  >;
  priceEvents?: Resolver<
    Array<ResolversTypes["PriceEvent"]>,
    ParentType,
    ContextType,
    RequireFields<QuerypriceEventsArgs, "skip" | "first" | "subgraphError">
  >;
  pricesChangedEvent?: Resolver<
    Maybe<ResolversTypes["PricesChangedEvent"]>,
    ParentType,
    ContextType,
    RequireFields<QuerypricesChangedEventArgs, "id" | "subgraphError">
  >;
  pricesChangedEvents?: Resolver<
    Array<ResolversTypes["PricesChangedEvent"]>,
    ParentType,
    ContextType,
    RequireFields<QuerypricesChangedEventsArgs, "skip" | "first" | "subgraphError">
  >;
  spreadsChangedEvent?: Resolver<
    Maybe<ResolversTypes["SpreadsChangedEvent"]>,
    ParentType,
    ContextType,
    RequireFields<QueryspreadsChangedEventArgs, "id" | "subgraphError">
  >;
  spreadsChangedEvents?: Resolver<
    Array<ResolversTypes["SpreadsChangedEvent"]>,
    ParentType,
    ContextType,
    RequireFields<QueryspreadsChangedEventsArgs, "skip" | "first" | "subgraphError">
  >;
  thresholdFactorChangedEvent?: Resolver<
    Maybe<ResolversTypes["ThresholdFactorChangedEvent"]>,
    ParentType,
    ContextType,
    RequireFields<QuerythresholdFactorChangedEventArgs, "id" | "subgraphError">
  >;
  thresholdFactorChangedEvents?: Resolver<
    Array<ResolversTypes["ThresholdFactorChangedEvent"]>,
    ParentType,
    ContextType,
    RequireFields<QuerythresholdFactorChangedEventsArgs, "skip" | "first" | "subgraphError">
  >;
  movingAverageDurationChanged?: Resolver<
    Maybe<ResolversTypes["MovingAverageDurationChanged"]>,
    ParentType,
    ContextType,
    RequireFields<QuerymovingAverageDurationChangedArgs, "id" | "subgraphError">
  >;
  movingAverageDurationChangeds?: Resolver<
    Array<ResolversTypes["MovingAverageDurationChanged"]>,
    ParentType,
    ContextType,
    RequireFields<QuerymovingAverageDurationChangedsArgs, "skip" | "first" | "subgraphError">
  >;
  newObservation?: Resolver<
    Maybe<ResolversTypes["NewObservation"]>,
    ParentType,
    ContextType,
    RequireFields<QuerynewObservationArgs, "id" | "subgraphError">
  >;
  newObservations?: Resolver<
    Array<ResolversTypes["NewObservation"]>,
    ParentType,
    ContextType,
    RequireFields<QuerynewObservationsArgs, "skip" | "first" | "subgraphError">
  >;
  observationFrequencyChanged?: Resolver<
    Maybe<ResolversTypes["ObservationFrequencyChanged"]>,
    ParentType,
    ContextType,
    RequireFields<QueryobservationFrequencyChangedArgs, "id" | "subgraphError">
  >;
  observationFrequencyChangeds?: Resolver<
    Array<ResolversTypes["ObservationFrequencyChanged"]>,
    ParentType,
    ContextType,
    RequireFields<QueryobservationFrequencyChangedsArgs, "skip" | "first" | "subgraphError">
  >;
  updateThresholdsChanged?: Resolver<
    Maybe<ResolversTypes["UpdateThresholdsChanged"]>,
    ParentType,
    ContextType,
    RequireFields<QueryupdateThresholdsChangedArgs, "id" | "subgraphError">
  >;
  updateThresholdsChangeds?: Resolver<
    Array<ResolversTypes["UpdateThresholdsChanged"]>,
    ParentType,
    ContextType,
    RequireFields<QueryupdateThresholdsChangedsArgs, "skip" | "first" | "subgraphError">
  >;
  minimumTargetPriceChanged?: Resolver<
    Maybe<ResolversTypes["MinimumTargetPriceChanged"]>,
    ParentType,
    ContextType,
    RequireFields<QueryminimumTargetPriceChangedArgs, "id" | "subgraphError">
  >;
  minimumTargetPriceChangeds?: Resolver<
    Array<ResolversTypes["MinimumTargetPriceChanged"]>,
    ParentType,
    ContextType,
    RequireFields<QueryminimumTargetPriceChangedsArgs, "skip" | "first" | "subgraphError">
  >;
  beat?: Resolver<
    Maybe<ResolversTypes["Beat"]>,
    ParentType,
    ContextType,
    RequireFields<QuerybeatArgs, "id" | "subgraphError">
  >;
  beats?: Resolver<
    Array<ResolversTypes["Beat"]>,
    ParentType,
    ContextType,
    RequireFields<QuerybeatsArgs, "skip" | "first" | "subgraphError">
  >;
  beatRewardIssued?: Resolver<
    Maybe<ResolversTypes["BeatRewardIssued"]>,
    ParentType,
    ContextType,
    RequireFields<QuerybeatRewardIssuedArgs, "id" | "subgraphError">
  >;
  beatRewardIssueds?: Resolver<
    Array<ResolversTypes["BeatRewardIssued"]>,
    ParentType,
    ContextType,
    RequireFields<QuerybeatRewardIssuedsArgs, "skip" | "first" | "subgraphError">
  >;
  beatRewardUpdated?: Resolver<
    Maybe<ResolversTypes["BeatRewardUpdated"]>,
    ParentType,
    ContextType,
    RequireFields<QuerybeatRewardUpdatedArgs, "id" | "subgraphError">
  >;
  beatRewardUpdateds?: Resolver<
    Array<ResolversTypes["BeatRewardUpdated"]>,
    ParentType,
    ContextType,
    RequireFields<QuerybeatRewardUpdatedsArgs, "skip" | "first" | "subgraphError">
  >;
  operatorVersion?: Resolver<
    Maybe<ResolversTypes["OperatorVersion"]>,
    ParentType,
    ContextType,
    RequireFields<QueryoperatorVersionArgs, "id" | "subgraphError">
  >;
  operatorVersions?: Resolver<
    Array<ResolversTypes["OperatorVersion"]>,
    ParentType,
    ContextType,
    RequireFields<QueryoperatorVersionsArgs, "skip" | "first" | "subgraphError">
  >;
  _meta?: Resolver<Maybe<ResolversTypes["_Meta_"]>, ParentType, ContextType, Partial<Query_metaArgs>>;
}>;

export type RangeSnapshotResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes["RangeSnapshot"] = ResolversParentTypes["RangeSnapshot"],
> = ResolversObject<{
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  blockchain?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  block?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  date?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  ohmPrice?: Resolver<Maybe<ResolversTypes["BigDecimal"]>, ParentType, ContextType>;
  ohmMovingAveragePrice?: Resolver<Maybe<ResolversTypes["BigDecimal"]>, ParentType, ContextType>;
  thresholdFactor?: Resolver<ResolversTypes["BigDecimal"], ParentType, ContextType>;
  cushionSpread?: Resolver<ResolversTypes["BigDecimal"], ParentType, ContextType>;
  wallSpread?: Resolver<ResolversTypes["BigDecimal"], ParentType, ContextType>;
  highCushionSpread?: Resolver<Maybe<ResolversTypes["BigDecimal"]>, ParentType, ContextType>;
  highWallSpread?: Resolver<Maybe<ResolversTypes["BigDecimal"]>, ParentType, ContextType>;
  lowCushionSpread?: Resolver<Maybe<ResolversTypes["BigDecimal"]>, ParentType, ContextType>;
  lowWallSpread?: Resolver<Maybe<ResolversTypes["BigDecimal"]>, ParentType, ContextType>;
  highActive?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  lowActive?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  highLastActiveTimestamp?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  lowLastActiveTimestamp?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  highCapacityOhm?: Resolver<ResolversTypes["BigDecimal"], ParentType, ContextType>;
  lowCapacityReserve?: Resolver<ResolversTypes["BigDecimal"], ParentType, ContextType>;
  highCushionPrice?: Resolver<ResolversTypes["BigDecimal"], ParentType, ContextType>;
  lowCushionPrice?: Resolver<ResolversTypes["BigDecimal"], ParentType, ContextType>;
  highMarketId?: Resolver<Maybe<ResolversTypes["BigInt"]>, ParentType, ContextType>;
  lowMarketId?: Resolver<Maybe<ResolversTypes["BigInt"]>, ParentType, ContextType>;
  highWallPrice?: Resolver<ResolversTypes["BigDecimal"], ParentType, ContextType>;
  lowWallPrice?: Resolver<ResolversTypes["BigDecimal"], ParentType, ContextType>;
  treasuryReserveAddress?: Resolver<Maybe<ResolversTypes["Bytes"]>, ParentType, ContextType>;
  treasuryReserveBalance?: Resolver<Maybe<ResolversTypes["BigDecimal"]>, ParentType, ContextType>;
  treasuryDebtBalance?: Resolver<Maybe<ResolversTypes["BigDecimal"]>, ParentType, ContextType>;
  operatorReserveFactor?: Resolver<Maybe<ResolversTypes["BigDecimal"]>, ParentType, ContextType>;
  operatorCushionFactor?: Resolver<Maybe<ResolversTypes["BigDecimal"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SpreadsChangedEventResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes["SpreadsChangedEvent"] = ResolversParentTypes["SpreadsChangedEvent"],
> = ResolversObject<{
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  blockchain?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  block?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  transaction?: Resolver<ResolversTypes["Bytes"], ParentType, ContextType>;
  date?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  high?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  cushionSpread?: Resolver<ResolversTypes["BigDecimal"], ParentType, ContextType>;
  wallSpread?: Resolver<ResolversTypes["BigDecimal"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SubscriptionResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes["Subscription"] = ResolversParentTypes["Subscription"],
> = ResolversObject<{
  rangeSnapshot?: SubscriptionResolver<
    Maybe<ResolversTypes["RangeSnapshot"]>,
    "rangeSnapshot",
    ParentType,
    ContextType,
    RequireFields<SubscriptionrangeSnapshotArgs, "id" | "subgraphError">
  >;
  rangeSnapshots?: SubscriptionResolver<
    Array<ResolversTypes["RangeSnapshot"]>,
    "rangeSnapshots",
    ParentType,
    ContextType,
    RequireFields<SubscriptionrangeSnapshotsArgs, "skip" | "first" | "subgraphError">
  >;
  priceEvent?: SubscriptionResolver<
    Maybe<ResolversTypes["PriceEvent"]>,
    "priceEvent",
    ParentType,
    ContextType,
    RequireFields<SubscriptionpriceEventArgs, "id" | "subgraphError">
  >;
  priceEvents?: SubscriptionResolver<
    Array<ResolversTypes["PriceEvent"]>,
    "priceEvents",
    ParentType,
    ContextType,
    RequireFields<SubscriptionpriceEventsArgs, "skip" | "first" | "subgraphError">
  >;
  pricesChangedEvent?: SubscriptionResolver<
    Maybe<ResolversTypes["PricesChangedEvent"]>,
    "pricesChangedEvent",
    ParentType,
    ContextType,
    RequireFields<SubscriptionpricesChangedEventArgs, "id" | "subgraphError">
  >;
  pricesChangedEvents?: SubscriptionResolver<
    Array<ResolversTypes["PricesChangedEvent"]>,
    "pricesChangedEvents",
    ParentType,
    ContextType,
    RequireFields<SubscriptionpricesChangedEventsArgs, "skip" | "first" | "subgraphError">
  >;
  spreadsChangedEvent?: SubscriptionResolver<
    Maybe<ResolversTypes["SpreadsChangedEvent"]>,
    "spreadsChangedEvent",
    ParentType,
    ContextType,
    RequireFields<SubscriptionspreadsChangedEventArgs, "id" | "subgraphError">
  >;
  spreadsChangedEvents?: SubscriptionResolver<
    Array<ResolversTypes["SpreadsChangedEvent"]>,
    "spreadsChangedEvents",
    ParentType,
    ContextType,
    RequireFields<SubscriptionspreadsChangedEventsArgs, "skip" | "first" | "subgraphError">
  >;
  thresholdFactorChangedEvent?: SubscriptionResolver<
    Maybe<ResolversTypes["ThresholdFactorChangedEvent"]>,
    "thresholdFactorChangedEvent",
    ParentType,
    ContextType,
    RequireFields<SubscriptionthresholdFactorChangedEventArgs, "id" | "subgraphError">
  >;
  thresholdFactorChangedEvents?: SubscriptionResolver<
    Array<ResolversTypes["ThresholdFactorChangedEvent"]>,
    "thresholdFactorChangedEvents",
    ParentType,
    ContextType,
    RequireFields<SubscriptionthresholdFactorChangedEventsArgs, "skip" | "first" | "subgraphError">
  >;
  movingAverageDurationChanged?: SubscriptionResolver<
    Maybe<ResolversTypes["MovingAverageDurationChanged"]>,
    "movingAverageDurationChanged",
    ParentType,
    ContextType,
    RequireFields<SubscriptionmovingAverageDurationChangedArgs, "id" | "subgraphError">
  >;
  movingAverageDurationChangeds?: SubscriptionResolver<
    Array<ResolversTypes["MovingAverageDurationChanged"]>,
    "movingAverageDurationChangeds",
    ParentType,
    ContextType,
    RequireFields<SubscriptionmovingAverageDurationChangedsArgs, "skip" | "first" | "subgraphError">
  >;
  newObservation?: SubscriptionResolver<
    Maybe<ResolversTypes["NewObservation"]>,
    "newObservation",
    ParentType,
    ContextType,
    RequireFields<SubscriptionnewObservationArgs, "id" | "subgraphError">
  >;
  newObservations?: SubscriptionResolver<
    Array<ResolversTypes["NewObservation"]>,
    "newObservations",
    ParentType,
    ContextType,
    RequireFields<SubscriptionnewObservationsArgs, "skip" | "first" | "subgraphError">
  >;
  observationFrequencyChanged?: SubscriptionResolver<
    Maybe<ResolversTypes["ObservationFrequencyChanged"]>,
    "observationFrequencyChanged",
    ParentType,
    ContextType,
    RequireFields<SubscriptionobservationFrequencyChangedArgs, "id" | "subgraphError">
  >;
  observationFrequencyChangeds?: SubscriptionResolver<
    Array<ResolversTypes["ObservationFrequencyChanged"]>,
    "observationFrequencyChangeds",
    ParentType,
    ContextType,
    RequireFields<SubscriptionobservationFrequencyChangedsArgs, "skip" | "first" | "subgraphError">
  >;
  updateThresholdsChanged?: SubscriptionResolver<
    Maybe<ResolversTypes["UpdateThresholdsChanged"]>,
    "updateThresholdsChanged",
    ParentType,
    ContextType,
    RequireFields<SubscriptionupdateThresholdsChangedArgs, "id" | "subgraphError">
  >;
  updateThresholdsChangeds?: SubscriptionResolver<
    Array<ResolversTypes["UpdateThresholdsChanged"]>,
    "updateThresholdsChangeds",
    ParentType,
    ContextType,
    RequireFields<SubscriptionupdateThresholdsChangedsArgs, "skip" | "first" | "subgraphError">
  >;
  minimumTargetPriceChanged?: SubscriptionResolver<
    Maybe<ResolversTypes["MinimumTargetPriceChanged"]>,
    "minimumTargetPriceChanged",
    ParentType,
    ContextType,
    RequireFields<SubscriptionminimumTargetPriceChangedArgs, "id" | "subgraphError">
  >;
  minimumTargetPriceChangeds?: SubscriptionResolver<
    Array<ResolversTypes["MinimumTargetPriceChanged"]>,
    "minimumTargetPriceChangeds",
    ParentType,
    ContextType,
    RequireFields<SubscriptionminimumTargetPriceChangedsArgs, "skip" | "first" | "subgraphError">
  >;
  beat?: SubscriptionResolver<
    Maybe<ResolversTypes["Beat"]>,
    "beat",
    ParentType,
    ContextType,
    RequireFields<SubscriptionbeatArgs, "id" | "subgraphError">
  >;
  beats?: SubscriptionResolver<
    Array<ResolversTypes["Beat"]>,
    "beats",
    ParentType,
    ContextType,
    RequireFields<SubscriptionbeatsArgs, "skip" | "first" | "subgraphError">
  >;
  beatRewardIssued?: SubscriptionResolver<
    Maybe<ResolversTypes["BeatRewardIssued"]>,
    "beatRewardIssued",
    ParentType,
    ContextType,
    RequireFields<SubscriptionbeatRewardIssuedArgs, "id" | "subgraphError">
  >;
  beatRewardIssueds?: SubscriptionResolver<
    Array<ResolversTypes["BeatRewardIssued"]>,
    "beatRewardIssueds",
    ParentType,
    ContextType,
    RequireFields<SubscriptionbeatRewardIssuedsArgs, "skip" | "first" | "subgraphError">
  >;
  beatRewardUpdated?: SubscriptionResolver<
    Maybe<ResolversTypes["BeatRewardUpdated"]>,
    "beatRewardUpdated",
    ParentType,
    ContextType,
    RequireFields<SubscriptionbeatRewardUpdatedArgs, "id" | "subgraphError">
  >;
  beatRewardUpdateds?: SubscriptionResolver<
    Array<ResolversTypes["BeatRewardUpdated"]>,
    "beatRewardUpdateds",
    ParentType,
    ContextType,
    RequireFields<SubscriptionbeatRewardUpdatedsArgs, "skip" | "first" | "subgraphError">
  >;
  operatorVersion?: SubscriptionResolver<
    Maybe<ResolversTypes["OperatorVersion"]>,
    "operatorVersion",
    ParentType,
    ContextType,
    RequireFields<SubscriptionoperatorVersionArgs, "id" | "subgraphError">
  >;
  operatorVersions?: SubscriptionResolver<
    Array<ResolversTypes["OperatorVersion"]>,
    "operatorVersions",
    ParentType,
    ContextType,
    RequireFields<SubscriptionoperatorVersionsArgs, "skip" | "first" | "subgraphError">
  >;
  _meta?: SubscriptionResolver<
    Maybe<ResolversTypes["_Meta_"]>,
    "_meta",
    ParentType,
    ContextType,
    Partial<Subscription_metaArgs>
  >;
}>;

export type ThresholdFactorChangedEventResolvers<
  ContextType = MeshContext,
  ParentType extends
    ResolversParentTypes["ThresholdFactorChangedEvent"] = ResolversParentTypes["ThresholdFactorChangedEvent"],
> = ResolversObject<{
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  blockchain?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  block?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  transaction?: Resolver<ResolversTypes["Bytes"], ParentType, ContextType>;
  date?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  thresholdFactor?: Resolver<ResolversTypes["BigDecimal"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface TimestampScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["Timestamp"], any> {
  name: "Timestamp";
}

export type UpdateThresholdsChangedResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes["UpdateThresholdsChanged"] = ResolversParentTypes["UpdateThresholdsChanged"],
> = ResolversObject<{
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  blockchain?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  block?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  transaction?: Resolver<ResolversTypes["Bytes"], ParentType, ContextType>;
  date?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  ohmEthUpdateThresholdSeconds?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  reserveEthUpdateThresholdSeconds?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type _Block_Resolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes["_Block_"] = ResolversParentTypes["_Block_"],
> = ResolversObject<{
  hash?: Resolver<Maybe<ResolversTypes["Bytes"]>, ParentType, ContextType>;
  number?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  timestamp?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  parentHash?: Resolver<Maybe<ResolversTypes["Bytes"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type _Meta_Resolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes["_Meta_"] = ResolversParentTypes["_Meta_"],
> = ResolversObject<{
  block?: Resolver<ResolversTypes["_Block_"], ParentType, ContextType>;
  deployment?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  hasIndexingErrors?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = MeshContext> = ResolversObject<{
  Beat?: BeatResolvers<ContextType>;
  BeatRewardIssued?: BeatRewardIssuedResolvers<ContextType>;
  BeatRewardUpdated?: BeatRewardUpdatedResolvers<ContextType>;
  BigDecimal?: GraphQLScalarType;
  BigInt?: GraphQLScalarType;
  Bytes?: GraphQLScalarType;
  Int8?: GraphQLScalarType;
  MinimumTargetPriceChanged?: MinimumTargetPriceChangedResolvers<ContextType>;
  MovingAverageDurationChanged?: MovingAverageDurationChangedResolvers<ContextType>;
  NewObservation?: NewObservationResolvers<ContextType>;
  ObservationFrequencyChanged?: ObservationFrequencyChangedResolvers<ContextType>;
  OperatorVersion?: OperatorVersionResolvers<ContextType>;
  PriceEvent?: PriceEventResolvers<ContextType>;
  PricesChangedEvent?: PricesChangedEventResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RangeSnapshot?: RangeSnapshotResolvers<ContextType>;
  SpreadsChangedEvent?: SpreadsChangedEventResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  ThresholdFactorChangedEvent?: ThresholdFactorChangedEventResolvers<ContextType>;
  Timestamp?: GraphQLScalarType;
  UpdateThresholdsChanged?: UpdateThresholdsChangedResolvers<ContextType>;
  _Block_?: _Block_Resolvers<ContextType>;
  _Meta_?: _Meta_Resolvers<ContextType>;
}>;

export type DirectiveResolvers<ContextType = MeshContext> = ResolversObject<{
  entity?: entityDirectiveResolver<any, any, ContextType>;
  subgraphId?: subgraphIdDirectiveResolver<any, any, ContextType>;
  derivedFrom?: derivedFromDirectiveResolver<any, any, ContextType>;
}>;

export type MeshContext = RbsTypes.Context & BaseMeshContext;

import { fileURLToPath } from "@graphql-mesh/utils";
const baseDir = pathModule.join(pathModule.dirname(fileURLToPath(import.meta.url)), "..");

const importFn: ImportFn = <T>(moduleId: string) => {
  const relativeModuleId = (pathModule.isAbsolute(moduleId) ? pathModule.relative(baseDir, moduleId) : moduleId)
    .split("\\")
    .join("/")
    .replace(baseDir + "/", "");
  switch (relativeModuleId) {
    case ".graphclient/sources/rbs/introspectionSchema":
      return Promise.resolve(importedModule$0) as T;

    default:
      return Promise.reject(new Error(`Cannot find module '${relativeModuleId}'.`));
  }
};

const rootStore = new MeshStore(
  ".graphclient",
  new FsStoreStorageAdapter({
    cwd: baseDir,
    importFn,
    fileType: "ts",
  }),
  {
    readonly: true,
    validate: false,
  },
);

export const rawServeConfig: YamlConfig.Config["serve"] = undefined as any;
export async function getMeshOptions(): Promise<GetMeshOptions> {
  const pubsub = new PubSub();
  const sourcesStore = rootStore.child("sources");
  const logger = new DefaultLogger("GraphClient");
  const cache = new (MeshCache as any)({
    ...({} as any),
    importFn,
    store: rootStore.child("cache"),
    pubsub,
    logger,
  } as any);

  const sources: MeshResolvedSource[] = [];
  const transforms: MeshTransform[] = [];
  const additionalEnvelopPlugins: MeshPlugin<any>[] = [];
  const rbsTransforms = [];
  const additionalTypeDefs = [] as any[];
  const rbsHandler = new GraphqlHandler({
    name: "rbs",
    config: { endpoint: "https://api.studio.thegraph.com/query/46563/olympus-rbs/1.5.3" },
    baseDir,
    cache,
    pubsub,
    store: sourcesStore.child("rbs"),
    logger: logger.child("rbs"),
    importFn,
  });
  rbsTransforms[0] = new AutoPaginationTransform({
    apiName: "rbs",
    config: { validateSchema: true },
    baseDir,
    cache,
    pubsub,
    importFn,
    logger,
  });
  sources[0] = {
    name: "rbs",
    handler: rbsHandler,
    transforms: rbsTransforms,
  };
  const additionalResolvers = [] as any[];
  const merger = new (BareMerger as any)({
    cache,
    pubsub,
    logger: logger.child("bareMerger"),
    store: rootStore.child("bareMerger"),
  });
  const documentHashMap = {
    "2d4e39851c171ceacd519d068adbe508c454205b51aed97f0b7029844b22c410": RbsPriceEventsDocument,
  };
  additionalEnvelopPlugins.push(
    usePersistedOperations({
      getPersistedOperation(key) {
        return documentHashMap[key];
      },
      ...{},
    }),
  );

  return {
    sources,
    transforms,
    additionalTypeDefs,
    additionalResolvers,
    cache,
    pubsub,
    merger,
    logger,
    additionalEnvelopPlugins,
    get documents() {
      return [
        {
          document: RbsPriceEventsDocument,
          get rawSDL() {
            return printWithCache(RbsPriceEventsDocument);
          },
          location: "RbsPriceEventsDocument.graphql",
          sha256Hash: "2d4e39851c171ceacd519d068adbe508c454205b51aed97f0b7029844b22c410",
        },
      ];
    },
    fetchFn,
  };
}

export function createBuiltMeshHTTPHandler<TServerContext = {}>(): MeshHTTPHandler<TServerContext> {
  return createMeshHTTPHandler<TServerContext>({
    baseDir,
    getBuiltMesh: getBuiltGraphClient,
    rawServeConfig: undefined,
  });
}

let meshInstance$: Promise<MeshInstance> | undefined;

export const pollingInterval = null;

export function getBuiltGraphClient(): Promise<MeshInstance> {
  if (meshInstance$ == null) {
    if (pollingInterval) {
      setInterval(() => {
        getMeshOptions()
          .then(meshOptions => getMesh(meshOptions))
          .then(newMesh =>
            meshInstance$.then(oldMesh => {
              oldMesh.destroy();
              meshInstance$ = Promise.resolve(newMesh);
            }),
          )
          .catch(err => {
            console.error("Mesh polling failed so the existing version will be used:", err);
          });
      }, pollingInterval);
    }
    meshInstance$ = getMeshOptions()
      .then(meshOptions => getMesh(meshOptions))
      .then(mesh => {
        const id = mesh.pubsub.subscribe("destroy", () => {
          meshInstance$ = undefined;
          mesh.pubsub.unsubscribe(id);
        });
        return mesh;
      });
  }
  return meshInstance$;
}

export const execute: ExecuteMeshFn = (...args) => getBuiltGraphClient().then(({ execute }) => execute(...args));

export const subscribe: SubscribeMeshFn = (...args) =>
  getBuiltGraphClient().then(({ subscribe }) => subscribe(...args));
export function getBuiltGraphSDK<TGlobalContext = any, TOperationContext = any>(globalContext?: TGlobalContext) {
  const sdkRequester$ = getBuiltGraphClient().then(({ sdkRequesterFactory }) => sdkRequesterFactory(globalContext));
  return getSdk<TOperationContext, TGlobalContext>((...args) =>
    sdkRequester$.then(sdkRequester => sdkRequester(...args)),
  );
}
export type RBSPriceEventsQueryVariables = Exact<{
  startDate: Scalars["String"]["input"];
}>;

export type RBSPriceEventsQuery = {
  priceEvents: Array<
    Pick<PriceEvent, "date" | "block" | "type" | "isHigh"> & {
      snapshot: Pick<
        RangeSnapshot,
        | "ohmPrice"
        | "ohmMovingAveragePrice"
        | "highCushionPrice"
        | "highWallPrice"
        | "lowCushionPrice"
        | "lowWallPrice"
        | "highActive"
        | "lowActive"
        | "highMarketId"
        | "lowMarketId"
        | "highCapacityOhm"
        | "lowCapacityReserve"
      >;
    }
  >;
};

export const RBSPriceEventsDocument = gql`
  query RBSPriceEvents($startDate: String!) {
    priceEvents(orderBy: date, orderDirection: desc, where: { date_gte: $startDate }) {
      date
      block
      type
      isHigh
      snapshot {
        ohmPrice
        ohmMovingAveragePrice
        highCushionPrice
        highWallPrice
        lowCushionPrice
        lowWallPrice
        highActive
        lowActive
        highMarketId
        lowMarketId
        highCapacityOhm
        lowCapacityReserve
      }
    }
  }
` as unknown as DocumentNode<RBSPriceEventsQuery, RBSPriceEventsQueryVariables>;

export type Requester<C = {}, E = unknown> = <R, V>(
  doc: DocumentNode,
  vars?: V,
  options?: C,
) => Promise<R> | AsyncIterable<R>;
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {
    RBSPriceEvents(variables: RBSPriceEventsQueryVariables, options?: C): Promise<RBSPriceEventsQuery> {
      return requester<RBSPriceEventsQuery, RBSPriceEventsQueryVariables>(
        RBSPriceEventsDocument,
        variables,
        options,
      ) as Promise<RBSPriceEventsQuery>;
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;
