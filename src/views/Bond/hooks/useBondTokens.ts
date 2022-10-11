import { OHMTokenProps } from "@olympusdao/component-library";
import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import { OHM_ADDRESSES } from "src/constants/addresses";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { BondFixedExpiryTeller__factory, IERC20__factory } from "src/typechain";
import { ERC20BondToken__factory } from "src/typechain/factories";
import { useAccount, useProvider } from "wagmi";

/**
 * Queries eth_logs ERC_20 Token created topic and returns all events.
 * Filters events by underlying asset == OHM
 */
export const useBondTokens = () => {
  const provider = useProvider();
  const networks = useTestableNetworks();
  return useQuery(["useBondToken"], async () => {
    const logs = await provider.getLogs({
      fromBlock: "earliest",
      toBlock: "latest",
      topics: [BondFixedExpiryTeller__factory.createInterface().getEventTopic("ERC20BondTokenCreated")],
    });
    try {
      const iface = new ethers.utils.Interface(BondFixedExpiryTeller__factory.abi);
      const tokens: string[] = logs
        .map((result: { topics: string[]; data: string }) => {
          const parsed = iface.parseLog({ topics: result.topics, data: result.data });
          if (parsed.args.underlying.toLowerCase() === OHM_ADDRESSES[networks.MAINNET].toLowerCase())
            return parsed.args.bondToken;
        })
        .filter((result_1: string) => result_1 != undefined);
      return tokens;
    } catch (error) {
      console.error(error);
    }
  });
};

/**
 * Maps through bond tokens and retrieves the underlying balances, symbol,
 * and expiry.
 */
export const useGetBondTokenBalances = () => {
  const { data: tokens = [] } = useBondTokens();
  const { address = "" } = useAccount();
  const provider = useProvider();

  return useQuery<
    {
      balance: DecimalBigNumber;
      symbol: string;
      token: string;
      matured: number;
      underlyingTokenSymbol: OHMTokenProps["name"];
    }[]
  >(["useGetTokenBalances", address, tokens], async () => {
    const tokenMap = await Promise.all(
      tokens.map(async (token: string) => {
        const contract = ERC20BondToken__factory.connect(token, provider);
        const underlyingContract = IERC20__factory.connect(await contract.underlying(), provider);
        const balance = new DecimalBigNumber(await contract.balanceOf(address), await contract.decimals());
        const symbol = await contract.symbol();
        const matured = await contract.expiry();
        const underlyingTokenSymbol = (await underlyingContract.symbol()) as OHMTokenProps["name"];
        return { balance, symbol, token, matured, underlyingTokenSymbol };
      }),
    );
    const withBalances = tokenMap.filter((token: { balance: DecimalBigNumber }) => token.balance.gt("0"));

    return withBalances;
  });
};
