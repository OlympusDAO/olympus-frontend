import { t } from "@lingui/macro";
import { useMutation } from "@tanstack/react-query";
import { ContractReceipt } from "ethers";
import { useDispatch } from "react-redux";
import { DEV_FAUCET } from "src/constants/addresses";
import { useDynamicFaucetContract } from "src/hooks/useContract";
import { error as createErrorToast, info as createInfoToast } from "src/slices/MessagesSlice";

export const useFaucet = () => {
  const dispatch = useDispatch();
  const contract = useDynamicFaucetContract(DEV_FAUCET, true);

  return useMutation<ContractReceipt, Error, string>(
    async token_ => {
      if (!contract)
        throw new Error(t`Faucet is not supported on this network. Please switch to Goerli Testnet to use the faucet`);

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
        throw new Error(t`Invalid token`);
      }

      return transaction.wait();
    },
    {
      onError: error => {
        console.error(error.message);
        dispatch(createErrorToast(error.message));
      },
      onSuccess: async () => {
        dispatch(createInfoToast(t`Successfully requested tokens from Faucet`));
      },
    },
  );
};
