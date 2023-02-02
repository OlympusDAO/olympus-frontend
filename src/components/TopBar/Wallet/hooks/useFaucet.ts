import { useMutation } from "@tanstack/react-query";
import { ContractReceipt } from "ethers";
import toast from "react-hot-toast";
import { DEV_FAUCET } from "src/constants/addresses";
import { GOVERNANCE_MOCK_GOHM_CONTRACT } from "src/constants/contracts";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useDynamicFaucetContract } from "src/hooks/useContract";
import { EthersError } from "src/lib/EthersTypes";
import { useAccount, useNetwork, useSigner } from "wagmi";

export const useFaucet = () => {
  const contract = useDynamicFaucetContract(DEV_FAUCET, true);

  return useMutation<ContractReceipt, EthersError, string>(
    async token_ => {
      if (!contract)
        throw new Error(`Faucet is not supported on this network. Please switch to Goerli Testnet to use the faucet`);

      let transaction;
      if (token_ === "OHM V1") {
        transaction = await contract.mintOHM(0);
      } else if (token_ === "OHM V2") {
        transaction = await contract.mintOHM(1);
      } else if (token_ === "sOHM V1") {
        transaction = await contract.mintSOHM(0);
      } else if (token_ === "sOHM V2") {
        transaction = await contract.mintSOHM(1);
      } else if (token_ === "wsOHM") {
        transaction = await contract.mintWSOHM();
      } else if (token_ === "gOHM") {
        transaction = await contract.mintGOHM();
      } else if (token_ === "DAI") {
        transaction = await contract.mintDAI();
      } else if (token_ === "ETH") {
        transaction = await contract.mintETH("150000000000000000");
      } else {
        throw new Error(`Invalid token`);
      }

      return transaction.wait();
    },
    {
      onError: error => {
        toast.error("error" in error ? error.error.message : error.message);
      },
      onSuccess: async () => {
        toast.success("Successfully requested tokens from Faucet");
      },
    },
  );
};

export const useGovernanceFaucet = () => {
  const contract = GOVERNANCE_MOCK_GOHM_CONTRACT.getEthersContract(5);
  const mintQuantity = new DecimalBigNumber("1000", 18);
  const { data: signer } = useSigner();
  const { address } = useAccount();
  const { chain } = useNetwork();
  return useMutation<ContractReceipt, EthersError>(
    async () => {
      if (!chain || chain.id !== 5) throw new Error("Faucet is only supported on Goerli");
      if (!contract)
        throw new Error(`Faucet is not supported on this network. Please switch to Goerli Testnet to use the faucet`);
      if (!signer) throw new Error("Signer is not set");
      if (!address) throw new Error("Wallet is not connected");

      console.log("mutating", address, mintQuantity.toBigNumber(18));
      const transaction = await contract.connect(signer).mint(address, mintQuantity.toBigNumber(18));
      return transaction.wait();
    },
    {
      onError: error => {
        toast.error("error" in error ? error.error.message : error.message);
      },
      onSuccess: async () => {
        toast.success(`Successfully requested 1000 governance gOHM from Faucet`);
      },
    },
  );
};
