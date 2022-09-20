import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ethers } from "ethers";
import { OHM_ADDRESSES } from "src/constants/addresses";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { BondFixedExpiryTeller__factory, IERC20__factory } from "src/typechain";
import { ERC20BondToken__factory } from "src/typechain/factories";
import { useAccount, useNetwork, useProvider } from "wagmi";

export const useBondTokens = () => {
  const { chain = { name: "mainnet", id: 1 } } = useNetwork();
  const network = chain.name === "ethereum" ? "mainnet" : chain.name;
  const networks = useTestableNetworks();
  return useQuery(["useBondToken"], async () => {
    const options = {
      method: "POST",
      url: `https://eth-${network}.alchemyapi.io/v2/${process.env.REACT_APP_ETHEREUM_ALCHEMY_IDS}`,
      headers: { accept: "application/json", "content-type": "application/json" },
      data: {
        id: 1,
        jsonrpc: "2.0",
        method: "eth_getLogs",
        params: [
          {
            fromBlock: "earliest",
            toBlock: "latest",
            topics: ["0x4fd9a46575749d9ddf290fadaa5729fc640790e2b6360df8cc8af35e418dcec0"],
          },
        ],
      },
    };
    try {
      const response = await axios.request(options);
      const iface = new ethers.utils.Interface(BondFixedExpiryTeller__factory.abi);
      const results = response.data.result;
      const tokens = results
        .map((result: { topics: string[]; data: string }) => {
          const parsed = iface.parseLog({ topics: result.topics, data: result.data });
          if (parsed.args.underlying === OHM_ADDRESSES[networks.MAINNET]) return parsed.args.bondToken;
        })
        .filter((result_1: string) => result_1 != undefined);
      return tokens;
    } catch (error) {
      console.error(error);
    }
  });
};

export const useGetBondTokenBalances = () => {
  const { data: tokens = [] } = useBondTokens();
  const { address = "" } = useAccount();
  const provider = useProvider();
  const networks = useTestableNetworks();

  return useQuery(["useGetTokenBalances", address, tokens], async () => {
    const tokenMap = await Promise.all(
      tokens.map(async (token: string) => {
        const contract = ERC20BondToken__factory.connect(token, provider);
        const underlyingContract = IERC20__factory.connect(await contract.underlying(), provider);
        const balance = new DecimalBigNumber(await contract.balanceOf(address), await contract.decimals());
        const symbol = await contract.symbol();
        const matured = await contract.expiry();
        console.log(matured, "matured", Date.now() / 1000);
        const underlyingTokenSymbol = await underlyingContract.symbol();
        return { balance, symbol, token, matured, underlyingTokenSymbol };
      }),
    );
    const withBalances = tokenMap.filter((token: { balance: DecimalBigNumber }) => token.balance.gt("0"));

    return withBalances;
  });
};
