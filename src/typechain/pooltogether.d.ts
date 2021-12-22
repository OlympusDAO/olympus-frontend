export type Maybe<T> = T | null;
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
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<ControlledTokenBalance_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  where?: Maybe<ControlledTokenBalance_Filter>;
};

export type AccountPrizePoolAccountsArgs = {
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<PrizePoolAccount_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  where?: Maybe<PrizePoolAccount_Filter>;
};

export type Account_Filter = {
  id?: Maybe<Scalars["ID"]>;
  id_gt?: Maybe<Scalars["ID"]>;
  id_gte?: Maybe<Scalars["ID"]>;
  id_in?: Maybe<Array<Scalars["ID"]>>;
  id_lt?: Maybe<Scalars["ID"]>;
  id_lte?: Maybe<Scalars["ID"]>;
  id_not?: Maybe<Scalars["ID"]>;
  id_not_in?: Maybe<Array<Scalars["ID"]>>;
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
  amount?: Maybe<Scalars["BigInt"]>;
  amount_gt?: Maybe<Scalars["BigInt"]>;
  amount_gte?: Maybe<Scalars["BigInt"]>;
  amount_in?: Maybe<Array<Scalars["BigInt"]>>;
  amount_lt?: Maybe<Scalars["BigInt"]>;
  amount_lte?: Maybe<Scalars["BigInt"]>;
  amount_not?: Maybe<Scalars["BigInt"]>;
  amount_not_in?: Maybe<Array<Scalars["BigInt"]>>;
  id?: Maybe<Scalars["ID"]>;
  id_gt?: Maybe<Scalars["ID"]>;
  id_gte?: Maybe<Scalars["ID"]>;
  id_in?: Maybe<Array<Scalars["ID"]>>;
  id_lt?: Maybe<Scalars["ID"]>;
  id_lte?: Maybe<Scalars["ID"]>;
  id_not?: Maybe<Scalars["ID"]>;
  id_not_in?: Maybe<Array<Scalars["ID"]>>;
  prize?: Maybe<Scalars["String"]>;
  prize_contains?: Maybe<Scalars["String"]>;
  prize_ends_with?: Maybe<Scalars["String"]>;
  prize_gt?: Maybe<Scalars["String"]>;
  prize_gte?: Maybe<Scalars["String"]>;
  prize_in?: Maybe<Array<Scalars["String"]>>;
  prize_lt?: Maybe<Scalars["String"]>;
  prize_lte?: Maybe<Scalars["String"]>;
  prize_not?: Maybe<Scalars["String"]>;
  prize_not_contains?: Maybe<Scalars["String"]>;
  prize_not_ends_with?: Maybe<Scalars["String"]>;
  prize_not_in?: Maybe<Array<Scalars["String"]>>;
  prize_not_starts_with?: Maybe<Scalars["String"]>;
  prize_starts_with?: Maybe<Scalars["String"]>;
  token?: Maybe<Scalars["String"]>;
  token_contains?: Maybe<Scalars["String"]>;
  token_ends_with?: Maybe<Scalars["String"]>;
  token_gt?: Maybe<Scalars["String"]>;
  token_gte?: Maybe<Scalars["String"]>;
  token_in?: Maybe<Array<Scalars["String"]>>;
  token_lt?: Maybe<Scalars["String"]>;
  token_lte?: Maybe<Scalars["String"]>;
  token_not?: Maybe<Scalars["String"]>;
  token_not_contains?: Maybe<Scalars["String"]>;
  token_not_ends_with?: Maybe<Scalars["String"]>;
  token_not_in?: Maybe<Array<Scalars["String"]>>;
  token_not_starts_with?: Maybe<Scalars["String"]>;
  token_starts_with?: Maybe<Scalars["String"]>;
  winner?: Maybe<Scalars["Bytes"]>;
  winner_contains?: Maybe<Scalars["Bytes"]>;
  winner_in?: Maybe<Array<Scalars["Bytes"]>>;
  winner_not?: Maybe<Scalars["Bytes"]>;
  winner_not_contains?: Maybe<Scalars["Bytes"]>;
  winner_not_in?: Maybe<Array<Scalars["Bytes"]>>;
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
  address?: Maybe<Scalars["Bytes"]>;
  address_contains?: Maybe<Scalars["Bytes"]>;
  address_in?: Maybe<Array<Scalars["Bytes"]>>;
  address_not?: Maybe<Scalars["Bytes"]>;
  address_not_contains?: Maybe<Scalars["Bytes"]>;
  address_not_in?: Maybe<Array<Scalars["Bytes"]>>;
  balanceAwarded?: Maybe<Scalars["BigInt"]>;
  balanceAwarded_gt?: Maybe<Scalars["BigInt"]>;
  balanceAwarded_gte?: Maybe<Scalars["BigInt"]>;
  balanceAwarded_in?: Maybe<Array<Scalars["BigInt"]>>;
  balanceAwarded_lt?: Maybe<Scalars["BigInt"]>;
  balanceAwarded_lte?: Maybe<Scalars["BigInt"]>;
  balanceAwarded_not?: Maybe<Scalars["BigInt"]>;
  balanceAwarded_not_in?: Maybe<Array<Scalars["BigInt"]>>;
  decimals?: Maybe<Scalars["BigInt"]>;
  decimals_gt?: Maybe<Scalars["BigInt"]>;
  decimals_gte?: Maybe<Scalars["BigInt"]>;
  decimals_in?: Maybe<Array<Scalars["BigInt"]>>;
  decimals_lt?: Maybe<Scalars["BigInt"]>;
  decimals_lte?: Maybe<Scalars["BigInt"]>;
  decimals_not?: Maybe<Scalars["BigInt"]>;
  decimals_not_in?: Maybe<Array<Scalars["BigInt"]>>;
  id?: Maybe<Scalars["ID"]>;
  id_gt?: Maybe<Scalars["ID"]>;
  id_gte?: Maybe<Scalars["ID"]>;
  id_in?: Maybe<Array<Scalars["ID"]>>;
  id_lt?: Maybe<Scalars["ID"]>;
  id_lte?: Maybe<Scalars["ID"]>;
  id_not?: Maybe<Scalars["ID"]>;
  id_not_in?: Maybe<Array<Scalars["ID"]>>;
  name?: Maybe<Scalars["String"]>;
  name_contains?: Maybe<Scalars["String"]>;
  name_ends_with?: Maybe<Scalars["String"]>;
  name_gt?: Maybe<Scalars["String"]>;
  name_gte?: Maybe<Scalars["String"]>;
  name_in?: Maybe<Array<Scalars["String"]>>;
  name_lt?: Maybe<Scalars["String"]>;
  name_lte?: Maybe<Scalars["String"]>;
  name_not?: Maybe<Scalars["String"]>;
  name_not_contains?: Maybe<Scalars["String"]>;
  name_not_ends_with?: Maybe<Scalars["String"]>;
  name_not_in?: Maybe<Array<Scalars["String"]>>;
  name_not_starts_with?: Maybe<Scalars["String"]>;
  name_starts_with?: Maybe<Scalars["String"]>;
  prize?: Maybe<Scalars["String"]>;
  prize_contains?: Maybe<Scalars["String"]>;
  prize_ends_with?: Maybe<Scalars["String"]>;
  prize_gt?: Maybe<Scalars["String"]>;
  prize_gte?: Maybe<Scalars["String"]>;
  prize_in?: Maybe<Array<Scalars["String"]>>;
  prize_lt?: Maybe<Scalars["String"]>;
  prize_lte?: Maybe<Scalars["String"]>;
  prize_not?: Maybe<Scalars["String"]>;
  prize_not_contains?: Maybe<Scalars["String"]>;
  prize_not_ends_with?: Maybe<Scalars["String"]>;
  prize_not_in?: Maybe<Array<Scalars["String"]>>;
  prize_not_starts_with?: Maybe<Scalars["String"]>;
  prize_starts_with?: Maybe<Scalars["String"]>;
  symbol?: Maybe<Scalars["String"]>;
  symbol_contains?: Maybe<Scalars["String"]>;
  symbol_ends_with?: Maybe<Scalars["String"]>;
  symbol_gt?: Maybe<Scalars["String"]>;
  symbol_gte?: Maybe<Scalars["String"]>;
  symbol_in?: Maybe<Array<Scalars["String"]>>;
  symbol_lt?: Maybe<Scalars["String"]>;
  symbol_lte?: Maybe<Scalars["String"]>;
  symbol_not?: Maybe<Scalars["String"]>;
  symbol_not_contains?: Maybe<Scalars["String"]>;
  symbol_not_ends_with?: Maybe<Scalars["String"]>;
  symbol_not_in?: Maybe<Array<Scalars["String"]>>;
  symbol_not_starts_with?: Maybe<Scalars["String"]>;
  symbol_starts_with?: Maybe<Scalars["String"]>;
  winner?: Maybe<Scalars["Bytes"]>;
  winner_contains?: Maybe<Scalars["Bytes"]>;
  winner_in?: Maybe<Array<Scalars["Bytes"]>>;
  winner_not?: Maybe<Scalars["Bytes"]>;
  winner_not_contains?: Maybe<Scalars["Bytes"]>;
  winner_not_in?: Maybe<Array<Scalars["Bytes"]>>;
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
  address?: Maybe<Scalars["Bytes"]>;
  address_contains?: Maybe<Scalars["Bytes"]>;
  address_in?: Maybe<Array<Scalars["Bytes"]>>;
  address_not?: Maybe<Scalars["Bytes"]>;
  address_not_contains?: Maybe<Scalars["Bytes"]>;
  address_not_in?: Maybe<Array<Scalars["Bytes"]>>;
  id?: Maybe<Scalars["ID"]>;
  id_gt?: Maybe<Scalars["ID"]>;
  id_gte?: Maybe<Scalars["ID"]>;
  id_in?: Maybe<Array<Scalars["ID"]>>;
  id_lt?: Maybe<Scalars["ID"]>;
  id_lte?: Maybe<Scalars["ID"]>;
  id_not?: Maybe<Scalars["ID"]>;
  id_not_in?: Maybe<Array<Scalars["ID"]>>;
  prize?: Maybe<Scalars["String"]>;
  prize_contains?: Maybe<Scalars["String"]>;
  prize_ends_with?: Maybe<Scalars["String"]>;
  prize_gt?: Maybe<Scalars["String"]>;
  prize_gte?: Maybe<Scalars["String"]>;
  prize_in?: Maybe<Array<Scalars["String"]>>;
  prize_lt?: Maybe<Scalars["String"]>;
  prize_lte?: Maybe<Scalars["String"]>;
  prize_not?: Maybe<Scalars["String"]>;
  prize_not_contains?: Maybe<Scalars["String"]>;
  prize_not_ends_with?: Maybe<Scalars["String"]>;
  prize_not_in?: Maybe<Array<Scalars["String"]>>;
  prize_not_starts_with?: Maybe<Scalars["String"]>;
  prize_starts_with?: Maybe<Scalars["String"]>;
  tokenIds?: Maybe<Array<Scalars["BigInt"]>>;
  tokenIds_contains?: Maybe<Array<Scalars["BigInt"]>>;
  tokenIds_not?: Maybe<Array<Scalars["BigInt"]>>;
  tokenIds_not_contains?: Maybe<Array<Scalars["BigInt"]>>;
  winner?: Maybe<Scalars["Bytes"]>;
  winner_contains?: Maybe<Scalars["Bytes"]>;
  winner_in?: Maybe<Array<Scalars["Bytes"]>>;
  winner_not?: Maybe<Scalars["Bytes"]>;
  winner_not_contains?: Maybe<Scalars["Bytes"]>;
  winner_not_in?: Maybe<Array<Scalars["Bytes"]>>;
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
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<BalanceDripPlayer_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  where?: Maybe<BalanceDripPlayer_Filter>;
};

export type BalanceDripPlayer = {
  __typename?: "BalanceDripPlayer";
  address: Scalars["Bytes"];
  balanceDrip: BalanceDrip;
  id: Scalars["ID"];
};

export type BalanceDripPlayer_Filter = {
  address?: Maybe<Scalars["Bytes"]>;
  address_contains?: Maybe<Scalars["Bytes"]>;
  address_in?: Maybe<Array<Scalars["Bytes"]>>;
  address_not?: Maybe<Scalars["Bytes"]>;
  address_not_contains?: Maybe<Scalars["Bytes"]>;
  address_not_in?: Maybe<Array<Scalars["Bytes"]>>;
  balanceDrip?: Maybe<Scalars["String"]>;
  balanceDrip_contains?: Maybe<Scalars["String"]>;
  balanceDrip_ends_with?: Maybe<Scalars["String"]>;
  balanceDrip_gt?: Maybe<Scalars["String"]>;
  balanceDrip_gte?: Maybe<Scalars["String"]>;
  balanceDrip_in?: Maybe<Array<Scalars["String"]>>;
  balanceDrip_lt?: Maybe<Scalars["String"]>;
  balanceDrip_lte?: Maybe<Scalars["String"]>;
  balanceDrip_not?: Maybe<Scalars["String"]>;
  balanceDrip_not_contains?: Maybe<Scalars["String"]>;
  balanceDrip_not_ends_with?: Maybe<Scalars["String"]>;
  balanceDrip_not_in?: Maybe<Array<Scalars["String"]>>;
  balanceDrip_not_starts_with?: Maybe<Scalars["String"]>;
  balanceDrip_starts_with?: Maybe<Scalars["String"]>;
  id?: Maybe<Scalars["ID"]>;
  id_gt?: Maybe<Scalars["ID"]>;
  id_gte?: Maybe<Scalars["ID"]>;
  id_in?: Maybe<Array<Scalars["ID"]>>;
  id_lt?: Maybe<Scalars["ID"]>;
  id_lte?: Maybe<Scalars["ID"]>;
  id_not?: Maybe<Scalars["ID"]>;
  id_not_in?: Maybe<Array<Scalars["ID"]>>;
};

export enum BalanceDripPlayer_OrderBy {
  Address = "address",
  BalanceDrip = "balanceDrip",
  Id = "id",
}

