import "src/views/Stake/Stake.scss";

import { Box, Typography } from "@mui/material";
import { memo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Icon, Modal } from "src/components/library";
import { usePathForNetwork } from "src/hooks/usePathForNetwork";
import { ClaimsArea } from "src/views/Stake/components/ClaimsArea/ClaimsArea";
import { StakeArea } from "src/views/Stake/components/StakeArea/StakeArea";
import { useNetwork } from "wagmi";

const Stake: React.FC = () => {
  const navigate = useNavigate();
  const { chain = { id: 1 } } = useNetwork();
  usePathForNetwork({ pathName: "stake", networkID: chain.id, navigate });
  const [searchParams, setSearchParams] = useSearchParams();
  const isStake = searchParams.get("unstake") ? false : true;
  return (
    <Modal
      headerContent={
        <>
          <Box display="flex" gap="6px">
            <Icon name="stake" />
            <Typography fontSize="15px" lineHeight="24px" fontWeight={500}>
              {isStake ? "Wrap" : "Unwrap"}
            </Typography>
          </Box>
        </>
      }
      open={true}
      onClose={() => navigate("/my-balances")}
      maxWidth="520px"
      minHeight="200px"
    >
      <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
        <StakeArea />
        <ClaimsArea />
      </Box>
    </Modal>
  );
};

export default memo(Stake);
