import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { BigNumber, BigNumberish } from "ethers";
import { NetworkId } from "src/constants";
import { Bond } from "src/lib/Bond";

import { IBondV2 } from "./BondSliceV2";

export interface IJsonRPCError {
  readonly message: string;
  readonly code: number;
}

export interface IBaseAsyncThunk {
  readonly networkID: NetworkId;
  readonly provider: StaticJsonRpcProvider | JsonRpcProvider;
}

export interface IValueOnlyAsyncThunk extends IBaseAsyncThunk {
  readonly value: BigNumber;
}

export interface IChangeApprovalAsyncThunk extends IBaseAsyncThunk {
  readonly token: string;
  readonly address: string;
}

export interface IChangeApprovalWithVersionAsyncThunk extends IChangeApprovalAsyncThunk {
  readonly version2: boolean;
}

export interface IChangeApprovalWithDisplayNameAsyncThunk extends IChangeApprovalAsyncThunk {
  readonly displayName: string;
  readonly insertName: boolean;
}

export interface IActionAsyncThunk extends IBaseAsyncThunk {
  readonly action: string;
  readonly address: string;
}

export interface IValueAsyncThunk extends IBaseAsyncThunk {
  readonly value: string;
  readonly address: string;
}

export interface IActionValueAsyncThunk extends IValueAsyncThunk {
  readonly action: string;
}

export interface IStakeAsyncThunk extends IActionValueAsyncThunk {
  readonly version2: boolean;
  readonly rebase: boolean;
}

export interface IActionValueGasAsyncThunk extends IActionValueAsyncThunk {
  readonly gas: number;
  readonly version2: boolean;
  readonly rebase: boolean;
}

export interface IBaseAddressAsyncThunk extends IBaseAsyncThunk {
  readonly address: string;
}

export interface IMigrateAsyncThunk extends IBaseAddressAsyncThunk {
  readonly gOHM: boolean;
}

export interface IMigrateSingleAsyncThunk extends IMigrateAsyncThunk {
  readonly type: number;
  readonly amount: string;
}

export interface IBaseBondV2ClaimAsyncThunk extends IBaseAddressAsyncThunk {
  readonly gOHM: boolean;
}

export interface IBaseBondV2SingleClaimAsyncThunk extends IBaseBondV2ClaimAsyncThunk {
  readonly indexes: [number];
}

export interface IBaseBondV2ClaimSinglesyncThunk extends IBaseBondV2ClaimAsyncThunk {
  readonly gOHM: boolean;
  readonly bondIndex: number;
}

export interface IActionValueRecipientAsyncThunk extends IActionValueAsyncThunk {
  readonly recipient: string;
  readonly version2: boolean;
  readonly rebase: boolean;
}

export interface IZapAsyncThunk extends IBaseAddressAsyncThunk {
  readonly tokenAddress: string;
  readonly sellAmount: BigNumber;
  readonly slippage: string;
}

// Account Slice

export interface ICalcUserBondDetailsAsyncThunk extends IBaseAddressAsyncThunk, IBaseBondAsyncThunk {}

// Bond Slice

export interface IBaseBondAsyncThunk extends IBaseAsyncThunk {
  readonly bond: Bond;
}

export interface IBondV2AysncThunk extends IBaseAddressAsyncThunk {
  readonly bond: IBondV2;
}

export interface IBondV2IndexAsyncThunk extends IBaseAddressAsyncThunk {
  readonly bondIndex: number;
}

export interface IBondV2PurchaseAsyncThunk extends IBaseAddressAsyncThunk {
  readonly bond: IBondV2;
  readonly maxPrice: BigNumberish;
  readonly amount: BigNumberish;
}

export interface IApproveBondAsyncThunk extends IBaseBondAsyncThunk {
  readonly address: string;
}

export interface ICalcBondDetailsAsyncThunk extends IBaseBondAsyncThunk {
  readonly value: string;
}

export interface IBondAssetAsyncThunk extends IBaseBondAsyncThunk, IValueAsyncThunk {
  readonly slippage: number;
}

export interface IRedeemBondAsyncThunk extends IBaseBondAsyncThunk {
  readonly address: string;
  readonly autostake: boolean;
}

export interface IRedeemAllBondsAsyncThunk extends IBaseAsyncThunk {
  readonly bonds: Bond[];
  readonly address: string;
  readonly autostake: boolean;
}
