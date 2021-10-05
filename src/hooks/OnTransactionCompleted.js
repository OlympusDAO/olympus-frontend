import { useEffect } from "react";

export const useOnTransactionCompleted = (tx, onCompleted) => {
  useEffect(() => {
    if (tx.completed && !tx.error) {
      onCompleted();
    }
  }, [tx.completed, tx.error]);
};
