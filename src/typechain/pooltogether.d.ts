export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigDecimal: any;
  BigInt: any;
  Bytes: any;
};

export type Account = {
  __typename?: "Account";
  controlledTokenBalances?: Maybe<Array<ControlledTokenBalance>>;
  id: Scalars["ID"];
  prizePoolAccounts: Array<PrizePoolAccount>;
};

export type AccountControlledTokenBalancesArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ControlledTokenBalance_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<ControlledTokenBalance_Filter>;
};

export type AccountPrizePoolAccountsArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<PrizePoolAccount_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<PrizePoolAccount_Filter>;
};

export type Account_Filter = {
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
};

export enum Account_OrderBy {
  ControlledTokenBalances = "controlledTokenBalances",
  Id = "id",
  PrizePoolAccounts = "prizePoolAccounts",
}

export type AwardedControlledToken = {
  __typename?: "AwardedControlledToken";
  amount: Scalars["BigInt"];
  id: Scalars["ID"];
  prize: Prize;
  token: ControlledToken;
  winner: Scalars["Bytes"];
};

export type AwardedControlledToken_Filter = {
  amount?: InputMaybe<Scalars["BigInt"]>;
  amount_gt?: InputMaybe<Scalars["BigInt"]>;
  amount_gte?: InputMaybe<Scalars["BigInt"]>;
  amount_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  amount_lt?: InputMaybe<Scalars["BigInt"]>;
  amount_lte?: InputMaybe<Scalars["BigInt"]>;
  amount_not?: InputMaybe<Scalars["BigInt"]>;
  amount_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  prize?: InputMaybe<Scalars["String"]>;
  prize_contains?: InputMaybe<Scalars["String"]>;
  prize_ends_with?: InputMaybe<Scalars["String"]>;
  prize_gt?: InputMaybe<Scalars["String"]>;
  prize_gte?: InputMaybe<Scalars["String"]>;
  prize_in?: InputMaybe<Array<Scalars["String"]>>;
  prize_lt?: InputMaybe<Scalars["String"]>;
  prize_lte?: InputMaybe<Scalars["String"]>;
  prize_not?: InputMaybe<Scalars["String"]>;
  prize_not_contains?: InputMaybe<Scalars["String"]>;
  prize_not_ends_with?: InputMaybe<Scalars["String"]>;
  prize_not_in?: InputMaybe<Array<Scalars["String"]>>;
  prize_not_starts_with?: InputMaybe<Scalars["String"]>;
  prize_starts_with?: InputMaybe<Scalars["String"]>;
  token?: InputMaybe<Scalars["String"]>;
  token_contains?: InputMaybe<Scalars["String"]>;
  token_ends_with?: InputMaybe<Scalars["String"]>;
  token_gt?: InputMaybe<Scalars["String"]>;
  token_gte?: InputMaybe<Scalars["String"]>;
  token_in?: InputMaybe<Array<Scalars["String"]>>;
  token_lt?: InputMaybe<Scalars["String"]>;
  token_lte?: InputMaybe<Scalars["String"]>;
  token_not?: InputMaybe<Scalars["String"]>;
  token_not_contains?: InputMaybe<Scalars["String"]>;
  token_not_ends_with?: InputMaybe<Scalars["String"]>;
  token_not_in?: InputMaybe<Array<Scalars["String"]>>;
  token_not_starts_with?: InputMaybe<Scalars["String"]>;
  token_starts_with?: InputMaybe<Scalars["String"]>;
  winner?: InputMaybe<Scalars["Bytes"]>;
  winner_contains?: InputMaybe<Scalars["Bytes"]>;
  winner_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  winner_not?: InputMaybe<Scalars["Bytes"]>;
  winner_not_contains?: InputMaybe<Scalars["Bytes"]>;
  winner_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
};

export enum AwardedControlledToken_OrderBy {
  Amount = "amount",
  Id = "id",
  Prize = "prize",
  Token = "token",
  Winner = "winner",
}

export type AwardedExternalErc20Token = {
  __typename?: "AwardedExternalErc20Token";
  address: Scalars["Bytes"];
  balanceAwarded?: Maybe<Scalars["BigInt"]>;
  decimals?: Maybe<Scalars["BigInt"]>;
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  prize: Prize;
  symbol?: Maybe<Scalars["String"]>;
  winner?: Maybe<Scalars["Bytes"]>;
};

export type AwardedExternalErc20Token_Filter = {
  address?: InputMaybe<Scalars["Bytes"]>;
  address_contains?: InputMaybe<Scalars["Bytes"]>;
  address_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  address_not?: InputMaybe<Scalars["Bytes"]>;
  address_not_contains?: InputMaybe<Scalars["Bytes"]>;
  address_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  balanceAwarded?: InputMaybe<Scalars["BigInt"]>;
  balanceAwarded_gt?: InputMaybe<Scalars["BigInt"]>;
  balanceAwarded_gte?: InputMaybe<Scalars["BigInt"]>;
  balanceAwarded_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  balanceAwarded_lt?: InputMaybe<Scalars["BigInt"]>;
  balanceAwarded_lte?: InputMaybe<Scalars["BigInt"]>;
  balanceAwarded_not?: InputMaybe<Scalars["BigInt"]>;
  balanceAwarded_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  decimals?: InputMaybe<Scalars["BigInt"]>;
  decimals_gt?: InputMaybe<Scalars["BigInt"]>;
  decimals_gte?: InputMaybe<Scalars["BigInt"]>;
  decimals_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  decimals_lt?: InputMaybe<Scalars["BigInt"]>;
  decimals_lte?: InputMaybe<Scalars["BigInt"]>;
  decimals_not?: InputMaybe<Scalars["BigInt"]>;
  decimals_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  name?: InputMaybe<Scalars["String"]>;
  name_contains?: InputMaybe<Scalars["String"]>;
  name_ends_with?: InputMaybe<Scalars["String"]>;
  name_gt?: InputMaybe<Scalars["String"]>;
  name_gte?: InputMaybe<Scalars["String"]>;
  name_in?: InputMaybe<Array<Scalars["String"]>>;
  name_lt?: InputMaybe<Scalars["String"]>;
  name_lte?: InputMaybe<Scalars["String"]>;
  name_not?: InputMaybe<Scalars["String"]>;
  name_not_contains?: InputMaybe<Scalars["String"]>;
  name_not_ends_with?: InputMaybe<Scalars["String"]>;
  name_not_in?: InputMaybe<Array<Scalars["String"]>>;
  name_not_starts_with?: InputMaybe<Scalars["String"]>;
  name_starts_with?: InputMaybe<Scalars["String"]>;
  prize?: InputMaybe<Scalars["String"]>;
  prize_contains?: InputMaybe<Scalars["String"]>;
  prize_ends_with?: InputMaybe<Scalars["String"]>;
  prize_gt?: InputMaybe<Scalars["String"]>;
  prize_gte?: InputMaybe<Scalars["String"]>;
  prize_in?: InputMaybe<Array<Scalars["String"]>>;
  prize_lt?: InputMaybe<Scalars["String"]>;
  prize_lte?: InputMaybe<Scalars["String"]>;
  prize_not?: InputMaybe<Scalars["String"]>;
  prize_not_contains?: InputMaybe<Scalars["String"]>;
  prize_not_ends_with?: InputMaybe<Scalars["String"]>;
  prize_not_in?: InputMaybe<Array<Scalars["String"]>>;
  prize_not_starts_with?: InputMaybe<Scalars["String"]>;
  prize_starts_with?: InputMaybe<Scalars["String"]>;
  symbol?: InputMaybe<Scalars["String"]>;
  symbol_contains?: InputMaybe<Scalars["String"]>;
  symbol_ends_with?: InputMaybe<Scalars["String"]>;
  symbol_gt?: InputMaybe<Scalars["String"]>;
  symbol_gte?: InputMaybe<Scalars["String"]>;
  symbol_in?: InputMaybe<Array<Scalars["String"]>>;
  symbol_lt?: InputMaybe<Scalars["String"]>;
  symbol_lte?: InputMaybe<Scalars["String"]>;
  symbol_not?: InputMaybe<Scalars["String"]>;
  symbol_not_contains?: InputMaybe<Scalars["String"]>;
  symbol_not_ends_with?: InputMaybe<Scalars["String"]>;
  symbol_not_in?: InputMaybe<Array<Scalars["String"]>>;
  symbol_not_starts_with?: InputMaybe<Scalars["String"]>;
  symbol_starts_with?: InputMaybe<Scalars["String"]>;
  winner?: InputMaybe<Scalars["Bytes"]>;
  winner_contains?: InputMaybe<Scalars["Bytes"]>;
  winner_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  winner_not?: InputMaybe<Scalars["Bytes"]>;
  winner_not_contains?: InputMaybe<Scalars["Bytes"]>;
  winner_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
};

export enum AwardedExternalErc20Token_OrderBy {
  Address = "address",
  BalanceAwarded = "balanceAwarded",
  Decimals = "decimals",
  Id = "id",
  Name = "name",
  Prize = "prize",
  Symbol = "symbol",
  Winner = "winner",
}

export type AwardedExternalErc721Nft = {
  __typename?: "AwardedExternalErc721Nft";
  address: Scalars["Bytes"];
  id: Scalars["ID"];
  prize?: Maybe<Prize>;
  tokenIds?: Maybe<Array<Scalars["BigInt"]>>;
  winner?: Maybe<Scalars["Bytes"]>;
};

export type AwardedExternalErc721Nft_Filter = {
  address?: InputMaybe<Scalars["Bytes"]>;
  address_contains?: InputMaybe<Scalars["Bytes"]>;
  address_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  address_not?: InputMaybe<Scalars["Bytes"]>;
  address_not_contains?: InputMaybe<Scalars["Bytes"]>;
  address_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  prize?: InputMaybe<Scalars["String"]>;
  prize_contains?: InputMaybe<Scalars["String"]>;
  prize_ends_with?: InputMaybe<Scalars["String"]>;
  prize_gt?: InputMaybe<Scalars["String"]>;
  prize_gte?: InputMaybe<Scalars["String"]>;
  prize_in?: InputMaybe<Array<Scalars["String"]>>;
  prize_lt?: InputMaybe<Scalars["String"]>;
  prize_lte?: InputMaybe<Scalars["String"]>;
  prize_not?: InputMaybe<Scalars["String"]>;
  prize_not_contains?: InputMaybe<Scalars["String"]>;
  prize_not_ends_with?: InputMaybe<Scalars["String"]>;
  prize_not_in?: InputMaybe<Array<Scalars["String"]>>;
  prize_not_starts_with?: InputMaybe<Scalars["String"]>;
  prize_starts_with?: InputMaybe<Scalars["String"]>;
  tokenIds?: InputMaybe<Array<Scalars["BigInt"]>>;
  tokenIds_contains?: InputMaybe<Array<Scalars["BigInt"]>>;
  tokenIds_not?: InputMaybe<Array<Scalars["BigInt"]>>;
  tokenIds_not_contains?: InputMaybe<Array<Scalars["BigInt"]>>;
  winner?: InputMaybe<Scalars["Bytes"]>;
  winner_contains?: InputMaybe<Scalars["Bytes"]>;
  winner_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  winner_not?: InputMaybe<Scalars["Bytes"]>;
  winner_not_contains?: InputMaybe<Scalars["Bytes"]>;
  winner_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
};

export enum AwardedExternalErc721Nft_OrderBy {
  Address = "address",
  Id = "id",
  Prize = "prize",
  TokenIds = "tokenIds",
  Winner = "winner",
}

export type BalanceDrip = {
  __typename?: "BalanceDrip";
  comptroller: Comptroller;
  deactivated: Scalars["Boolean"];
  dripRatePerSecond?: Maybe<Scalars["BigInt"]>;
  dripToken: Scalars["Bytes"];
  exchangeRateMantissa?: Maybe<Scalars["BigInt"]>;
  id: Scalars["ID"];
  measureToken: Scalars["Bytes"];
  players: Array<BalanceDripPlayer>;
  sourceAddress: Scalars["Bytes"];
  timestamp?: Maybe<Scalars["BigInt"]>;
};

export type BalanceDripPlayersArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<BalanceDripPlayer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<BalanceDripPlayer_Filter>;
};

export type BalanceDripPlayer = {
  __typename?: "BalanceDripPlayer";
  address: Scalars["Bytes"];
  balanceDrip: BalanceDrip;
  id: Scalars["ID"];
};

export type BalanceDripPlayer_Filter = {
  address?: InputMaybe<Scalars["Bytes"]>;
  address_contains?: InputMaybe<Scalars["Bytes"]>;
  address_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  address_not?: InputMaybe<Scalars["Bytes"]>;
  address_not_contains?: InputMaybe<Scalars["Bytes"]>;
  address_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  balanceDrip?: InputMaybe<Scalars["String"]>;
  balanceDrip_contains?: InputMaybe<Scalars["String"]>;
  balanceDrip_ends_with?: InputMaybe<Scalars["String"]>;
  balanceDrip_gt?: InputMaybe<Scalars["String"]>;
  balanceDrip_gte?: InputMaybe<Scalars["String"]>;
  balanceDrip_in?: InputMaybe<Array<Scalars["String"]>>;
  balanceDrip_lt?: InputMaybe<Scalars["String"]>;
  balanceDrip_lte?: InputMaybe<Scalars["String"]>;
  balanceDrip_not?: InputMaybe<Scalars["String"]>;
  balanceDrip_not_contains?: InputMaybe<Scalars["String"]>;
  balanceDrip_not_ends_with?: InputMaybe<Scalars["String"]>;
  balanceDrip_not_in?: InputMaybe<Array<Scalars["String"]>>;
  balanceDrip_not_starts_with?: InputMaybe<Scalars["String"]>;
  balanceDrip_starts_with?: InputMaybe<Scalars["String"]>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
};

export enum BalanceDripPlayer_OrderBy {
  Address = "address",
  BalanceDrip = "balanceDrip",
  Id = "id",
}

export type BalanceDrip_Filter = {
  comptroller?: InputMaybe<Scalars["String"]>;
  comptroller_contains?: InputMaybe<Scalars["String"]>;
  comptroller_ends_with?: InputMaybe<Scalars["String"]>;
  comptroller_gt?: InputMaybe<Scalars["String"]>;
  comptroller_gte?: InputMaybe<Scalars["String"]>;
  comptroller_in?: InputMaybe<Array<Scalars["String"]>>;
  comptroller_lt?: InputMaybe<Scalars["String"]>;
  comptroller_lte?: InputMaybe<Scalars["String"]>;
  comptroller_not?: InputMaybe<Scalars["String"]>;
  comptroller_not_contains?: InputMaybe<Scalars["String"]>;
  comptroller_not_ends_with?: InputMaybe<Scalars["String"]>;
  comptroller_not_in?: InputMaybe<Array<Scalars["String"]>>;
  comptroller_not_starts_with?: InputMaybe<Scalars["String"]>;
  comptroller_starts_with?: InputMaybe<Scalars["String"]>;
  deactivated?: InputMaybe<Scalars["Boolean"]>;
  deactivated_in?: InputMaybe<Array<Scalars["Boolean"]>>;
  deactivated_not?: InputMaybe<Scalars["Boolean"]>;
  deactivated_not_in?: InputMaybe<Array<Scalars["Boolean"]>>;
  dripRatePerSecond?: InputMaybe<Scalars["BigInt"]>;
  dripRatePerSecond_gt?: InputMaybe<Scalars["BigInt"]>;
  dripRatePerSecond_gte?: InputMaybe<Scalars["BigInt"]>;
  dripRatePerSecond_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  dripRatePerSecond_lt?: InputMaybe<Scalars["BigInt"]>;
  dripRatePerSecond_lte?: InputMaybe<Scalars["BigInt"]>;
  dripRatePerSecond_not?: InputMaybe<Scalars["BigInt"]>;
  dripRatePerSecond_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  dripToken?: InputMaybe<Scalars["Bytes"]>;
  dripToken_contains?: InputMaybe<Scalars["Bytes"]>;
  dripToken_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  dripToken_not?: InputMaybe<Scalars["Bytes"]>;
  dripToken_not_contains?: InputMaybe<Scalars["Bytes"]>;
  dripToken_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  exchangeRateMantissa?: InputMaybe<Scalars["BigInt"]>;
  exchangeRateMantissa_gt?: InputMaybe<Scalars["BigInt"]>;
  exchangeRateMantissa_gte?: InputMaybe<Scalars["BigInt"]>;
  exchangeRateMantissa_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  exchangeRateMantissa_lt?: InputMaybe<Scalars["BigInt"]>;
  exchangeRateMantissa_lte?: InputMaybe<Scalars["BigInt"]>;
  exchangeRateMantissa_not?: InputMaybe<Scalars["BigInt"]>;
  exchangeRateMantissa_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  measureToken?: InputMaybe<Scalars["Bytes"]>;
  measureToken_contains?: InputMaybe<Scalars["Bytes"]>;
  measureToken_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  measureToken_not?: InputMaybe<Scalars["Bytes"]>;
  measureToken_not_contains?: InputMaybe<Scalars["Bytes"]>;
  measureToken_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  sourceAddress?: InputMaybe<Scalars["Bytes"]>;
  sourceAddress_contains?: InputMaybe<Scalars["Bytes"]>;
  sourceAddress_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  sourceAddress_not?: InputMaybe<Scalars["Bytes"]>;
  sourceAddress_not_contains?: InputMaybe<Scalars["Bytes"]>;
  sourceAddress_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  timestamp?: InputMaybe<Scalars["BigInt"]>;
  timestamp_gt?: InputMaybe<Scalars["BigInt"]>;
  timestamp_gte?: InputMaybe<Scalars["BigInt"]>;
  timestamp_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  timestamp_lt?: InputMaybe<Scalars["BigInt"]>;
  timestamp_lte?: InputMaybe<Scalars["BigInt"]>;
  timestamp_not?: InputMaybe<Scalars["BigInt"]>;
  timestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
};

