import "src/views/Stake/Stake.scss";

import { Box, Typography } from "@mui/material";
import { Modal, PrimaryButton } from "@olympusdao/component-library";
import { memo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePathForNetwork } from "src/hooks/usePathForNetwork";
import { ClaimsArea } from "src/views/Stake/components/ClaimsArea/ClaimsArea";
import { StakeArea } from "src/views/Stake/components/StakeArea/StakeArea";
import { useNetwork } from "wagmi";

const Stake: React.FC = () => {
  const navigate = useNavigate();
  const { chain = { id: 1 } } = useNetwork();
  usePathForNetwork({ pathName: "stake", networkID: chain.id, navigate });
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const seenMessage = window.localStorage.getItem("liquidityMessage");
    !seenMessage && setOpenModal(true);
  }, []);

  return (
    <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
      <Modal
        headerContent={
          <Typography fontWeight={600} fontSize="15px">
            Did You Know?
          </Typography>
        }
        open={openModal}
        onClose={() => {
          window.localStorage.setItem("liquidityMessage", "true");
          setOpenModal(false);
        }}
        maxWidth="476px"
        minHeight="200px"
      >
        <Box>
          <Typography fontSize="32px" fontWeight="500" textAlign="center" lineHeight="36px">
            Use OHM to Provide Liquidity
          </Typography>
          <Typography mt="4px" fontSize="15px" textAlign="center" mb="36px">
            The staking rate has been reduced to 2.33%. See the Provide Liquidity page to explore further utility for
            OHM.
          </Typography>
          <PrimaryButton
            fullWidth
            onClick={() => {
              window.localStorage.setItem("liquidityMessage", "true");
              navigate("/liquidity");
            }}
          >
            Take me to Provide Liquidity
          </PrimaryButton>
        </Box>
      </Modal>
      <StakeArea />
      <ClaimsArea />
    </Box>
  );
};

export default memo(Stake);
