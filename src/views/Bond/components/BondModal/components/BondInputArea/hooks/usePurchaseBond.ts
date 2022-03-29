import { useMutation } from "react-query";
import { BOND_DEPOSITORY_CONTRACT } from "src/constants/contracts";
import { useWeb3Context } from "src/hooks";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";

export const usePurchaseBond = (isInverseBond: boolean) => {
  const { provider } = useWeb3Context();
  const networks = useTestableNetworks();

  return useMutation<void, Error, { id: string; amount: string; maxPrice: string; address: string }>(async params => {
    // const contract = isInverseBond ? OP_BOND_DEPOSITORY_CONTRACT : BOND_DEPOSITORY_CONTRACT;
    const contract = BOND_DEPOSITORY_CONTRACT;
    const ethers = contract.getEthersContract(networks.MAINNET).connect(provider.getSigner());

    await ethers.deposit(params.id, params.amount, params.maxPrice, params.address, "");
  });
};