export type BalanceDrip_Filter = {
  comptroller?: Maybe<Scalars["String"]>;
  comptroller_contains?: Maybe<Scalars["String"]>;
  comptroller_ends_with?: Maybe<Scalars["String"]>;
  comptroller_gt?: Maybe<Scalars["String"]>;
  comptroller_gte?: Maybe<Scalars["String"]>;
  comptroller_in?: Maybe<Array<Scalars["String"]>>;
  comptroller_lt?: Maybe<Scalars["String"]>;
  comptroller_lte?: Maybe<Scalars["String"]>;
  comptroller_not?: Maybe<Scalars["String"]>;
  comptroller_not_contains?: Maybe<Scalars["String"]>;
  comptroller_not_ends_with?: Maybe<Scalars["String"]>;
  comptroller_not_in?: Maybe<Array<Scalars["String"]>>;
  comptroller_not_starts_with?: Maybe<Scalars["String"]>;
  comptroller_starts_with?: Maybe<Scalars["String"]>;
  deactivated?: Maybe<Scalars["Boolean"]>;
  deactivated_in?: Maybe<Array<Scalars["Boolean"]>>;
  deactivated_not?: Maybe<Scalars["Boolean"]>;
  deactivated_not_in?: Maybe<Array<Scalars["Boolean"]>>;
  dripRatePerSecond?: Maybe<Scalars["BigInt"]>;
  dripRatePerSecond_gt?: Maybe<Scalars["BigInt"]>;
  dripRatePerSecond_gte?: Maybe<Scalars["BigInt"]>;
  dripRatePerSecond_in?: Maybe<Array<Scalars["BigInt"]>>;
  dripRatePerSecond_lt?: Maybe<Scalars["BigInt"]>;
  dripRatePerSecond_lte?: Maybe<Scalars["BigInt"]>;
  dripRatePerSecond_not?: Maybe<Scalars["BigInt"]>;
  dripRatePerSecond_not_in?: Maybe<Array<Scalars["BigInt"]>>;
  dripToken?: Maybe<Scalars["Bytes"]>;
  dripToken_contains?: Maybe<Scalars["Bytes"]>;
  dripToken_in?: Maybe<Array<Scalars["Bytes"]>>;
  dripToken_not?: Maybe<Scalars["Bytes"]>;
  dripToken_not_contains?: Maybe<Scalars["Bytes"]>;
  dripToken_not_in?: Maybe<Array<Scalars["Bytes"]>>;
  exchangeRateMantissa?: Maybe<Scalars["BigInt"]>;
  exchangeRateMantissa_gt?: Maybe<Scalars["BigInt"]>;
  exchangeRateMantissa_gte?: Maybe<Scalars["BigInt"]>;
  exchangeRateMantissa_in?: Maybe<Array<Scalars["BigInt"]>>;
  exchangeRateMantissa_lt?: Maybe<Scalars["BigInt"]>;
  exchangeRateMantissa_lte?: Maybe<Scalars["BigInt"]>;
  exchangeRateMantissa_not?: Maybe<Scalars["BigInt"]>;
  exchangeRateMantissa_not_in?: Maybe<Array<Scalars["BigInt"]>>;
  id?: Maybe<Scalars["ID"]>;
  id_gt?: Maybe<Scalars["ID"]>;
  id_gte?: Maybe<Scalars["ID"]>;
  id_in?: Maybe<Array<Scalars["ID"]>>;
  id_lt?: Maybe<Scalars["ID"]>;
  id_lte?: Maybe<Scalars["ID"]>;
  id_not?: Maybe<Scalars["ID"]>;
  id_not_in?: Maybe<Array<Scalars["ID"]>>;
  measureToken?: Maybe<Scalars["Bytes"]>;
  measureToken_contains?: Maybe<Scalars["Bytes"]>;
  measureToken_in?: Maybe<Array<Scalars["Bytes"]>>;
  measureToken_not?: Maybe<Scalars["Bytes"]>;
  measureToken_not_contains?: Maybe<Scalars["Bytes"]>;
  measureToken_not_in?: Maybe<Array<Scalars["Bytes"]>>;
  sourceAddress?: Maybe<Scalars["Bytes"]>;
  sourceAddress_contains?: Maybe<Scalars["Bytes"]>;
  sourceAddress_in?: Maybe<Array<Scalars["Bytes"]>>;
  sourceAddress_not?: Maybe<Scalars["Bytes"]>;
  sourceAddress_not_contains?: Maybe<Scalars["Bytes"]>;
  sourceAddress_not_in?: Maybe<Array<Scalars["Bytes"]>>;
  timestamp?: Maybe<Scalars["BigInt"]>;
  timestamp_gt?: Maybe<Scalars["BigInt"]>;
  timestamp_gte?: Maybe<Scalars["BigInt"]>;
  timestamp_in?: Maybe<Array<Scalars["BigInt"]>>;
  timestamp_lt?: Maybe<Scalars["BigInt"]>;
  timestamp_lte?: Maybe<Scalars["BigInt"]>;
  timestamp_not?: Maybe<Scalars["BigInt"]>;
  timestamp_not_in?: Maybe<Array<Scalars["BigInt"]>>;
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

export type Block_Height = {
  hash?: Maybe<Scalars["Bytes"]>;
  number?: Maybe<Scalars["Int"]>;
};

export type CompoundPrizePool = {
  __typename?: "CompoundPrizePool";
  cToken?: Maybe<Scalars["Bytes"]>;
  id: Scalars["ID"];
};

export type CompoundPrizePool_Filter = {
  cToken?: Maybe<Scalars["Bytes"]>;
  cToken_contains?: Maybe<Scalars["Bytes"]>;
  cToken_in?: Maybe<Array<Scalars["Bytes"]>>;
  cToken_not?: Maybe<Scalars["Bytes"]>;
  cToken_not_contains?: Maybe<Scalars["Bytes"]>;
  cToken_not_in?: Maybe<Array<Scalars["Bytes"]>>;
  id?: Maybe<Scalars["ID"]>;
  id_gt?: Maybe<Scalars["ID"]>;
  id_gte?: Maybe<Scalars["ID"]>;
  id_in?: Maybe<Array<Scalars["ID"]>>;
  id_lt?: Maybe<Scalars["ID"]>;
  id_lte?: Maybe<Scalars["ID"]>;
  id_not?: Maybe<Scalars["ID"]>;
  id_not_in?: Maybe<Array<Scalars["ID"]>>;
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
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<BalanceDrip_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  where?: Maybe<BalanceDrip_Filter>;
};

export type ComptrollerPlayersArgs = {
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<DripTokenPlayer_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  where?: Maybe<DripTokenPlayer_Filter>;
};

export type ComptrollerVolumeDripsArgs = {
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<VolumeDrip_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  where?: Maybe<VolumeDrip_Filter>;
};

export type Comptroller_Filter = {
  id?: Maybe<Scalars["ID"]>;
  id_gt?: Maybe<Scalars["ID"]>;
  id_gte?: Maybe<Scalars["ID"]>;
  id_in?: Maybe<Array<Scalars["ID"]>>;
  id_lt?: Maybe<Scalars["ID"]>;
  id_lte?: Maybe<Scalars["ID"]>;
  id_not?: Maybe<Scalars["ID"]>;
  id_not_in?: Maybe<Array<Scalars["ID"]>>;
  owner?: Maybe<Scalars["Bytes"]>;
  owner_contains?: Maybe<Scalars["Bytes"]>;
  owner_in?: Maybe<Array<Scalars["Bytes"]>>;
  owner_not?: Maybe<Scalars["Bytes"]>;
  owner_not_contains?: Maybe<Scalars["Bytes"]>;
  owner_not_in?: Maybe<Array<Scalars["Bytes"]>>;
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
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<ControlledTokenBalance_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  where?: Maybe<ControlledTokenBalance_Filter>;
};

export type ControlledTokenBalance = {
  __typename?: "ControlledTokenBalance";
  account: Account;
  balance?: Maybe<Scalars["BigInt"]>;
  controlledToken: ControlledToken;
  id: Scalars["ID"];
};

export type ControlledTokenBalance_Filter = {
  account?: Maybe<Scalars["String"]>;
  account_contains?: Maybe<Scalars["String"]>;
  account_ends_with?: Maybe<Scalars["String"]>;
  account_gt?: Maybe<Scalars["String"]>;
  account_gte?: Maybe<Scalars["String"]>;
  account_in?: Maybe<Array<Scalars["String"]>>;
  account_lt?: Maybe<Scalars["String"]>;
  account_lte?: Maybe<Scalars["String"]>;
  account_not?: Maybe<Scalars["String"]>;
  account_not_contains?: Maybe<Scalars["String"]>;
  account_not_ends_with?: Maybe<Scalars["String"]>;
  account_not_in?: Maybe<Array<Scalars["String"]>>;
  account_not_starts_with?: Maybe<Scalars["String"]>;
  account_starts_with?: Maybe<Scalars["String"]>;
  balance?: Maybe<Scalars["BigInt"]>;
  balance_gt?: Maybe<Scalars["BigInt"]>;
  balance_gte?: Maybe<Scalars["BigInt"]>;
  balance_in?: Maybe<Array<Scalars["BigInt"]>>;
  balance_lt?: Maybe<Scalars["BigInt"]>;
  balance_lte?: Maybe<Scalars["BigInt"]>;
  balance_not?: Maybe<Scalars["BigInt"]>;
  balance_not_in?: Maybe<Array<Scalars["BigInt"]>>;
  controlledToken?: Maybe<Scalars["String"]>;
  controlledToken_contains?: Maybe<Scalars["String"]>;
  controlledToken_ends_with?: Maybe<Scalars["String"]>;
  controlledToken_gt?: Maybe<Scalars["String"]>;
  controlledToken_gte?: Maybe<Scalars["String"]>;
  controlledToken_in?: Maybe<Array<Scalars["String"]>>;
  controlledToken_lt?: Maybe<Scalars["String"]>;
  controlledToken_lte?: Maybe<Scalars["String"]>;
  controlledToken_not?: Maybe<Scalars["String"]>;
  controlledToken_not_contains?: Maybe<Scalars["String"]>;
  controlledToken_not_ends_with?: Maybe<Scalars["String"]>;
  controlledToken_not_in?: Maybe<Array<Scalars["String"]>>;
  controlledToken_not_starts_with?: Maybe<Scalars["String"]>;
  controlledToken_starts_with?: Maybe<Scalars["String"]>;
  id?: Maybe<Scalars["ID"]>;
  id_gt?: Maybe<Scalars["ID"]>;
  id_gte?: Maybe<Scalars["ID"]>;
  id_in?: Maybe<Array<Scalars["ID"]>>;
  id_lt?: Maybe<Scalars["ID"]>;
  id_lte?: Maybe<Scalars["ID"]>;
  id_not?: Maybe<Scalars["ID"]>;
  id_not_in?: Maybe<Array<Scalars["ID"]>>;
};

export enum ControlledTokenBalance_OrderBy {
  Account = "account",
  Balance = "balance",
  ControlledToken = "controlledToken",
  Id = "id",
}

export type ControlledToken_Filter = {
  controller?: Maybe<Scalars["String"]>;
  controller_contains?: Maybe<Scalars["String"]>;
  controller_ends_with?: Maybe<Scalars["String"]>;
  controller_gt?: Maybe<Scalars["String"]>;
  controller_gte?: Maybe<Scalars["String"]>;
  controller_in?: Maybe<Array<Scalars["String"]>>;
  controller_lt?: Maybe<Scalars["String"]>;
  controller_lte?: Maybe<Scalars["String"]>;
  controller_not?: Maybe<Scalars["String"]>;
  controller_not_contains?: Maybe<Scalars["String"]>;
  controller_not_ends_with?: Maybe<Scalars["String"]>;
  controller_not_in?: Maybe<Array<Scalars["String"]>>;
  controller_not_starts_with?: Maybe<Scalars["String"]>;
  controller_starts_with?: Maybe<Scalars["String"]>;
  decimals?: Maybe<Scalars["BigInt"]>;
  decimals_gt?: Maybe<Scalars["BigInt"]>;
  decimals_gte?: Maybe<Scalars["BigInt"]>;
  decimals_in?: Maybe<Array<Scalars["BigInt"]>>;
  decimals_lt?: Maybe<Scalars["BigInt"]>;
  decimals_lte?: Maybe<Scalars["BigInt"]>;
  decimals_not?: Maybe<Scalars["BigInt"]>;
  decimals_not_in?: Maybe<Array<Scalars["BigInt"]>>;
  id?: Maybe<Scalars["ID"]>;
  id_gt?: Maybe<Scalars["ID"]>;
  id_gte?: Maybe<Scalars["ID"]>;
  id_in?: Maybe<Array<Scalars["ID"]>>;
  id_lt?: Maybe<Scalars["ID"]>;
  id_lte?: Maybe<Scalars["ID"]>;
  id_not?: Maybe<Scalars["ID"]>;
  id_not_in?: Maybe<Array<Scalars["ID"]>>;
  name?: Maybe<Scalars["String"]>;
  name_contains?: Maybe<Scalars["String"]>;
  name_ends_with?: Maybe<Scalars["String"]>;
  name_gt?: Maybe<Scalars["String"]>;
  name_gte?: Maybe<Scalars["String"]>;
  name_in?: Maybe<Array<Scalars["String"]>>;
  name_lt?: Maybe<Scalars["String"]>;
  name_lte?: Maybe<Scalars["String"]>;
  name_not?: Maybe<Scalars["String"]>;
  name_not_contains?: Maybe<Scalars["String"]>;
  name_not_ends_with?: Maybe<Scalars["String"]>;
  name_not_in?: Maybe<Array<Scalars["String"]>>;
  name_not_starts_with?: Maybe<Scalars["String"]>;
  name_starts_with?: Maybe<Scalars["String"]>;
  numberOfHolders?: Maybe<Scalars["BigInt"]>;
  numberOfHolders_gt?: Maybe<Scalars["BigInt"]>;
  numberOfHolders_gte?: Maybe<Scalars["BigInt"]>;
  numberOfHolders_in?: Maybe<Array<Scalars["BigInt"]>>;
  numberOfHolders_lt?: Maybe<Scalars["BigInt"]>;
  numberOfHolders_lte?: Maybe<Scalars["BigInt"]>;
  numberOfHolders_not?: Maybe<Scalars["BigInt"]>;
  numberOfHolders_not_in?: Maybe<Array<Scalars["BigInt"]>>;
  symbol?: Maybe<Scalars["String"]>;
  symbol_contains?: Maybe<Scalars["String"]>;
  symbol_ends_with?: Maybe<Scalars["String"]>;
  symbol_gt?: Maybe<Scalars["String"]>;
  symbol_gte?: Maybe<Scalars["String"]>;
  symbol_in?: Maybe<Array<Scalars["String"]>>;
  symbol_lt?: Maybe<Scalars["String"]>;
  symbol_lte?: Maybe<Scalars["String"]>;
  symbol_not?: Maybe<Scalars["String"]>;
  symbol_not_contains?: Maybe<Scalars["String"]>;
  symbol_not_ends_with?: Maybe<Scalars["String"]>;
  symbol_not_in?: Maybe<Array<Scalars["String"]>>;
  symbol_not_starts_with?: Maybe<Scalars["String"]>;
  symbol_starts_with?: Maybe<Scalars["String"]>;
  totalSupply?: Maybe<Scalars["BigInt"]>;
  totalSupply_gt?: Maybe<Scalars["BigInt"]>;
  totalSupply_gte?: Maybe<Scalars["BigInt"]>;
  totalSupply_in?: Maybe<Array<Scalars["BigInt"]>>;
  totalSupply_lt?: Maybe<Scalars["BigInt"]>;
  totalSupply_lte?: Maybe<Scalars["BigInt"]>;
  totalSupply_not?: Maybe<Scalars["BigInt"]>;
  totalSupply_not_in?: Maybe<Array<Scalars["BigInt"]>>;
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
  balance?: Maybe<Scalars["BigInt"]>;
  balance_gt?: Maybe<Scalars["BigInt"]>;
  balance_gte?: Maybe<Scalars["BigInt"]>;
  balance_in?: Maybe<Array<Scalars["BigInt"]>>;
  balance_lt?: Maybe<Scalars["BigInt"]>;
  balance_lte?: Maybe<Scalars["BigInt"]>;
  balance_not?: Maybe<Scalars["BigInt"]>;
  balance_not_in?: Maybe<Array<Scalars["BigInt"]>>;
  id?: Maybe<Scalars["ID"]>;
  id_gt?: Maybe<Scalars["ID"]>;
  id_gte?: Maybe<Scalars["ID"]>;
  id_in?: Maybe<Array<Scalars["ID"]>>;
  id_lt?: Maybe<Scalars["ID"]>;
  id_lte?: Maybe<Scalars["ID"]>;
  id_not?: Maybe<Scalars["ID"]>;
  id_not_in?: Maybe<Array<Scalars["ID"]>>;
  initialized?: Maybe<Scalars["Boolean"]>;
  initialized_in?: Maybe<Array<Scalars["Boolean"]>>;
  initialized_not?: Maybe<Scalars["Boolean"]>;
  initialized_not_in?: Maybe<Array<Scalars["Boolean"]>>;
  prizePool?: Maybe<Scalars["String"]>;
  prizePool_contains?: Maybe<Scalars["String"]>;
  prizePool_ends_with?: Maybe<Scalars["String"]>;
  prizePool_gt?: Maybe<Scalars["String"]>;
  prizePool_gte?: Maybe<Scalars["String"]>;
  prizePool_in?: Maybe<Array<Scalars["String"]>>;
  prizePool_lt?: Maybe<Scalars["String"]>;
  prizePool_lte?: Maybe<Scalars["String"]>;
  prizePool_not?: Maybe<Scalars["String"]>;
  prizePool_not_contains?: Maybe<Scalars["String"]>;
  prizePool_not_ends_with?: Maybe<Scalars["String"]>;
  prizePool_not_in?: Maybe<Array<Scalars["String"]>>;
  prizePool_not_starts_with?: Maybe<Scalars["String"]>;
  prizePool_starts_with?: Maybe<Scalars["String"]>;
  timestamp?: Maybe<Scalars["BigInt"]>;
  timestamp_gt?: Maybe<Scalars["BigInt"]>;
  timestamp_gte?: Maybe<Scalars["BigInt"]>;
  timestamp_in?: Maybe<Array<Scalars["BigInt"]>>;
  timestamp_lt?: Maybe<Scalars["BigInt"]>;
  timestamp_lte?: Maybe<Scalars["BigInt"]>;
  timestamp_not?: Maybe<Scalars["BigInt"]>;
  timestamp_not_in?: Maybe<Array<Scalars["BigInt"]>>;
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
  creditLimitMantissa?: Maybe<Scalars["BigInt"]>;
  creditLimitMantissa_gt?: Maybe<Scalars["BigInt"]>;
  creditLimitMantissa_gte?: Maybe<Scalars["BigInt"]>;
  creditLimitMantissa_in?: Maybe<Array<Scalars["BigInt"]>>;
  creditLimitMantissa_lt?: Maybe<Scalars["BigInt"]>;
  creditLimitMantissa_lte?: Maybe<Scalars["BigInt"]>;
  creditLimitMantissa_not?: Maybe<Scalars["BigInt"]>;
  creditLimitMantissa_not_in?: Maybe<Array<Scalars["BigInt"]>>;
  creditRateMantissa?: Maybe<Scalars["BigInt"]>;
  creditRateMantissa_gt?: Maybe<Scalars["BigInt"]>;
  creditRateMantissa_gte?: Maybe<Scalars["BigInt"]>;
  creditRateMantissa_in?: Maybe<Array<Scalars["BigInt"]>>;
  creditRateMantissa_lt?: Maybe<Scalars["BigInt"]>;
  creditRateMantissa_lte?: Maybe<Scalars["BigInt"]>;
  creditRateMantissa_not?: Maybe<Scalars["BigInt"]>;
  creditRateMantissa_not_in?: Maybe<Array<Scalars["BigInt"]>>;
  id?: Maybe<Scalars["ID"]>;
  id_gt?: Maybe<Scalars["ID"]>;
  id_gte?: Maybe<Scalars["ID"]>;
  id_in?: Maybe<Array<Scalars["ID"]>>;
  id_lt?: Maybe<Scalars["ID"]>;
  id_lte?: Maybe<Scalars["ID"]>;
  id_not?: Maybe<Scalars["ID"]>;
  id_not_in?: Maybe<Array<Scalars["ID"]>>;
  prizePool?: Maybe<Scalars["String"]>;
  prizePool_contains?: Maybe<Scalars["String"]>;
  prizePool_ends_with?: Maybe<Scalars["String"]>;
  prizePool_gt?: Maybe<Scalars["String"]>;
  prizePool_gte?: Maybe<Scalars["String"]>;
  prizePool_in?: Maybe<Array<Scalars["String"]>>;
  prizePool_lt?: Maybe<Scalars["String"]>;
  prizePool_lte?: Maybe<Scalars["String"]>;
  prizePool_not?: Maybe<Scalars["String"]>;
  prizePool_not_contains?: Maybe<Scalars["String"]>;
  prizePool_not_ends_with?: Maybe<Scalars["String"]>;
  prizePool_not_in?: Maybe<Array<Scalars["String"]>>;
  prizePool_not_starts_with?: Maybe<Scalars["String"]>;
  prizePool_starts_with?: Maybe<Scalars["String"]>;
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
  address?: Maybe<Scalars["Bytes"]>;
  address_contains?: Maybe<Scalars["Bytes"]>;
  address_in?: Maybe<Array<Scalars["Bytes"]>>;
  address_not?: Maybe<Scalars["Bytes"]>;
  address_not_contains?: Maybe<Scalars["Bytes"]>;
  address_not_in?: Maybe<Array<Scalars["Bytes"]>>;
  balance?: Maybe<Scalars["BigInt"]>;
  balance_gt?: Maybe<Scalars["BigInt"]>;
  balance_gte?: Maybe<Scalars["BigInt"]>;
  balance_in?: Maybe<Array<Scalars["BigInt"]>>;
  balance_lt?: Maybe<Scalars["BigInt"]>;
  balance_lte?: Maybe<Scalars["BigInt"]>;
  balance_not?: Maybe<Scalars["BigInt"]>;
  balance_not_in?: Maybe<Array<Scalars["BigInt"]>>;
  comptroller?: Maybe<Scalars["String"]>;
  comptroller_contains?: Maybe<Scalars["String"]>;
  comptroller_ends_with?: Maybe<Scalars["String"]>;
  comptroller_gt?: Maybe<Scalars["String"]>;
  comptroller_gte?: Maybe<Scalars["String"]>;
  comptroller_in?: Maybe<Array<Scalars["String"]>>;
  comptroller_lt?: Maybe<Scalars["String"]>;
  comptroller_lte?: Maybe<Scalars["String"]>;
  comptroller_not?: Maybe<Scalars["String"]>;
  comptroller_not_contains?: Maybe<Scalars["String"]>;
  comptroller_not_ends_with?: Maybe<Scalars["String"]>;
  comptroller_not_in?: Maybe<Array<Scalars["String"]>>;
  comptroller_not_starts_with?: Maybe<Scalars["String"]>;
  comptroller_starts_with?: Maybe<Scalars["String"]>;
  dripToken?: Maybe<Scalars["Bytes"]>;
  dripToken_contains?: Maybe<Scalars["Bytes"]>;
  dripToken_in?: Maybe<Array<Scalars["Bytes"]>>;
  dripToken_not?: Maybe<Scalars["Bytes"]>;
  dripToken_not_contains?: Maybe<Scalars["Bytes"]>;
  dripToken_not_in?: Maybe<Array<Scalars["Bytes"]>>;
  id?: Maybe<Scalars["ID"]>;
  id_gt?: Maybe<Scalars["ID"]>;
  id_gte?: Maybe<Scalars["ID"]>;
  id_in?: Maybe<Array<Scalars["ID"]>>;
  id_lt?: Maybe<Scalars["ID"]>;
  id_lte?: Maybe<Scalars["ID"]>;
  id_not?: Maybe<Scalars["ID"]>;
  id_not_in?: Maybe<Array<Scalars["ID"]>>;
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
  address?: Maybe<Scalars["Bytes"]>;
  address_contains?: Maybe<Scalars["Bytes"]>;
  address_in?: Maybe<Array<Scalars["Bytes"]>>;
  address_not?: Maybe<Scalars["Bytes"]>;
  address_not_contains?: Maybe<Scalars["Bytes"]>;
  address_not_in?: Maybe<Array<Scalars["Bytes"]>>;
  balanceAwarded?: Maybe<Scalars["BigInt"]>;
  balanceAwarded_gt?: Maybe<Scalars["BigInt"]>;
  balanceAwarded_gte?: Maybe<Scalars["BigInt"]>;
  balanceAwarded_in?: Maybe<Array<Scalars["BigInt"]>>;
  balanceAwarded_lt?: Maybe<Scalars["BigInt"]>;
  balanceAwarded_lte?: Maybe<Scalars["BigInt"]>;
  balanceAwarded_not?: Maybe<Scalars["BigInt"]>;
  balanceAwarded_not_in?: Maybe<Array<Scalars["BigInt"]>>;
  decimals?: Maybe<Scalars["BigInt"]>;
  decimals_gt?: Maybe<Scalars["BigInt"]>;
  decimals_gte?: Maybe<Scalars["BigInt"]>;
  decimals_in?: Maybe<Array<Scalars["BigInt"]>>;
  decimals_lt?: Maybe<Scalars["BigInt"]>;
  decimals_lte?: Maybe<Scalars["BigInt"]>;
  decimals_not?: Maybe<Scalars["BigInt"]>;
  decimals_not_in?: Maybe<Array<Scalars["BigInt"]>>;
  id?: Maybe<Scalars["ID"]>;
  id_gt?: Maybe<Scalars["ID"]>;
  id_gte?: Maybe<Scalars["ID"]>;
  id_in?: Maybe<Array<Scalars["ID"]>>;
  id_lt?: Maybe<Scalars["ID"]>;
  id_lte?: Maybe<Scalars["ID"]>;
  id_not?: Maybe<Scalars["ID"]>;
  id_not_in?: Maybe<Array<Scalars["ID"]>>;
  name?: Maybe<Scalars["String"]>;
  name_contains?: Maybe<Scalars["String"]>;
  name_ends_with?: Maybe<Scalars["String"]>;
  name_gt?: Maybe<Scalars["String"]>;
  name_gte?: Maybe<Scalars["String"]>;
  name_in?: Maybe<Array<Scalars["String"]>>;
  name_lt?: Maybe<Scalars["String"]>;
  name_lte?: Maybe<Scalars["String"]>;
  name_not?: Maybe<Scalars["String"]>;
  name_not_contains?: Maybe<Scalars["String"]>;
  name_not_ends_with?: Maybe<Scalars["String"]>;
  name_not_in?: Maybe<Array<Scalars["String"]>>;
  name_not_starts_with?: Maybe<Scalars["String"]>;
  name_starts_with?: Maybe<Scalars["String"]>;
  prizeStrategy?: Maybe<Scalars["String"]>;
  prizeStrategy_contains?: Maybe<Scalars["String"]>;
  prizeStrategy_ends_with?: Maybe<Scalars["String"]>;
  prizeStrategy_gt?: Maybe<Scalars["String"]>;
  prizeStrategy_gte?: Maybe<Scalars["String"]>;
  prizeStrategy_in?: Maybe<Array<Scalars["String"]>>;
  prizeStrategy_lt?: Maybe<Scalars["String"]>;
  prizeStrategy_lte?: Maybe<Scalars["String"]>;
  prizeStrategy_not?: Maybe<Scalars["String"]>;
  prizeStrategy_not_contains?: Maybe<Scalars["String"]>;
  prizeStrategy_not_ends_with?: Maybe<Scalars["String"]>;
  prizeStrategy_not_in?: Maybe<Array<Scalars["String"]>>;
  prizeStrategy_not_starts_with?: Maybe<Scalars["String"]>;
  prizeStrategy_starts_with?: Maybe<Scalars["String"]>;
  symbol?: Maybe<Scalars["String"]>;
  symbol_contains?: Maybe<Scalars["String"]>;
  symbol_ends_with?: Maybe<Scalars["String"]>;
  symbol_gt?: Maybe<Scalars["String"]>;
  symbol_gte?: Maybe<Scalars["String"]>;
  symbol_in?: Maybe<Array<Scalars["String"]>>;
  symbol_lt?: Maybe<Scalars["String"]>;
  symbol_lte?: Maybe<Scalars["String"]>;
  symbol_not?: Maybe<Scalars["String"]>;
  symbol_not_contains?: Maybe<Scalars["String"]>;
  symbol_not_ends_with?: Maybe<Scalars["String"]>;
  symbol_not_in?: Maybe<Array<Scalars["String"]>>;
  symbol_not_starts_with?: Maybe<Scalars["String"]>;
  symbol_starts_with?: Maybe<Scalars["String"]>;
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
  address?: Maybe<Scalars["Bytes"]>;
  address_contains?: Maybe<Scalars["Bytes"]>;
  address_in?: Maybe<Array<Scalars["Bytes"]>>;
  address_not?: Maybe<Scalars["Bytes"]>;
  address_not_contains?: Maybe<Scalars["Bytes"]>;
  address_not_in?: Maybe<Array<Scalars["Bytes"]>>;
  id?: Maybe<Scalars["ID"]>;
  id_gt?: Maybe<Scalars["ID"]>;
  id_gte?: Maybe<Scalars["ID"]>;
  id_in?: Maybe<Array<Scalars["ID"]>>;
  id_lt?: Maybe<Scalars["ID"]>;
  id_lte?: Maybe<Scalars["ID"]>;
  id_not?: Maybe<Scalars["ID"]>;
  id_not_in?: Maybe<Array<Scalars["ID"]>>;
  prizeStrategy?: Maybe<Scalars["String"]>;
  prizeStrategy_contains?: Maybe<Scalars["String"]>;
  prizeStrategy_ends_with?: Maybe<Scalars["String"]>;
  prizeStrategy_gt?: Maybe<Scalars["String"]>;
  prizeStrategy_gte?: Maybe<Scalars["String"]>;
  prizeStrategy_in?: Maybe<Array<Scalars["String"]>>;
  prizeStrategy_lt?: Maybe<Scalars["String"]>;
  prizeStrategy_lte?: Maybe<Scalars["String"]>;
  prizeStrategy_not?: Maybe<Scalars["String"]>;
  prizeStrategy_not_contains?: Maybe<Scalars["String"]>;
  prizeStrategy_not_ends_with?: Maybe<Scalars["String"]>;
  prizeStrategy_not_in?: Maybe<Array<Scalars["String"]>>;
  prizeStrategy_not_starts_with?: Maybe<Scalars["String"]>;
  prizeStrategy_starts_with?: Maybe<Scalars["String"]>;
  tokenIds?: Maybe<Array<Scalars["BigInt"]>>;
  tokenIds_contains?: Maybe<Array<Scalars["BigInt"]>>;
  tokenIds_not?: Maybe<Array<Scalars["BigInt"]>>;
  tokenIds_not_contains?: Maybe<Array<Scalars["BigInt"]>>;
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
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<MultipleWinnersExternalErc20Award_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  where?: Maybe<MultipleWinnersExternalErc20Award_Filter>;
};

export type MultipleWinnersPrizeStrategyExternalErc721AwardsArgs = {
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<MultipleWinnersExternalErc721Award_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  where?: Maybe<MultipleWinnersExternalErc721Award_Filter>;
};

export type MultipleWinnersPrizeStrategyPrizeSplitsArgs = {
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<PrizeSplit_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  where?: Maybe<PrizeSplit_Filter>;
};

export type MultipleWinnersPrizeStrategy_Filter = {
  blockListedAddresses?: Maybe<Array<Scalars["Bytes"]>>;
  blockListedAddresses_contains?: Maybe<Array<Scalars["Bytes"]>>;
  blockListedAddresses_not?: Maybe<Array<Scalars["Bytes"]>>;
  blockListedAddresses_not_contains?: Maybe<Array<Scalars["Bytes"]>>;
  id?: Maybe<Scalars["ID"]>;
  id_gt?: Maybe<Scalars["ID"]>;
  id_gte?: Maybe<Scalars["ID"]>;
  id_in?: Maybe<Array<Scalars["ID"]>>;
  id_lt?: Maybe<Scalars["ID"]>;
  id_lte?: Maybe<Scalars["ID"]>;
  id_not?: Maybe<Scalars["ID"]>;
  id_not_in?: Maybe<Array<Scalars["ID"]>>;
  numberOfWinners?: Maybe<Scalars["BigInt"]>;
  numberOfWinners_gt?: Maybe<Scalars["BigInt"]>;
  numberOfWinners_gte?: Maybe<Scalars["BigInt"]>;
  numberOfWinners_in?: Maybe<Array<Scalars["BigInt"]>>;
  numberOfWinners_lt?: Maybe<Scalars["BigInt"]>;
  numberOfWinners_lte?: Maybe<Scalars["BigInt"]>;
  numberOfWinners_not?: Maybe<Scalars["BigInt"]>;
  numberOfWinners_not_in?: Maybe<Array<Scalars["BigInt"]>>;
  owner?: Maybe<Scalars["Bytes"]>;
  owner_contains?: Maybe<Scalars["Bytes"]>;
  owner_in?: Maybe<Array<Scalars["Bytes"]>>;
  owner_not?: Maybe<Scalars["Bytes"]>;
  owner_not_contains?: Maybe<Scalars["Bytes"]>;
  owner_not_in?: Maybe<Array<Scalars["Bytes"]>>;
  prizePeriodEndAt?: Maybe<Scalars["BigInt"]>;
  prizePeriodEndAt_gt?: Maybe<Scalars["BigInt"]>;
  prizePeriodEndAt_gte?: Maybe<Scalars["BigInt"]>;
  prizePeriodEndAt_in?: Maybe<Array<Scalars["BigInt"]>>;
  prizePeriodEndAt_lt?: Maybe<Scalars["BigInt"]>;
  prizePeriodEndAt_lte?: Maybe<Scalars["BigInt"]>;
  prizePeriodEndAt_not?: Maybe<Scalars["BigInt"]>;
  prizePeriodEndAt_not_in?: Maybe<Array<Scalars["BigInt"]>>;
  prizePeriodSeconds?: Maybe<Scalars["BigInt"]>;
  prizePeriodSeconds_gt?: Maybe<Scalars["BigInt"]>;
  prizePeriodSeconds_gte?: Maybe<Scalars["BigInt"]>;
  prizePeriodSeconds_in?: Maybe<Array<Scalars["BigInt"]>>;
  prizePeriodSeconds_lt?: Maybe<Scalars["BigInt"]>;
  prizePeriodSeconds_lte?: Maybe<Scalars["BigInt"]>;
  prizePeriodSeconds_not?: Maybe<Scalars["BigInt"]>;
  prizePeriodSeconds_not_in?: Maybe<Array<Scalars["BigInt"]>>;
  prizePeriodStartedAt?: Maybe<Scalars["BigInt"]>;
  prizePeriodStartedAt_gt?: Maybe<Scalars["BigInt"]>;
  prizePeriodStartedAt_gte?: Maybe<Scalars["BigInt"]>;
  prizePeriodStartedAt_in?: Maybe<Array<Scalars["BigInt"]>>;
  prizePeriodStartedAt_lt?: Maybe<Scalars["BigInt"]>;
  prizePeriodStartedAt_lte?: Maybe<Scalars["BigInt"]>;
  prizePeriodStartedAt_not?: Maybe<Scalars["BigInt"]>;
  prizePeriodStartedAt_not_in?: Maybe<Array<Scalars["BigInt"]>>;
  prizePool?: Maybe<Scalars["String"]>;
  prizePool_contains?: Maybe<Scalars["String"]>;
  prizePool_ends_with?: Maybe<Scalars["String"]>;
  prizePool_gt?: Maybe<Scalars["String"]>;
  prizePool_gte?: Maybe<Scalars["String"]>;
  prizePool_in?: Maybe<Array<Scalars["String"]>>;
  prizePool_lt?: Maybe<Scalars["String"]>;
  prizePool_lte?: Maybe<Scalars["String"]>;
  prizePool_not?: Maybe<Scalars["String"]>;
  prizePool_not_contains?: Maybe<Scalars["String"]>;
  prizePool_not_ends_with?: Maybe<Scalars["String"]>;
  prizePool_not_in?: Maybe<Array<Scalars["String"]>>;
  prizePool_not_starts_with?: Maybe<Scalars["String"]>;
  prizePool_starts_with?: Maybe<Scalars["String"]>;
  rng?: Maybe<Scalars["Bytes"]>;
  rng_contains?: Maybe<Scalars["Bytes"]>;
  rng_in?: Maybe<Array<Scalars["Bytes"]>>;
  rng_not?: Maybe<Scalars["Bytes"]>;
  rng_not_contains?: Maybe<Scalars["Bytes"]>;
  rng_not_in?: Maybe<Array<Scalars["Bytes"]>>;
  splitExternalERC20Awards?: Maybe<Scalars["Boolean"]>;
  splitExternalERC20Awards_in?: Maybe<Array<Scalars["Boolean"]>>;
  splitExternalERC20Awards_not?: Maybe<Scalars["Boolean"]>;
  splitExternalERC20Awards_not_in?: Maybe<Array<Scalars["Boolean"]>>;
  sponsorship?: Maybe<Scalars["String"]>;
  sponsorship_contains?: Maybe<Scalars["String"]>;
  sponsorship_ends_with?: Maybe<Scalars["String"]>;
  sponsorship_gt?: Maybe<Scalars["String"]>;
  sponsorship_gte?: Maybe<Scalars["String"]>;
  sponsorship_in?: Maybe<Array<Scalars["String"]>>;
  sponsorship_lt?: Maybe<Scalars["String"]>;
  sponsorship_lte?: Maybe<Scalars["String"]>;
  sponsorship_not?: Maybe<Scalars["String"]>;
  sponsorship_not_contains?: Maybe<Scalars["String"]>;
  sponsorship_not_ends_with?: Maybe<Scalars["String"]>;
  sponsorship_not_in?: Maybe<Array<Scalars["String"]>>;
  sponsorship_not_starts_with?: Maybe<Scalars["String"]>;
  sponsorship_starts_with?: Maybe<Scalars["String"]>;
  ticket?: Maybe<Scalars["String"]>;
  ticket_contains?: Maybe<Scalars["String"]>;
  ticket_ends_with?: Maybe<Scalars["String"]>;
  ticket_gt?: Maybe<Scalars["String"]>;
  ticket_gte?: Maybe<Scalars["String"]>;
  ticket_in?: Maybe<Array<Scalars["String"]>>;
  ticket_lt?: Maybe<Scalars["String"]>;
  ticket_lte?: Maybe<Scalars["String"]>;
  ticket_not?: Maybe<Scalars["String"]>;
  ticket_not_contains?: Maybe<Scalars["String"]>;
  ticket_not_ends_with?: Maybe<Scalars["String"]>;
  ticket_not_in?: Maybe<Array<Scalars["String"]>>;
  ticket_not_starts_with?: Maybe<Scalars["String"]>;
  ticket_starts_with?: Maybe<Scalars["String"]>;
  tokenListener?: Maybe<Scalars["Bytes"]>;
  tokenListener_contains?: Maybe<Scalars["Bytes"]>;
  tokenListener_in?: Maybe<Array<Scalars["Bytes"]>>;
  tokenListener_not?: Maybe<Scalars["Bytes"]>;
  tokenListener_not_contains?: Maybe<Scalars["Bytes"]>;
  tokenListener_not_in?: Maybe<Array<Scalars["Bytes"]>>;
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
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<AwardedControlledToken_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  where?: Maybe<AwardedControlledToken_Filter>;
};

export type PrizeAwardedExternalErc20TokensArgs = {
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<AwardedExternalErc20Token_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  where?: Maybe<AwardedExternalErc20Token_Filter>;
};

export type PrizeAwardedExternalErc721NftsArgs = {
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<AwardedExternalErc721Nft_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  where?: Maybe<AwardedExternalErc721Nft_Filter>;
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
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<ControlledToken_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  where?: Maybe<ControlledToken_Filter>;
};

export type PrizePoolPrizePoolAccountsArgs = {
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<PrizePoolAccount_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  where?: Maybe<PrizePoolAccount_Filter>;
};

export type PrizePoolPrizesArgs = {
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<Prize_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  where?: Maybe<Prize_Filter>;
};

export type PrizePoolTokenCreditBalancesArgs = {
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<CreditBalance_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  where?: Maybe<CreditBalance_Filter>;
};

export type PrizePoolTokenCreditRatesArgs = {
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<CreditRate_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  where?: Maybe<CreditRate_Filter>;
};

export type PrizePoolAccount = {
  __typename?: "PrizePoolAccount";
  account: Account;
  id: Scalars["ID"];
  prizePool: PrizePool;
};

export type PrizePoolAccount_Filter = {
  account?: Maybe<Scalars["String"]>;
  account_contains?: Maybe<Scalars["String"]>;
  account_ends_with?: Maybe<Scalars["String"]>;
  account_gt?: Maybe<Scalars["String"]>;
  account_gte?: Maybe<Scalars["String"]>;
  account_in?: Maybe<Array<Scalars["String"]>>;
  account_lt?: Maybe<Scalars["String"]>;
  account_lte?: Maybe<Scalars["String"]>;
  account_not?: Maybe<Scalars["String"]>;
  account_not_contains?: Maybe<Scalars["String"]>;
  account_not_ends_with?: Maybe<Scalars["String"]>;
  account_not_in?: Maybe<Array<Scalars["String"]>>;
  account_not_starts_with?: Maybe<Scalars["String"]>;
  account_starts_with?: Maybe<Scalars["String"]>;
  id?: Maybe<Scalars["ID"]>;
  id_gt?: Maybe<Scalars["ID"]>;
  id_gte?: Maybe<Scalars["ID"]>;
  id_in?: Maybe<Array<Scalars["ID"]>>;
  id_lt?: Maybe<Scalars["ID"]>;
  id_lte?: Maybe<Scalars["ID"]>;
  id_not?: Maybe<Scalars["ID"]>;
  id_not_in?: Maybe<Array<Scalars["ID"]>>;
  prizePool?: Maybe<Scalars["String"]>;
  prizePool_contains?: Maybe<Scalars["String"]>;
  prizePool_ends_with?: Maybe<Scalars["String"]>;
  prizePool_gt?: Maybe<Scalars["String"]>;
  prizePool_gte?: Maybe<Scalars["String"]>;
  prizePool_in?: Maybe<Array<Scalars["String"]>>;
  prizePool_lt?: Maybe<Scalars["String"]>;
  prizePool_lte?: Maybe<Scalars["String"]>;
  prizePool_not?: Maybe<Scalars["String"]>;
  prizePool_not_contains?: Maybe<Scalars["String"]>;
  prizePool_not_ends_with?: Maybe<Scalars["String"]>;
  prizePool_not_in?: Maybe<Array<Scalars["String"]>>;
  prizePool_not_starts_with?: Maybe<Scalars["String"]>;
  prizePool_starts_with?: Maybe<Scalars["String"]>;
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
  compoundPrizePool?: Maybe<Scalars["String"]>;
  compoundPrizePool_contains?: Maybe<Scalars["String"]>;
  compoundPrizePool_ends_with?: Maybe<Scalars["String"]>;
  compoundPrizePool_gt?: Maybe<Scalars["String"]>;
  compoundPrizePool_gte?: Maybe<Scalars["String"]>;
  compoundPrizePool_in?: Maybe<Array<Scalars["String"]>>;
  compoundPrizePool_lt?: Maybe<Scalars["String"]>;
  compoundPrizePool_lte?: Maybe<Scalars["String"]>;
  compoundPrizePool_not?: Maybe<Scalars["String"]>;
  compoundPrizePool_not_contains?: Maybe<Scalars["String"]>;
  compoundPrizePool_not_ends_with?: Maybe<Scalars["String"]>;
  compoundPrizePool_not_in?: Maybe<Array<Scalars["String"]>>;
  compoundPrizePool_not_starts_with?: Maybe<Scalars["String"]>;
  compoundPrizePool_starts_with?: Maybe<Scalars["String"]>;
  cumulativePrizeGross?: Maybe<Scalars["BigInt"]>;
  cumulativePrizeGross_gt?: Maybe<Scalars["BigInt"]>;
  cumulativePrizeGross_gte?: Maybe<Scalars["BigInt"]>;
  cumulativePrizeGross_in?: Maybe<Array<Scalars["BigInt"]>>;
  cumulativePrizeGross_lt?: Maybe<Scalars["BigInt"]>;
  cumulativePrizeGross_lte?: Maybe<Scalars["BigInt"]>;
  cumulativePrizeGross_not?: Maybe<Scalars["BigInt"]>;
  cumulativePrizeGross_not_in?: Maybe<Array<Scalars["BigInt"]>>;
  cumulativePrizeNet?: Maybe<Scalars["BigInt"]>;
  cumulativePrizeNet_gt?: Maybe<Scalars["BigInt"]>;
  cumulativePrizeNet_gte?: Maybe<Scalars["BigInt"]>;
  cumulativePrizeNet_in?: Maybe<Array<Scalars["BigInt"]>>;
  cumulativePrizeNet_lt?: Maybe<Scalars["BigInt"]>;
  cumulativePrizeNet_lte?: Maybe<Scalars["BigInt"]>;
  cumulativePrizeNet_not?: Maybe<Scalars["BigInt"]>;
  cumulativePrizeNet_not_in?: Maybe<Array<Scalars["BigInt"]>>;
  cumulativePrizeReserveFee?: Maybe<Scalars["BigInt"]>;
  cumulativePrizeReserveFee_gt?: Maybe<Scalars["BigInt"]>;
  cumulativePrizeReserveFee_gte?: Maybe<Scalars["BigInt"]>;
  cumulativePrizeReserveFee_in?: Maybe<Array<Scalars["BigInt"]>>;
  cumulativePrizeReserveFee_lt?: Maybe<Scalars["BigInt"]>;
  cumulativePrizeReserveFee_lte?: Maybe<Scalars["BigInt"]>;
  cumulativePrizeReserveFee_not?: Maybe<Scalars["BigInt"]>;
  cumulativePrizeReserveFee_not_in?: Maybe<Array<Scalars["BigInt"]>>;
  currentPrizeId?: Maybe<Scalars["BigInt"]>;
  currentPrizeId_gt?: Maybe<Scalars["BigInt"]>;
  currentPrizeId_gte?: Maybe<Scalars["BigInt"]>;
  currentPrizeId_in?: Maybe<Array<Scalars["BigInt"]>>;
  currentPrizeId_lt?: Maybe<Scalars["BigInt"]>;
  currentPrizeId_lte?: Maybe<Scalars["BigInt"]>;
  currentPrizeId_not?: Maybe<Scalars["BigInt"]>;
  currentPrizeId_not_in?: Maybe<Array<Scalars["BigInt"]>>;
  currentState?: Maybe<PrizePoolState>;
  currentState_in?: Maybe<Array<PrizePoolState>>;
  currentState_not?: Maybe<PrizePoolState>;
  currentState_not_in?: Maybe<Array<PrizePoolState>>;
  deactivated?: Maybe<Scalars["Boolean"]>;
  deactivated_in?: Maybe<Array<Scalars["Boolean"]>>;
  deactivated_not?: Maybe<Scalars["Boolean"]>;
  deactivated_not_in?: Maybe<Array<Scalars["Boolean"]>>;
  id?: Maybe<Scalars["ID"]>;
  id_gt?: Maybe<Scalars["ID"]>;
  id_gte?: Maybe<Scalars["ID"]>;
  id_in?: Maybe<Array<Scalars["ID"]>>;
  id_lt?: Maybe<Scalars["ID"]>;
  id_lte?: Maybe<Scalars["ID"]>;
  id_not?: Maybe<Scalars["ID"]>;
  id_not_in?: Maybe<Array<Scalars["ID"]>>;
  liquidityCap?: Maybe<Scalars["BigInt"]>;
  liquidityCap_gt?: Maybe<Scalars["BigInt"]>;
  liquidityCap_gte?: Maybe<Scalars["BigInt"]>;
  liquidityCap_in?: Maybe<Array<Scalars["BigInt"]>>;
  liquidityCap_lt?: Maybe<Scalars["BigInt"]>;
  liquidityCap_lte?: Maybe<Scalars["BigInt"]>;
  liquidityCap_not?: Maybe<Scalars["BigInt"]>;
  liquidityCap_not_in?: Maybe<Array<Scalars["BigInt"]>>;
  maxExitFeeMantissa?: Maybe<Scalars["BigInt"]>;
  maxExitFeeMantissa_gt?: Maybe<Scalars["BigInt"]>;
  maxExitFeeMantissa_gte?: Maybe<Scalars["BigInt"]>;
  maxExitFeeMantissa_in?: Maybe<Array<Scalars["BigInt"]>>;
  maxExitFeeMantissa_lt?: Maybe<Scalars["BigInt"]>;
  maxExitFeeMantissa_lte?: Maybe<Scalars["BigInt"]>;
  maxExitFeeMantissa_not?: Maybe<Scalars["BigInt"]>;
  maxExitFeeMantissa_not_in?: Maybe<Array<Scalars["BigInt"]>>;
  owner?: Maybe<Scalars["Bytes"]>;
  owner_contains?: Maybe<Scalars["Bytes"]>;
  owner_in?: Maybe<Array<Scalars["Bytes"]>>;
  owner_not?: Maybe<Scalars["Bytes"]>;
  owner_not_contains?: Maybe<Scalars["Bytes"]>;
  owner_not_in?: Maybe<Array<Scalars["Bytes"]>>;
  prizePoolType?: Maybe<PrizePoolType>;
  prizePoolType_in?: Maybe<Array<PrizePoolType>>;
  prizePoolType_not?: Maybe<PrizePoolType>;
  prizePoolType_not_in?: Maybe<Array<PrizePoolType>>;
  prizeStrategy?: Maybe<Scalars["String"]>;
  prizeStrategy_contains?: Maybe<Scalars["String"]>;
  prizeStrategy_ends_with?: Maybe<Scalars["String"]>;
  prizeStrategy_gt?: Maybe<Scalars["String"]>;
  prizeStrategy_gte?: Maybe<Scalars["String"]>;
  prizeStrategy_in?: Maybe<Array<Scalars["String"]>>;
  prizeStrategy_lt?: Maybe<Scalars["String"]>;
  prizeStrategy_lte?: Maybe<Scalars["String"]>;
  prizeStrategy_not?: Maybe<Scalars["String"]>;
  prizeStrategy_not_contains?: Maybe<Scalars["String"]>;
  prizeStrategy_not_ends_with?: Maybe<Scalars["String"]>;
  prizeStrategy_not_in?: Maybe<Array<Scalars["String"]>>;
  prizeStrategy_not_starts_with?: Maybe<Scalars["String"]>;
  prizeStrategy_starts_with?: Maybe<Scalars["String"]>;
  reserveFeeControlledToken?: Maybe<Scalars["Bytes"]>;
  reserveFeeControlledToken_contains?: Maybe<Scalars["Bytes"]>;
  reserveFeeControlledToken_in?: Maybe<Array<Scalars["Bytes"]>>;
  reserveFeeControlledToken_not?: Maybe<Scalars["Bytes"]>;
  reserveFeeControlledToken_not_contains?: Maybe<Scalars["Bytes"]>;
  reserveFeeControlledToken_not_in?: Maybe<Array<Scalars["Bytes"]>>;
  reserveRegistry?: Maybe<Scalars["Bytes"]>;
  reserveRegistry_contains?: Maybe<Scalars["Bytes"]>;
  reserveRegistry_in?: Maybe<Array<Scalars["Bytes"]>>;
  reserveRegistry_not?: Maybe<Scalars["Bytes"]>;
  reserveRegistry_not_contains?: Maybe<Scalars["Bytes"]>;
  reserveRegistry_not_in?: Maybe<Array<Scalars["Bytes"]>>;
  stakePrizePool?: Maybe<Scalars["String"]>;
  stakePrizePool_contains?: Maybe<Scalars["String"]>;
  stakePrizePool_ends_with?: Maybe<Scalars["String"]>;
  stakePrizePool_gt?: Maybe<Scalars["String"]>;
  stakePrizePool_gte?: Maybe<Scalars["String"]>;
  stakePrizePool_in?: Maybe<Array<Scalars["String"]>>;
  stakePrizePool_lt?: Maybe<Scalars["String"]>;
  stakePrizePool_lte?: Maybe<Scalars["String"]>;
  stakePrizePool_not?: Maybe<Scalars["String"]>;
  stakePrizePool_not_contains?: Maybe<Scalars["String"]>;
  stakePrizePool_not_ends_with?: Maybe<Scalars["String"]>;
  stakePrizePool_not_in?: Maybe<Array<Scalars["String"]>>;
  stakePrizePool_not_starts_with?: Maybe<Scalars["String"]>;
  stakePrizePool_starts_with?: Maybe<Scalars["String"]>;
  underlyingCollateralDecimals?: Maybe<Scalars["BigInt"]>;
  underlyingCollateralDecimals_gt?: Maybe<Scalars["BigInt"]>;
  underlyingCollateralDecimals_gte?: Maybe<Scalars["BigInt"]>;
  underlyingCollateralDecimals_in?: Maybe<Array<Scalars["BigInt"]>>;
  underlyingCollateralDecimals_lt?: Maybe<Scalars["BigInt"]>;
  underlyingCollateralDecimals_lte?: Maybe<Scalars["BigInt"]>;
  underlyingCollateralDecimals_not?: Maybe<Scalars["BigInt"]>;
  underlyingCollateralDecimals_not_in?: Maybe<Array<Scalars["BigInt"]>>;
  underlyingCollateralName?: Maybe<Scalars["String"]>;
  underlyingCollateralName_contains?: Maybe<Scalars["String"]>;
  underlyingCollateralName_ends_with?: Maybe<Scalars["String"]>;
  underlyingCollateralName_gt?: Maybe<Scalars["String"]>;
  underlyingCollateralName_gte?: Maybe<Scalars["String"]>;
  underlyingCollateralName_in?: Maybe<Array<Scalars["String"]>>;
  underlyingCollateralName_lt?: Maybe<Scalars["String"]>;
  underlyingCollateralName_lte?: Maybe<Scalars["String"]>;
  underlyingCollateralName_not?: Maybe<Scalars["String"]>;
  underlyingCollateralName_not_contains?: Maybe<Scalars["String"]>;
  underlyingCollateralName_not_ends_with?: Maybe<Scalars["String"]>;
  underlyingCollateralName_not_in?: Maybe<Array<Scalars["String"]>>;
  underlyingCollateralName_not_starts_with?: Maybe<Scalars["String"]>;
  underlyingCollateralName_starts_with?: Maybe<Scalars["String"]>;
  underlyingCollateralSymbol?: Maybe<Scalars["String"]>;
  underlyingCollateralSymbol_contains?: Maybe<Scalars["String"]>;
  underlyingCollateralSymbol_ends_with?: Maybe<Scalars["String"]>;
  underlyingCollateralSymbol_gt?: Maybe<Scalars["String"]>;
  underlyingCollateralSymbol_gte?: Maybe<Scalars["String"]>;
  underlyingCollateralSymbol_in?: Maybe<Array<Scalars["String"]>>;
  underlyingCollateralSymbol_lt?: Maybe<Scalars["String"]>;
  underlyingCollateralSymbol_lte?: Maybe<Scalars["String"]>;
  underlyingCollateralSymbol_not?: Maybe<Scalars["String"]>;
  underlyingCollateralSymbol_not_contains?: Maybe<Scalars["String"]>;
  underlyingCollateralSymbol_not_ends_with?: Maybe<Scalars["String"]>;
  underlyingCollateralSymbol_not_in?: Maybe<Array<Scalars["String"]>>;
  underlyingCollateralSymbol_not_starts_with?: Maybe<Scalars["String"]>;
  underlyingCollateralSymbol_starts_with?: Maybe<Scalars["String"]>;
  underlyingCollateralToken?: Maybe<Scalars["Bytes"]>;
  underlyingCollateralToken_contains?: Maybe<Scalars["Bytes"]>;
  underlyingCollateralToken_in?: Maybe<Array<Scalars["Bytes"]>>;
  underlyingCollateralToken_not?: Maybe<Scalars["Bytes"]>;
  underlyingCollateralToken_not_contains?: Maybe<Scalars["Bytes"]>;
  underlyingCollateralToken_not_in?: Maybe<Array<Scalars["Bytes"]>>;
  yieldSourcePrizePool?: Maybe<Scalars["String"]>;
  yieldSourcePrizePool_contains?: Maybe<Scalars["String"]>;
  yieldSourcePrizePool_ends_with?: Maybe<Scalars["String"]>;
  yieldSourcePrizePool_gt?: Maybe<Scalars["String"]>;
  yieldSourcePrizePool_gte?: Maybe<Scalars["String"]>;
  yieldSourcePrizePool_in?: Maybe<Array<Scalars["String"]>>;
  yieldSourcePrizePool_lt?: Maybe<Scalars["String"]>;
  yieldSourcePrizePool_lte?: Maybe<Scalars["String"]>;
  yieldSourcePrizePool_not?: Maybe<Scalars["String"]>;
  yieldSourcePrizePool_not_contains?: Maybe<Scalars["String"]>;
  yieldSourcePrizePool_not_ends_with?: Maybe<Scalars["String"]>;
  yieldSourcePrizePool_not_in?: Maybe<Array<Scalars["String"]>>;
  yieldSourcePrizePool_not_starts_with?: Maybe<Scalars["String"]>;
  yieldSourcePrizePool_starts_with?: Maybe<Scalars["String"]>;
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
  id?: Maybe<Scalars["ID"]>;
  id_gt?: Maybe<Scalars["ID"]>;
  id_gte?: Maybe<Scalars["ID"]>;
  id_in?: Maybe<Array<Scalars["ID"]>>;
  id_lt?: Maybe<Scalars["ID"]>;
  id_lte?: Maybe<Scalars["ID"]>;
  id_not?: Maybe<Scalars["ID"]>;
  id_not_in?: Maybe<Array<Scalars["ID"]>>;
  percentage?: Maybe<Scalars["BigInt"]>;
  percentage_gt?: Maybe<Scalars["BigInt"]>;
  percentage_gte?: Maybe<Scalars["BigInt"]>;
  percentage_in?: Maybe<Array<Scalars["BigInt"]>>;
  percentage_lt?: Maybe<Scalars["BigInt"]>;
  percentage_lte?: Maybe<Scalars["BigInt"]>;
  percentage_not?: Maybe<Scalars["BigInt"]>;
  percentage_not_in?: Maybe<Array<Scalars["BigInt"]>>;
  prizeStrategy?: Maybe<Scalars["String"]>;
  prizeStrategy_contains?: Maybe<Scalars["String"]>;
  prizeStrategy_ends_with?: Maybe<Scalars["String"]>;
  prizeStrategy_gt?: Maybe<Scalars["String"]>;
  prizeStrategy_gte?: Maybe<Scalars["String"]>;
  prizeStrategy_in?: Maybe<Array<Scalars["String"]>>;
  prizeStrategy_lt?: Maybe<Scalars["String"]>;
  prizeStrategy_lte?: Maybe<Scalars["String"]>;
  prizeStrategy_not?: Maybe<Scalars["String"]>;
  prizeStrategy_not_contains?: Maybe<Scalars["String"]>;
  prizeStrategy_not_ends_with?: Maybe<Scalars["String"]>;
  prizeStrategy_not_in?: Maybe<Array<Scalars["String"]>>;
  prizeStrategy_not_starts_with?: Maybe<Scalars["String"]>;
  prizeStrategy_starts_with?: Maybe<Scalars["String"]>;
  target?: Maybe<Scalars["Bytes"]>;
  target_contains?: Maybe<Scalars["Bytes"]>;
  target_in?: Maybe<Array<Scalars["Bytes"]>>;
  target_not?: Maybe<Scalars["Bytes"]>;
  target_not_contains?: Maybe<Scalars["Bytes"]>;
  target_not_in?: Maybe<Array<Scalars["Bytes"]>>;
  tokenType?: Maybe<Scalars["BigInt"]>;
  tokenType_gt?: Maybe<Scalars["BigInt"]>;
  tokenType_gte?: Maybe<Scalars["BigInt"]>;
  tokenType_in?: Maybe<Array<Scalars["BigInt"]>>;
  tokenType_lt?: Maybe<Scalars["BigInt"]>;
  tokenType_lte?: Maybe<Scalars["BigInt"]>;
  tokenType_not?: Maybe<Scalars["BigInt"]>;
  tokenType_not_in?: Maybe<Array<Scalars["BigInt"]>>;
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
  id?: Maybe<Scalars["ID"]>;
  id_gt?: Maybe<Scalars["ID"]>;
  id_gte?: Maybe<Scalars["ID"]>;
  id_in?: Maybe<Array<Scalars["ID"]>>;
  id_lt?: Maybe<Scalars["ID"]>;
  id_lte?: Maybe<Scalars["ID"]>;
  id_not?: Maybe<Scalars["ID"]>;
  id_not_in?: Maybe<Array<Scalars["ID"]>>;
  multipleWinners?: Maybe<Scalars["String"]>;
  multipleWinners_contains?: Maybe<Scalars["String"]>;
  multipleWinners_ends_with?: Maybe<Scalars["String"]>;
  multipleWinners_gt?: Maybe<Scalars["String"]>;
  multipleWinners_gte?: Maybe<Scalars["String"]>;
  multipleWinners_in?: Maybe<Array<Scalars["String"]>>;
  multipleWinners_lt?: Maybe<Scalars["String"]>;
  multipleWinners_lte?: Maybe<Scalars["String"]>;
  multipleWinners_not?: Maybe<Scalars["String"]>;
  multipleWinners_not_contains?: Maybe<Scalars["String"]>;
  multipleWinners_not_ends_with?: Maybe<Scalars["String"]>;
  multipleWinners_not_in?: Maybe<Array<Scalars["String"]>>;
  multipleWinners_not_starts_with?: Maybe<Scalars["String"]>;
  multipleWinners_starts_with?: Maybe<Scalars["String"]>;
  singleRandomWinner?: Maybe<Scalars["String"]>;
  singleRandomWinner_contains?: Maybe<Scalars["String"]>;
  singleRandomWinner_ends_with?: Maybe<Scalars["String"]>;
  singleRandomWinner_gt?: Maybe<Scalars["String"]>;
  singleRandomWinner_gte?: Maybe<Scalars["String"]>;
  singleRandomWinner_in?: Maybe<Array<Scalars["String"]>>;
  singleRandomWinner_lt?: Maybe<Scalars["String"]>;
  singleRandomWinner_lte?: Maybe<Scalars["String"]>;
  singleRandomWinner_not?: Maybe<Scalars["String"]>;
  singleRandomWinner_not_contains?: Maybe<Scalars["String"]>;
  singleRandomWinner_not_ends_with?: Maybe<Scalars["String"]>;
  singleRandomWinner_not_in?: Maybe<Array<Scalars["String"]>>;
  singleRandomWinner_not_starts_with?: Maybe<Scalars["String"]>;
  singleRandomWinner_starts_with?: Maybe<Scalars["String"]>;
};

export enum PrizeStrategy_OrderBy {
  Id = "id",
  MultipleWinners = "multipleWinners",
  SingleRandomWinner = "singleRandomWinner",
}

export type Prize_Filter = {
  awardStartOperator?: Maybe<Scalars["Bytes"]>;
  awardStartOperator_contains?: Maybe<Scalars["Bytes"]>;
  awardStartOperator_in?: Maybe<Array<Scalars["Bytes"]>>;
  awardStartOperator_not?: Maybe<Scalars["Bytes"]>;
  awardStartOperator_not_contains?: Maybe<Scalars["Bytes"]>;
  awardStartOperator_not_in?: Maybe<Array<Scalars["Bytes"]>>;
  awardedBlock?: Maybe<Scalars["BigInt"]>;
  awardedBlock_gt?: Maybe<Scalars["BigInt"]>;
  awardedBlock_gte?: Maybe<Scalars["BigInt"]>;
  awardedBlock_in?: Maybe<Array<Scalars["BigInt"]>>;
  awardedBlock_lt?: Maybe<Scalars["BigInt"]>;
  awardedBlock_lte?: Maybe<Scalars["BigInt"]>;
  awardedBlock_not?: Maybe<Scalars["BigInt"]>;
  awardedBlock_not_in?: Maybe<Array<Scalars["BigInt"]>>;
  awardedOperator?: Maybe<Scalars["Bytes"]>;
  awardedOperator_contains?: Maybe<Scalars["Bytes"]>;
  awardedOperator_in?: Maybe<Array<Scalars["Bytes"]>>;
  awardedOperator_not?: Maybe<Scalars["Bytes"]>;
  awardedOperator_not_contains?: Maybe<Scalars["Bytes"]>;
  awardedOperator_not_in?: Maybe<Array<Scalars["Bytes"]>>;
  awardedTimestamp?: Maybe<Scalars["BigInt"]>;
  awardedTimestamp_gt?: Maybe<Scalars["BigInt"]>;
  awardedTimestamp_gte?: Maybe<Scalars["BigInt"]>;
  awardedTimestamp_in?: Maybe<Array<Scalars["BigInt"]>>;
  awardedTimestamp_lt?: Maybe<Scalars["BigInt"]>;
  awardedTimestamp_lte?: Maybe<Scalars["BigInt"]>;
  awardedTimestamp_not?: Maybe<Scalars["BigInt"]>;
  awardedTimestamp_not_in?: Maybe<Array<Scalars["BigInt"]>>;
  id?: Maybe<Scalars["ID"]>;
  id_gt?: Maybe<Scalars["ID"]>;
  id_gte?: Maybe<Scalars["ID"]>;
  id_in?: Maybe<Array<Scalars["ID"]>>;
  id_lt?: Maybe<Scalars["ID"]>;
  id_lte?: Maybe<Scalars["ID"]>;
  id_not?: Maybe<Scalars["ID"]>;
  id_not_in?: Maybe<Array<Scalars["ID"]>>;
  lockBlock?: Maybe<Scalars["BigInt"]>;
  lockBlock_gt?: Maybe<Scalars["BigInt"]>;
  lockBlock_gte?: Maybe<Scalars["BigInt"]>;
  lockBlock_in?: Maybe<Array<Scalars["BigInt"]>>;
  lockBlock_lt?: Maybe<Scalars["BigInt"]>;
  lockBlock_lte?: Maybe<Scalars["BigInt"]>;
  lockBlock_not?: Maybe<Scalars["BigInt"]>;
  lockBlock_not_in?: Maybe<Array<Scalars["BigInt"]>>;
  numberOfExternalAwardedErc20Winners?: Maybe<Scalars["BigInt"]>;
  numberOfExternalAwardedErc20Winners_gt?: Maybe<Scalars["BigInt"]>;
  numberOfExternalAwardedErc20Winners_gte?: Maybe<Scalars["BigInt"]>;
  numberOfExternalAwardedErc20Winners_in?: Maybe<Array<Scalars["BigInt"]>>;
  numberOfExternalAwardedErc20Winners_lt?: Maybe<Scalars["BigInt"]>;
  numberOfExternalAwardedErc20Winners_lte?: Maybe<Scalars["BigInt"]>;
  numberOfExternalAwardedErc20Winners_not?: Maybe<Scalars["BigInt"]>;
  numberOfExternalAwardedErc20Winners_not_in?: Maybe<Array<Scalars["BigInt"]>>;
  numberOfSubWinners?: Maybe<Scalars["BigInt"]>;
  numberOfSubWinners_gt?: Maybe<Scalars["BigInt"]>;
  numberOfSubWinners_gte?: Maybe<Scalars["BigInt"]>;
  numberOfSubWinners_in?: Maybe<Array<Scalars["BigInt"]>>;
  numberOfSubWinners_lt?: Maybe<Scalars["BigInt"]>;
  numberOfSubWinners_lte?: Maybe<Scalars["BigInt"]>;
  numberOfSubWinners_not?: Maybe<Scalars["BigInt"]>;
  numberOfSubWinners_not_in?: Maybe<Array<Scalars["BigInt"]>>;
  prizePeriodStartedTimestamp?: Maybe<Scalars["BigInt"]>;
  prizePeriodStartedTimestamp_gt?: Maybe<Scalars["BigInt"]>;
  prizePeriodStartedTimestamp_gte?: Maybe<Scalars["BigInt"]>;
  prizePeriodStartedTimestamp_in?: Maybe<Array<Scalars["BigInt"]>>;
  prizePeriodStartedTimestamp_lt?: Maybe<Scalars["BigInt"]>;
  prizePeriodStartedTimestamp_lte?: Maybe<Scalars["BigInt"]>;
  prizePeriodStartedTimestamp_not?: Maybe<Scalars["BigInt"]>;
  prizePeriodStartedTimestamp_not_in?: Maybe<Array<Scalars["BigInt"]>>;
  prizePool?: Maybe<Scalars["String"]>;
  prizePool_contains?: Maybe<Scalars["String"]>;
  prizePool_ends_with?: Maybe<Scalars["String"]>;
  prizePool_gt?: Maybe<Scalars["String"]>;
  prizePool_gte?: Maybe<Scalars["String"]>;
  prizePool_in?: Maybe<Array<Scalars["String"]>>;
  prizePool_lt?: Maybe<Scalars["String"]>;
  prizePool_lte?: Maybe<Scalars["String"]>;
  prizePool_not?: Maybe<Scalars["String"]>;
  prizePool_not_contains?: Maybe<Scalars["String"]>;
  prizePool_not_ends_with?: Maybe<Scalars["String"]>;
  prizePool_not_in?: Maybe<Array<Scalars["String"]>>;
  prizePool_not_starts_with?: Maybe<Scalars["String"]>;
  prizePool_starts_with?: Maybe<Scalars["String"]>;
  randomNumber?: Maybe<Scalars["BigInt"]>;
  randomNumber_gt?: Maybe<Scalars["BigInt"]>;
  randomNumber_gte?: Maybe<Scalars["BigInt"]>;
  randomNumber_in?: Maybe<Array<Scalars["BigInt"]>>;
  randomNumber_lt?: Maybe<Scalars["BigInt"]>;
  randomNumber_lte?: Maybe<Scalars["BigInt"]>;
  randomNumber_not?: Maybe<Scalars["BigInt"]>;
  randomNumber_not_in?: Maybe<Array<Scalars["BigInt"]>>;
  rngRequestId?: Maybe<Scalars["BigInt"]>;
  rngRequestId_gt?: Maybe<Scalars["BigInt"]>;
  rngRequestId_gte?: Maybe<Scalars["BigInt"]>;
  rngRequestId_in?: Maybe<Array<Scalars["BigInt"]>>;
  rngRequestId_lt?: Maybe<Scalars["BigInt"]>;
  rngRequestId_lte?: Maybe<Scalars["BigInt"]>;
  rngRequestId_not?: Maybe<Scalars["BigInt"]>;
  rngRequestId_not_in?: Maybe<Array<Scalars["BigInt"]>>;
  totalTicketSupply?: Maybe<Scalars["BigInt"]>;
  totalTicketSupply_gt?: Maybe<Scalars["BigInt"]>;
  totalTicketSupply_gte?: Maybe<Scalars["BigInt"]>;
  totalTicketSupply_in?: Maybe<Array<Scalars["BigInt"]>>;
  totalTicketSupply_lt?: Maybe<Scalars["BigInt"]>;
  totalTicketSupply_lte?: Maybe<Scalars["BigInt"]>;
  totalTicketSupply_not?: Maybe<Scalars["BigInt"]>;
  totalTicketSupply_not_in?: Maybe<Array<Scalars["BigInt"]>>;
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
  block?: Maybe<Block_Height>;
};

export type QueryAccountArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryAccountsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<Account_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<Account_Filter>;
};

export type QueryAwardedControlledTokenArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryAwardedControlledTokensArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<AwardedControlledToken_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<AwardedControlledToken_Filter>;
};

export type QueryAwardedExternalErc20TokenArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryAwardedExternalErc20TokensArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<AwardedExternalErc20Token_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<AwardedExternalErc20Token_Filter>;
};

export type QueryAwardedExternalErc721NftArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryAwardedExternalErc721NftsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<AwardedExternalErc721Nft_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<AwardedExternalErc721Nft_Filter>;
};

export type QueryBalanceDripArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryBalanceDripPlayerArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryBalanceDripPlayersArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<BalanceDripPlayer_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<BalanceDripPlayer_Filter>;
};

export type QueryBalanceDripsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<BalanceDrip_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<BalanceDrip_Filter>;
};

export type QueryCompoundPrizePoolArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryCompoundPrizePoolsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<CompoundPrizePool_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<CompoundPrizePool_Filter>;
};

export type QueryComptrollerArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryComptrollersArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<Comptroller_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<Comptroller_Filter>;
};

export type QueryControlledTokenArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryControlledTokenBalanceArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryControlledTokenBalancesArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<ControlledTokenBalance_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<ControlledTokenBalance_Filter>;
};

