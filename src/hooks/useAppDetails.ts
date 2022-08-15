import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import { NetworkId } from "src/constants";
import { SOHM_CONTRACT, STAKING_CONTRACT, V1_STAKING_CONTRACT } from "src/constants/contracts";
import { queryAssertion } from "src/helpers/react-query/queryAssertion";
import {
  useMarketCap,
  useOhmCirculatingSupply,
  useOhmPrice,
  useOhmTotalSupply,
  useTotalValueDeposited,
  useTreasuryMarketValue,
} from "src/hooks/useProtocolMetrics";
import { useProvider } from "wagmi";

export interface IAppData {
  readonly circSupply?: number;
  readonly currentIndex?: string;
  readonly currentIndexV1?: string;
  readonly currentBlock?: number;
  readonly fiveDayRate?: number;
  readonly loading: boolean;
  readonly loadingMarketPrice: boolean;
  readonly marketCap?: number;
  readonly marketPrice?: number;
  readonly stakingAPY?: number;
  readonly stakingRebase?: number;
  readonly stakingTVL?: number;
  readonly totalSupply?: number;
  readonly treasuryBalance?: number;
  readonly treasuryMarketValue?: number;
  readonly secondsToEpoch?: number;
}

export const appDetailsKey = () => ["useAppDetails"];

export const useAppDetails = (subgraphUrl?: string) => {
  const provider = useProvider({ chainId: NetworkId.MAINNET });

  const { data: stakingTVL } = useTotalValueDeposited(subgraphUrl);
  const { data: totalSupply } = useOhmTotalSupply(subgraphUrl);
  const { data: treasuryMarketValue } = useTreasuryMarketValue(subgraphUrl);
  const { data: marketCap } = useMarketCap(subgraphUrl);
  const { data: marketPrice } = useOhmPrice(subgraphUrl);
  const { data: circSupply } = useOhmCirculatingSupply(subgraphUrl);

  const key = appDetailsKey();
  return useQuery<IAppData, Error>(
    key,
    async () => {
      queryAssertion(
        stakingTVL && //
          totalSupply &&
          treasuryMarketValue &&
          marketCap &&
          marketPrice &&
          circSupply,
        key,
      );

      if (!provider) {
        console.error("Failed to connect to provider, please connect your wallet");
        return {
          stakingTVL,
          marketPrice,
          marketCap,
          circSupply,
          totalSupply,
          treasuryMarketValue,
        } as IAppData;
      }

      const currentBlock = await provider.getBlockNumber();

      const stakingContract = STAKING_CONTRACT.getEthersContract(NetworkId.MAINNET);
      const stakingContractV1 = V1_STAKING_CONTRACT.getEthersContract(NetworkId.MAINNET);
      const sOhmContract = SOHM_CONTRACT.getEthersContract(NetworkId.MAINNET);

      //Calculating staking
      const epoch = await stakingContract.epoch();
      const secondsToEpoch = Number(await stakingContract.secondsToNextEpoch());
      const stakingReward = epoch.distribute;
      const circ = await sOhmContract.circulatingSupply();
      const stakingRebase = Number(stakingReward.toString()) / Number(circ.toString());
      const fiveDayRate = Math.pow(1 + stakingRebase, 5 * 3) - 1;
      const stakingAPY = Math.pow(1 + stakingRebase, 365 * 3) - 1;

      //current index
      const currentIndex = await stakingContract.index();
      const currentIndexV1 = await stakingContractV1.index();

      return {
        currentIndex: ethers.utils.formatUnits(currentIndex, "gwei"),
        currentIndexV1: ethers.utils.formatUnits(currentIndexV1, "gwei"),
        currentBlock,
        fiveDayRate,
        stakingAPY,
        stakingTVL,
        stakingRebase,
        marketCap,
        marketPrice,
        circSupply,
        totalSupply,
        treasuryMarketValue,
        secondsToEpoch,
      } as IAppData;
    },
    {
      enabled:
        !!stakingTVL && //
        !!totalSupply &&
        !!treasuryMarketValue &&
        !!marketCap &&
        !!marketPrice &&
        !!circSupply,
    },
  );
};
