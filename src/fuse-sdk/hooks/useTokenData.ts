import { Provider } from "@ethersproject/providers";
import { ethers } from "ethers";
import { useMemo } from "react";
import { useQueries, useQuery } from "react-query";

import { abi as ERC20ABI } from "../../abi/IERC20.json";

export const ETH_TOKEN_DATA = {
  symbol: "ETH",
  address: "0x0000000000000000000000000000000000000000",
  name: "Ethereum Network Token",
  decimals: 18,
  color: "#627EEA",
  overlayTextColor: "#fff",
  logoURL: "https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/64/Ethereum-ETH-icon.png",
};

export interface TokenData {
  name: string | null;
  symbol: string | null;
  address: string | null;
  decimals: number | null;
  color: string | null;
  overlayTextColor: string | null;
  logoURL: string | null;
  extraData?: Record<string, any>;
}

export const useTokenDataWithContract = (address: string, provider: Provider) => {
  const tokenData = useTokenData(address);

  const contract = useMemo(() => new ethers.Contract(address, ERC20ABI as any, provider), [address, provider]);

  return { tokenData, contract };
};

export const fetchTokenData = async (address: string) => {
  let data;

  if (address !== ETH_TOKEN_DATA.address) {
    try {
      data = {
        ...(await fetch(
          // Since running the vercel functions requires a Vercel account and is super slow,
          // just fetch this data from the live site in development:
          (process.env.NODE_ENV === "development" ? "https://app.rari.capital" : "https://app.rari.capital") +
            "/api/tokenData?address=" +
            address,
        ).then(res => res.json())),
        address: address,
      };
    } catch (e) {
      data = {
        name: null,
        address: null,
        symbol: null,
        decimals: null,
        color: null,
        overlayTextColor: null,
        logoURL: null,
      };
    }
  } else {
    data = ETH_TOKEN_DATA;
  }

  return data as TokenData;
};

export const useTokenData = (address: string) => {
  const { data: tokenData } = useQuery(address + " tokenData", async () => await fetchTokenData(address));
  return tokenData;
};

export const useTokensData = (addresses: string[]) => {
  const tokensData = useQueries(
    addresses.map((address: string) => {
      return {
        queryKey: address + " tokenData",
        queryFn: async () => await fetchTokenData(address),
      };
    }),
  );

  return useMemo(() => {
    const ret: any[] = [];

    if (!tokensData.length) return [];

    // Return null altogether
    tokensData.forEach(({ data }) => {
      if (!data) return [];
      ret.push(data);
    });

    if (!ret.length) return [];

    return ret;
  }, [tokensData]);
};

export interface TokensDataMap {
  [address: string]: TokenData;
}

export const useTokensDataAsMap = (addresses: string[] = []): TokensDataMap => {
  const tokensData = useQueries(
    addresses.map((address: string) => {
      return {
        queryKey: address + " tokenData",
        queryFn: async () => await fetchTokenData(address),
      };
    }),
  );

  return useMemo(() => {
    const ret: TokensDataMap = {};
    if (!tokensData.length) return {};
    tokensData.forEach(({ data }) => {
      const _data = data as TokenData;
      if (_data && _data.address) {
        ret[_data.address] = _data;
      }
    });

    return ret;
  }, [tokensData]);
};
