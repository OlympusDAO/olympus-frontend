import { BaseProvider, JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { BigNumber, Signer } from "ethers";
import { NetworkId } from "src/constants";

export interface IJsonRPCError {
  readonly message: string;
  readonly code: number;
}

export interface IBaseAsyncThunk {
  readonly networkID: NetworkId;
  readonly provider: StaticJsonRpcProvider | JsonRpcProvider | BaseProvider;
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
  readonly provider: StaticJsonRpcProvider | JsonRpcProvider;
}

export interface IChangeApprovalWithDisplayNameAsyncThunk extends IChangeApprovalAsyncThunk {
  readonly displayName: string;
  readonly insertName: boolean;
  readonly provider: StaticJsonRpcProvider | JsonRpcProvider | BaseProvider;
  readonly signer: Signer;
}

export interface IActionAsyncThunk extends IBaseAsyncThunk {
  readonly action: string;
  readonly address: string;
}

export interface IValueAsyncThunk extends IBaseAsyncThunk {
  readonly value: string;
  readonly address: string;
  readonly provider: StaticJsonRpcProvider | JsonRpcProvider;
}

export interface IActionValueAsyncThunk extends IValueAsyncThunk {
  readonly action: string;
}

export interface IStakeAsyncThunk extends IActionValueAsyncThunk {
  readonly version2: boolean;
  readonly rebase: boolean;
  readonly provider: StaticJsonRpcProvider | JsonRpcProvider;
}

export interface IActionValueGasAsyncThunk extends IActionValueAsyncThunk {
  readonly gas: number;
  readonly version2: boolean;
  readonly rebase: boolean;
}

export interface IBaseAddressAsyncThunk extends IBaseAsyncThunk {
  readonly address: string;
}

export interface IBaseAddressRecipientAsyncThunk extends IBaseAddressAsyncThunk {
  readonly recipient: string;
  readonly provider: BaseProvider;
}

export interface IMigrateAsyncThunk extends IBaseAddressAsyncThunk {
  readonly gOHM: boolean;
  readonly provider: StaticJsonRpcProvider | JsonRpcProvider | BaseProvider;
  readonly signer: Signer;
}

export interface IMigrateSingleAsyncThunk extends IMigrateAsyncThunk {
  readonly type: number;
  readonly amount: string;
}

export interface IActionValueRecipientAsyncThunk extends IActionValueAsyncThunk {
  readonly recipient: string;
  readonly version2: boolean;
  readonly rebase: boolean;
  readonly eventSource: string;
}

export interface IZapAsyncThunk extends IBaseAddressAsyncThunk {
  readonly tokenAddress: string;
  readonly sellAmount: BigNumber;
  readonly slippage: string;
  readonly minimumAmount: string;
  readonly gOHM: boolean;
}

export interface ChangeAssetType {
  (checked: boolean): void;
}
