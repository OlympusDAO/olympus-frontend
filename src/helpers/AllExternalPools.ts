import { ExternalPool } from "src/lib/ExternalPool";
import { ReactComponent as avaxImage } from "src/assets/tokens/AVAX.svg";
import { ReactComponent as gOhmImage } from "src/assets/tokens/token_wsOHM.svg";
import { ReactComponent as wEthImage } from "src/assets/tokens/wETH.svg";
import { addresses, NetworkId } from "src/constants";
import { NodeHelper } from "./NodeHelper";
import { BigNumber, ethers } from "ethers";
import { abi as PairContractABI } from "src/abi/PairContract.json";
import { OlympusStakingv2__factory, PairContract } from "src/typechain";
import { formatCurrency, getMarketPrice, getTokenPrice } from "src/helpers";

export const tj_gohm_wavax = new ExternalPool({
  poolName: "gOHM-AVAX",
  icons: [gOhmImage, avaxImage],
  stakeOn: "Trader Joe",
  pairGecko: "avalanche-2",
  href: "https://traderjoexyz.com/#/farm/0xB674f93952F02F2538214D4572Aa47F262e990Ff-0x188bED1968b795d5c9022F6a0bb5931Ac4c18F00",
  address: "0xb674f93952f02f2538214d4572aa47f262e990ff",
  masterchef: "0x188bED1968b795d5c9022F6a0bb5931Ac4c18F00",
  networkID: NetworkId.AVALANCHE,
});

export const pango_gohm_wavax = new ExternalPool({
  poolName: "gOHM-AVAX",
  icons: [gOhmImage, avaxImage],
  stakeOn: "Pangolin",
  pairGecko: "avalanche-2",
  href: "https://app.pangolin.exchange/#/png/0x321E7092a180BB43555132ec53AaA65a5bF84251/AVAX/2",
  address: "0xb68f4e8261a4276336698f5b11dc46396cf07a22",
  masterchef: "0x188bED1968b795d5c9022F6a0bb5931Ac4c18F00",
  networkID: NetworkId.AVALANCHE,
});

export const sushi_arb_gohm_weth = new ExternalPool({
  poolName: "gOHM-wETH",
  icons: [gOhmImage, wEthImage],
  stakeOn: "Sushi (Arbitrum)",
  pairGecko: "ethereum",
  href: "https://app.sushi.com/farm?filter=2x",
  address: "0xaa5bD49f2162ffdC15634c87A77AC67bD51C6a6D",
  masterchef: "0xF4d73326C13a4Fc5FD7A064217e12780e9Bd62c3",
  networkID: NetworkId.ARBITRUM,
});

export const sushi_poly_gohm_weth = new ExternalPool({
  poolName: "gOHM-wETH",
  icons: [gOhmImage, wEthImage],
  stakeOn: "Sushi (Polygon)",
  pairGecko: "ethereum",
  href: "https://app.sushi.com/farm?filter=2x",
  address: "0x1549e0e8127d380080aab448b82d280433ce4030",
  masterchef: "0x0769fd68dFb93167989C6f7254cd0D766Fb2841F",
  networkID: NetworkId.POLYGON,
});

// export const allPools = [tj_gohm_wavax, pango_gohm_wavax, sushi_arb_gohm_weth, sushi_poly_gohm_weth];
export const allPools = [tj_gohm_wavax, sushi_arb_gohm_weth, sushi_poly_gohm_weth];

/**
 * iterate through a given wallet address for all ExternalPools
 * @param address
 */
export const fetchPoolData = async (address: string) => {
  try {
    const results = allPools.map(async pool => {
      const provider = NodeHelper.getAnynetStaticProvider(pool.networkID);
      const poolContract = new ethers.Contract(pool.address as string, PairContractABI, provider) as PairContract;
      let userBalance = BigNumber.from("0");
      if (address) {
        userBalance = await poolContract.balanceOf(address);
      }
      let stakedBalanceAsLp = Number((await poolContract.balanceOf(pool.masterchef)).toString()) / 10 ** 18;
      let poolTokenSupply = Number((await poolContract.totalSupply()).toString()) / 10 ** 18;
      const { reserve0, reserve1 } = await poolContract.getReserves();
      let reserve0Price = 0;
      let reserve1Price = 0;
      const token0 = await poolContract.token0();
      const ohmPrice = await getMarketPrice();
      const mainnetProvider = NodeHelper.getMainnetStaticProvider();
      const stakingContract = OlympusStakingv2__factory.connect(
        addresses[NetworkId.MAINNET].STAKING_V2,
        mainnetProvider,
      );
      const currentIndex = await stakingContract.index();
      const gOhmPrice = ohmPrice * Number(ethers.utils.formatUnits(currentIndex, "gwei"));
      let token2Price: number = await getTokenPrice(pool.pairGecko);
      if (token0.toLowerCase() === addresses[pool.networkID].GOHM_ADDRESS.toLowerCase()) {
        reserve0Price = gOhmPrice;
        reserve1Price = token2Price;
      } else {
        reserve1Price = gOhmPrice;
        reserve0Price = token2Price;
      }
      const totalLpAsUSD =
        Number(ethers.utils.formatEther(reserve0)) * reserve0Price +
        Number(ethers.utils.formatEther(reserve1)) * reserve1Price;
      const tvl = (totalLpAsUSD * stakedBalanceAsLp) / poolTokenSupply;
      return {
        ...pool,
        userBalance: ethers.utils.formatEther(userBalance),
        apy: "1000%",
        tvl: formatCurrency(tvl, 2, "USD"),
      };
    });
    return await Promise.all(results);
  } catch {
    return allPools;
  }
};

export default allPools;