export enum BalanceDrip_OrderBy {
  Comptroller = "comptroller",
  Deactivated = "deactivated",
  DripRatePerSecond = "dripRatePerSecond",
  DripToken = "dripToken",
  ExchangeRateMantissa = "exchangeRateMantissa",
  Id = "id",
  MeasureToken = "measureToken",
  Players = "players",
  SourceAddress = "sourceAddress",
  Timestamp = "timestamp",
}

/** The block at which the query should be executed. */
export type Block_Height = {
  /** Value containing a block hash */
  hash?: InputMaybe<Scalars["Bytes"]>;
  /** Value containing a block number */
  number?: InputMaybe<Scalars["Int"]>;
  /**
   * Value containing the minimum block number.
   * In the case of `number_gte`, the query will be executed on the latest block only if
   * the subgraph has progressed to or past the minimum block number.
   * Defaults to the latest block when omitted.
   *
   */
  number_gte?: InputMaybe<Scalars["Int"]>;
};

export type CompoundPrizePool = {
  __typename?: "CompoundPrizePool";
  cToken?: Maybe<Scalars["Bytes"]>;
  id: Scalars["ID"];
};

export type CompoundPrizePool_Filter = {
  cToken?: InputMaybe<Scalars["Bytes"]>;
  cToken_contains?: InputMaybe<Scalars["Bytes"]>;
  cToken_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  cToken_not?: InputMaybe<Scalars["Bytes"]>;
  cToken_not_contains?: InputMaybe<Scalars["Bytes"]>;
  cToken_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
};

export enum CompoundPrizePool_OrderBy {
  CToken = "cToken",
  Id = "id",
}

export type Comptroller = {
  __typename?: "Comptroller";
  balanceDrips: Array<BalanceDrip>;
  id: Scalars["ID"];
  owner: Scalars["Bytes"];
  players: Array<DripTokenPlayer>;
  volumeDrips: Array<VolumeDrip>;
};

export type ComptrollerBalanceDripsArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<BalanceDrip_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<BalanceDrip_Filter>;
};

export type ComptrollerPlayersArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<DripTokenPlayer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<DripTokenPlayer_Filter>;
};

export type ComptrollerVolumeDripsArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<VolumeDrip_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<VolumeDrip_Filter>;
};

export type Comptroller_Filter = {
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  owner?: InputMaybe<Scalars["Bytes"]>;
  owner_contains?: InputMaybe<Scalars["Bytes"]>;
  owner_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  owner_not?: InputMaybe<Scalars["Bytes"]>;
  owner_not_contains?: InputMaybe<Scalars["Bytes"]>;
  owner_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
};

export enum Comptroller_OrderBy {
  BalanceDrips = "balanceDrips",
  Id = "id",
  Owner = "owner",
  Players = "players",
  VolumeDrips = "volumeDrips",
}

export type ControlledToken = {
  __typename?: "ControlledToken";
  balances: Array<ControlledTokenBalance>;
  controller?: Maybe<PrizePool>;
  decimals?: Maybe<Scalars["BigInt"]>;
  id: Scalars["ID"];
  name: Scalars["String"];
  numberOfHolders: Scalars["BigInt"];
  symbol: Scalars["String"];
  totalSupply: Scalars["BigInt"];
};

export type ControlledTokenBalancesArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ControlledTokenBalance_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<ControlledTokenBalance_Filter>;
};

export type ControlledTokenBalance = {
  __typename?: "ControlledTokenBalance";
  account: Account;
  balance?: Maybe<Scalars["BigInt"]>;
  controlledToken: ControlledToken;
  id: Scalars["ID"];
};

export type ControlledTokenBalance_Filter = {
  account?: InputMaybe<Scalars["String"]>;
  account_contains?: InputMaybe<Scalars["String"]>;
  account_ends_with?: InputMaybe<Scalars["String"]>;
  account_gt?: InputMaybe<Scalars["String"]>;
  account_gte?: InputMaybe<Scalars["String"]>;
  account_in?: InputMaybe<Array<Scalars["String"]>>;
  account_lt?: InputMaybe<Scalars["String"]>;
  account_lte?: InputMaybe<Scalars["String"]>;
  account_not?: InputMaybe<Scalars["String"]>;
  account_not_contains?: InputMaybe<Scalars["String"]>;
  account_not_ends_with?: InputMaybe<Scalars["String"]>;
  account_not_in?: InputMaybe<Array<Scalars["String"]>>;
  account_not_starts_with?: InputMaybe<Scalars["String"]>;
  account_starts_with?: InputMaybe<Scalars["String"]>;
  balance?: InputMaybe<Scalars["BigInt"]>;
  balance_gt?: InputMaybe<Scalars["BigInt"]>;
  balance_gte?: InputMaybe<Scalars["BigInt"]>;
  balance_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  balance_lt?: InputMaybe<Scalars["BigInt"]>;
  balance_lte?: InputMaybe<Scalars["BigInt"]>;
  balance_not?: InputMaybe<Scalars["BigInt"]>;
  balance_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  controlledToken?: InputMaybe<Scalars["String"]>;
  controlledToken_contains?: InputMaybe<Scalars["String"]>;
  controlledToken_ends_with?: InputMaybe<Scalars["String"]>;
  controlledToken_gt?: InputMaybe<Scalars["String"]>;
  controlledToken_gte?: InputMaybe<Scalars["String"]>;
  controlledToken_in?: InputMaybe<Array<Scalars["String"]>>;
  controlledToken_lt?: InputMaybe<Scalars["String"]>;
  controlledToken_lte?: InputMaybe<Scalars["String"]>;
  controlledToken_not?: InputMaybe<Scalars["String"]>;
  controlledToken_not_contains?: InputMaybe<Scalars["String"]>;
  controlledToken_not_ends_with?: InputMaybe<Scalars["String"]>;
  controlledToken_not_in?: InputMaybe<Array<Scalars["String"]>>;
  controlledToken_not_starts_with?: InputMaybe<Scalars["String"]>;
  controlledToken_starts_with?: InputMaybe<Scalars["String"]>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
};

export enum ControlledTokenBalance_OrderBy {
  Account = "account",
  Balance = "balance",
  ControlledToken = "controlledToken",
  Id = "id",
}

export type ControlledToken_Filter = {
  controller?: InputMaybe<Scalars["String"]>;
  controller_contains?: InputMaybe<Scalars["String"]>;
  controller_ends_with?: InputMaybe<Scalars["String"]>;
  controller_gt?: InputMaybe<Scalars["String"]>;
  controller_gte?: InputMaybe<Scalars["String"]>;
  controller_in?: InputMaybe<Array<Scalars["String"]>>;
  controller_lt?: InputMaybe<Scalars["String"]>;
  controller_lte?: InputMaybe<Scalars["String"]>;
  controller_not?: InputMaybe<Scalars["String"]>;
  controller_not_contains?: InputMaybe<Scalars["String"]>;
  controller_not_ends_with?: InputMaybe<Scalars["String"]>;
  controller_not_in?: InputMaybe<Array<Scalars["String"]>>;
  controller_not_starts_with?: InputMaybe<Scalars["String"]>;
  controller_starts_with?: InputMaybe<Scalars["String"]>;
  decimals?: InputMaybe<Scalars["BigInt"]>;
  decimals_gt?: InputMaybe<Scalars["BigInt"]>;
  decimals_gte?: InputMaybe<Scalars["BigInt"]>;
  decimals_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  decimals_lt?: InputMaybe<Scalars["BigInt"]>;
  decimals_lte?: InputMaybe<Scalars["BigInt"]>;
  decimals_not?: InputMaybe<Scalars["BigInt"]>;
  decimals_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  name?: InputMaybe<Scalars["String"]>;
  name_contains?: InputMaybe<Scalars["String"]>;
  name_ends_with?: InputMaybe<Scalars["String"]>;
  name_gt?: InputMaybe<Scalars["String"]>;
  name_gte?: InputMaybe<Scalars["String"]>;
  name_in?: InputMaybe<Array<Scalars["String"]>>;
  name_lt?: InputMaybe<Scalars["String"]>;
  name_lte?: InputMaybe<Scalars["String"]>;
  name_not?: InputMaybe<Scalars["String"]>;
  name_not_contains?: InputMaybe<Scalars["String"]>;
  name_not_ends_with?: InputMaybe<Scalars["String"]>;
  name_not_in?: InputMaybe<Array<Scalars["String"]>>;
  name_not_starts_with?: InputMaybe<Scalars["String"]>;
  name_starts_with?: InputMaybe<Scalars["String"]>;
  numberOfHolders?: InputMaybe<Scalars["BigInt"]>;
  numberOfHolders_gt?: InputMaybe<Scalars["BigInt"]>;
  numberOfHolders_gte?: InputMaybe<Scalars["BigInt"]>;
  numberOfHolders_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  numberOfHolders_lt?: InputMaybe<Scalars["BigInt"]>;
  numberOfHolders_lte?: InputMaybe<Scalars["BigInt"]>;
  numberOfHolders_not?: InputMaybe<Scalars["BigInt"]>;
  numberOfHolders_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  symbol?: InputMaybe<Scalars["String"]>;
  symbol_contains?: InputMaybe<Scalars["String"]>;
  symbol_ends_with?: InputMaybe<Scalars["String"]>;
  symbol_gt?: InputMaybe<Scalars["String"]>;
  symbol_gte?: InputMaybe<Scalars["String"]>;
  symbol_in?: InputMaybe<Array<Scalars["String"]>>;
  symbol_lt?: InputMaybe<Scalars["String"]>;
  symbol_lte?: InputMaybe<Scalars["String"]>;
  symbol_not?: InputMaybe<Scalars["String"]>;
  symbol_not_contains?: InputMaybe<Scalars["String"]>;
  symbol_not_ends_with?: InputMaybe<Scalars["String"]>;
  symbol_not_in?: InputMaybe<Array<Scalars["String"]>>;
  symbol_not_starts_with?: InputMaybe<Scalars["String"]>;
  symbol_starts_with?: InputMaybe<Scalars["String"]>;
  totalSupply?: InputMaybe<Scalars["BigInt"]>;
  totalSupply_gt?: InputMaybe<Scalars["BigInt"]>;
  totalSupply_gte?: InputMaybe<Scalars["BigInt"]>;
  totalSupply_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  totalSupply_lt?: InputMaybe<Scalars["BigInt"]>;
  totalSupply_lte?: InputMaybe<Scalars["BigInt"]>;
  totalSupply_not?: InputMaybe<Scalars["BigInt"]>;
  totalSupply_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
};

export enum ControlledToken_OrderBy {
  Balances = "balances",
  Controller = "controller",
  Decimals = "decimals",
  Id = "id",
  Name = "name",
  NumberOfHolders = "numberOfHolders",
  Symbol = "symbol",
  TotalSupply = "totalSupply",
}

export type CreditBalance = {
  __typename?: "CreditBalance";
  balance?: Maybe<Scalars["BigInt"]>;
  id: Scalars["ID"];
  initialized?: Maybe<Scalars["Boolean"]>;
  prizePool: PrizePool;
  timestamp?: Maybe<Scalars["BigInt"]>;
};

export type CreditBalance_Filter = {
  balance?: InputMaybe<Scalars["BigInt"]>;
  balance_gt?: InputMaybe<Scalars["BigInt"]>;
  balance_gte?: InputMaybe<Scalars["BigInt"]>;
  balance_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  balance_lt?: InputMaybe<Scalars["BigInt"]>;
  balance_lte?: InputMaybe<Scalars["BigInt"]>;
  balance_not?: InputMaybe<Scalars["BigInt"]>;
  balance_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  initialized?: InputMaybe<Scalars["Boolean"]>;
  initialized_in?: InputMaybe<Array<Scalars["Boolean"]>>;
  initialized_not?: InputMaybe<Scalars["Boolean"]>;
  initialized_not_in?: InputMaybe<Array<Scalars["Boolean"]>>;
  prizePool?: InputMaybe<Scalars["String"]>;
  prizePool_contains?: InputMaybe<Scalars["String"]>;
  prizePool_ends_with?: InputMaybe<Scalars["String"]>;
  prizePool_gt?: InputMaybe<Scalars["String"]>;
  prizePool_gte?: InputMaybe<Scalars["String"]>;
  prizePool_in?: InputMaybe<Array<Scalars["String"]>>;
  prizePool_lt?: InputMaybe<Scalars["String"]>;
  prizePool_lte?: InputMaybe<Scalars["String"]>;
  prizePool_not?: InputMaybe<Scalars["String"]>;
  prizePool_not_contains?: InputMaybe<Scalars["String"]>;
  prizePool_not_ends_with?: InputMaybe<Scalars["String"]>;
  prizePool_not_in?: InputMaybe<Array<Scalars["String"]>>;
  prizePool_not_starts_with?: InputMaybe<Scalars["String"]>;
  prizePool_starts_with?: InputMaybe<Scalars["String"]>;
  timestamp?: InputMaybe<Scalars["BigInt"]>;
  timestamp_gt?: InputMaybe<Scalars["BigInt"]>;
  timestamp_gte?: InputMaybe<Scalars["BigInt"]>;
  timestamp_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  timestamp_lt?: InputMaybe<Scalars["BigInt"]>;
  timestamp_lte?: InputMaybe<Scalars["BigInt"]>;
  timestamp_not?: InputMaybe<Scalars["BigInt"]>;
  timestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
};

export enum CreditBalance_OrderBy {
  Balance = "balance",
  Id = "id",
  Initialized = "initialized",
  PrizePool = "prizePool",
  Timestamp = "timestamp",
}

export type CreditRate = {
  __typename?: "CreditRate";
  creditLimitMantissa: Scalars["BigInt"];
  creditRateMantissa: Scalars["BigInt"];
  id: Scalars["ID"];
  prizePool: PrizePool;
};

export type CreditRate_Filter = {
  creditLimitMantissa?: InputMaybe<Scalars["BigInt"]>;
  creditLimitMantissa_gt?: InputMaybe<Scalars["BigInt"]>;
  creditLimitMantissa_gte?: InputMaybe<Scalars["BigInt"]>;
  creditLimitMantissa_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  creditLimitMantissa_lt?: InputMaybe<Scalars["BigInt"]>;
  creditLimitMantissa_lte?: InputMaybe<Scalars["BigInt"]>;
  creditLimitMantissa_not?: InputMaybe<Scalars["BigInt"]>;
  creditLimitMantissa_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  creditRateMantissa?: InputMaybe<Scalars["BigInt"]>;
  creditRateMantissa_gt?: InputMaybe<Scalars["BigInt"]>;
  creditRateMantissa_gte?: InputMaybe<Scalars["BigInt"]>;
  creditRateMantissa_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  creditRateMantissa_lt?: InputMaybe<Scalars["BigInt"]>;
  creditRateMantissa_lte?: InputMaybe<Scalars["BigInt"]>;
  creditRateMantissa_not?: InputMaybe<Scalars["BigInt"]>;
  creditRateMantissa_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  prizePool?: InputMaybe<Scalars["String"]>;
  prizePool_contains?: InputMaybe<Scalars["String"]>;
  prizePool_ends_with?: InputMaybe<Scalars["String"]>;
  prizePool_gt?: InputMaybe<Scalars["String"]>;
  prizePool_gte?: InputMaybe<Scalars["String"]>;
  prizePool_in?: InputMaybe<Array<Scalars["String"]>>;
  prizePool_lt?: InputMaybe<Scalars["String"]>;
  prizePool_lte?: InputMaybe<Scalars["String"]>;
  prizePool_not?: InputMaybe<Scalars["String"]>;
  prizePool_not_contains?: InputMaybe<Scalars["String"]>;
  prizePool_not_ends_with?: InputMaybe<Scalars["String"]>;
  prizePool_not_in?: InputMaybe<Array<Scalars["String"]>>;
  prizePool_not_starts_with?: InputMaybe<Scalars["String"]>;
  prizePool_starts_with?: InputMaybe<Scalars["String"]>;
};

export enum CreditRate_OrderBy {
  CreditLimitMantissa = "creditLimitMantissa",
  CreditRateMantissa = "creditRateMantissa",
  Id = "id",
  PrizePool = "prizePool",
}

