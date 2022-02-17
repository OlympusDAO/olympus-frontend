import { useBalance } from "src/hooks/useBalance";
import { ExternalPool } from "src/lib/ExternalPool";

export const useStakePoolBalance = (pool: ExternalPool) => {
  return useBalance({ [pool.networkID]: pool.address });
};