export type QueryControlledTokensArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<ControlledToken_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<ControlledToken_Filter>;
};

export type QueryCreditBalanceArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryCreditBalancesArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<CreditBalance_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<CreditBalance_Filter>;
};

export type QueryCreditRateArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryCreditRatesArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<CreditRate_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<CreditRate_Filter>;
};

export type QueryDripTokenPlayerArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryDripTokenPlayersArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<DripTokenPlayer_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<DripTokenPlayer_Filter>;
};

export type QueryMultipleWinnersExternalErc20AwardArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryMultipleWinnersExternalErc20AwardsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<MultipleWinnersExternalErc20Award_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<MultipleWinnersExternalErc20Award_Filter>;
};

export type QueryMultipleWinnersExternalErc721AwardArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryMultipleWinnersExternalErc721AwardsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<MultipleWinnersExternalErc721Award_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<MultipleWinnersExternalErc721Award_Filter>;
};

export type QueryMultipleWinnersPrizeStrategiesArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<MultipleWinnersPrizeStrategy_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<MultipleWinnersPrizeStrategy_Filter>;
};

export type QueryMultipleWinnersPrizeStrategyArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryPrizeArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryPrizePoolArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryPrizePoolAccountArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryPrizePoolAccountsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<PrizePoolAccount_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<PrizePoolAccount_Filter>;
};