export type DripTokenPlayer = {
  __typename?: "DripTokenPlayer";
  address: Scalars["Bytes"];
  balance: Scalars["BigInt"];
  comptroller: Comptroller;
  dripToken: Scalars["Bytes"];
  id: Scalars["ID"];
};

export type DripTokenPlayer_Filter = {
  address?: InputMaybe<Scalars["Bytes"]>;
  address_contains?: InputMaybe<Scalars["Bytes"]>;
  address_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  address_not?: InputMaybe<Scalars["Bytes"]>;
  address_not_contains?: InputMaybe<Scalars["Bytes"]>;
  address_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  balance?: InputMaybe<Scalars["BigInt"]>;
  balance_gt?: InputMaybe<Scalars["BigInt"]>;
  balance_gte?: InputMaybe<Scalars["BigInt"]>;
  balance_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  balance_lt?: InputMaybe<Scalars["BigInt"]>;
  balance_lte?: InputMaybe<Scalars["BigInt"]>;
  balance_not?: InputMaybe<Scalars["BigInt"]>;
  balance_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  comptroller?: InputMaybe<Scalars["String"]>;
  comptroller_contains?: InputMaybe<Scalars["String"]>;
  comptroller_ends_with?: InputMaybe<Scalars["String"]>;
  comptroller_gt?: InputMaybe<Scalars["String"]>;
  comptroller_gte?: InputMaybe<Scalars["String"]>;
  comptroller_in?: InputMaybe<Array<Scalars["String"]>>;
  comptroller_lt?: InputMaybe<Scalars["String"]>;
  comptroller_lte?: InputMaybe<Scalars["String"]>;
  comptroller_not?: InputMaybe<Scalars["String"]>;
  comptroller_not_contains?: InputMaybe<Scalars["String"]>;
  comptroller_not_ends_with?: InputMaybe<Scalars["String"]>;
  comptroller_not_in?: InputMaybe<Array<Scalars["String"]>>;
  comptroller_not_starts_with?: InputMaybe<Scalars["String"]>;
  comptroller_starts_with?: InputMaybe<Scalars["String"]>;
  dripToken?: InputMaybe<Scalars["Bytes"]>;
  dripToken_contains?: InputMaybe<Scalars["Bytes"]>;
  dripToken_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  dripToken_not?: InputMaybe<Scalars["Bytes"]>;
  dripToken_not_contains?: InputMaybe<Scalars["Bytes"]>;
  dripToken_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
};

export enum DripTokenPlayer_OrderBy {
  Address = "address",
  Balance = "balance",
  Comptroller = "comptroller",
  DripToken = "dripToken",
  Id = "id",
}

export type MultipleWinnersExternalErc20Award = {
  __typename?: "MultipleWinnersExternalErc20Award";
  address: Scalars["Bytes"];
  balanceAwarded?: Maybe<Scalars["BigInt"]>;
  decimals?: Maybe<Scalars["BigInt"]>;
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  prizeStrategy?: Maybe<MultipleWinnersPrizeStrategy>;
  symbol?: Maybe<Scalars["String"]>;
};

export type MultipleWinnersExternalErc20Award_Filter = {
  address?: InputMaybe<Scalars["Bytes"]>;
  address_contains?: InputMaybe<Scalars["Bytes"]>;
  address_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  address_not?: InputMaybe<Scalars["Bytes"]>;
  address_not_contains?: InputMaybe<Scalars["Bytes"]>;
  address_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  balanceAwarded?: InputMaybe<Scalars["BigInt"]>;
  balanceAwarded_gt?: InputMaybe<Scalars["BigInt"]>;
  balanceAwarded_gte?: InputMaybe<Scalars["BigInt"]>;
  balanceAwarded_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  balanceAwarded_lt?: InputMaybe<Scalars["BigInt"]>;
  balanceAwarded_lte?: InputMaybe<Scalars["BigInt"]>;
  balanceAwarded_not?: InputMaybe<Scalars["BigInt"]>;
  balanceAwarded_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  decimals?: InputMaybe<Scalars["BigInt"]>;
  decimals_gt?: InputMaybe<Scalars["BigInt"]>;
  decimals_gte?: InputMaybe<Scalars["BigInt"]>;
  decimals_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  decimals_lt?: InputMaybe<Scalars["BigInt"]>;
  decimals_lte?: InputMaybe<Scalars["BigInt"]>;
  decimals_not?: InputMaybe<Scalars["BigInt"]>;
  decimals_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  name?: InputMaybe<Scalars["String"]>;
  name_contains?: InputMaybe<Scalars["String"]>;
  name_ends_with?: InputMaybe<Scalars["String"]>;
  name_gt?: InputMaybe<Scalars["String"]>;
  name_gte?: InputMaybe<Scalars["String"]>;
  name_in?: InputMaybe<Array<Scalars["String"]>>;
  name_lt?: InputMaybe<Scalars["String"]>;
  name_lte?: InputMaybe<Scalars["String"]>;
  name_not?: InputMaybe<Scalars["String"]>;
  name_not_contains?: InputMaybe<Scalars["String"]>;
  name_not_ends_with?: InputMaybe<Scalars["String"]>;
  name_not_in?: InputMaybe<Array<Scalars["String"]>>;
  name_not_starts_with?: InputMaybe<Scalars["String"]>;
  name_starts_with?: InputMaybe<Scalars["String"]>;
  prizeStrategy?: InputMaybe<Scalars["String"]>;
  prizeStrategy_contains?: InputMaybe<Scalars["String"]>;
  prizeStrategy_ends_with?: InputMaybe<Scalars["String"]>;
  prizeStrategy_gt?: InputMaybe<Scalars["String"]>;
  prizeStrategy_gte?: InputMaybe<Scalars["String"]>;
  prizeStrategy_in?: InputMaybe<Array<Scalars["String"]>>;
  prizeStrategy_lt?: InputMaybe<Scalars["String"]>;
  prizeStrategy_lte?: InputMaybe<Scalars["String"]>;
  prizeStrategy_not?: InputMaybe<Scalars["String"]>;
  prizeStrategy_not_contains?: InputMaybe<Scalars["String"]>;
  prizeStrategy_not_ends_with?: InputMaybe<Scalars["String"]>;
  prizeStrategy_not_in?: InputMaybe<Array<Scalars["String"]>>;
  prizeStrategy_not_starts_with?: InputMaybe<Scalars["String"]>;
  prizeStrategy_starts_with?: InputMaybe<Scalars["String"]>;
  symbol?: InputMaybe<Scalars["String"]>;
  symbol_contains?: InputMaybe<Scalars["String"]>;
  symbol_ends_with?: InputMaybe<Scalars["String"]>;
  symbol_gt?: InputMaybe<Scalars["String"]>;
  symbol_gte?: InputMaybe<Scalars["String"]>;
  symbol_in?: InputMaybe<Array<Scalars["String"]>>;
  symbol_lt?: InputMaybe<Scalars["String"]>;
  symbol_lte?: InputMaybe<Scalars["String"]>;
  symbol_not?: InputMaybe<Scalars["String"]>;
  symbol_not_contains?: InputMaybe<Scalars["String"]>;
  symbol_not_ends_with?: InputMaybe<Scalars["String"]>;
  symbol_not_in?: InputMaybe<Array<Scalars["String"]>>;
  symbol_not_starts_with?: InputMaybe<Scalars["String"]>;
  symbol_starts_with?: InputMaybe<Scalars["String"]>;
};

export enum MultipleWinnersExternalErc20Award_OrderBy {
  Address = "address",
  BalanceAwarded = "balanceAwarded",
  Decimals = "decimals",
  Id = "id",
  Name = "name",
  PrizeStrategy = "prizeStrategy",
  Symbol = "symbol",
}

export type MultipleWinnersExternalErc721Award = {
  __typename?: "MultipleWinnersExternalErc721Award";
  address: Scalars["Bytes"];
  id: Scalars["ID"];
  prizeStrategy?: Maybe<MultipleWinnersPrizeStrategy>;
  tokenIds?: Maybe<Array<Scalars["BigInt"]>>;
};

export type MultipleWinnersExternalErc721Award_Filter = {
  address?: InputMaybe<Scalars["Bytes"]>;
  address_contains?: InputMaybe<Scalars["Bytes"]>;
  address_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  address_not?: InputMaybe<Scalars["Bytes"]>;
  address_not_contains?: InputMaybe<Scalars["Bytes"]>;
  address_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  prizeStrategy?: InputMaybe<Scalars["String"]>;
  prizeStrategy_contains?: InputMaybe<Scalars["String"]>;
  prizeStrategy_ends_with?: InputMaybe<Scalars["String"]>;
  prizeStrategy_gt?: InputMaybe<Scalars["String"]>;
  prizeStrategy_gte?: InputMaybe<Scalars["String"]>;
  prizeStrategy_in?: InputMaybe<Array<Scalars["String"]>>;
  prizeStrategy_lt?: InputMaybe<Scalars["String"]>;
  prizeStrategy_lte?: InputMaybe<Scalars["String"]>;
  prizeStrategy_not?: InputMaybe<Scalars["String"]>;
  prizeStrategy_not_contains?: InputMaybe<Scalars["String"]>;
  prizeStrategy_not_ends_with?: InputMaybe<Scalars["String"]>;
  prizeStrategy_not_in?: InputMaybe<Array<Scalars["String"]>>;
  prizeStrategy_not_starts_with?: InputMaybe<Scalars["String"]>;
  prizeStrategy_starts_with?: InputMaybe<Scalars["String"]>;
  tokenIds?: InputMaybe<Array<Scalars["BigInt"]>>;
  tokenIds_contains?: InputMaybe<Array<Scalars["BigInt"]>>;
  tokenIds_not?: InputMaybe<Array<Scalars["BigInt"]>>;
  tokenIds_not_contains?: InputMaybe<Array<Scalars["BigInt"]>>;
};

export enum MultipleWinnersExternalErc721Award_OrderBy {
  Address = "address",
  Id = "id",
  PrizeStrategy = "prizeStrategy",
  TokenIds = "tokenIds",
}

export type MultipleWinnersPrizeStrategy = {
  __typename?: "MultipleWinnersPrizeStrategy";
  blockListedAddresses?: Maybe<Array<Scalars["Bytes"]>>;
  externalErc20Awards: Array<MultipleWinnersExternalErc20Award>;
  externalErc721Awards: Array<MultipleWinnersExternalErc721Award>;
  id: Scalars["ID"];
  numberOfWinners?: Maybe<Scalars["BigInt"]>;
  owner?: Maybe<Scalars["Bytes"]>;
  prizePeriodEndAt: Scalars["BigInt"];
  prizePeriodSeconds: Scalars["BigInt"];
  prizePeriodStartedAt: Scalars["BigInt"];
  prizePool?: Maybe<PrizePool>;
  prizeSplits?: Maybe<Array<PrizeSplit>>;
  rng?: Maybe<Scalars["Bytes"]>;
  splitExternalERC20Awards?: Maybe<Scalars["Boolean"]>;
  sponsorship?: Maybe<ControlledToken>;
  ticket?: Maybe<ControlledToken>;
  tokenListener?: Maybe<Scalars["Bytes"]>;
};

export type MultipleWinnersPrizeStrategyExternalErc20AwardsArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<MultipleWinnersExternalErc20Award_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<MultipleWinnersExternalErc20Award_Filter>;
};

export type MultipleWinnersPrizeStrategyExternalErc721AwardsArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<MultipleWinnersExternalErc721Award_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<MultipleWinnersExternalErc721Award_Filter>;
};

export type MultipleWinnersPrizeStrategyPrizeSplitsArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<PrizeSplit_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<PrizeSplit_Filter>;
};

export type MultipleWinnersPrizeStrategy_Filter = {
  blockListedAddresses?: InputMaybe<Array<Scalars["Bytes"]>>;
  blockListedAddresses_contains?: InputMaybe<Array<Scalars["Bytes"]>>;
  blockListedAddresses_not?: InputMaybe<Array<Scalars["Bytes"]>>;
  blockListedAddresses_not_contains?: InputMaybe<Array<Scalars["Bytes"]>>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  numberOfWinners?: InputMaybe<Scalars["BigInt"]>;
  numberOfWinners_gt?: InputMaybe<Scalars["BigInt"]>;
  numberOfWinners_gte?: InputMaybe<Scalars["BigInt"]>;
  numberOfWinners_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  numberOfWinners_lt?: InputMaybe<Scalars["BigInt"]>;
  numberOfWinners_lte?: InputMaybe<Scalars["BigInt"]>;
  numberOfWinners_not?: InputMaybe<Scalars["BigInt"]>;
  numberOfWinners_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  owner?: InputMaybe<Scalars["Bytes"]>;
  owner_contains?: InputMaybe<Scalars["Bytes"]>;
  owner_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  owner_not?: InputMaybe<Scalars["Bytes"]>;
  owner_not_contains?: InputMaybe<Scalars["Bytes"]>;
  owner_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  prizePeriodEndAt?: InputMaybe<Scalars["BigInt"]>;
  prizePeriodEndAt_gt?: InputMaybe<Scalars["BigInt"]>;
  prizePeriodEndAt_gte?: InputMaybe<Scalars["BigInt"]>;
  prizePeriodEndAt_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  prizePeriodEndAt_lt?: InputMaybe<Scalars["BigInt"]>;
  prizePeriodEndAt_lte?: InputMaybe<Scalars["BigInt"]>;
  prizePeriodEndAt_not?: InputMaybe<Scalars["BigInt"]>;
  prizePeriodEndAt_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  prizePeriodSeconds?: InputMaybe<Scalars["BigInt"]>;
  prizePeriodSeconds_gt?: InputMaybe<Scalars["BigInt"]>;
  prizePeriodSeconds_gte?: InputMaybe<Scalars["BigInt"]>;
  prizePeriodSeconds_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  prizePeriodSeconds_lt?: InputMaybe<Scalars["BigInt"]>;
  prizePeriodSeconds_lte?: InputMaybe<Scalars["BigInt"]>;
  prizePeriodSeconds_not?: InputMaybe<Scalars["BigInt"]>;
  prizePeriodSeconds_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  prizePeriodStartedAt?: InputMaybe<Scalars["BigInt"]>;
  prizePeriodStartedAt_gt?: InputMaybe<Scalars["BigInt"]>;
  prizePeriodStartedAt_gte?: InputMaybe<Scalars["BigInt"]>;
  prizePeriodStartedAt_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  prizePeriodStartedAt_lt?: InputMaybe<Scalars["BigInt"]>;
  prizePeriodStartedAt_lte?: InputMaybe<Scalars["BigInt"]>;
  prizePeriodStartedAt_not?: InputMaybe<Scalars["BigInt"]>;
  prizePeriodStartedAt_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  prizePool?: InputMaybe<Scalars["String"]>;
  prizePool_contains?: InputMaybe<Scalars["String"]>;
  prizePool_ends_with?: InputMaybe<Scalars["String"]>;
  prizePool_gt?: InputMaybe<Scalars["String"]>;
  prizePool_gte?: InputMaybe<Scalars["String"]>;
  prizePool_in?: InputMaybe<Array<Scalars["String"]>>;
  prizePool_lt?: InputMaybe<Scalars["String"]>;
  prizePool_lte?: InputMaybe<Scalars["String"]>;
  prizePool_not?: InputMaybe<Scalars["String"]>;
  prizePool_not_contains?: InputMaybe<Scalars["String"]>;
  prizePool_not_ends_with?: InputMaybe<Scalars["String"]>;
  prizePool_not_in?: InputMaybe<Array<Scalars["String"]>>;
  prizePool_not_starts_with?: InputMaybe<Scalars["String"]>;
  prizePool_starts_with?: InputMaybe<Scalars["String"]>;
  rng?: InputMaybe<Scalars["Bytes"]>;
  rng_contains?: InputMaybe<Scalars["Bytes"]>;
  rng_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  rng_not?: InputMaybe<Scalars["Bytes"]>;
  rng_not_contains?: InputMaybe<Scalars["Bytes"]>;
  rng_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  splitExternalERC20Awards?: InputMaybe<Scalars["Boolean"]>;
  splitExternalERC20Awards_in?: InputMaybe<Array<Scalars["Boolean"]>>;
  splitExternalERC20Awards_not?: InputMaybe<Scalars["Boolean"]>;
  splitExternalERC20Awards_not_in?: InputMaybe<Array<Scalars["Boolean"]>>;
  sponsorship?: InputMaybe<Scalars["String"]>;
  sponsorship_contains?: InputMaybe<Scalars["String"]>;
  sponsorship_ends_with?: InputMaybe<Scalars["String"]>;
  sponsorship_gt?: InputMaybe<Scalars["String"]>;
  sponsorship_gte?: InputMaybe<Scalars["String"]>;
  sponsorship_in?: InputMaybe<Array<Scalars["String"]>>;
  sponsorship_lt?: InputMaybe<Scalars["String"]>;
  sponsorship_lte?: InputMaybe<Scalars["String"]>;
  sponsorship_not?: InputMaybe<Scalars["String"]>;
  sponsorship_not_contains?: InputMaybe<Scalars["String"]>;
  sponsorship_not_ends_with?: InputMaybe<Scalars["String"]>;
  sponsorship_not_in?: InputMaybe<Array<Scalars["String"]>>;
  sponsorship_not_starts_with?: InputMaybe<Scalars["String"]>;
  sponsorship_starts_with?: InputMaybe<Scalars["String"]>;
  ticket?: InputMaybe<Scalars["String"]>;
  ticket_contains?: InputMaybe<Scalars["String"]>;
  ticket_ends_with?: InputMaybe<Scalars["String"]>;
  ticket_gt?: InputMaybe<Scalars["String"]>;
  ticket_gte?: InputMaybe<Scalars["String"]>;
  ticket_in?: InputMaybe<Array<Scalars["String"]>>;
  ticket_lt?: InputMaybe<Scalars["String"]>;
  ticket_lte?: InputMaybe<Scalars["String"]>;
  ticket_not?: InputMaybe<Scalars["String"]>;
  ticket_not_contains?: InputMaybe<Scalars["String"]>;
  ticket_not_ends_with?: InputMaybe<Scalars["String"]>;
  ticket_not_in?: InputMaybe<Array<Scalars["String"]>>;
  ticket_not_starts_with?: InputMaybe<Scalars["String"]>;
  ticket_starts_with?: InputMaybe<Scalars["String"]>;
  tokenListener?: InputMaybe<Scalars["Bytes"]>;
  tokenListener_contains?: InputMaybe<Scalars["Bytes"]>;
  tokenListener_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  tokenListener_not?: InputMaybe<Scalars["Bytes"]>;
  tokenListener_not_contains?: InputMaybe<Scalars["Bytes"]>;
  tokenListener_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
};

