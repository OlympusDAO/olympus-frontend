import { useQuery } from "@tanstack/react-query";
import { BigNumber } from "ethers";
import { NetworkId } from "src/constants";
import { SOHM_CONTRACT, STAKING_CONTRACT } from "src/constants/contracts";
import { parseBigNumber } from "src/helpers";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useNextRebase } from "src/views/Stake/components/StakeArea/components/RebaseTimer/hooks/useNextRebaseDate";
import { useAccount, useNetwork } from "wagmi";

export const warmupQueryKey = (address: string | `0x${string}`, chainId?: number) => [
  "useWarmupClaim",
  address,
  chainId,
];

export interface IWarmupBalances {
  deposit: BigNumber; // if forfeiting, ohm quantity
  expiry: BigNumber; // end of warmup period (epoch #)
  lock: boolean; // prevents malicious delays for claim
  sohm: DecimalBigNumber; // staked balance
  gohm: DecimalBigNumber; // staked balance
}

/** claim info for the connected wallet */
export const useWarmupClaim = () => {
  const { address = "" } = useAccount();
  const { chain = { id: 1 } } = useNetwork();

  return useQuery<IWarmupBalances, Error>(
    [warmupQueryKey(address, chain?.id)],
    async () => {
      if (![NetworkId.MAINNET, NetworkId.TESTNET_GOERLI].includes(chain.id)) throw new Error("Not implemented");
      const stakingContract = STAKING_CONTRACT.getEthersContract(chain.id);
      const sohmContract = SOHM_CONTRACT.getEthersContract(chain.id);
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
      enabled: !!chain,
    },
  );
};

/**
 * @returns JS Date for warmup completion for connected wallet
 */
export const useWarmupDate = () => {
  const { data: warmupBalance, isSuccess: balanceSuccess } = useWarmupClaim();
  const { data: secondsToRebase, isSuccess: rebaseSuccess } = useNextRebase();
  const { data: epoch, isSuccess: epochSuccess } = useEpoch();
  const isSuccess = rebaseSuccess && balanceSuccess && epochSuccess;

  const parsedSeconds = parseBigNumber(secondsToRebase || BigNumber.from("0"), 0);
  const epochLengthSeconds = parseBigNumber(epoch?.length.toBigNumber() || BigNumber.from("0"), 0);

  const warmupExpiry = warmupBalance?.expiry || BigNumber.from("0");
  const currentEpoch = epoch?.number.toBigNumber() || BigNumber.from("0");
  // how many fully length epochs are remaining?
  const warmupLength = parseBigNumber(warmupExpiry, 0) - parseBigNumber(currentEpoch, 0) - 1;

  // secondsRemainingInThisEpoch + (epochLenghInSeconds * numberOfEpochsInWarmup)
  const dateTime = new Date(Date.now() + (parsedSeconds + epochLengthSeconds * warmupLength) * 1000);

  return {
    data: isSuccess ? dateTime : undefined,
    isClaimable: isSuccess ? currentEpoch.gte(warmupExpiry) : undefined,
  };
};

/**
 * warmupPeriod in # of epochs
 */
export const useWarmupPeriod = () => {
  const { chain = { id: 1 } } = useNetwork();

  return useQuery<DecimalBigNumber, Error>(["warmupPeriodLength", chain?.id], async () => {
    if (![NetworkId.MAINNET, NetworkId.TESTNET_GOERLI].includes(chain.id)) throw new Error("Not implemented");
    const stakingContract = STAKING_CONTRACT.getEthersContract(chain.id);

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

  return useQuery<IEpoch, Error>(["epoch"], async () => {
    if (![NetworkId.MAINNET, NetworkId.TESTNET_GOERLI].includes(chain.id)) throw new Error("Not implemented");
    const stakingContract = STAKING_CONTRACT.getEthersContract(chain.id);

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

  return useQuery<DecimalBigNumber, Error>(["gonsForBalance", balance], async () => {
    if (![NetworkId.MAINNET, NetworkId.TESTNET_GOERLI].includes(chain.id)) throw new Error("Not implemented");
    const sohmContract = SOHM_CONTRACT.getEthersContract(chain.id);

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

  return useQuery<DecimalBigNumber, Error>(["balanceForGons", gons], async () => {
    if (![NetworkId.MAINNET, NetworkId.TESTNET_GOERLI].includes(chain.id)) throw new Error("Not implemented");
    const sohmContract = SOHM_CONTRACT.getEthersContract(chain.id);

    const _gons = new DecimalBigNumber(gons, 9);
    const balance = await sohmContract.balanceForGons(_gons.toBigNumber());

    return new DecimalBigNumber(balance, 9);
  });
};
