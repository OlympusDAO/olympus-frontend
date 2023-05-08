import { useMutation } from "@tanstack/react-query";
import { BigNumber } from "ethers";
import { BLEVaultManagerLido__factory } from "src/typechain";
import { useSigner } from "wagmi";

export const useGetExpectedPairTokenAmount = () => {
  const { data: signer } = useSigner();
  return useMutation(async ({ address, lpAmount }: { address: string; lpAmount: BigNumber }) => {
    if (!signer) throw new Error(`Please connect a wallet`);
    const contract = BLEVaultManagerLido__factory.connect(address, signer);
    const pairTokensOut = await contract.callStatic.getExpectedPairTokenOutUser(lpAmount);
    return pairTokensOut;
  });
};
