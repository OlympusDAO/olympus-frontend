import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface DefillamaPriceResponse {
  coins: {
    [address: string]: {
      symbol: string;
      price: number;
    };
  };
}
/**Mainnet only addresses */
export const useGetDefillamaPrice = ({ addresses }: { addresses: string[] }) => {
  return useQuery(
    ["useGetDefillamaPrice", addresses],
    async () => {
      try {
        const joinedAddresses = addresses.map(address => `ethereum:${address}`).join(",");
        const response = await axios.get<DefillamaPriceResponse>(
          `https://coins.llama.fi/prices/current/${joinedAddresses}`,
        );
        return response.data.coins;
      } catch (error) {
        return {};
      }
    },
    { enabled: addresses.length > 0 },
  );
};