export type QueryPrizePoolsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<PrizePool_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<PrizePool_Filter>;
};

export type QueryPrizeSplitArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryPrizeSplitsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<PrizeSplit_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<PrizeSplit_Filter>;
};

export type QueryPrizeStrategiesArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<PrizeStrategy_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<PrizeStrategy_Filter>;
};

export type QueryPrizeStrategyArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryPrizesArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<Prize_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<Prize_Filter>;
};

export type QuerySablierStreamArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QuerySablierStreamsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<SablierStream_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<SablierStream_Filter>;
};

export type QuerySingleRandomWinnerExternalErc20AwardArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QuerySingleRandomWinnerExternalErc20AwardsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<SingleRandomWinnerExternalErc20Award_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<SingleRandomWinnerExternalErc20Award_Filter>;
};

export type QuerySingleRandomWinnerExternalErc721AwardArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QuerySingleRandomWinnerExternalErc721AwardsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<SingleRandomWinnerExternalErc721Award_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<SingleRandomWinnerExternalErc721Award_Filter>;
};

export type QuerySingleRandomWinnerPrizeStrategiesArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<SingleRandomWinnerPrizeStrategy_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<SingleRandomWinnerPrizeStrategy_Filter>;
};

export type QuerySingleRandomWinnerPrizeStrategyArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryStakePrizePoolArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryStakePrizePoolsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<StakePrizePool_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<StakePrizePool_Filter>;
};

