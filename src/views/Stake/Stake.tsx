import "src/views/Stake/Stake.scss";

import { Box } from "@mui/material";
import { Modal } from "@olympusdao/component-library";
import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { usePathForNetwork } from "src/hooks/usePathForNetwork";
import { ClaimsArea } from "src/views/Stake/components/ClaimsArea/ClaimsArea";
import { StakeArea } from "src/views/Stake/components/StakeArea/StakeArea";
import { useNetwork } from "wagmi";

const Stake: React.FC = () => {
  const navigate = useNavigate();
  const { chain = { id: 1 } } = useNetwork();
  usePathForNetwork({ pathName: "stake", networkID: chain.id, navigate });

  return (
    <Modal headerText="Wrap" open={true} onClose={() => navigate("/my-balances")} maxWidth="520px" minHeight="200px">
      <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
        <StakeArea />
        <ClaimsArea />
      </Box>
    </Modal>
  );
};

export default memo(Stake);
