import { useMutation } from "@tanstack/react-query";
import { ethers } from "ethers";

export const useMineBlocks = () => {
  return useMutation(async ({ blocks }: { blocks: number }) => {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://rpc.tenderly.co/fork/f7571dd4-342e-457a-a83b-670b6a84e4c4",
    );
    const params = [
      ethers.utils.hexValue(blocks), // hex encoded number of blocks to increase
    ];
    const timeParams = [ethers.utils.hexValue(blocks * 15)];
    const response2 = await provider.send("evm_increaseTime", timeParams);
    const response = await provider.send("evm_increaseBlocks", params);
  });
};