export enum MultipleWinnersPrizeStrategy_OrderBy {
  BlockListedAddresses = "blockListedAddresses",
  ExternalErc20Awards = "externalErc20Awards",
  ExternalErc721Awards = "externalErc721Awards",
  Id = "id",
  NumberOfWinners = "numberOfWinners",
  Owner = "owner",
  PrizePeriodEndAt = "prizePeriodEndAt",
  PrizePeriodSeconds = "prizePeriodSeconds",
  PrizePeriodStartedAt = "prizePeriodStartedAt",
  PrizePool = "prizePool",
  PrizeSplits = "prizeSplits",
  Rng = "rng",
  SplitExternalErc20Awards = "splitExternalERC20Awards",
  Sponsorship = "sponsorship",
  Ticket = "ticket",
  TokenListener = "tokenListener",
}

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = "asc",
  Desc = "desc",
}

export type Prize = {
  __typename?: "Prize";
  awardStartOperator?: Maybe<Scalars["Bytes"]>;
  awardedBlock?: Maybe<Scalars["BigInt"]>;
  awardedControlledTokens: Array<AwardedControlledToken>;
  awardedExternalErc20Tokens: Array<AwardedExternalErc20Token>;
  awardedExternalErc721Nfts: Array<AwardedExternalErc721Nft>;
  awardedOperator?: Maybe<Scalars["Bytes"]>;
  awardedTimestamp?: Maybe<Scalars["BigInt"]>;
  id: Scalars["ID"];
  lockBlock?: Maybe<Scalars["BigInt"]>;
  numberOfExternalAwardedErc20Winners?: Maybe<Scalars["BigInt"]>;
  numberOfSubWinners?: Maybe<Scalars["BigInt"]>;
  prizePeriodStartedTimestamp?: Maybe<Scalars["BigInt"]>;
  prizePool: PrizePool;
  randomNumber?: Maybe<Scalars["BigInt"]>;
  rngRequestId?: Maybe<Scalars["BigInt"]>;
  totalTicketSupply?: Maybe<Scalars["BigInt"]>;
};

export type PrizeAwardedControlledTokensArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<AwardedControlledToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<AwardedControlledToken_Filter>;
};

export type PrizeAwardedExternalErc20TokensArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<AwardedExternalErc20Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<AwardedExternalErc20Token_Filter>;
};

export type PrizeAwardedExternalErc721NftsArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<AwardedExternalErc721Nft_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<AwardedExternalErc721Nft_Filter>;
};

export type PrizePool = {
  __typename?: "PrizePool";
  compoundPrizePool?: Maybe<CompoundPrizePool>;
  controlledTokens: Array<ControlledToken>;
  cumulativePrizeGross: Scalars["BigInt"];
  cumulativePrizeNet: Scalars["BigInt"];
  cumulativePrizeReserveFee: Scalars["BigInt"];
  currentPrizeId: Scalars["BigInt"];
  currentState: PrizePoolState;
  deactivated: Scalars["Boolean"];
  id: Scalars["ID"];
  liquidityCap: Scalars["BigInt"];
  maxExitFeeMantissa: Scalars["BigInt"];
  owner?: Maybe<Scalars["Bytes"]>;
  prizePoolAccounts: Array<PrizePoolAccount>;
  prizePoolType?: Maybe<PrizePoolType>;
  prizeStrategy?: Maybe<PrizeStrategy>;
  prizes: Array<Prize>;
  reserveFeeControlledToken: Scalars["Bytes"];
  reserveRegistry?: Maybe<Scalars["Bytes"]>;
  sablierStream?: Maybe<SablierStream>;
  stakePrizePool?: Maybe<StakePrizePool>;
  tokenCreditBalances: Array<CreditBalance>;
  tokenCreditRates: Array<CreditRate>;
  underlyingCollateralDecimals?: Maybe<Scalars["BigInt"]>;
  underlyingCollateralName?: Maybe<Scalars["String"]>;
  underlyingCollateralSymbol?: Maybe<Scalars["String"]>;
  underlyingCollateralToken?: Maybe<Scalars["Bytes"]>;
  yieldSourcePrizePool?: Maybe<YieldSourcePrizePool>;
};

export type PrizePoolControlledTokensArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ControlledToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<ControlledToken_Filter>;
};

export type PrizePoolPrizePoolAccountsArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<PrizePoolAccount_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<PrizePoolAccount_Filter>;
};

export type PrizePoolPrizesArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Prize_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<Prize_Filter>;
};

export type PrizePoolTokenCreditBalancesArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<CreditBalance_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<CreditBalance_Filter>;
};

export type PrizePoolTokenCreditRatesArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<CreditRate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<CreditRate_Filter>;
};

export type PrizePoolAccount = {
  __typename?: "PrizePoolAccount";
  account: Account;
  id: Scalars["ID"];
  prizePool: PrizePool;
};

export type PrizePoolAccount_Filter = {
  account?: InputMaybe<Scalars["String"]>;
  account_contains?: InputMaybe<Scalars["String"]>;
  account_ends_with?: InputMaybe<Scalars["String"]>;
  account_gt?: InputMaybe<Scalars["String"]>;
  account_gte?: InputMaybe<Scalars["String"]>;
  account_in?: InputMaybe<Array<Scalars["String"]>>;
  account_lt?: InputMaybe<Scalars["String"]>;
  account_lte?: InputMaybe<Scalars["String"]>;
  account_not?: InputMaybe<Scalars["String"]>;
  account_not_contains?: InputMaybe<Scalars["String"]>;
  account_not_ends_with?: InputMaybe<Scalars["String"]>;
  account_not_in?: InputMaybe<Array<Scalars["String"]>>;
  account_not_starts_with?: InputMaybe<Scalars["String"]>;
  account_starts_with?: InputMaybe<Scalars["String"]>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  prizePool?: InputMaybe<Scalars["String"]>;
  prizePool_contains?: InputMaybe<Scalars["String"]>;
  prizePool_ends_with?: InputMaybe<Scalars["String"]>;
  prizePool_gt?: InputMaybe<Scalars["String"]>;
  prizePool_gte?: InputMaybe<Scalars["String"]>;
  prizePool_in?: InputMaybe<Array<Scalars["String"]>>;
  prizePool_lt?: InputMaybe<Scalars["String"]>;
  prizePool_lte?: InputMaybe<Scalars["String"]>;
  prizePool_not?: InputMaybe<Scalars["String"]>;
  prizePool_not_contains?: InputMaybe<Scalars["String"]>;
  prizePool_not_ends_with?: InputMaybe<Scalars["String"]>;
  prizePool_not_in?: InputMaybe<Array<Scalars["String"]>>;
  prizePool_not_starts_with?: InputMaybe<Scalars["String"]>;
  prizePool_starts_with?: InputMaybe<Scalars["String"]>;
};

export enum PrizePoolAccount_OrderBy {
  Account = "account",
  Id = "id",
  PrizePool = "prizePool",
}

export enum PrizePoolState {
  Awarded = "Awarded",
  Opened = "Opened",
  Started = "Started",
}

export enum PrizePoolType {
  Compound = "Compound",
  Stake = "Stake",
  YieldSource = "YieldSource",
  YVault = "yVault",
}

export type PrizePool_Filter = {
  compoundPrizePool?: InputMaybe<Scalars["String"]>;
  compoundPrizePool_contains?: InputMaybe<Scalars["String"]>;
  compoundPrizePool_ends_with?: InputMaybe<Scalars["String"]>;
  compoundPrizePool_gt?: InputMaybe<Scalars["String"]>;
  compoundPrizePool_gte?: InputMaybe<Scalars["String"]>;
  compoundPrizePool_in?: InputMaybe<Array<Scalars["String"]>>;
  compoundPrizePool_lt?: InputMaybe<Scalars["String"]>;
  compoundPrizePool_lte?: InputMaybe<Scalars["String"]>;
  compoundPrizePool_not?: InputMaybe<Scalars["String"]>;
  compoundPrizePool_not_contains?: InputMaybe<Scalars["String"]>;
  compoundPrizePool_not_ends_with?: InputMaybe<Scalars["String"]>;
  compoundPrizePool_not_in?: InputMaybe<Array<Scalars["String"]>>;
  compoundPrizePool_not_starts_with?: InputMaybe<Scalars["String"]>;
  compoundPrizePool_starts_with?: InputMaybe<Scalars["String"]>;
  cumulativePrizeGross?: InputMaybe<Scalars["BigInt"]>;
  cumulativePrizeGross_gt?: InputMaybe<Scalars["BigInt"]>;
  cumulativePrizeGross_gte?: InputMaybe<Scalars["BigInt"]>;
  cumulativePrizeGross_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  cumulativePrizeGross_lt?: InputMaybe<Scalars["BigInt"]>;
  cumulativePrizeGross_lte?: InputMaybe<Scalars["BigInt"]>;
  cumulativePrizeGross_not?: InputMaybe<Scalars["BigInt"]>;
  cumulativePrizeGross_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  cumulativePrizeNet?: InputMaybe<Scalars["BigInt"]>;
  cumulativePrizeNet_gt?: InputMaybe<Scalars["BigInt"]>;
  cumulativePrizeNet_gte?: InputMaybe<Scalars["BigInt"]>;
  cumulativePrizeNet_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  cumulativePrizeNet_lt?: InputMaybe<Scalars["BigInt"]>;
  cumulativePrizeNet_lte?: InputMaybe<Scalars["BigInt"]>;
  cumulativePrizeNet_not?: InputMaybe<Scalars["BigInt"]>;
  cumulativePrizeNet_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  cumulativePrizeReserveFee?: InputMaybe<Scalars["BigInt"]>;
  cumulativePrizeReserveFee_gt?: InputMaybe<Scalars["BigInt"]>;
  cumulativePrizeReserveFee_gte?: InputMaybe<Scalars["BigInt"]>;
  cumulativePrizeReserveFee_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  cumulativePrizeReserveFee_lt?: InputMaybe<Scalars["BigInt"]>;
  cumulativePrizeReserveFee_lte?: InputMaybe<Scalars["BigInt"]>;
  cumulativePrizeReserveFee_not?: InputMaybe<Scalars["BigInt"]>;
  cumulativePrizeReserveFee_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  currentPrizeId?: InputMaybe<Scalars["BigInt"]>;
  currentPrizeId_gt?: InputMaybe<Scalars["BigInt"]>;
  currentPrizeId_gte?: InputMaybe<Scalars["BigInt"]>;
  currentPrizeId_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  currentPrizeId_lt?: InputMaybe<Scalars["BigInt"]>;
  currentPrizeId_lte?: InputMaybe<Scalars["BigInt"]>;
  currentPrizeId_not?: InputMaybe<Scalars["BigInt"]>;
  currentPrizeId_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  currentState?: InputMaybe<PrizePoolState>;
  currentState_in?: InputMaybe<Array<PrizePoolState>>;
  currentState_not?: InputMaybe<PrizePoolState>;
  currentState_not_in?: InputMaybe<Array<PrizePoolState>>;
  deactivated?: InputMaybe<Scalars["Boolean"]>;
  deactivated_in?: InputMaybe<Array<Scalars["Boolean"]>>;
  deactivated_not?: InputMaybe<Scalars["Boolean"]>;
  deactivated_not_in?: InputMaybe<Array<Scalars["Boolean"]>>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  liquidityCap?: InputMaybe<Scalars["BigInt"]>;
  liquidityCap_gt?: InputMaybe<Scalars["BigInt"]>;
  liquidityCap_gte?: InputMaybe<Scalars["BigInt"]>;
  liquidityCap_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  liquidityCap_lt?: InputMaybe<Scalars["BigInt"]>;
  liquidityCap_lte?: InputMaybe<Scalars["BigInt"]>;
  liquidityCap_not?: InputMaybe<Scalars["BigInt"]>;
  liquidityCap_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  maxExitFeeMantissa?: InputMaybe<Scalars["BigInt"]>;
  maxExitFeeMantissa_gt?: InputMaybe<Scalars["BigInt"]>;
  maxExitFeeMantissa_gte?: InputMaybe<Scalars["BigInt"]>;
  maxExitFeeMantissa_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  maxExitFeeMantissa_lt?: InputMaybe<Scalars["BigInt"]>;
  maxExitFeeMantissa_lte?: InputMaybe<Scalars["BigInt"]>;
  maxExitFeeMantissa_not?: InputMaybe<Scalars["BigInt"]>;
  maxExitFeeMantissa_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  owner?: InputMaybe<Scalars["Bytes"]>;
  owner_contains?: InputMaybe<Scalars["Bytes"]>;
  owner_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  owner_not?: InputMaybe<Scalars["Bytes"]>;
  owner_not_contains?: InputMaybe<Scalars["Bytes"]>;
  owner_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  prizePoolType?: InputMaybe<PrizePoolType>;
  prizePoolType_in?: InputMaybe<Array<PrizePoolType>>;
  prizePoolType_not?: InputMaybe<PrizePoolType>;
  prizePoolType_not_in?: InputMaybe<Array<PrizePoolType>>;
  prizeStrategy?: InputMaybe<Scalars["String"]>;
  prizeStrategy_contains?: InputMaybe<Scalars["String"]>;
  prizeStrategy_ends_with?: InputMaybe<Scalars["String"]>;
  prizeStrategy_gt?: InputMaybe<Scalars["String"]>;
  prizeStrategy_gte?: InputMaybe<Scalars["String"]>;
  prizeStrategy_in?: InputMaybe<Array<Scalars["String"]>>;
  prizeStrategy_lt?: InputMaybe<Scalars["String"]>;
  prizeStrategy_lte?: InputMaybe<Scalars["String"]>;
  prizeStrategy_not?: InputMaybe<Scalars["String"]>;
  prizeStrategy_not_contains?: InputMaybe<Scalars["String"]>;
  prizeStrategy_not_ends_with?: InputMaybe<Scalars["String"]>;
  prizeStrategy_not_in?: InputMaybe<Array<Scalars["String"]>>;
  prizeStrategy_not_starts_with?: InputMaybe<Scalars["String"]>;
  prizeStrategy_starts_with?: InputMaybe<Scalars["String"]>;
  reserveFeeControlledToken?: InputMaybe<Scalars["Bytes"]>;
  reserveFeeControlledToken_contains?: InputMaybe<Scalars["Bytes"]>;
  reserveFeeControlledToken_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  reserveFeeControlledToken_not?: InputMaybe<Scalars["Bytes"]>;
  reserveFeeControlledToken_not_contains?: InputMaybe<Scalars["Bytes"]>;
  reserveFeeControlledToken_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  reserveRegistry?: InputMaybe<Scalars["Bytes"]>;
  reserveRegistry_contains?: InputMaybe<Scalars["Bytes"]>;
  reserveRegistry_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  reserveRegistry_not?: InputMaybe<Scalars["Bytes"]>;
  reserveRegistry_not_contains?: InputMaybe<Scalars["Bytes"]>;
  reserveRegistry_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  stakePrizePool?: InputMaybe<Scalars["String"]>;
  stakePrizePool_contains?: InputMaybe<Scalars["String"]>;
  stakePrizePool_ends_with?: InputMaybe<Scalars["String"]>;
  stakePrizePool_gt?: InputMaybe<Scalars["String"]>;
  stakePrizePool_gte?: InputMaybe<Scalars["String"]>;
  stakePrizePool_in?: InputMaybe<Array<Scalars["String"]>>;
  stakePrizePool_lt?: InputMaybe<Scalars["String"]>;
  stakePrizePool_lte?: InputMaybe<Scalars["String"]>;
  stakePrizePool_not?: InputMaybe<Scalars["String"]>;
  stakePrizePool_not_contains?: InputMaybe<Scalars["String"]>;
  stakePrizePool_not_ends_with?: InputMaybe<Scalars["String"]>;
  stakePrizePool_not_in?: InputMaybe<Array<Scalars["String"]>>;
  stakePrizePool_not_starts_with?: InputMaybe<Scalars["String"]>;
  stakePrizePool_starts_with?: InputMaybe<Scalars["String"]>;
  underlyingCollateralDecimals?: InputMaybe<Scalars["BigInt"]>;
  underlyingCollateralDecimals_gt?: InputMaybe<Scalars["BigInt"]>;
  underlyingCollateralDecimals_gte?: InputMaybe<Scalars["BigInt"]>;
  underlyingCollateralDecimals_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  underlyingCollateralDecimals_lt?: InputMaybe<Scalars["BigInt"]>;
  underlyingCollateralDecimals_lte?: InputMaybe<Scalars["BigInt"]>;
  underlyingCollateralDecimals_not?: InputMaybe<Scalars["BigInt"]>;
  underlyingCollateralDecimals_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  underlyingCollateralName?: InputMaybe<Scalars["String"]>;
  underlyingCollateralName_contains?: InputMaybe<Scalars["String"]>;
  underlyingCollateralName_ends_with?: InputMaybe<Scalars["String"]>;
  underlyingCollateralName_gt?: InputMaybe<Scalars["String"]>;
  underlyingCollateralName_gte?: InputMaybe<Scalars["String"]>;
  underlyingCollateralName_in?: InputMaybe<Array<Scalars["String"]>>;
  underlyingCollateralName_lt?: InputMaybe<Scalars["String"]>;
  underlyingCollateralName_lte?: InputMaybe<Scalars["String"]>;
  underlyingCollateralName_not?: InputMaybe<Scalars["String"]>;
  underlyingCollateralName_not_contains?: InputMaybe<Scalars["String"]>;
  underlyingCollateralName_not_ends_with?: InputMaybe<Scalars["String"]>;
  underlyingCollateralName_not_in?: InputMaybe<Array<Scalars["String"]>>;
  underlyingCollateralName_not_starts_with?: InputMaybe<Scalars["String"]>;
  underlyingCollateralName_starts_with?: InputMaybe<Scalars["String"]>;
  underlyingCollateralSymbol?: InputMaybe<Scalars["String"]>;
  underlyingCollateralSymbol_contains?: InputMaybe<Scalars["String"]>;
  underlyingCollateralSymbol_ends_with?: InputMaybe<Scalars["String"]>;
  underlyingCollateralSymbol_gt?: InputMaybe<Scalars["String"]>;
  underlyingCollateralSymbol_gte?: InputMaybe<Scalars["String"]>;
  underlyingCollateralSymbol_in?: InputMaybe<Array<Scalars["String"]>>;
  underlyingCollateralSymbol_lt?: InputMaybe<Scalars["String"]>;
  underlyingCollateralSymbol_lte?: InputMaybe<Scalars["String"]>;
  underlyingCollateralSymbol_not?: InputMaybe<Scalars["String"]>;
  underlyingCollateralSymbol_not_contains?: InputMaybe<Scalars["String"]>;
  underlyingCollateralSymbol_not_ends_with?: InputMaybe<Scalars["String"]>;
  underlyingCollateralSymbol_not_in?: InputMaybe<Array<Scalars["String"]>>;
  underlyingCollateralSymbol_not_starts_with?: InputMaybe<Scalars["String"]>;
  underlyingCollateralSymbol_starts_with?: InputMaybe<Scalars["String"]>;
  underlyingCollateralToken?: InputMaybe<Scalars["Bytes"]>;
  underlyingCollateralToken_contains?: InputMaybe<Scalars["Bytes"]>;
  underlyingCollateralToken_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  underlyingCollateralToken_not?: InputMaybe<Scalars["Bytes"]>;
  underlyingCollateralToken_not_contains?: InputMaybe<Scalars["Bytes"]>;
  underlyingCollateralToken_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  yieldSourcePrizePool?: InputMaybe<Scalars["String"]>;
  yieldSourcePrizePool_contains?: InputMaybe<Scalars["String"]>;
  yieldSourcePrizePool_ends_with?: InputMaybe<Scalars["String"]>;
  yieldSourcePrizePool_gt?: InputMaybe<Scalars["String"]>;
  yieldSourcePrizePool_gte?: InputMaybe<Scalars["String"]>;
  yieldSourcePrizePool_in?: InputMaybe<Array<Scalars["String"]>>;
  yieldSourcePrizePool_lt?: InputMaybe<Scalars["String"]>;
  yieldSourcePrizePool_lte?: InputMaybe<Scalars["String"]>;
  yieldSourcePrizePool_not?: InputMaybe<Scalars["String"]>;
  yieldSourcePrizePool_not_contains?: InputMaybe<Scalars["String"]>;
  yieldSourcePrizePool_not_ends_with?: InputMaybe<Scalars["String"]>;
  yieldSourcePrizePool_not_in?: InputMaybe<Array<Scalars["String"]>>;
  yieldSourcePrizePool_not_starts_with?: InputMaybe<Scalars["String"]>;
  yieldSourcePrizePool_starts_with?: InputMaybe<Scalars["String"]>;
};

