import { t } from "@lingui/macro";
import { Box, Theme, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { DataRow, Input, Modal, PrimaryButton, TokenStack } from "@olympusdao/component-library";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles<Theme>(theme => ({}));

/**
 * Component for Displaying RangeModal
 */
const RangeModal: FC = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [reserveAmount, setReserveAmount] = useState("");
  const [ohmAmount, setOhmAmount] = useState("");
  const setMax = () => {
    return "max";
  };

  //TODO: Swap for Current Price
  const currentPrice = 16.15;
  const changeOhmBalance = (value: any) => {
    const reserveValue = value * currentPrice;
    setOhmAmount(value);
    setReserveAmount(reserveValue.toString());
  };

  const changeReserveBalance = (value: any) => {
    const ohmValue = value / currentPrice;
    setOhmAmount(ohmValue.toString());
    setReserveAmount(value);
  };
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
      <Box display="flex" flexDirection="column">
        {/* TODO: Add WalletConnect Guard */}
        <Box display="flex" flexDirection="column">
          {/* TODO: Add TokenAlllowanceGuard */}
          <Input
            type="string"
            name="amount"
            value={reserveAmount}
            endString={t`Max`}
            endStringOnClick={setMax}
            id="outlined-adornment-amount"
            onChange={event => changeReserveBalance(event.currentTarget.value)}
            label={t`Enter an amount of DAI`}
            startAdornment={"DAI"}
          />
          <Input
            type="string"
            name="amount"
            value={ohmAmount}
            endString={t`Max`}
            endStringOnClick={setMax}
            id="outlined-adornment-amount"
            onChange={event => changeOhmBalance(event.currentTarget.value)}
            label={t`Enter an amount of OHM`}
            startAdornment={"OHM"}
          />
        </Box>
        <Box mt="8px">
          <PrimaryButton fullWidth type="submit">
            Swap
          </PrimaryButton>
        </Box>
        <DataRow title={t`Max you Can Buy`} balance={`${reserveAmount} OHM`} />
      </Box>
    </Modal>
  );
};

export default RangeModal;
