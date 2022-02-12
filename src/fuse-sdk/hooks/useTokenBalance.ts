import { Provider } from "@ethersproject/providers";
import Big from "big.js";
import { ethers } from "ethers";
import { useQuery } from "react-query";

import { abi as ERC20ABI } from "../../abi/IERC20.json";
import { useRari } from "../helpers/RariContext";
import { ETH_TOKEN_DATA } from "./useTokenData";

export const fetchTokenBalance = async (tokenAddress: string, provider: Provider, address: string): Promise<Big> => {
  let stringBalance;

  if (tokenAddress === ETH_TOKEN_DATA.address || tokenAddress === "NO_ADDRESS_HERE_USE_WETH_FOR_ADDRESS") {
    stringBalance = await provider.getBalance(address);
  } else {
    const contract = new ethers.Contract(tokenAddress, ERC20ABI as any, provider);

    stringBalance = await contract.balanceOf(address);
  }

  return Big(stringBalance);
};

export function useTokenBalance(tokenAddress: string, customAddress?: string) {
  const { fuse, address } = useRari();

  const addressToCheck = customAddress ?? address;

  return useQuery(tokenAddress + " balanceOf " + addressToCheck, () =>
    fetchTokenBalance(tokenAddress, fuse.provider, addressToCheck),
  );
}
