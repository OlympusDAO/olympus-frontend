import { useQuery } from "@tanstack/react-query";
import { BigNumber } from "ethers";
import { NetworkId } from "src/constants";
import { SOHM_ADDRESSES, STAKING_ADDRESSES } from "src/constants/addresses";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useStaticSohmContract, useStaticStakingContract } from "src/hooks/useContract";
import { useAccount, useNetwork } from "wagmi";

export const warmupQueryKey = (address?: string) => ["useWarmupClaim", address];

export interface IWarmupBalances {
  deposit: BigNumber; // if forfeiting, ohm quantity
  expiry: BigNumber; // end of warmup period (epoch #)
  lock: boolean; // prevents malicious delays for claim
  sohm: DecimalBigNumber; // staked balance
  gohm: DecimalBigNumber; // staked balance
}

export const useWarmupClaim = () => {
  const { address = "" } = useAccount();
  const { chain = { id: 1 } } = useNetwork();
  if (chain?.id !== NetworkId.MAINNET && chain?.id !== NetworkId.TESTNET_GOERLI) throw new Error("Not implemented");
  const stakingContract = useStaticStakingContract(STAKING_ADDRESSES[chain?.id], chain?.id);
  const sohmContract = useStaticSohmContract(SOHM_ADDRESSES[chain?.id], chain?.id);

  return useQuery<IWarmupBalances, Error>(
    [warmupQueryKey(address)],
    async () => {
      const warmupClaim = await stakingContract.warmupInfo(address);
      const sOHMBalance = await sohmContract.balanceForGons(warmupClaim.gons);
      const gOHMBalance = await sohmContract.toG(sOHMBalance);

      const warmupBalances: IWarmupBalances = {
        deposit: warmupClaim.deposit,
        expiry: warmupClaim.expiry,
        lock: warmupClaim.lock,
        sohm: new DecimalBigNumber(sOHMBalance, 9),
        gohm: new DecimalBigNumber(gOHMBalance, 18),
      };

      // return new DecimalBigNumber(warmupClaim, 9);
      return warmupBalances;
    },
    {
      enabled: !!chain && !!STAKING_ADDRESSES[chain?.id] && !!SOHM_ADDRESSES[chain?.id],
    },
  );
};

/**
 * warmupPeriod in # of epochs
 */
export const useWarmupPeriod = () => {
  const { chain = { id: 1 } } = useNetwork();
  if (chain?.id !== NetworkId.MAINNET && chain?.id !== NetworkId.TESTNET_GOERLI) throw new Error("Not implemented");
  const stakingContract = useStaticStakingContract(STAKING_ADDRESSES[chain?.id], chain?.id);

  return useQuery<DecimalBigNumber, Error>(["warmupPeriodLength"], async () => {
    const length = await stakingContract.warmupPeriod();

    return new DecimalBigNumber(length, 0);
  });
};

export interface IEpoch {
  length: DecimalBigNumber;
  number: DecimalBigNumber;
  end: DecimalBigNumber;
}
/**
 * length - warmupPeriod in # of epochs
 * number - current epoch number
 */
export const useEpoch = () => {
  const { chain = { id: 1 } } = useNetwork();
  if (chain?.id !== NetworkId.MAINNET && chain?.id !== NetworkId.TESTNET_GOERLI) throw new Error("Not implemented");
  const stakingContract = useStaticStakingContract(STAKING_ADDRESSES[chain?.id], chain?.id);

  return useQuery<IEpoch, Error>(["epoch"], async () => {
    const epoch = await stakingContract.epoch();
    return {
      length: new DecimalBigNumber(epoch[0], 0), // epoch.length returns the length of the epoch array, not the `length` value of the epoch object
      number: new DecimalBigNumber(epoch.number, 0),
      end: new DecimalBigNumber(epoch.end, 0),
    };
  });
};

/**
 *
 * @param balance an sOHM balance
 * @returns gons
 */
export const useGonsForBalance = ({ balance }: { balance: string }) => {
  const { chain = { id: 1 } } = useNetwork();
  if (chain?.id !== NetworkId.MAINNET && chain?.id !== NetworkId.TESTNET_GOERLI) throw new Error("Not implemented");
  const sohmContract = useStaticSohmContract(SOHM_ADDRESSES[chain?.id], chain?.id);

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
  const { chain = { id: 1 } } = useNetwork();
  if (chain?.id !== NetworkId.MAINNET && chain?.id !== NetworkId.TESTNET_GOERLI) throw new Error("Not implemented");
  const sohmContract = useStaticSohmContract(SOHM_ADDRESSES[chain?.id], chain?.id);

  return useQuery<DecimalBigNumber, Error>(["balanceForGons", gons], async () => {
    const _gons = new DecimalBigNumber(gons, 9);
    const balance = await sohmContract.balanceForGons(_gons.toBigNumber());

    return new DecimalBigNumber(balance, 9);
  });
};
