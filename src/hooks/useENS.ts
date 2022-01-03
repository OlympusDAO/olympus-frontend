import { ethers } from "ethers";
import { useQuery } from "react-query";
import { queryAssertion } from "src/helpers";
import { useAddress } from "./useAddress";
import { useWeb3Context } from "./useWeb3Context";

export const useENSKey = (address?: string) => [address, "useENS"];

export const useENS = () => {
  const { provider } = useWeb3Context();
  const { data: address } = useAddress();

  return useQuery<{ name?: string; avatar?: string }, Error>(
    useENSKey(address),
    async () => {
      queryAssertion(address, useENSKey(address));

      const name = (await provider.lookupAddress(address)) ?? undefined;

      let avatar: string | undefined;
      if (name) avatar = (await provider.getAvatar(name)) ?? undefined;

      return { name, avatar };
    },

    { enabled: !!address },
  );
};