export type QueryVolumeDripArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryVolumeDripPeriodArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryVolumeDripPeriodsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<VolumeDripPeriod_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<VolumeDripPeriod_Filter>;
};

export type QueryVolumeDripPlayerArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryVolumeDripPlayersArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<VolumeDripPlayer_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<VolumeDripPlayer_Filter>;
};

export type QueryVolumeDripsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<VolumeDrip_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<VolumeDrip_Filter>;
};

export type QueryYieldSourcePrizePoolArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryYieldSourcePrizePoolsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<YieldSourcePrizePool_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<YieldSourcePrizePool_Filter>;
};

export type SablierStream = {
  __typename?: "SablierStream";
  id: Scalars["ID"];
  prizePool: PrizePool;
};

export type SablierStream_Filter = {
  id?: Maybe<Scalars["ID"]>;
  id_gt?: Maybe<Scalars["ID"]>;
  id_gte?: Maybe<Scalars["ID"]>;
  id_in?: Maybe<Array<Scalars["ID"]>>;
  id_lt?: Maybe<Scalars["ID"]>;
  id_lte?: Maybe<Scalars["ID"]>;
  id_not?: Maybe<Scalars["ID"]>;
  id_not_in?: Maybe<Array<Scalars["ID"]>>;
  prizePool?: Maybe<Scalars["String"]>;
  prizePool_contains?: Maybe<Scalars["String"]>;
  prizePool_ends_with?: Maybe<Scalars["String"]>;
  prizePool_gt?: Maybe<Scalars["String"]>;
  prizePool_gte?: Maybe<Scalars["String"]>;
  prizePool_in?: Maybe<Array<Scalars["String"]>>;
  prizePool_lt?: Maybe<Scalars["String"]>;
  prizePool_lte?: Maybe<Scalars["String"]>;
  prizePool_not?: Maybe<Scalars["String"]>;
  prizePool_not_contains?: Maybe<Scalars["String"]>;
  prizePool_not_ends_with?: Maybe<Scalars["String"]>;
  prizePool_not_in?: Maybe<Array<Scalars["String"]>>;
  prizePool_not_starts_with?: Maybe<Scalars["String"]>;
  prizePool_starts_with?: Maybe<Scalars["String"]>;
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
  address?: Maybe<Scalars["Bytes"]>;
  address_contains?: Maybe<Scalars["Bytes"]>;
  address_in?: Maybe<Array<Scalars["Bytes"]>>;
  address_not?: Maybe<Scalars["Bytes"]>;
  address_not_contains?: Maybe<Scalars["Bytes"]>;
  address_not_in?: Maybe<Array<Scalars["Bytes"]>>;
  decimals?: Maybe<Scalars["BigInt"]>;
  decimals_gt?: Maybe<Scalars["BigInt"]>;
  decimals_gte?: Maybe<Scalars["BigInt"]>;
  decimals_in?: Maybe<Array<Scalars["BigInt"]>>;
  decimals_lt?: Maybe<Scalars["BigInt"]>;
  decimals_lte?: Maybe<Scalars["BigInt"]>;
  decimals_not?: Maybe<Scalars["BigInt"]>;
  decimals_not_in?: Maybe<Array<Scalars["BigInt"]>>;
  id?: Maybe<Scalars["ID"]>;
  id_gt?: Maybe<Scalars["ID"]>;
  id_gte?: Maybe<Scalars["ID"]>;
  id_in?: Maybe<Array<Scalars["ID"]>>;
  id_lt?: Maybe<Scalars["ID"]>;
  id_lte?: Maybe<Scalars["ID"]>;
  id_not?: Maybe<Scalars["ID"]>;
  id_not_in?: Maybe<Array<Scalars["ID"]>>;
  name?: Maybe<Scalars["String"]>;
  name_contains?: Maybe<Scalars["String"]>;
  name_ends_with?: Maybe<Scalars["String"]>;
  name_gt?: Maybe<Scalars["String"]>;
  name_gte?: Maybe<Scalars["String"]>;
  name_in?: Maybe<Array<Scalars["String"]>>;
  name_lt?: Maybe<Scalars["String"]>;
  name_lte?: Maybe<Scalars["String"]>;
  name_not?: Maybe<Scalars["String"]>;
  name_not_contains?: Maybe<Scalars["String"]>;
  name_not_ends_with?: Maybe<Scalars["String"]>;
  name_not_in?: Maybe<Array<Scalars["String"]>>;
  name_not_starts_with?: Maybe<Scalars["String"]>;
  name_starts_with?: Maybe<Scalars["String"]>;
  prizeStrategy?: Maybe<Scalars["String"]>;
  prizeStrategy_contains?: Maybe<Scalars["String"]>;
  prizeStrategy_ends_with?: Maybe<Scalars["String"]>;
  prizeStrategy_gt?: Maybe<Scalars["String"]>;
  prizeStrategy_gte?: Maybe<Scalars["String"]>;
  prizeStrategy_in?: Maybe<Array<Scalars["String"]>>;
  prizeStrategy_lt?: Maybe<Scalars["String"]>;
  prizeStrategy_lte?: Maybe<Scalars["String"]>;
  prizeStrategy_not?: Maybe<Scalars["String"]>;
  prizeStrategy_not_contains?: Maybe<Scalars["String"]>;
  prizeStrategy_not_ends_with?: Maybe<Scalars["String"]>;
  prizeStrategy_not_in?: Maybe<Array<Scalars["String"]>>;
  prizeStrategy_not_starts_with?: Maybe<Scalars["String"]>;
  prizeStrategy_starts_with?: Maybe<Scalars["String"]>;
  symbol?: Maybe<Scalars["String"]>;
  symbol_contains?: Maybe<Scalars["String"]>;
  symbol_ends_with?: Maybe<Scalars["String"]>;
  symbol_gt?: Maybe<Scalars["String"]>;
  symbol_gte?: Maybe<Scalars["String"]>;
  symbol_in?: Maybe<Array<Scalars["String"]>>;
  symbol_lt?: Maybe<Scalars["String"]>;
  symbol_lte?: Maybe<Scalars["String"]>;
  symbol_not?: Maybe<Scalars["String"]>;
  symbol_not_contains?: Maybe<Scalars["String"]>;
  symbol_not_ends_with?: Maybe<Scalars["String"]>;
  symbol_not_in?: Maybe<Array<Scalars["String"]>>;
  symbol_not_starts_with?: Maybe<Scalars["String"]>;
  symbol_starts_with?: Maybe<Scalars["String"]>;
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
  address?: Maybe<Scalars["Bytes"]>;
  address_contains?: Maybe<Scalars["Bytes"]>;
  address_in?: Maybe<Array<Scalars["Bytes"]>>;
  address_not?: Maybe<Scalars["Bytes"]>;
  address_not_contains?: Maybe<Scalars["Bytes"]>;
  address_not_in?: Maybe<Array<Scalars["Bytes"]>>;
  id?: Maybe<Scalars["ID"]>;
  id_gt?: Maybe<Scalars["ID"]>;
  id_gte?: Maybe<Scalars["ID"]>;
  id_in?: Maybe<Array<Scalars["ID"]>>;
  id_lt?: Maybe<Scalars["ID"]>;
  id_lte?: Maybe<Scalars["ID"]>;
  id_not?: Maybe<Scalars["ID"]>;
  id_not_in?: Maybe<Array<Scalars["ID"]>>;
  prizeStrategy?: Maybe<Scalars["String"]>;
  prizeStrategy_contains?: Maybe<Scalars["String"]>;
  prizeStrategy_ends_with?: Maybe<Scalars["String"]>;
  prizeStrategy_gt?: Maybe<Scalars["String"]>;
  prizeStrategy_gte?: Maybe<Scalars["String"]>;
  prizeStrategy_in?: Maybe<Array<Scalars["String"]>>;
  prizeStrategy_lt?: Maybe<Scalars["String"]>;
  prizeStrategy_lte?: Maybe<Scalars["String"]>;
  prizeStrategy_not?: Maybe<Scalars["String"]>;
  prizeStrategy_not_contains?: Maybe<Scalars["String"]>;
  prizeStrategy_not_ends_with?: Maybe<Scalars["String"]>;
  prizeStrategy_not_in?: Maybe<Array<Scalars["String"]>>;
  prizeStrategy_not_starts_with?: Maybe<Scalars["String"]>;
  prizeStrategy_starts_with?: Maybe<Scalars["String"]>;
  tokenIds?: Maybe<Array<Scalars["BigInt"]>>;
  tokenIds_contains?: Maybe<Array<Scalars["BigInt"]>>;
  tokenIds_not?: Maybe<Array<Scalars["BigInt"]>>;
  tokenIds_not_contains?: Maybe<Array<Scalars["BigInt"]>>;
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
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<SingleRandomWinnerExternalErc20Award_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  where?: Maybe<SingleRandomWinnerExternalErc20Award_Filter>;
};

