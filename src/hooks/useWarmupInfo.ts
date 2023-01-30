import { useQuery } from "@tanstack/react-query";
import { BigNumberish } from "ethers";
import { NetworkId } from "src/constants";
import { SOHM_ADDRESSES, STAKING_ADDRESSES } from "src/constants/addresses";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useStaticSohmContract, useStaticStakingContract } from "src/hooks/useContract";
import { useAccount } from "wagmi";

export const warmupQueryKey = (address?: string) => ["useWarmupClaim", address];

export interface IWarmupGons {
  deposit: BigNumberish; // if forfeiting
  gons: BigNumberish; // staked balance
  expiry: BigNumberish; // end of warmup period (epoch #)
  lock: boolean; // prevents malicious delays for claim
}

export interface IWarmupBalances extends IWarmupGons {
  sohm: BigNumberish; // staked balance
  gohm: BigNumberish; // staked balance
}

export const useWarmupClaim = () => {
  const { address = "" } = useAccount();
  const stakingContract = useStaticStakingContract(STAKING_ADDRESSES[NetworkId.MAINNET], NetworkId.MAINNET);
  const sohmContract = useStaticSohmContract(SOHM_ADDRESSES[NetworkId.MAINNET], NetworkId.MAINNET);

  return useQuery<IWarmupBalances, Error>([warmupQueryKey(address)], async () => {
    const warmupClaim: IWarmupGons = await stakingContract.warmupInfo(address);
    const sOHMBalance = await sohmContract.balanceForGons(warmupClaim.gons);
    const gOHMBalance = await sohmContract.toG(sOHMBalance);

    const warmupBalances: IWarmupBalances = {
      deposit: warmupClaim.deposit,
      gons: warmupClaim.gons,
      expiry: warmupClaim.expiry,
      lock: warmupClaim.lock,
      sohm: sOHMBalance,
      gohm: gOHMBalance,
    };

    // return new DecimalBigNumber(warmupClaim, 9);
    return warmupBalances;
  });
};

/**
 * warmupPeriod in # of epochs
 */
export const useWarmupPeriod = () => {
  const stakingContract = useStaticStakingContract(STAKING_ADDRESSES[NetworkId.MAINNET], NetworkId.MAINNET);

  return useQuery<DecimalBigNumber, Error>(["warmupPeriodLength"], async () => {
    const length = await stakingContract.warmupPeriod();

    return new DecimalBigNumber(length, 0);
  });
};

/**
 * warmupPeriod in # of epochs
 */
export const useEpochLength = () => {
  const stakingContract = useStaticStakingContract(STAKING_ADDRESSES[NetworkId.MAINNET], NetworkId.MAINNET);

  return useQuery<DecimalBigNumber, Error>(["epochLength"], async () => {
    const epoch = await stakingContract.epoch();
    const length = epoch.length;

    return new DecimalBigNumber(length, 0);
  });
};

/**
 *
 * @param balance an sOHM balance
 * @returns gons
 */
export const useGonsForBalance = ({ balance }: { balance: string }) => {
  const sohmContract = useStaticSohmContract(SOHM_ADDRESSES[NetworkId.MAINNET], NetworkId.MAINNET);

  return useQuery<DecimalBigNumber, Error>(["gonsForBalance", balance], async () => {
    const _balance = new DecimalBigNumber(balance, 9);
    const gons = await sohmContract.gonsForBalance(_balance.toBigNumber());

    return new DecimalBigNumber(gons, 9);
  });
};

/**
 *
 * @param gons a quantity of gons
 * @returns sOHM balance
 */
export const useBalanceForGons = ({ gons }: { gons: string }) => {
  const sohmContract = useStaticSohmContract(SOHM_ADDRESSES[NetworkId.MAINNET], NetworkId.MAINNET);

  return useQuery<DecimalBigNumber, Error>(["balanceForGons", gons], async () => {
    const _gons = new DecimalBigNumber(gons, 9);
    const balance = await sohmContract.balanceForGons(_gons.toBigNumber());

    return new DecimalBigNumber(balance, 9);
  });
};
