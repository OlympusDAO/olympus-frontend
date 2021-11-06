/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import type { TypedEventFilter, TypedEvent, TypedListener } from "./common";

interface LpBondCalcContractInterface extends ethers.utils.Interface {
  functions: {
    "getKValue(address)": FunctionFragment;
    "getTotalValue(address)": FunctionFragment;
    "markdown(address)": FunctionFragment;
    "valuation(address,uint256)": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "getKValue", values: [string]): string;
  encodeFunctionData(
    functionFragment: "getTotalValue",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "markdown", values: [string]): string;
  encodeFunctionData(
    functionFragment: "valuation",
    values: [string, BigNumberish]
  ): string;

  decodeFunctionResult(functionFragment: "getKValue", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getTotalValue",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "markdown", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "valuation", data: BytesLike): Result;

  events: {};
}

export class LpBondCalcContract extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: LpBondCalcContractInterface;

  functions: {
    getKValue(
      pair_: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { k_: BigNumber }>;

    getTotalValue(
      pair_: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { _value: BigNumber }>;

    markdown(pair_: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    valuation(
      pair_: string,
      amount_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { _value: BigNumber }>;
  };

  getKValue(pair_: string, overrides?: CallOverrides): Promise<BigNumber>;

  getTotalValue(pair_: string, overrides?: CallOverrides): Promise<BigNumber>;

  markdown(pair_: string, overrides?: CallOverrides): Promise<BigNumber>;

  valuation(
    pair_: string,
    amount_: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  callStatic: {
    getKValue(pair_: string, overrides?: CallOverrides): Promise<BigNumber>;

    getTotalValue(pair_: string, overrides?: CallOverrides): Promise<BigNumber>;

    markdown(pair_: string, overrides?: CallOverrides): Promise<BigNumber>;

    valuation(
      pair_: string,
      amount_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    getKValue(pair_: string, overrides?: CallOverrides): Promise<BigNumber>;

    getTotalValue(pair_: string, overrides?: CallOverrides): Promise<BigNumber>;

    markdown(pair_: string, overrides?: CallOverrides): Promise<BigNumber>;

    valuation(
      pair_: string,
      amount_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    getKValue(
      pair_: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getTotalValue(
      pair_: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    markdown(
      pair_: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    valuation(
      pair_: string,
      amount_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