export type SingleRandomWinnerPrizeStrategyExternalErc721AwardsArgs = {
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<SingleRandomWinnerExternalErc721Award_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  where?: Maybe<SingleRandomWinnerExternalErc721Award_Filter>;
};

export type SingleRandomWinnerPrizeStrategy_Filter = {
  id?: Maybe<Scalars["ID"]>;
  id_gt?: Maybe<Scalars["ID"]>;
  id_gte?: Maybe<Scalars["ID"]>;
  id_in?: Maybe<Array<Scalars["ID"]>>;
  id_lt?: Maybe<Scalars["ID"]>;
  id_lte?: Maybe<Scalars["ID"]>;
  id_not?: Maybe<Scalars["ID"]>;
  id_not_in?: Maybe<Array<Scalars["ID"]>>;
  owner?: Maybe<Scalars["Bytes"]>;
  owner_contains?: Maybe<Scalars["Bytes"]>;
  owner_in?: Maybe<Array<Scalars["Bytes"]>>;
  owner_not?: Maybe<Scalars["Bytes"]>;
  owner_not_contains?: Maybe<Scalars["Bytes"]>;
  owner_not_in?: Maybe<Array<Scalars["Bytes"]>>;
  prizePeriodEndAt?: Maybe<Scalars["BigInt"]>;
  prizePeriodEndAt_gt?: Maybe<Scalars["BigInt"]>;
  prizePeriodEndAt_gte?: Maybe<Scalars["BigInt"]>;
  prizePeriodEndAt_in?: Maybe<Array<Scalars["BigInt"]>>;
  prizePeriodEndAt_lt?: Maybe<Scalars["BigInt"]>;
  prizePeriodEndAt_lte?: Maybe<Scalars["BigInt"]>;
  prizePeriodEndAt_not?: Maybe<Scalars["BigInt"]>;
  prizePeriodEndAt_not_in?: Maybe<Array<Scalars["BigInt"]>>;
  prizePeriodSeconds?: Maybe<Scalars["BigInt"]>;
  prizePeriodSeconds_gt?: Maybe<Scalars["BigInt"]>;
  prizePeriodSeconds_gte?: Maybe<Scalars["BigInt"]>;
  prizePeriodSeconds_in?: Maybe<Array<Scalars["BigInt"]>>;
  prizePeriodSeconds_lt?: Maybe<Scalars["BigInt"]>;
  prizePeriodSeconds_lte?: Maybe<Scalars["BigInt"]>;
  prizePeriodSeconds_not?: Maybe<Scalars["BigInt"]>;
  prizePeriodSeconds_not_in?: Maybe<Array<Scalars["BigInt"]>>;
  prizePeriodStartedAt?: Maybe<Scalars["BigInt"]>;
  prizePeriodStartedAt_gt?: Maybe<Scalars["BigInt"]>;
  prizePeriodStartedAt_gte?: Maybe<Scalars["BigInt"]>;
  prizePeriodStartedAt_in?: Maybe<Array<Scalars["BigInt"]>>;
  prizePeriodStartedAt_lt?: Maybe<Scalars["BigInt"]>;
  prizePeriodStartedAt_lte?: Maybe<Scalars["BigInt"]>;
  prizePeriodStartedAt_not?: Maybe<Scalars["BigInt"]>;
  prizePeriodStartedAt_not_in?: Maybe<Array<Scalars["BigInt"]>>;
  prizePool?: Maybe<Scalars["String"]>;
  prizePool_contains?: Maybe<Scalars["String"]>;
  prizePool_ends_with?: Maybe<Scalars["String"]>;
  prizePool_gt?: Maybe<Scalars["String"]>;
  prizePool_gte?: Maybe<Scalars["String"]>;
  prizePool_in?: Maybe<Array<Scalars["String"]>>;
  prizePool_lt?: Maybe<Scalars["String"]>;
  prizePool_lte?: Maybe<Scalars["String"]>;
  prizePool_not?: Maybe<Scalars["String"]>;
  prizePool_not_contains?: Maybe<Scalars["String"]>;
  prizePool_not_ends_with?: Maybe<Scalars["String"]>;
  prizePool_not_in?: Maybe<Array<Scalars["String"]>>;
  prizePool_not_starts_with?: Maybe<Scalars["String"]>;
  prizePool_starts_with?: Maybe<Scalars["String"]>;
  rng?: Maybe<Scalars["Bytes"]>;
  rng_contains?: Maybe<Scalars["Bytes"]>;
  rng_in?: Maybe<Array<Scalars["Bytes"]>>;
  rng_not?: Maybe<Scalars["Bytes"]>;
  rng_not_contains?: Maybe<Scalars["Bytes"]>;
  rng_not_in?: Maybe<Array<Scalars["Bytes"]>>;
  sponsorship?: Maybe<Scalars["String"]>;
  sponsorship_contains?: Maybe<Scalars["String"]>;
  sponsorship_ends_with?: Maybe<Scalars["String"]>;
  sponsorship_gt?: Maybe<Scalars["String"]>;
  sponsorship_gte?: Maybe<Scalars["String"]>;
  sponsorship_in?: Maybe<Array<Scalars["String"]>>;
  sponsorship_lt?: Maybe<Scalars["String"]>;
  sponsorship_lte?: Maybe<Scalars["String"]>;
  sponsorship_not?: Maybe<Scalars["String"]>;
  sponsorship_not_contains?: Maybe<Scalars["String"]>;
  sponsorship_not_ends_with?: Maybe<Scalars["String"]>;
  sponsorship_not_in?: Maybe<Array<Scalars["String"]>>;
  sponsorship_not_starts_with?: Maybe<Scalars["String"]>;
  sponsorship_starts_with?: Maybe<Scalars["String"]>;
  ticket?: Maybe<Scalars["String"]>;
  ticket_contains?: Maybe<Scalars["String"]>;
  ticket_ends_with?: Maybe<Scalars["String"]>;
  ticket_gt?: Maybe<Scalars["String"]>;
  ticket_gte?: Maybe<Scalars["String"]>;
  ticket_in?: Maybe<Array<Scalars["String"]>>;
  ticket_lt?: Maybe<Scalars["String"]>;
  ticket_lte?: Maybe<Scalars["String"]>;
  ticket_not?: Maybe<Scalars["String"]>;
  ticket_not_contains?: Maybe<Scalars["String"]>;
  ticket_not_ends_with?: Maybe<Scalars["String"]>;
  ticket_not_in?: Maybe<Array<Scalars["String"]>>;
  ticket_not_starts_with?: Maybe<Scalars["String"]>;
  ticket_starts_with?: Maybe<Scalars["String"]>;
  tokenListener?: Maybe<Scalars["String"]>;
  tokenListener_contains?: Maybe<Scalars["String"]>;
  tokenListener_ends_with?: Maybe<Scalars["String"]>;
  tokenListener_gt?: Maybe<Scalars["String"]>;
  tokenListener_gte?: Maybe<Scalars["String"]>;
  tokenListener_in?: Maybe<Array<Scalars["String"]>>;
  tokenListener_lt?: Maybe<Scalars["String"]>;
  tokenListener_lte?: Maybe<Scalars["String"]>;
  tokenListener_not?: Maybe<Scalars["String"]>;
  tokenListener_not_contains?: Maybe<Scalars["String"]>;
  tokenListener_not_ends_with?: Maybe<Scalars["String"]>;
  tokenListener_not_in?: Maybe<Array<Scalars["String"]>>;
  tokenListener_not_starts_with?: Maybe<Scalars["String"]>;
  tokenListener_starts_with?: Maybe<Scalars["String"]>;
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
  id?: Maybe<Scalars["ID"]>;
  id_gt?: Maybe<Scalars["ID"]>;
  id_gte?: Maybe<Scalars["ID"]>;
  id_in?: Maybe<Array<Scalars["ID"]>>;
  id_lt?: Maybe<Scalars["ID"]>;
  id_lte?: Maybe<Scalars["ID"]>;
  id_not?: Maybe<Scalars["ID"]>;
  id_not_in?: Maybe<Array<Scalars["ID"]>>;
  stakeToken?: Maybe<Scalars["Bytes"]>;
  stakeToken_contains?: Maybe<Scalars["Bytes"]>;
  stakeToken_in?: Maybe<Array<Scalars["Bytes"]>>;
  stakeToken_not?: Maybe<Scalars["Bytes"]>;
  stakeToken_not_contains?: Maybe<Scalars["Bytes"]>;
  stakeToken_not_in?: Maybe<Array<Scalars["Bytes"]>>;
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
  block?: Maybe<Block_Height>;
};

export type SubscriptionAccountArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionAccountsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<Account_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<Account_Filter>;
};

export type SubscriptionAwardedControlledTokenArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionAwardedControlledTokensArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<AwardedControlledToken_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<AwardedControlledToken_Filter>;
};

export type SubscriptionAwardedExternalErc20TokenArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionAwardedExternalErc20TokensArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<AwardedExternalErc20Token_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<AwardedExternalErc20Token_Filter>;
};

export type SubscriptionAwardedExternalErc721NftArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionAwardedExternalErc721NftsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<AwardedExternalErc721Nft_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<AwardedExternalErc721Nft_Filter>;
};

export type SubscriptionBalanceDripArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionBalanceDripPlayerArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionBalanceDripPlayersArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<BalanceDripPlayer_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<BalanceDripPlayer_Filter>;
};

export type SubscriptionBalanceDripsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<BalanceDrip_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<BalanceDrip_Filter>;
};

export type SubscriptionCompoundPrizePoolArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionCompoundPrizePoolsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<CompoundPrizePool_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<CompoundPrizePool_Filter>;
};

export type SubscriptionComptrollerArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionComptrollersArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<Comptroller_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<Comptroller_Filter>;
};

export type SubscriptionControlledTokenArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionControlledTokenBalanceArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionControlledTokenBalancesArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<ControlledTokenBalance_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<ControlledTokenBalance_Filter>;
};

export type SubscriptionControlledTokensArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<ControlledToken_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<ControlledToken_Filter>;
};

export type SubscriptionCreditBalanceArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionCreditBalancesArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<CreditBalance_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<CreditBalance_Filter>;
};

export type SubscriptionCreditRateArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionCreditRatesArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<CreditRate_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<CreditRate_Filter>;
};

export type SubscriptionDripTokenPlayerArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionDripTokenPlayersArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<DripTokenPlayer_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<DripTokenPlayer_Filter>;
};

export type SubscriptionMultipleWinnersExternalErc20AwardArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionMultipleWinnersExternalErc20AwardsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<MultipleWinnersExternalErc20Award_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<MultipleWinnersExternalErc20Award_Filter>;
};

export type SubscriptionMultipleWinnersExternalErc721AwardArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionMultipleWinnersExternalErc721AwardsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<MultipleWinnersExternalErc721Award_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<MultipleWinnersExternalErc721Award_Filter>;
};

export type SubscriptionMultipleWinnersPrizeStrategiesArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<MultipleWinnersPrizeStrategy_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<MultipleWinnersPrizeStrategy_Filter>;
};

export type SubscriptionMultipleWinnersPrizeStrategyArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionPrizeArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionPrizePoolArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionPrizePoolAccountArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionPrizePoolAccountsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<PrizePoolAccount_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<PrizePoolAccount_Filter>;
};

export type SubscriptionPrizePoolsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<PrizePool_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<PrizePool_Filter>;
};

export type SubscriptionPrizeSplitArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionPrizeSplitsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<PrizeSplit_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<PrizeSplit_Filter>;
};

export type SubscriptionPrizeStrategiesArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<PrizeStrategy_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<PrizeStrategy_Filter>;
};

export type SubscriptionPrizeStrategyArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionPrizesArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<Prize_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<Prize_Filter>;
};

export type SubscriptionSablierStreamArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionSablierStreamsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<SablierStream_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<SablierStream_Filter>;
};

export type SubscriptionSingleRandomWinnerExternalErc20AwardArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionSingleRandomWinnerExternalErc20AwardsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<SingleRandomWinnerExternalErc20Award_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<SingleRandomWinnerExternalErc20Award_Filter>;
};

export type SubscriptionSingleRandomWinnerExternalErc721AwardArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionSingleRandomWinnerExternalErc721AwardsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<SingleRandomWinnerExternalErc721Award_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<SingleRandomWinnerExternalErc721Award_Filter>;
};

export type SubscriptionSingleRandomWinnerPrizeStrategiesArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<SingleRandomWinnerPrizeStrategy_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<SingleRandomWinnerPrizeStrategy_Filter>;
};

export type SubscriptionSingleRandomWinnerPrizeStrategyArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionStakePrizePoolArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionStakePrizePoolsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<StakePrizePool_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<StakePrizePool_Filter>;
};

export type SubscriptionVolumeDripArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionVolumeDripPeriodArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionVolumeDripPeriodsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<VolumeDripPeriod_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<VolumeDripPeriod_Filter>;
};

export type SubscriptionVolumeDripPlayerArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionVolumeDripPlayersArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<VolumeDripPlayer_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<VolumeDripPlayer_Filter>;
};

export type SubscriptionVolumeDripsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<VolumeDrip_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<VolumeDrip_Filter>;
};

export type SubscriptionYieldSourcePrizePoolArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionYieldSourcePrizePoolsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<YieldSourcePrizePool_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<YieldSourcePrizePool_Filter>;
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
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<VolumeDripPlayer_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  where?: Maybe<VolumeDripPlayer_Filter>;
};

export type VolumeDripPeriodsArgs = {
  first?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<VolumeDripPeriod_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars["Int"]>;
  where?: Maybe<VolumeDripPeriod_Filter>;
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
  dripAmount?: Maybe<Scalars["BigInt"]>;
  dripAmount_gt?: Maybe<Scalars["BigInt"]>;
  dripAmount_gte?: Maybe<Scalars["BigInt"]>;
  dripAmount_in?: Maybe<Array<Scalars["BigInt"]>>;
  dripAmount_lt?: Maybe<Scalars["BigInt"]>;
  dripAmount_lte?: Maybe<Scalars["BigInt"]>;
  dripAmount_not?: Maybe<Scalars["BigInt"]>;
  dripAmount_not_in?: Maybe<Array<Scalars["BigInt"]>>;
  endTime?: Maybe<Scalars["BigInt"]>;
  endTime_gt?: Maybe<Scalars["BigInt"]>;
  endTime_gte?: Maybe<Scalars["BigInt"]>;
  endTime_in?: Maybe<Array<Scalars["BigInt"]>>;
  endTime_lt?: Maybe<Scalars["BigInt"]>;
  endTime_lte?: Maybe<Scalars["BigInt"]>;
  endTime_not?: Maybe<Scalars["BigInt"]>;
  endTime_not_in?: Maybe<Array<Scalars["BigInt"]>>;
  id?: Maybe<Scalars["ID"]>;
  id_gt?: Maybe<Scalars["ID"]>;
  id_gte?: Maybe<Scalars["ID"]>;
  id_in?: Maybe<Array<Scalars["ID"]>>;
  id_lt?: Maybe<Scalars["ID"]>;
  id_lte?: Maybe<Scalars["ID"]>;
  id_not?: Maybe<Scalars["ID"]>;
  id_not_in?: Maybe<Array<Scalars["ID"]>>;
  isDripping?: Maybe<Scalars["Boolean"]>;
  isDripping_in?: Maybe<Array<Scalars["Boolean"]>>;
  isDripping_not?: Maybe<Scalars["Boolean"]>;
  isDripping_not_in?: Maybe<Array<Scalars["Boolean"]>>;
  periodIndex?: Maybe<Scalars["BigInt"]>;
  periodIndex_gt?: Maybe<Scalars["BigInt"]>;
  periodIndex_gte?: Maybe<Scalars["BigInt"]>;
  periodIndex_in?: Maybe<Array<Scalars["BigInt"]>>;
  periodIndex_lt?: Maybe<Scalars["BigInt"]>;
  periodIndex_lte?: Maybe<Scalars["BigInt"]>;
  periodIndex_not?: Maybe<Scalars["BigInt"]>;
  periodIndex_not_in?: Maybe<Array<Scalars["BigInt"]>>;
  totalSupply?: Maybe<Scalars["BigInt"]>;
  totalSupply_gt?: Maybe<Scalars["BigInt"]>;
  totalSupply_gte?: Maybe<Scalars["BigInt"]>;
  totalSupply_in?: Maybe<Array<Scalars["BigInt"]>>;
  totalSupply_lt?: Maybe<Scalars["BigInt"]>;
  totalSupply_lte?: Maybe<Scalars["BigInt"]>;
  totalSupply_not?: Maybe<Scalars["BigInt"]>;
  totalSupply_not_in?: Maybe<Array<Scalars["BigInt"]>>;
  volumeDrip?: Maybe<Scalars["String"]>;
  volumeDrip_contains?: Maybe<Scalars["String"]>;
  volumeDrip_ends_with?: Maybe<Scalars["String"]>;
  volumeDrip_gt?: Maybe<Scalars["String"]>;
  volumeDrip_gte?: Maybe<Scalars["String"]>;
  volumeDrip_in?: Maybe<Array<Scalars["String"]>>;
  volumeDrip_lt?: Maybe<Scalars["String"]>;
  volumeDrip_lte?: Maybe<Scalars["String"]>;
  volumeDrip_not?: Maybe<Scalars["String"]>;
  volumeDrip_not_contains?: Maybe<Scalars["String"]>;
  volumeDrip_not_ends_with?: Maybe<Scalars["String"]>;
  volumeDrip_not_in?: Maybe<Array<Scalars["String"]>>;
  volumeDrip_not_starts_with?: Maybe<Scalars["String"]>;
  volumeDrip_starts_with?: Maybe<Scalars["String"]>;
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
  address?: Maybe<Scalars["Bytes"]>;
  address_contains?: Maybe<Scalars["Bytes"]>;
  address_in?: Maybe<Array<Scalars["Bytes"]>>;
  address_not?: Maybe<Scalars["Bytes"]>;
  address_not_contains?: Maybe<Scalars["Bytes"]>;
  address_not_in?: Maybe<Array<Scalars["Bytes"]>>;
  balance?: Maybe<Scalars["BigInt"]>;
  balance_gt?: Maybe<Scalars["BigInt"]>;
  balance_gte?: Maybe<Scalars["BigInt"]>;
  balance_in?: Maybe<Array<Scalars["BigInt"]>>;
  balance_lt?: Maybe<Scalars["BigInt"]>;
  balance_lte?: Maybe<Scalars["BigInt"]>;
  balance_not?: Maybe<Scalars["BigInt"]>;
  balance_not_in?: Maybe<Array<Scalars["BigInt"]>>;
  id?: Maybe<Scalars["ID"]>;
  id_gt?: Maybe<Scalars["ID"]>;
  id_gte?: Maybe<Scalars["ID"]>;
  id_in?: Maybe<Array<Scalars["ID"]>>;
  id_lt?: Maybe<Scalars["ID"]>;
  id_lte?: Maybe<Scalars["ID"]>;
  id_not?: Maybe<Scalars["ID"]>;
  id_not_in?: Maybe<Array<Scalars["ID"]>>;
  periodIndex?: Maybe<Scalars["BigInt"]>;
  periodIndex_gt?: Maybe<Scalars["BigInt"]>;
  periodIndex_gte?: Maybe<Scalars["BigInt"]>;
  periodIndex_in?: Maybe<Array<Scalars["BigInt"]>>;
  periodIndex_lt?: Maybe<Scalars["BigInt"]>;
  periodIndex_lte?: Maybe<Scalars["BigInt"]>;
  periodIndex_not?: Maybe<Scalars["BigInt"]>;
  periodIndex_not_in?: Maybe<Array<Scalars["BigInt"]>>;
  volumeDrip?: Maybe<Scalars["String"]>;
  volumeDrip_contains?: Maybe<Scalars["String"]>;
  volumeDrip_ends_with?: Maybe<Scalars["String"]>;
  volumeDrip_gt?: Maybe<Scalars["String"]>;
  volumeDrip_gte?: Maybe<Scalars["String"]>;
  volumeDrip_in?: Maybe<Array<Scalars["String"]>>;
  volumeDrip_lt?: Maybe<Scalars["String"]>;
  volumeDrip_lte?: Maybe<Scalars["String"]>;
  volumeDrip_not?: Maybe<Scalars["String"]>;
  volumeDrip_not_contains?: Maybe<Scalars["String"]>;
  volumeDrip_not_ends_with?: Maybe<Scalars["String"]>;
  volumeDrip_not_in?: Maybe<Array<Scalars["String"]>>;
  volumeDrip_not_starts_with?: Maybe<Scalars["String"]>;
  volumeDrip_starts_with?: Maybe<Scalars["String"]>;
};

export enum VolumeDripPlayer_OrderBy {
  Address = "address",
  Balance = "balance",
  Id = "id",
  PeriodIndex = "periodIndex",
  VolumeDrip = "volumeDrip",
}

export type VolumeDrip_Filter = {
  comptroller?: Maybe<Scalars["String"]>;
  comptroller_contains?: Maybe<Scalars["String"]>;
  comptroller_ends_with?: Maybe<Scalars["String"]>;
  comptroller_gt?: Maybe<Scalars["String"]>;
  comptroller_gte?: Maybe<Scalars["String"]>;
  comptroller_in?: Maybe<Array<Scalars["String"]>>;
  comptroller_lt?: Maybe<Scalars["String"]>;
  comptroller_lte?: Maybe<Scalars["String"]>;
  comptroller_not?: Maybe<Scalars["String"]>;
  comptroller_not_contains?: Maybe<Scalars["String"]>;
  comptroller_not_ends_with?: Maybe<Scalars["String"]>;
  comptroller_not_in?: Maybe<Array<Scalars["String"]>>;
  comptroller_not_starts_with?: Maybe<Scalars["String"]>;
  comptroller_starts_with?: Maybe<Scalars["String"]>;
  deactivated?: Maybe<Scalars["Boolean"]>;
  deactivated_in?: Maybe<Array<Scalars["Boolean"]>>;
  deactivated_not?: Maybe<Scalars["Boolean"]>;
  deactivated_not_in?: Maybe<Array<Scalars["Boolean"]>>;
  dripAmount?: Maybe<Scalars["BigInt"]>;
  dripAmount_gt?: Maybe<Scalars["BigInt"]>;
  dripAmount_gte?: Maybe<Scalars["BigInt"]>;
  dripAmount_in?: Maybe<Array<Scalars["BigInt"]>>;
  dripAmount_lt?: Maybe<Scalars["BigInt"]>;
  dripAmount_lte?: Maybe<Scalars["BigInt"]>;
  dripAmount_not?: Maybe<Scalars["BigInt"]>;
  dripAmount_not_in?: Maybe<Array<Scalars["BigInt"]>>;
  dripToken?: Maybe<Scalars["Bytes"]>;
  dripToken_contains?: Maybe<Scalars["Bytes"]>;
  dripToken_in?: Maybe<Array<Scalars["Bytes"]>>;
  dripToken_not?: Maybe<Scalars["Bytes"]>;
  dripToken_not_contains?: Maybe<Scalars["Bytes"]>;
  dripToken_not_in?: Maybe<Array<Scalars["Bytes"]>>;
  id?: Maybe<Scalars["ID"]>;
  id_gt?: Maybe<Scalars["ID"]>;
  id_gte?: Maybe<Scalars["ID"]>;
  id_in?: Maybe<Array<Scalars["ID"]>>;
  id_lt?: Maybe<Scalars["ID"]>;
  id_lte?: Maybe<Scalars["ID"]>;
  id_not?: Maybe<Scalars["ID"]>;
  id_not_in?: Maybe<Array<Scalars["ID"]>>;
  measureToken?: Maybe<Scalars["Bytes"]>;
  measureToken_contains?: Maybe<Scalars["Bytes"]>;
  measureToken_in?: Maybe<Array<Scalars["Bytes"]>>;
  measureToken_not?: Maybe<Scalars["Bytes"]>;
  measureToken_not_contains?: Maybe<Scalars["Bytes"]>;
  measureToken_not_in?: Maybe<Array<Scalars["Bytes"]>>;
  periodCount?: Maybe<Scalars["BigInt"]>;
  periodCount_gt?: Maybe<Scalars["BigInt"]>;
  periodCount_gte?: Maybe<Scalars["BigInt"]>;
  periodCount_in?: Maybe<Array<Scalars["BigInt"]>>;
  periodCount_lt?: Maybe<Scalars["BigInt"]>;
  periodCount_lte?: Maybe<Scalars["BigInt"]>;
  periodCount_not?: Maybe<Scalars["BigInt"]>;
  periodCount_not_in?: Maybe<Array<Scalars["BigInt"]>>;
  periodSeconds?: Maybe<Scalars["BigInt"]>;
  periodSeconds_gt?: Maybe<Scalars["BigInt"]>;
  periodSeconds_gte?: Maybe<Scalars["BigInt"]>;
  periodSeconds_in?: Maybe<Array<Scalars["BigInt"]>>;
  periodSeconds_lt?: Maybe<Scalars["BigInt"]>;
  periodSeconds_lte?: Maybe<Scalars["BigInt"]>;
  periodSeconds_not?: Maybe<Scalars["BigInt"]>;
  periodSeconds_not_in?: Maybe<Array<Scalars["BigInt"]>>;
  referral?: Maybe<Scalars["Boolean"]>;
  referral_in?: Maybe<Array<Scalars["Boolean"]>>;
  referral_not?: Maybe<Scalars["Boolean"]>;
  referral_not_in?: Maybe<Array<Scalars["Boolean"]>>;
  sourceAddress?: Maybe<Scalars["Bytes"]>;
  sourceAddress_contains?: Maybe<Scalars["Bytes"]>;
  sourceAddress_in?: Maybe<Array<Scalars["Bytes"]>>;
  sourceAddress_not?: Maybe<Scalars["Bytes"]>;
  sourceAddress_not_contains?: Maybe<Scalars["Bytes"]>;
  sourceAddress_not_in?: Maybe<Array<Scalars["Bytes"]>>;
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
  id?: Maybe<Scalars["ID"]>;
  id_gt?: Maybe<Scalars["ID"]>;
  id_gte?: Maybe<Scalars["ID"]>;
  id_in?: Maybe<Array<Scalars["ID"]>>;
  id_lt?: Maybe<Scalars["ID"]>;
  id_lte?: Maybe<Scalars["ID"]>;
  id_not?: Maybe<Scalars["ID"]>;
  id_not_in?: Maybe<Array<Scalars["ID"]>>;
  yieldSource?: Maybe<Scalars["Bytes"]>;
  yieldSource_contains?: Maybe<Scalars["Bytes"]>;
  yieldSource_in?: Maybe<Array<Scalars["Bytes"]>>;
  yieldSource_not?: Maybe<Scalars["Bytes"]>;
  yieldSource_not_contains?: Maybe<Scalars["Bytes"]>;
  yieldSource_not_in?: Maybe<Array<Scalars["Bytes"]>>;
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
