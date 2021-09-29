import { useCallback } from "react";
import { callTransaction } from "lib/utils/callTransaction";

export const useSendTransaction = function () {
  const sendTx = useCallback(
    async (setTx, provider, address, contractAddress, contractAbi, method, txName, params = []) => {
      callTransaction(setTx, provider, address, contractAddress, contractAbi, method, txName, params);
    },
    [],
  );

  return sendTx;
};
