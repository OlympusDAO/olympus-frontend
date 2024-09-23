import { QueryClient, useMutation } from "@tanstack/react-query";

export async function addToNetwork() {
  try {
    if (window.ethereum) {
      const chainId = 1;
      const params = {
        chainId: "0x" + chainId.toString(16),
        chainName: "Olympus Governance Fork - Ethereum",
        nativeCurrency: {
          name: "Ether",
          symbol: "ETH",
          decimals: 18,
        },
        rpcUrls: ["https://rpc.tenderly.co/fork/bc145689-8a7d-4a9a-872c-b54c670a762a"],
      };

      const result = await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [params],
      });

      return result;
    } else {
      throw new Error("No Ethereum Wallet");
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

export default function useAddToNetwork() {
  const queryClient = new QueryClient();

  return useMutation(addToNetwork, {
    onSettled: () => {
      queryClient.invalidateQueries();
    },
  });
}
