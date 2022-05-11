import { Box, Theme, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Modal, TokenStack } from "@olympusdao/component-library";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles<Theme>(theme => ({}));

/**
 * Component for Displaying RangeModal
 */
const RangeModal: FC = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  return (
    <Modal
      topLeft={<></>}
      headerContent={
        <Box display="flex" flexDirection="row">
          <TokenStack tokens={["DAI", "OHM"]} />
          <Box display="flex" flexDirection="column" ml={1} justifyContent="center" alignItems="center">
            <Typography variant="h5">Swap DAI for OHM</Typography>
          </Box>
        </Box>
      }
      open
      onClose={() => navigate(`/range`)}
    >
      <>Range Input Area</>
    </Modal>
  );
};

export default RangeModal;