export enum PrizePool_OrderBy {
  CompoundPrizePool = "compoundPrizePool",
  ControlledTokens = "controlledTokens",
  CumulativePrizeGross = "cumulativePrizeGross",
  CumulativePrizeNet = "cumulativePrizeNet",
  CumulativePrizeReserveFee = "cumulativePrizeReserveFee",
  CurrentPrizeId = "currentPrizeId",
  CurrentState = "currentState",
  Deactivated = "deactivated",
  Id = "id",
  LiquidityCap = "liquidityCap",
  MaxExitFeeMantissa = "maxExitFeeMantissa",
  Owner = "owner",
  PrizePoolAccounts = "prizePoolAccounts",
  PrizePoolType = "prizePoolType",
  PrizeStrategy = "prizeStrategy",
  Prizes = "prizes",
  ReserveFeeControlledToken = "reserveFeeControlledToken",
  ReserveRegistry = "reserveRegistry",
  SablierStream = "sablierStream",
  StakePrizePool = "stakePrizePool",
  TokenCreditBalances = "tokenCreditBalances",
  TokenCreditRates = "tokenCreditRates",
  UnderlyingCollateralDecimals = "underlyingCollateralDecimals",
  UnderlyingCollateralName = "underlyingCollateralName",
  UnderlyingCollateralSymbol = "underlyingCollateralSymbol",
  UnderlyingCollateralToken = "underlyingCollateralToken",
  YieldSourcePrizePool = "yieldSourcePrizePool",
}

export type PrizeSplit = {
  __typename?: "PrizeSplit";
  id: Scalars["ID"];
  percentage: Scalars["BigInt"];
  prizeStrategy?: Maybe<MultipleWinnersPrizeStrategy>;
  target: Scalars["Bytes"];
  tokenType: Scalars["BigInt"];
};

export type PrizeSplit_Filter = {
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  percentage?: InputMaybe<Scalars["BigInt"]>;
  percentage_gt?: InputMaybe<Scalars["BigInt"]>;
  percentage_gte?: InputMaybe<Scalars["BigInt"]>;
  percentage_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  percentage_lt?: InputMaybe<Scalars["BigInt"]>;
  percentage_lte?: InputMaybe<Scalars["BigInt"]>;
  percentage_not?: InputMaybe<Scalars["BigInt"]>;
  percentage_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  prizeStrategy?: InputMaybe<Scalars["String"]>;
  prizeStrategy_contains?: InputMaybe<Scalars["String"]>;
  prizeStrategy_ends_with?: InputMaybe<Scalars["String"]>;
  prizeStrategy_gt?: InputMaybe<Scalars["String"]>;
  prizeStrategy_gte?: InputMaybe<Scalars["String"]>;
  prizeStrategy_in?: InputMaybe<Array<Scalars["String"]>>;
  prizeStrategy_lt?: InputMaybe<Scalars["String"]>;
  prizeStrategy_lte?: InputMaybe<Scalars["String"]>;
  prizeStrategy_not?: InputMaybe<Scalars["String"]>;
  prizeStrategy_not_contains?: InputMaybe<Scalars["String"]>;
  prizeStrategy_not_ends_with?: InputMaybe<Scalars["String"]>;
  prizeStrategy_not_in?: InputMaybe<Array<Scalars["String"]>>;
  prizeStrategy_not_starts_with?: InputMaybe<Scalars["String"]>;
  prizeStrategy_starts_with?: InputMaybe<Scalars["String"]>;
  target?: InputMaybe<Scalars["Bytes"]>;
  target_contains?: InputMaybe<Scalars["Bytes"]>;
  target_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  target_not?: InputMaybe<Scalars["Bytes"]>;
  target_not_contains?: InputMaybe<Scalars["Bytes"]>;
  target_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  tokenType?: InputMaybe<Scalars["BigInt"]>;
  tokenType_gt?: InputMaybe<Scalars["BigInt"]>;
  tokenType_gte?: InputMaybe<Scalars["BigInt"]>;
  tokenType_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  tokenType_lt?: InputMaybe<Scalars["BigInt"]>;
  tokenType_lte?: InputMaybe<Scalars["BigInt"]>;
  tokenType_not?: InputMaybe<Scalars["BigInt"]>;
  tokenType_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
};

export enum PrizeSplit_OrderBy {
  Id = "id",
  Percentage = "percentage",
  PrizeStrategy = "prizeStrategy",
  Target = "target",
  TokenType = "tokenType",
}

export type PrizeStrategy = {
  __typename?: "PrizeStrategy";
  id: Scalars["ID"];
  multipleWinners?: Maybe<MultipleWinnersPrizeStrategy>;
  singleRandomWinner?: Maybe<SingleRandomWinnerPrizeStrategy>;
};

export type PrizeStrategy_Filter = {
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  multipleWinners?: InputMaybe<Scalars["String"]>;
  multipleWinners_contains?: InputMaybe<Scalars["String"]>;
  multipleWinners_ends_with?: InputMaybe<Scalars["String"]>;
  multipleWinners_gt?: InputMaybe<Scalars["String"]>;
  multipleWinners_gte?: InputMaybe<Scalars["String"]>;
  multipleWinners_in?: InputMaybe<Array<Scalars["String"]>>;
  multipleWinners_lt?: InputMaybe<Scalars["String"]>;
  multipleWinners_lte?: InputMaybe<Scalars["String"]>;
  multipleWinners_not?: InputMaybe<Scalars["String"]>;
  multipleWinners_not_contains?: InputMaybe<Scalars["String"]>;
  multipleWinners_not_ends_with?: InputMaybe<Scalars["String"]>;
  multipleWinners_not_in?: InputMaybe<Array<Scalars["String"]>>;
  multipleWinners_not_starts_with?: InputMaybe<Scalars["String"]>;
  multipleWinners_starts_with?: InputMaybe<Scalars["String"]>;
  singleRandomWinner?: InputMaybe<Scalars["String"]>;
  singleRandomWinner_contains?: InputMaybe<Scalars["String"]>;
  singleRandomWinner_ends_with?: InputMaybe<Scalars["String"]>;
  singleRandomWinner_gt?: InputMaybe<Scalars["String"]>;
  singleRandomWinner_gte?: InputMaybe<Scalars["String"]>;
  singleRandomWinner_in?: InputMaybe<Array<Scalars["String"]>>;
  singleRandomWinner_lt?: InputMaybe<Scalars["String"]>;
  singleRandomWinner_lte?: InputMaybe<Scalars["String"]>;
  singleRandomWinner_not?: InputMaybe<Scalars["String"]>;
  singleRandomWinner_not_contains?: InputMaybe<Scalars["String"]>;
  singleRandomWinner_not_ends_with?: InputMaybe<Scalars["String"]>;
  singleRandomWinner_not_in?: InputMaybe<Array<Scalars["String"]>>;
  singleRandomWinner_not_starts_with?: InputMaybe<Scalars["String"]>;
  singleRandomWinner_starts_with?: InputMaybe<Scalars["String"]>;
};

export enum PrizeStrategy_OrderBy {
  Id = "id",
  MultipleWinners = "multipleWinners",
  SingleRandomWinner = "singleRandomWinner",
}

export type Prize_Filter = {
  awardStartOperator?: InputMaybe<Scalars["Bytes"]>;
  awardStartOperator_contains?: InputMaybe<Scalars["Bytes"]>;
  awardStartOperator_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  awardStartOperator_not?: InputMaybe<Scalars["Bytes"]>;
  awardStartOperator_not_contains?: InputMaybe<Scalars["Bytes"]>;
  awardStartOperator_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  awardedBlock?: InputMaybe<Scalars["BigInt"]>;
  awardedBlock_gt?: InputMaybe<Scalars["BigInt"]>;
  awardedBlock_gte?: InputMaybe<Scalars["BigInt"]>;
  awardedBlock_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  awardedBlock_lt?: InputMaybe<Scalars["BigInt"]>;
  awardedBlock_lte?: InputMaybe<Scalars["BigInt"]>;
  awardedBlock_not?: InputMaybe<Scalars["BigInt"]>;
  awardedBlock_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  awardedOperator?: InputMaybe<Scalars["Bytes"]>;
  awardedOperator_contains?: InputMaybe<Scalars["Bytes"]>;
  awardedOperator_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  awardedOperator_not?: InputMaybe<Scalars["Bytes"]>;
  awardedOperator_not_contains?: InputMaybe<Scalars["Bytes"]>;
  awardedOperator_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  awardedTimestamp?: InputMaybe<Scalars["BigInt"]>;
  awardedTimestamp_gt?: InputMaybe<Scalars["BigInt"]>;
  awardedTimestamp_gte?: InputMaybe<Scalars["BigInt"]>;
  awardedTimestamp_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  awardedTimestamp_lt?: InputMaybe<Scalars["BigInt"]>;
  awardedTimestamp_lte?: InputMaybe<Scalars["BigInt"]>;
  awardedTimestamp_not?: InputMaybe<Scalars["BigInt"]>;
  awardedTimestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  lockBlock?: InputMaybe<Scalars["BigInt"]>;
  lockBlock_gt?: InputMaybe<Scalars["BigInt"]>;
  lockBlock_gte?: InputMaybe<Scalars["BigInt"]>;
  lockBlock_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  lockBlock_lt?: InputMaybe<Scalars["BigInt"]>;
  lockBlock_lte?: InputMaybe<Scalars["BigInt"]>;
  lockBlock_not?: InputMaybe<Scalars["BigInt"]>;
  lockBlock_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  numberOfExternalAwardedErc20Winners?: InputMaybe<Scalars["BigInt"]>;
  numberOfExternalAwardedErc20Winners_gt?: InputMaybe<Scalars["BigInt"]>;
  numberOfExternalAwardedErc20Winners_gte?: InputMaybe<Scalars["BigInt"]>;
  numberOfExternalAwardedErc20Winners_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  numberOfExternalAwardedErc20Winners_lt?: InputMaybe<Scalars["BigInt"]>;
  numberOfExternalAwardedErc20Winners_lte?: InputMaybe<Scalars["BigInt"]>;
  numberOfExternalAwardedErc20Winners_not?: InputMaybe<Scalars["BigInt"]>;
  numberOfExternalAwardedErc20Winners_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  numberOfSubWinners?: InputMaybe<Scalars["BigInt"]>;
  numberOfSubWinners_gt?: InputMaybe<Scalars["BigInt"]>;
  numberOfSubWinners_gte?: InputMaybe<Scalars["BigInt"]>;
  numberOfSubWinners_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  numberOfSubWinners_lt?: InputMaybe<Scalars["BigInt"]>;
  numberOfSubWinners_lte?: InputMaybe<Scalars["BigInt"]>;
  numberOfSubWinners_not?: InputMaybe<Scalars["BigInt"]>;
  numberOfSubWinners_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  prizePeriodStartedTimestamp?: InputMaybe<Scalars["BigInt"]>;
  prizePeriodStartedTimestamp_gt?: InputMaybe<Scalars["BigInt"]>;
  prizePeriodStartedTimestamp_gte?: InputMaybe<Scalars["BigInt"]>;
  prizePeriodStartedTimestamp_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  prizePeriodStartedTimestamp_lt?: InputMaybe<Scalars["BigInt"]>;
  prizePeriodStartedTimestamp_lte?: InputMaybe<Scalars["BigInt"]>;
  prizePeriodStartedTimestamp_not?: InputMaybe<Scalars["BigInt"]>;
  prizePeriodStartedTimestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  prizePool?: InputMaybe<Scalars["String"]>;
  prizePool_contains?: InputMaybe<Scalars["String"]>;
  prizePool_ends_with?: InputMaybe<Scalars["String"]>;
  prizePool_gt?: InputMaybe<Scalars["String"]>;
  prizePool_gte?: InputMaybe<Scalars["String"]>;
  prizePool_in?: InputMaybe<Array<Scalars["String"]>>;
  prizePool_lt?: InputMaybe<Scalars["String"]>;
  prizePool_lte?: InputMaybe<Scalars["String"]>;
  prizePool_not?: InputMaybe<Scalars["String"]>;
  prizePool_not_contains?: InputMaybe<Scalars["String"]>;
  prizePool_not_ends_with?: InputMaybe<Scalars["String"]>;
  prizePool_not_in?: InputMaybe<Array<Scalars["String"]>>;
  prizePool_not_starts_with?: InputMaybe<Scalars["String"]>;
  prizePool_starts_with?: InputMaybe<Scalars["String"]>;
  randomNumber?: InputMaybe<Scalars["BigInt"]>;
  randomNumber_gt?: InputMaybe<Scalars["BigInt"]>;
  randomNumber_gte?: InputMaybe<Scalars["BigInt"]>;
  randomNumber_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  randomNumber_lt?: InputMaybe<Scalars["BigInt"]>;
  randomNumber_lte?: InputMaybe<Scalars["BigInt"]>;
  randomNumber_not?: InputMaybe<Scalars["BigInt"]>;
  randomNumber_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  rngRequestId?: InputMaybe<Scalars["BigInt"]>;
  rngRequestId_gt?: InputMaybe<Scalars["BigInt"]>;
  rngRequestId_gte?: InputMaybe<Scalars["BigInt"]>;
  rngRequestId_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  rngRequestId_lt?: InputMaybe<Scalars["BigInt"]>;
  rngRequestId_lte?: InputMaybe<Scalars["BigInt"]>;
  rngRequestId_not?: InputMaybe<Scalars["BigInt"]>;
  rngRequestId_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  totalTicketSupply?: InputMaybe<Scalars["BigInt"]>;
  totalTicketSupply_gt?: InputMaybe<Scalars["BigInt"]>;
  totalTicketSupply_gte?: InputMaybe<Scalars["BigInt"]>;
  totalTicketSupply_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  totalTicketSupply_lt?: InputMaybe<Scalars["BigInt"]>;
  totalTicketSupply_lte?: InputMaybe<Scalars["BigInt"]>;
  totalTicketSupply_not?: InputMaybe<Scalars["BigInt"]>;
  totalTicketSupply_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
};

