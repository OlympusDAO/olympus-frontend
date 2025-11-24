import { Box, Typography } from "@mui/material";
import { PrimaryButton } from "@olympusdao/component-library";
import { NetworkId } from "src/constants";
import { GOHM_ADDRESSES, USDS_ADDRESSES } from "src/constants/addresses";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { GOHM__factory } from "src/typechain";
import { useAccount, useNetwork, useSigner } from "wagmi";

export const DevTools = () => {
  const networks = useTestableNetworks();
  const { chain = { id: NetworkId.MAINNET } } = useNetwork();
  const { data: signer } = useSigner();
  const { address } = useAccount();

  // Only show on Sepolia testnet
  if (chain.id !== NetworkId.SEPOLIA) return null;

  const mintGohm = async () => {
    if (!signer || !address) return;
    const gohmContract = GOHM__factory.connect(GOHM_ADDRESSES[networks.MAINNET_SEPOLIA], signer);
    const amount = new DecimalBigNumber("1000", 18);
    const tx = await gohmContract.mint(address, amount.toBigNumber());
    await tx.wait();
  };

  const mintUsds = async () => {
    if (!signer || !address) return;
    const usdsContract = GOHM__factory.connect(USDS_ADDRESSES[networks.MAINNET_SEPOLIA], signer);
    const amount = new DecimalBigNumber("10000", 18);
    const tx = await usdsContract.mint(address, amount.toBigNumber());
    await tx.wait();
  };

  return (
    <Box border="1px dashed" p={"16px"} mb="6px">
      <Typography variant="h6" mb="6px">
        Dev Tools
      </Typography>
      <Box display="flex" gap="6px" flexWrap="wrap">
        <PrimaryButton variant="contained" onClick={mintGohm}>
          Mint 1,000 gOHM
        </PrimaryButton>
        <PrimaryButton variant="contained" onClick={mintUsds}>
          Mint 10,000 USDS
        </PrimaryButton>
      </Box>
    </Box>
  );
};
