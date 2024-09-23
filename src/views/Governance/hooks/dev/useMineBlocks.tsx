import { useMutation } from "@tanstack/react-query";
import { ethers } from "ethers";

export const useMineBlocks = () => {
  return useMutation(async ({ blocks }: { blocks: number }) => {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://rpc.tenderly.co/fork/bc145689-8a7d-4a9a-872c-b54c670a762a",
    );
    const params = [
      ethers.utils.hexValue(blocks), // hex encoded number of blocks to increase
    ];
    const timeParams = [ethers.utils.hexValue(blocks * 15)];
    const response2 = await provider.send("evm_increaseTime", timeParams);
    const response = await provider.send("evm_increaseBlocks", params);
  });
};