export enum Prize_OrderBy {
  AwardStartOperator = "awardStartOperator",
  AwardedBlock = "awardedBlock",
  AwardedControlledTokens = "awardedControlledTokens",
  AwardedExternalErc20Tokens = "awardedExternalErc20Tokens",
  AwardedExternalErc721Nfts = "awardedExternalErc721Nfts",
  AwardedOperator = "awardedOperator",
  AwardedTimestamp = "awardedTimestamp",
  Id = "id",
  LockBlock = "lockBlock",
  NumberOfExternalAwardedErc20Winners = "numberOfExternalAwardedErc20Winners",
  NumberOfSubWinners = "numberOfSubWinners",
  PrizePeriodStartedTimestamp = "prizePeriodStartedTimestamp",
  PrizePool = "prizePool",
  RandomNumber = "randomNumber",
  RngRequestId = "rngRequestId",
  TotalTicketSupply = "totalTicketSupply",
}

export type Query = {
  __typename?: "Query";
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  account?: Maybe<Account>;
  accounts: Array<Account>;
  awardedControlledToken?: Maybe<AwardedControlledToken>;
  awardedControlledTokens: Array<AwardedControlledToken>;
  awardedExternalErc20Token?: Maybe<AwardedExternalErc20Token>;
  awardedExternalErc20Tokens: Array<AwardedExternalErc20Token>;
  awardedExternalErc721Nft?: Maybe<AwardedExternalErc721Nft>;
  awardedExternalErc721Nfts: Array<AwardedExternalErc721Nft>;
  balanceDrip?: Maybe<BalanceDrip>;
  balanceDripPlayer?: Maybe<BalanceDripPlayer>;
  balanceDripPlayers: Array<BalanceDripPlayer>;
  balanceDrips: Array<BalanceDrip>;
  compoundPrizePool?: Maybe<CompoundPrizePool>;
  compoundPrizePools: Array<CompoundPrizePool>;
  comptroller?: Maybe<Comptroller>;
  comptrollers: Array<Comptroller>;
  controlledToken?: Maybe<ControlledToken>;
  controlledTokenBalance?: Maybe<ControlledTokenBalance>;
  controlledTokenBalances: Array<ControlledTokenBalance>;
  controlledTokens: Array<ControlledToken>;
  creditBalance?: Maybe<CreditBalance>;
  creditBalances: Array<CreditBalance>;
  creditRate?: Maybe<CreditRate>;
  creditRates: Array<CreditRate>;
  dripTokenPlayer?: Maybe<DripTokenPlayer>;
  dripTokenPlayers: Array<DripTokenPlayer>;
  multipleWinnersExternalErc20Award?: Maybe<MultipleWinnersExternalErc20Award>;
  multipleWinnersExternalErc20Awards: Array<MultipleWinnersExternalErc20Award>;
  multipleWinnersExternalErc721Award?: Maybe<MultipleWinnersExternalErc721Award>;
  multipleWinnersExternalErc721Awards: Array<MultipleWinnersExternalErc721Award>;
  multipleWinnersPrizeStrategies: Array<MultipleWinnersPrizeStrategy>;
  multipleWinnersPrizeStrategy?: Maybe<MultipleWinnersPrizeStrategy>;
  prize?: Maybe<Prize>;
  prizePool?: Maybe<PrizePool>;
  prizePoolAccount?: Maybe<PrizePoolAccount>;
  prizePoolAccounts: Array<PrizePoolAccount>;
  prizePools: Array<PrizePool>;
  prizeSplit?: Maybe<PrizeSplit>;
  prizeSplits: Array<PrizeSplit>;
  prizeStrategies: Array<PrizeStrategy>;
  prizeStrategy?: Maybe<PrizeStrategy>;
  prizes: Array<Prize>;
  sablierStream?: Maybe<SablierStream>;
  sablierStreams: Array<SablierStream>;
  singleRandomWinnerExternalErc20Award?: Maybe<SingleRandomWinnerExternalErc20Award>;
  singleRandomWinnerExternalErc20Awards: Array<SingleRandomWinnerExternalErc20Award>;
  singleRandomWinnerExternalErc721Award?: Maybe<SingleRandomWinnerExternalErc721Award>;
  singleRandomWinnerExternalErc721Awards: Array<SingleRandomWinnerExternalErc721Award>;
  singleRandomWinnerPrizeStrategies: Array<SingleRandomWinnerPrizeStrategy>;
  singleRandomWinnerPrizeStrategy?: Maybe<SingleRandomWinnerPrizeStrategy>;
  stakePrizePool?: Maybe<StakePrizePool>;
  stakePrizePools: Array<StakePrizePool>;
  volumeDrip?: Maybe<VolumeDrip>;
  volumeDripPeriod?: Maybe<VolumeDripPeriod>;
  volumeDripPeriods: Array<VolumeDripPeriod>;
  volumeDripPlayer?: Maybe<VolumeDripPlayer>;
  volumeDripPlayers: Array<VolumeDripPlayer>;
  volumeDrips: Array<VolumeDrip>;
  yieldSourcePrizePool?: Maybe<YieldSourcePrizePool>;
  yieldSourcePrizePools: Array<YieldSourcePrizePool>;
};

export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};

export type QueryAccountArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryAccountsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Account_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Account_Filter>;
};

export type QueryAwardedControlledTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryAwardedControlledTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<AwardedControlledToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AwardedControlledToken_Filter>;
};

export type QueryAwardedExternalErc20TokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryAwardedExternalErc20TokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<AwardedExternalErc20Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AwardedExternalErc20Token_Filter>;
};

export type QueryAwardedExternalErc721NftArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryAwardedExternalErc721NftsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<AwardedExternalErc721Nft_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AwardedExternalErc721Nft_Filter>;
};

export type QueryBalanceDripArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryBalanceDripPlayerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryBalanceDripPlayersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<BalanceDripPlayer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<BalanceDripPlayer_Filter>;
};

export type QueryBalanceDripsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<BalanceDrip_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<BalanceDrip_Filter>;
};

export type QueryCompoundPrizePoolArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryCompoundPrizePoolsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<CompoundPrizePool_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<CompoundPrizePool_Filter>;
};

export type QueryComptrollerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryComptrollersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Comptroller_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Comptroller_Filter>;
};

export type QueryControlledTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryControlledTokenBalanceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryControlledTokenBalancesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ControlledTokenBalance_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ControlledTokenBalance_Filter>;
};

export type QueryControlledTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ControlledToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ControlledToken_Filter>;
};

export type QueryCreditBalanceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryCreditBalancesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<CreditBalance_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<CreditBalance_Filter>;
};

export type QueryCreditRateArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryCreditRatesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<CreditRate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<CreditRate_Filter>;
};

export type QueryDripTokenPlayerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryDripTokenPlayersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<DripTokenPlayer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DripTokenPlayer_Filter>;
};

export type QueryMultipleWinnersExternalErc20AwardArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryMultipleWinnersExternalErc20AwardsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<MultipleWinnersExternalErc20Award_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<MultipleWinnersExternalErc20Award_Filter>;
};

export type QueryMultipleWinnersExternalErc721AwardArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryMultipleWinnersExternalErc721AwardsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<MultipleWinnersExternalErc721Award_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<MultipleWinnersExternalErc721Award_Filter>;
};

export type QueryMultipleWinnersPrizeStrategiesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<MultipleWinnersPrizeStrategy_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<MultipleWinnersPrizeStrategy_Filter>;
};

export type QueryMultipleWinnersPrizeStrategyArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryPrizeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryPrizePoolArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryPrizePoolAccountArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryPrizePoolAccountsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<PrizePoolAccount_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PrizePoolAccount_Filter>;
};

export type QueryPrizePoolsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<PrizePool_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PrizePool_Filter>;
};

export type QueryPrizeSplitArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryPrizeSplitsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<PrizeSplit_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PrizeSplit_Filter>;
};

export type QueryPrizeStrategiesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<PrizeStrategy_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PrizeStrategy_Filter>;
};

export type QueryPrizeStrategyArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryPrizesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Prize_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Prize_Filter>;
};

export type QuerySablierStreamArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QuerySablierStreamsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<SablierStream_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SablierStream_Filter>;
};

export type QuerySingleRandomWinnerExternalErc20AwardArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QuerySingleRandomWinnerExternalErc20AwardsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<SingleRandomWinnerExternalErc20Award_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SingleRandomWinnerExternalErc20Award_Filter>;
};

export type QuerySingleRandomWinnerExternalErc721AwardArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QuerySingleRandomWinnerExternalErc721AwardsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<SingleRandomWinnerExternalErc721Award_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SingleRandomWinnerExternalErc721Award_Filter>;
};

export type QuerySingleRandomWinnerPrizeStrategiesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<SingleRandomWinnerPrizeStrategy_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SingleRandomWinnerPrizeStrategy_Filter>;
};

export type QuerySingleRandomWinnerPrizeStrategyArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryStakePrizePoolArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryStakePrizePoolsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<StakePrizePool_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<StakePrizePool_Filter>;
};

export type QueryVolumeDripArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryVolumeDripPeriodArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryVolumeDripPeriodsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<VolumeDripPeriod_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<VolumeDripPeriod_Filter>;
};

export type QueryVolumeDripPlayerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryVolumeDripPlayersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<VolumeDripPlayer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<VolumeDripPlayer_Filter>;
};

export type QueryVolumeDripsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<VolumeDrip_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<VolumeDrip_Filter>;
};

export type QueryYieldSourcePrizePoolArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryYieldSourcePrizePoolsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<YieldSourcePrizePool_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<YieldSourcePrizePool_Filter>;
};

export type SablierStream = {
  __typename?: "SablierStream";
  id: Scalars["ID"];
  prizePool: PrizePool;
};

export type SablierStream_Filter = {
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  prizePool?: InputMaybe<Scalars["String"]>;
  prizePool_contains?: InputMaybe<Scalars["String"]>;
  prizePool_ends_with?: InputMaybe<Scalars["String"]>;
  prizePool_gt?: InputMaybe<Scalars["String"]>;
  prizePool_gte?: InputMaybe<Scalars["String"]>;
  prizePool_in?: InputMaybe<Array<Scalars["String"]>>;
  prizePool_lt?: InputMaybe<Scalars["String"]>;
  prizePool_lte?: InputMaybe<Scalars["String"]>;
  prizePool_not?: InputMaybe<Scalars["String"]>;
  prizePool_not_contains?: InputMaybe<Scalars["String"]>;
  prizePool_not_ends_with?: InputMaybe<Scalars["String"]>;
  prizePool_not_in?: InputMaybe<Array<Scalars["String"]>>;
  prizePool_not_starts_with?: InputMaybe<Scalars["String"]>;
  prizePool_starts_with?: InputMaybe<Scalars["String"]>;
};

export enum SablierStream_OrderBy {
  Id = "id",
  PrizePool = "prizePool",
}

export type SingleRandomWinnerExternalErc20Award = {
  __typename?: "SingleRandomWinnerExternalErc20Award";
  address: Scalars["Bytes"];
  decimals?: Maybe<Scalars["BigInt"]>;
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  prizeStrategy?: Maybe<SingleRandomWinnerPrizeStrategy>;
  symbol?: Maybe<Scalars["String"]>;
};

export type SingleRandomWinnerExternalErc20Award_Filter = {
  address?: InputMaybe<Scalars["Bytes"]>;
  address_contains?: InputMaybe<Scalars["Bytes"]>;
  address_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  address_not?: InputMaybe<Scalars["Bytes"]>;
  address_not_contains?: InputMaybe<Scalars["Bytes"]>;
  address_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  decimals?: InputMaybe<Scalars["BigInt"]>;
  decimals_gt?: InputMaybe<Scalars["BigInt"]>;
  decimals_gte?: InputMaybe<Scalars["BigInt"]>;
  decimals_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  decimals_lt?: InputMaybe<Scalars["BigInt"]>;
  decimals_lte?: InputMaybe<Scalars["BigInt"]>;
  decimals_not?: InputMaybe<Scalars["BigInt"]>;
  decimals_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  name?: InputMaybe<Scalars["String"]>;
  name_contains?: InputMaybe<Scalars["String"]>;
  name_ends_with?: InputMaybe<Scalars["String"]>;
  name_gt?: InputMaybe<Scalars["String"]>;
  name_gte?: InputMaybe<Scalars["String"]>;
  name_in?: InputMaybe<Array<Scalars["String"]>>;
  name_lt?: InputMaybe<Scalars["String"]>;
  name_lte?: InputMaybe<Scalars["String"]>;
  name_not?: InputMaybe<Scalars["String"]>;
  name_not_contains?: InputMaybe<Scalars["String"]>;
  name_not_ends_with?: InputMaybe<Scalars["String"]>;
  name_not_in?: InputMaybe<Array<Scalars["String"]>>;
  name_not_starts_with?: InputMaybe<Scalars["String"]>;
  name_starts_with?: InputMaybe<Scalars["String"]>;
  prizeStrategy?: InputMaybe<Scalars["String"]>;
  prizeStrategy_contains?: InputMaybe<Scalars["String"]>;
  prizeStrategy_ends_with?: InputMaybe<Scalars["String"]>;
  prizeStrategy_gt?: InputMaybe<Scalars["String"]>;
  prizeStrategy_gte?: InputMaybe<Scalars["String"]>;
  prizeStrategy_in?: InputMaybe<Array<Scalars["String"]>>;
  prizeStrategy_lt?: InputMaybe<Scalars["String"]>;
  prizeStrategy_lte?: InputMaybe<Scalars["String"]>;
  prizeStrategy_not?: InputMaybe<Scalars["String"]>;
  prizeStrategy_not_contains?: InputMaybe<Scalars["String"]>;
  prizeStrategy_not_ends_with?: InputMaybe<Scalars["String"]>;
  prizeStrategy_not_in?: InputMaybe<Array<Scalars["String"]>>;
  prizeStrategy_not_starts_with?: InputMaybe<Scalars["String"]>;
  prizeStrategy_starts_with?: InputMaybe<Scalars["String"]>;
  symbol?: InputMaybe<Scalars["String"]>;
  symbol_contains?: InputMaybe<Scalars["String"]>;
  symbol_ends_with?: InputMaybe<Scalars["String"]>;
  symbol_gt?: InputMaybe<Scalars["String"]>;
  symbol_gte?: InputMaybe<Scalars["String"]>;
  symbol_in?: InputMaybe<Array<Scalars["String"]>>;
  symbol_lt?: InputMaybe<Scalars["String"]>;
  symbol_lte?: InputMaybe<Scalars["String"]>;
  symbol_not?: InputMaybe<Scalars["String"]>;
  symbol_not_contains?: InputMaybe<Scalars["String"]>;
  symbol_not_ends_with?: InputMaybe<Scalars["String"]>;
  symbol_not_in?: InputMaybe<Array<Scalars["String"]>>;
  symbol_not_starts_with?: InputMaybe<Scalars["String"]>;
  symbol_starts_with?: InputMaybe<Scalars["String"]>;
};

