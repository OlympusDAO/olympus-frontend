import { useQuery } from "react-query";
import { queryAssertion } from "src/helpers";
import { useAddress } from "./useAddress";
import { useWeb3Context } from "./useWeb3Context";

export const useEnsKey = (address?: string) => [address, "useEns"];

export const useEns = () => {
  const { provider } = useWeb3Context();
  const { data: address } = useAddress();

  return useQuery<{ name: string | null; avatar: string | null }, Error>(
    useEnsKey(address),
    async () => {
      queryAssertion(address, useEnsKey(address));

      const name = await provider.lookupAddress(address);
      const avatar = name ? await provider.getAvatar(name) : null;

      return { name, avatar };
    },

    { enabled: !!address },
  );
};