export enum SingleRandomWinnerExternalErc20Award_OrderBy {
  Address = "address",
  Decimals = "decimals",
  Id = "id",
  Name = "name",
  PrizeStrategy = "prizeStrategy",
  Symbol = "symbol",
}

export type SingleRandomWinnerExternalErc721Award = {
  __typename?: "SingleRandomWinnerExternalErc721Award";
  address: Scalars["Bytes"];
  id: Scalars["ID"];
  prizeStrategy?: Maybe<SingleRandomWinnerPrizeStrategy>;
  tokenIds?: Maybe<Array<Scalars["BigInt"]>>;
};

export type SingleRandomWinnerExternalErc721Award_Filter = {
  address?: InputMaybe<Scalars["Bytes"]>;
  address_contains?: InputMaybe<Scalars["Bytes"]>;
  address_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  address_not?: InputMaybe<Scalars["Bytes"]>;
  address_not_contains?: InputMaybe<Scalars["Bytes"]>;
  address_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  prizeStrategy?: InputMaybe<Scalars["String"]>;
  prizeStrategy_contains?: InputMaybe<Scalars["String"]>;
  prizeStrategy_ends_with?: InputMaybe<Scalars["String"]>;
  prizeStrategy_gt?: InputMaybe<Scalars["String"]>;
  prizeStrategy_gte?: InputMaybe<Scalars["String"]>;
  prizeStrategy_in?: InputMaybe<Array<Scalars["String"]>>;
  prizeStrategy_lt?: InputMaybe<Scalars["String"]>;
  prizeStrategy_lte?: InputMaybe<Scalars["String"]>;
  prizeStrategy_not?: InputMaybe<Scalars["String"]>;
  prizeStrategy_not_contains?: InputMaybe<Scalars["String"]>;
  prizeStrategy_not_ends_with?: InputMaybe<Scalars["String"]>;
  prizeStrategy_not_in?: InputMaybe<Array<Scalars["String"]>>;
  prizeStrategy_not_starts_with?: InputMaybe<Scalars["String"]>;
  prizeStrategy_starts_with?: InputMaybe<Scalars["String"]>;
  tokenIds?: InputMaybe<Array<Scalars["BigInt"]>>;
  tokenIds_contains?: InputMaybe<Array<Scalars["BigInt"]>>;
  tokenIds_not?: InputMaybe<Array<Scalars["BigInt"]>>;
  tokenIds_not_contains?: InputMaybe<Array<Scalars["BigInt"]>>;
};

export enum SingleRandomWinnerExternalErc721Award_OrderBy {
  Address = "address",
  Id = "id",
  PrizeStrategy = "prizeStrategy",
  TokenIds = "tokenIds",
}

export type SingleRandomWinnerPrizeStrategy = {
  __typename?: "SingleRandomWinnerPrizeStrategy";
  externalErc20Awards: Array<SingleRandomWinnerExternalErc20Award>;
  externalErc721Awards: Array<SingleRandomWinnerExternalErc721Award>;
  id: Scalars["ID"];
  owner?: Maybe<Scalars["Bytes"]>;
  prizePeriodEndAt: Scalars["BigInt"];
  prizePeriodSeconds: Scalars["BigInt"];
  prizePeriodStartedAt: Scalars["BigInt"];
  prizePool?: Maybe<PrizePool>;
  rng?: Maybe<Scalars["Bytes"]>;
  sponsorship?: Maybe<ControlledToken>;
  ticket?: Maybe<ControlledToken>;
  tokenListener?: Maybe<Comptroller>;
};

export type SingleRandomWinnerPrizeStrategyExternalErc20AwardsArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<SingleRandomWinnerExternalErc20Award_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<SingleRandomWinnerExternalErc20Award_Filter>;
};

export type SingleRandomWinnerPrizeStrategyExternalErc721AwardsArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<SingleRandomWinnerExternalErc721Award_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<SingleRandomWinnerExternalErc721Award_Filter>;
};

export type SingleRandomWinnerPrizeStrategy_Filter = {
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  owner?: InputMaybe<Scalars["Bytes"]>;
  owner_contains?: InputMaybe<Scalars["Bytes"]>;
  owner_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  owner_not?: InputMaybe<Scalars["Bytes"]>;
  owner_not_contains?: InputMaybe<Scalars["Bytes"]>;
  owner_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  prizePeriodEndAt?: InputMaybe<Scalars["BigInt"]>;
  prizePeriodEndAt_gt?: InputMaybe<Scalars["BigInt"]>;
  prizePeriodEndAt_gte?: InputMaybe<Scalars["BigInt"]>;
  prizePeriodEndAt_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  prizePeriodEndAt_lt?: InputMaybe<Scalars["BigInt"]>;
  prizePeriodEndAt_lte?: InputMaybe<Scalars["BigInt"]>;
  prizePeriodEndAt_not?: InputMaybe<Scalars["BigInt"]>;
  prizePeriodEndAt_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  prizePeriodSeconds?: InputMaybe<Scalars["BigInt"]>;
  prizePeriodSeconds_gt?: InputMaybe<Scalars["BigInt"]>;
  prizePeriodSeconds_gte?: InputMaybe<Scalars["BigInt"]>;
  prizePeriodSeconds_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  prizePeriodSeconds_lt?: InputMaybe<Scalars["BigInt"]>;
  prizePeriodSeconds_lte?: InputMaybe<Scalars["BigInt"]>;
  prizePeriodSeconds_not?: InputMaybe<Scalars["BigInt"]>;
  prizePeriodSeconds_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  prizePeriodStartedAt?: InputMaybe<Scalars["BigInt"]>;
  prizePeriodStartedAt_gt?: InputMaybe<Scalars["BigInt"]>;
  prizePeriodStartedAt_gte?: InputMaybe<Scalars["BigInt"]>;
  prizePeriodStartedAt_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  prizePeriodStartedAt_lt?: InputMaybe<Scalars["BigInt"]>;
  prizePeriodStartedAt_lte?: InputMaybe<Scalars["BigInt"]>;
  prizePeriodStartedAt_not?: InputMaybe<Scalars["BigInt"]>;
  prizePeriodStartedAt_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  prizePool?: InputMaybe<Scalars["String"]>;
  prizePool_contains?: InputMaybe<Scalars["String"]>;
  prizePool_ends_with?: InputMaybe<Scalars["String"]>;
  prizePool_gt?: InputMaybe<Scalars["String"]>;
  prizePool_gte?: InputMaybe<Scalars["String"]>;
  prizePool_in?: InputMaybe<Array<Scalars["String"]>>;
  prizePool_lt?: InputMaybe<Scalars["String"]>;
  prizePool_lte?: InputMaybe<Scalars["String"]>;
  prizePool_not?: InputMaybe<Scalars["String"]>;
  prizePool_not_contains?: InputMaybe<Scalars["String"]>;
  prizePool_not_ends_with?: InputMaybe<Scalars["String"]>;
  prizePool_not_in?: InputMaybe<Array<Scalars["String"]>>;
  prizePool_not_starts_with?: InputMaybe<Scalars["String"]>;
  prizePool_starts_with?: InputMaybe<Scalars["String"]>;
  rng?: InputMaybe<Scalars["Bytes"]>;
  rng_contains?: InputMaybe<Scalars["Bytes"]>;
  rng_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  rng_not?: InputMaybe<Scalars["Bytes"]>;
  rng_not_contains?: InputMaybe<Scalars["Bytes"]>;
  rng_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  sponsorship?: InputMaybe<Scalars["String"]>;
  sponsorship_contains?: InputMaybe<Scalars["String"]>;
  sponsorship_ends_with?: InputMaybe<Scalars["String"]>;
  sponsorship_gt?: InputMaybe<Scalars["String"]>;
  sponsorship_gte?: InputMaybe<Scalars["String"]>;
  sponsorship_in?: InputMaybe<Array<Scalars["String"]>>;
  sponsorship_lt?: InputMaybe<Scalars["String"]>;
  sponsorship_lte?: InputMaybe<Scalars["String"]>;
  sponsorship_not?: InputMaybe<Scalars["String"]>;
  sponsorship_not_contains?: InputMaybe<Scalars["String"]>;
  sponsorship_not_ends_with?: InputMaybe<Scalars["String"]>;
  sponsorship_not_in?: InputMaybe<Array<Scalars["String"]>>;
  sponsorship_not_starts_with?: InputMaybe<Scalars["String"]>;
  sponsorship_starts_with?: InputMaybe<Scalars["String"]>;
  ticket?: InputMaybe<Scalars["String"]>;
  ticket_contains?: InputMaybe<Scalars["String"]>;
  ticket_ends_with?: InputMaybe<Scalars["String"]>;
  ticket_gt?: InputMaybe<Scalars["String"]>;
  ticket_gte?: InputMaybe<Scalars["String"]>;
  ticket_in?: InputMaybe<Array<Scalars["String"]>>;
  ticket_lt?: InputMaybe<Scalars["String"]>;
  ticket_lte?: InputMaybe<Scalars["String"]>;
  ticket_not?: InputMaybe<Scalars["String"]>;
  ticket_not_contains?: InputMaybe<Scalars["String"]>;
  ticket_not_ends_with?: InputMaybe<Scalars["String"]>;
  ticket_not_in?: InputMaybe<Array<Scalars["String"]>>;
  ticket_not_starts_with?: InputMaybe<Scalars["String"]>;
  ticket_starts_with?: InputMaybe<Scalars["String"]>;
  tokenListener?: InputMaybe<Scalars["String"]>;
  tokenListener_contains?: InputMaybe<Scalars["String"]>;
  tokenListener_ends_with?: InputMaybe<Scalars["String"]>;
  tokenListener_gt?: InputMaybe<Scalars["String"]>;
  tokenListener_gte?: InputMaybe<Scalars["String"]>;
  tokenListener_in?: InputMaybe<Array<Scalars["String"]>>;
  tokenListener_lt?: InputMaybe<Scalars["String"]>;
  tokenListener_lte?: InputMaybe<Scalars["String"]>;
  tokenListener_not?: InputMaybe<Scalars["String"]>;
  tokenListener_not_contains?: InputMaybe<Scalars["String"]>;
  tokenListener_not_ends_with?: InputMaybe<Scalars["String"]>;
  tokenListener_not_in?: InputMaybe<Array<Scalars["String"]>>;
  tokenListener_not_starts_with?: InputMaybe<Scalars["String"]>;
  tokenListener_starts_with?: InputMaybe<Scalars["String"]>;
};

export enum SingleRandomWinnerPrizeStrategy_OrderBy {
  ExternalErc20Awards = "externalErc20Awards",
  ExternalErc721Awards = "externalErc721Awards",
  Id = "id",
  Owner = "owner",
  PrizePeriodEndAt = "prizePeriodEndAt",
  PrizePeriodSeconds = "prizePeriodSeconds",
  PrizePeriodStartedAt = "prizePeriodStartedAt",
  PrizePool = "prizePool",
  Rng = "rng",
  Sponsorship = "sponsorship",
  Ticket = "ticket",
  TokenListener = "tokenListener",
}

export type StakePrizePool = {
  __typename?: "StakePrizePool";
  id: Scalars["ID"];
  stakeToken?: Maybe<Scalars["Bytes"]>;
};

export type StakePrizePool_Filter = {
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  stakeToken?: InputMaybe<Scalars["Bytes"]>;
  stakeToken_contains?: InputMaybe<Scalars["Bytes"]>;
  stakeToken_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  stakeToken_not?: InputMaybe<Scalars["Bytes"]>;
  stakeToken_not_contains?: InputMaybe<Scalars["Bytes"]>;
  stakeToken_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
};

export enum StakePrizePool_OrderBy {
  Id = "id",
  StakeToken = "stakeToken",
}

export type Subscription = {
  __typename?: "Subscription";
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  account?: Maybe<Account>;
  accounts: Array<Account>;
  awardedControlledToken?: Maybe<AwardedControlledToken>;
  awardedControlledTokens: Array<AwardedControlledToken>;
  awardedExternalErc20Token?: Maybe<AwardedExternalErc20Token>;
  awardedExternalErc20Tokens: Array<AwardedExternalErc20Token>;
  awardedExternalErc721Nft?: Maybe<AwardedExternalErc721Nft>;
  awardedExternalErc721Nfts: Array<AwardedExternalErc721Nft>;
  balanceDrip?: Maybe<BalanceDrip>;
  balanceDripPlayer?: Maybe<BalanceDripPlayer>;
  balanceDripPlayers: Array<BalanceDripPlayer>;
  balanceDrips: Array<BalanceDrip>;
  compoundPrizePool?: Maybe<CompoundPrizePool>;
  compoundPrizePools: Array<CompoundPrizePool>;
  comptroller?: Maybe<Comptroller>;
  comptrollers: Array<Comptroller>;
  controlledToken?: Maybe<ControlledToken>;
  controlledTokenBalance?: Maybe<ControlledTokenBalance>;
  controlledTokenBalances: Array<ControlledTokenBalance>;
  controlledTokens: Array<ControlledToken>;
  creditBalance?: Maybe<CreditBalance>;
  creditBalances: Array<CreditBalance>;
  creditRate?: Maybe<CreditRate>;
  creditRates: Array<CreditRate>;
  dripTokenPlayer?: Maybe<DripTokenPlayer>;
  dripTokenPlayers: Array<DripTokenPlayer>;
  multipleWinnersExternalErc20Award?: Maybe<MultipleWinnersExternalErc20Award>;
  multipleWinnersExternalErc20Awards: Array<MultipleWinnersExternalErc20Award>;
  multipleWinnersExternalErc721Award?: Maybe<MultipleWinnersExternalErc721Award>;
  multipleWinnersExternalErc721Awards: Array<MultipleWinnersExternalErc721Award>;
  multipleWinnersPrizeStrategies: Array<MultipleWinnersPrizeStrategy>;
  multipleWinnersPrizeStrategy?: Maybe<MultipleWinnersPrizeStrategy>;
  prize?: Maybe<Prize>;
  prizePool?: Maybe<PrizePool>;
  prizePoolAccount?: Maybe<PrizePoolAccount>;
  prizePoolAccounts: Array<PrizePoolAccount>;
  prizePools: Array<PrizePool>;
  prizeSplit?: Maybe<PrizeSplit>;
  prizeSplits: Array<PrizeSplit>;
  prizeStrategies: Array<PrizeStrategy>;
  prizeStrategy?: Maybe<PrizeStrategy>;
  prizes: Array<Prize>;
  sablierStream?: Maybe<SablierStream>;
  sablierStreams: Array<SablierStream>;
  singleRandomWinnerExternalErc20Award?: Maybe<SingleRandomWinnerExternalErc20Award>;
  singleRandomWinnerExternalErc20Awards: Array<SingleRandomWinnerExternalErc20Award>;
  singleRandomWinnerExternalErc721Award?: Maybe<SingleRandomWinnerExternalErc721Award>;
  singleRandomWinnerExternalErc721Awards: Array<SingleRandomWinnerExternalErc721Award>;
  singleRandomWinnerPrizeStrategies: Array<SingleRandomWinnerPrizeStrategy>;
  singleRandomWinnerPrizeStrategy?: Maybe<SingleRandomWinnerPrizeStrategy>;
  stakePrizePool?: Maybe<StakePrizePool>;
  stakePrizePools: Array<StakePrizePool>;
  volumeDrip?: Maybe<VolumeDrip>;
  volumeDripPeriod?: Maybe<VolumeDripPeriod>;
  volumeDripPeriods: Array<VolumeDripPeriod>;
  volumeDripPlayer?: Maybe<VolumeDripPlayer>;
  volumeDripPlayers: Array<VolumeDripPlayer>;
  volumeDrips: Array<VolumeDrip>;
  yieldSourcePrizePool?: Maybe<YieldSourcePrizePool>;
  yieldSourcePrizePools: Array<YieldSourcePrizePool>;
};

export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};

export type SubscriptionAccountArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionAccountsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Account_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Account_Filter>;
};

export type SubscriptionAwardedControlledTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionAwardedControlledTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<AwardedControlledToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AwardedControlledToken_Filter>;
};

export type SubscriptionAwardedExternalErc20TokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionAwardedExternalErc20TokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<AwardedExternalErc20Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AwardedExternalErc20Token_Filter>;
};

export type SubscriptionAwardedExternalErc721NftArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionAwardedExternalErc721NftsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<AwardedExternalErc721Nft_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AwardedExternalErc721Nft_Filter>;
};

export type SubscriptionBalanceDripArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionBalanceDripPlayerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionBalanceDripPlayersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<BalanceDripPlayer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<BalanceDripPlayer_Filter>;
};

export type SubscriptionBalanceDripsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<BalanceDrip_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<BalanceDrip_Filter>;
};

export type SubscriptionCompoundPrizePoolArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionCompoundPrizePoolsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<CompoundPrizePool_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<CompoundPrizePool_Filter>;
};

export type SubscriptionComptrollerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionComptrollersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Comptroller_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Comptroller_Filter>;
};

export type SubscriptionControlledTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionControlledTokenBalanceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionControlledTokenBalancesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ControlledTokenBalance_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ControlledTokenBalance_Filter>;
};

export type SubscriptionControlledTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ControlledToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ControlledToken_Filter>;
};

export type SubscriptionCreditBalanceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionCreditBalancesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<CreditBalance_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<CreditBalance_Filter>;
};

export type SubscriptionCreditRateArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionCreditRatesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<CreditRate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<CreditRate_Filter>;
};

export type SubscriptionDripTokenPlayerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionDripTokenPlayersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<DripTokenPlayer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DripTokenPlayer_Filter>;
};

export type SubscriptionMultipleWinnersExternalErc20AwardArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionMultipleWinnersExternalErc20AwardsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<MultipleWinnersExternalErc20Award_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<MultipleWinnersExternalErc20Award_Filter>;
};

export type SubscriptionMultipleWinnersExternalErc721AwardArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionMultipleWinnersExternalErc721AwardsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<MultipleWinnersExternalErc721Award_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<MultipleWinnersExternalErc721Award_Filter>;
};

export type SubscriptionMultipleWinnersPrizeStrategiesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<MultipleWinnersPrizeStrategy_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<MultipleWinnersPrizeStrategy_Filter>;
};

export type SubscriptionMultipleWinnersPrizeStrategyArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionPrizeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionPrizePoolArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionPrizePoolAccountArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionPrizePoolAccountsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<PrizePoolAccount_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PrizePoolAccount_Filter>;
};

export type SubscriptionPrizePoolsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<PrizePool_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PrizePool_Filter>;
};

export type SubscriptionPrizeSplitArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionPrizeSplitsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<PrizeSplit_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PrizeSplit_Filter>;
};

export type SubscriptionPrizeStrategiesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<PrizeStrategy_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PrizeStrategy_Filter>;
};

export type SubscriptionPrizeStrategyArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionPrizesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Prize_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Prize_Filter>;
};

export type SubscriptionSablierStreamArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionSablierStreamsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<SablierStream_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SablierStream_Filter>;
};

export type SubscriptionSingleRandomWinnerExternalErc20AwardArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionSingleRandomWinnerExternalErc20AwardsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<SingleRandomWinnerExternalErc20Award_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SingleRandomWinnerExternalErc20Award_Filter>;
};

export type SubscriptionSingleRandomWinnerExternalErc721AwardArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionSingleRandomWinnerExternalErc721AwardsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<SingleRandomWinnerExternalErc721Award_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SingleRandomWinnerExternalErc721Award_Filter>;
};

export type SubscriptionSingleRandomWinnerPrizeStrategiesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<SingleRandomWinnerPrizeStrategy_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SingleRandomWinnerPrizeStrategy_Filter>;
};

export type SubscriptionSingleRandomWinnerPrizeStrategyArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionStakePrizePoolArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionStakePrizePoolsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<StakePrizePool_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<StakePrizePool_Filter>;
};

export type SubscriptionVolumeDripArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionVolumeDripPeriodArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionVolumeDripPeriodsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<VolumeDripPeriod_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<VolumeDripPeriod_Filter>;
};

export type SubscriptionVolumeDripPlayerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionVolumeDripPlayersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<VolumeDripPlayer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<VolumeDripPlayer_Filter>;
};

export type SubscriptionVolumeDripsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<VolumeDrip_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<VolumeDrip_Filter>;
};

export type SubscriptionYieldSourcePrizePoolArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionYieldSourcePrizePoolsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<YieldSourcePrizePool_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<YieldSourcePrizePool_Filter>;
};

export type VolumeDrip = {
  __typename?: "VolumeDrip";
  comptroller: Comptroller;
  deactivated: Scalars["Boolean"];
  deposits: Array<VolumeDripPlayer>;
  dripAmount?: Maybe<Scalars["BigInt"]>;
  dripToken: Scalars["Bytes"];
  id: Scalars["ID"];
  measureToken: Scalars["Bytes"];
  periodCount?: Maybe<Scalars["BigInt"]>;
  periodSeconds?: Maybe<Scalars["BigInt"]>;
  periods: Array<VolumeDripPeriod>;
  referral: Scalars["Boolean"];
  sourceAddress: Scalars["Bytes"];
};

export type VolumeDripDepositsArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<VolumeDripPlayer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<VolumeDripPlayer_Filter>;
};

export type VolumeDripPeriodsArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<VolumeDripPeriod_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<VolumeDripPeriod_Filter>;
};

export type VolumeDripPeriod = {
  __typename?: "VolumeDripPeriod";
  dripAmount?: Maybe<Scalars["BigInt"]>;
  endTime?: Maybe<Scalars["BigInt"]>;
  id: Scalars["ID"];
  isDripping: Scalars["Boolean"];
  periodIndex: Scalars["BigInt"];
  totalSupply?: Maybe<Scalars["BigInt"]>;
  volumeDrip: VolumeDrip;
};

export type VolumeDripPeriod_Filter = {
  dripAmount?: InputMaybe<Scalars["BigInt"]>;
  dripAmount_gt?: InputMaybe<Scalars["BigInt"]>;
  dripAmount_gte?: InputMaybe<Scalars["BigInt"]>;
  dripAmount_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  dripAmount_lt?: InputMaybe<Scalars["BigInt"]>;
  dripAmount_lte?: InputMaybe<Scalars["BigInt"]>;
  dripAmount_not?: InputMaybe<Scalars["BigInt"]>;
  dripAmount_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  endTime?: InputMaybe<Scalars["BigInt"]>;
  endTime_gt?: InputMaybe<Scalars["BigInt"]>;
  endTime_gte?: InputMaybe<Scalars["BigInt"]>;
  endTime_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  endTime_lt?: InputMaybe<Scalars["BigInt"]>;
  endTime_lte?: InputMaybe<Scalars["BigInt"]>;
  endTime_not?: InputMaybe<Scalars["BigInt"]>;
  endTime_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  isDripping?: InputMaybe<Scalars["Boolean"]>;
  isDripping_in?: InputMaybe<Array<Scalars["Boolean"]>>;
  isDripping_not?: InputMaybe<Scalars["Boolean"]>;
  isDripping_not_in?: InputMaybe<Array<Scalars["Boolean"]>>;
  periodIndex?: InputMaybe<Scalars["BigInt"]>;
  periodIndex_gt?: InputMaybe<Scalars["BigInt"]>;
  periodIndex_gte?: InputMaybe<Scalars["BigInt"]>;
  periodIndex_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  periodIndex_lt?: InputMaybe<Scalars["BigInt"]>;
  periodIndex_lte?: InputMaybe<Scalars["BigInt"]>;
  periodIndex_not?: InputMaybe<Scalars["BigInt"]>;
  periodIndex_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  totalSupply?: InputMaybe<Scalars["BigInt"]>;
  totalSupply_gt?: InputMaybe<Scalars["BigInt"]>;
  totalSupply_gte?: InputMaybe<Scalars["BigInt"]>;
  totalSupply_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  totalSupply_lt?: InputMaybe<Scalars["BigInt"]>;
  totalSupply_lte?: InputMaybe<Scalars["BigInt"]>;
  totalSupply_not?: InputMaybe<Scalars["BigInt"]>;
  totalSupply_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  volumeDrip?: InputMaybe<Scalars["String"]>;
  volumeDrip_contains?: InputMaybe<Scalars["String"]>;
  volumeDrip_ends_with?: InputMaybe<Scalars["String"]>;
  volumeDrip_gt?: InputMaybe<Scalars["String"]>;
  volumeDrip_gte?: InputMaybe<Scalars["String"]>;
  volumeDrip_in?: InputMaybe<Array<Scalars["String"]>>;
  volumeDrip_lt?: InputMaybe<Scalars["String"]>;
  volumeDrip_lte?: InputMaybe<Scalars["String"]>;
  volumeDrip_not?: InputMaybe<Scalars["String"]>;
  volumeDrip_not_contains?: InputMaybe<Scalars["String"]>;
  volumeDrip_not_ends_with?: InputMaybe<Scalars["String"]>;
  volumeDrip_not_in?: InputMaybe<Array<Scalars["String"]>>;
  volumeDrip_not_starts_with?: InputMaybe<Scalars["String"]>;
  volumeDrip_starts_with?: InputMaybe<Scalars["String"]>;
};

export enum VolumeDripPeriod_OrderBy {
  DripAmount = "dripAmount",
  EndTime = "endTime",
  Id = "id",
  IsDripping = "isDripping",
  PeriodIndex = "periodIndex",
  TotalSupply = "totalSupply",
  VolumeDrip = "volumeDrip",
}

export type VolumeDripPlayer = {
  __typename?: "VolumeDripPlayer";
  address: Scalars["Bytes"];
  balance: Scalars["BigInt"];
  id: Scalars["ID"];
  periodIndex: Scalars["BigInt"];
  volumeDrip: VolumeDrip;
};

export type VolumeDripPlayer_Filter = {
  address?: InputMaybe<Scalars["Bytes"]>;
  address_contains?: InputMaybe<Scalars["Bytes"]>;
  address_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  address_not?: InputMaybe<Scalars["Bytes"]>;
  address_not_contains?: InputMaybe<Scalars["Bytes"]>;
  address_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  balance?: InputMaybe<Scalars["BigInt"]>;
  balance_gt?: InputMaybe<Scalars["BigInt"]>;
  balance_gte?: InputMaybe<Scalars["BigInt"]>;
  balance_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  balance_lt?: InputMaybe<Scalars["BigInt"]>;
  balance_lte?: InputMaybe<Scalars["BigInt"]>;
  balance_not?: InputMaybe<Scalars["BigInt"]>;
  balance_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  periodIndex?: InputMaybe<Scalars["BigInt"]>;
  periodIndex_gt?: InputMaybe<Scalars["BigInt"]>;
  periodIndex_gte?: InputMaybe<Scalars["BigInt"]>;
  periodIndex_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  periodIndex_lt?: InputMaybe<Scalars["BigInt"]>;
  periodIndex_lte?: InputMaybe<Scalars["BigInt"]>;
  periodIndex_not?: InputMaybe<Scalars["BigInt"]>;
  periodIndex_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  volumeDrip?: InputMaybe<Scalars["String"]>;
  volumeDrip_contains?: InputMaybe<Scalars["String"]>;
  volumeDrip_ends_with?: InputMaybe<Scalars["String"]>;
  volumeDrip_gt?: InputMaybe<Scalars["String"]>;
  volumeDrip_gte?: InputMaybe<Scalars["String"]>;
  volumeDrip_in?: InputMaybe<Array<Scalars["String"]>>;
  volumeDrip_lt?: InputMaybe<Scalars["String"]>;
  volumeDrip_lte?: InputMaybe<Scalars["String"]>;
  volumeDrip_not?: InputMaybe<Scalars["String"]>;
  volumeDrip_not_contains?: InputMaybe<Scalars["String"]>;
  volumeDrip_not_ends_with?: InputMaybe<Scalars["String"]>;
  volumeDrip_not_in?: InputMaybe<Array<Scalars["String"]>>;
  volumeDrip_not_starts_with?: InputMaybe<Scalars["String"]>;
  volumeDrip_starts_with?: InputMaybe<Scalars["String"]>;
};

export enum VolumeDripPlayer_OrderBy {
  Address = "address",
  Balance = "balance",
  Id = "id",
  PeriodIndex = "periodIndex",
  VolumeDrip = "volumeDrip",
}

export type VolumeDrip_Filter = {
  comptroller?: InputMaybe<Scalars["String"]>;
  comptroller_contains?: InputMaybe<Scalars["String"]>;
  comptroller_ends_with?: InputMaybe<Scalars["String"]>;
  comptroller_gt?: InputMaybe<Scalars["String"]>;
  comptroller_gte?: InputMaybe<Scalars["String"]>;
  comptroller_in?: InputMaybe<Array<Scalars["String"]>>;
  comptroller_lt?: InputMaybe<Scalars["String"]>;
  comptroller_lte?: InputMaybe<Scalars["String"]>;
  comptroller_not?: InputMaybe<Scalars["String"]>;
  comptroller_not_contains?: InputMaybe<Scalars["String"]>;
  comptroller_not_ends_with?: InputMaybe<Scalars["String"]>;
  comptroller_not_in?: InputMaybe<Array<Scalars["String"]>>;
  comptroller_not_starts_with?: InputMaybe<Scalars["String"]>;
  comptroller_starts_with?: InputMaybe<Scalars["String"]>;
  deactivated?: InputMaybe<Scalars["Boolean"]>;
  deactivated_in?: InputMaybe<Array<Scalars["Boolean"]>>;
  deactivated_not?: InputMaybe<Scalars["Boolean"]>;
  deactivated_not_in?: InputMaybe<Array<Scalars["Boolean"]>>;
  dripAmount?: InputMaybe<Scalars["BigInt"]>;
  dripAmount_gt?: InputMaybe<Scalars["BigInt"]>;
  dripAmount_gte?: InputMaybe<Scalars["BigInt"]>;
  dripAmount_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  dripAmount_lt?: InputMaybe<Scalars["BigInt"]>;
  dripAmount_lte?: InputMaybe<Scalars["BigInt"]>;
  dripAmount_not?: InputMaybe<Scalars["BigInt"]>;
  dripAmount_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  dripToken?: InputMaybe<Scalars["Bytes"]>;
  dripToken_contains?: InputMaybe<Scalars["Bytes"]>;
  dripToken_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  dripToken_not?: InputMaybe<Scalars["Bytes"]>;
  dripToken_not_contains?: InputMaybe<Scalars["Bytes"]>;
  dripToken_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  measureToken?: InputMaybe<Scalars["Bytes"]>;
  measureToken_contains?: InputMaybe<Scalars["Bytes"]>;
  measureToken_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  measureToken_not?: InputMaybe<Scalars["Bytes"]>;
  measureToken_not_contains?: InputMaybe<Scalars["Bytes"]>;
  measureToken_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  periodCount?: InputMaybe<Scalars["BigInt"]>;
  periodCount_gt?: InputMaybe<Scalars["BigInt"]>;
  periodCount_gte?: InputMaybe<Scalars["BigInt"]>;
  periodCount_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  periodCount_lt?: InputMaybe<Scalars["BigInt"]>;
  periodCount_lte?: InputMaybe<Scalars["BigInt"]>;
  periodCount_not?: InputMaybe<Scalars["BigInt"]>;
  periodCount_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  periodSeconds?: InputMaybe<Scalars["BigInt"]>;
  periodSeconds_gt?: InputMaybe<Scalars["BigInt"]>;
  periodSeconds_gte?: InputMaybe<Scalars["BigInt"]>;
  periodSeconds_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  periodSeconds_lt?: InputMaybe<Scalars["BigInt"]>;
  periodSeconds_lte?: InputMaybe<Scalars["BigInt"]>;
  periodSeconds_not?: InputMaybe<Scalars["BigInt"]>;
  periodSeconds_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  referral?: InputMaybe<Scalars["Boolean"]>;
  referral_in?: InputMaybe<Array<Scalars["Boolean"]>>;
  referral_not?: InputMaybe<Scalars["Boolean"]>;
  referral_not_in?: InputMaybe<Array<Scalars["Boolean"]>>;
  sourceAddress?: InputMaybe<Scalars["Bytes"]>;
  sourceAddress_contains?: InputMaybe<Scalars["Bytes"]>;
  sourceAddress_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  sourceAddress_not?: InputMaybe<Scalars["Bytes"]>;
  sourceAddress_not_contains?: InputMaybe<Scalars["Bytes"]>;
  sourceAddress_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
};

export enum VolumeDrip_OrderBy {
  Comptroller = "comptroller",
  Deactivated = "deactivated",
  Deposits = "deposits",
  DripAmount = "dripAmount",
  DripToken = "dripToken",
  Id = "id",
  MeasureToken = "measureToken",
  PeriodCount = "periodCount",
  PeriodSeconds = "periodSeconds",
  Periods = "periods",
  Referral = "referral",
  SourceAddress = "sourceAddress",
}

export type YieldSourcePrizePool = {
  __typename?: "YieldSourcePrizePool";
  id: Scalars["ID"];
  yieldSource?: Maybe<Scalars["Bytes"]>;
};

export type YieldSourcePrizePool_Filter = {
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  yieldSource?: InputMaybe<Scalars["Bytes"]>;
  yieldSource_contains?: InputMaybe<Scalars["Bytes"]>;
  yieldSource_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  yieldSource_not?: InputMaybe<Scalars["Bytes"]>;
  yieldSource_not_contains?: InputMaybe<Scalars["Bytes"]>;
  yieldSource_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
};

export enum YieldSourcePrizePool_OrderBy {
  Id = "id",
  YieldSource = "yieldSource",
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
