import { CheckBoxOutlineBlank, CheckBoxOutlined } from "@mui/icons-material";
import { Box, Checkbox, FormControlLabel, Typography, useTheme } from "@mui/material";
import { DataRow, Icon, Metric, Modal, PrimaryButton, TokenStack } from "@olympusdao/component-library";
import { useState } from "react";

export const ConfirmationModal = () => {
  const theme = useTheme();
  const [checked, setChecked] = useState(false);
  return (
    <Modal
      maxWidth="476px"
      minHeight="200px"
      open={true}
      headerContent={
        <Box display="flex" flexDirection="row" gap="6px" alignItems="center">
          <TokenStack tokens={["ETH", "OHM"]} sx={{ fontSize: "27px" }} />
          <Typography fontWeight="500">Deposit stETH</Typography>
        </Box>
      }
      onClose={() => {
        console.log("close");
      }}
    >
      <>
        <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
          <Box display="flex" flexDirection="column">
            <Metric label="Assets to Deposit" metric={"10"} />
            <Box display="flex" flexDirection="row" justifyContent="center">
              <Typography>stETH</Typography>
            </Box>
          </Box>
          <Icon sx={{ transform: "rotate(-90deg)" }} name="caret-down" />
          <Box display="flex" flexDirection="column">
            <Metric label="Assets to Receive" metric="10" />
            <Box display="flex" flexDirection="row" justifyContent="center">
              <Typography>stETH-OHM LP</Typography>
            </Box>
          </Box>
        </Box>
        <Box mt="21px" mb="21px" borderTop={`1px solid ${theme.colors.gray[500]}`}></Box>
        <DataRow title="Your Balance" balance={"0.00"} />
        <DataRow title="OHM Minted" balance={"0.00"} />
        <DataRow title="Max You Can Buy" balance={"0.00"} />
        <DataRow title="Max You Can Buy" balance={"0.00"} />
        <div>
          <Box display="flex" alignItems="center">
            <FormControlLabel
              sx={{ marginRight: 0 }}
              control={
                <Checkbox
                  checked={checked}
                  onChange={event => setChecked(event.target.checked)}
                  icon={<CheckBoxOutlineBlank viewBox="0 0 24 24" />}
                  checkedIcon={<CheckBoxOutlined viewBox="0 0 24 24" />}
                  data-testid="disclaimer-checkbox"
                />
              }
              label=""
              data-testid="disclaimer"
            />
            <Typography fontWeight="500">I Understand</Typography>
          </Box>
          <Typography fontSize="12px" lineHeight="15px" mb="18px">
            By depositing stETH into an AMO pools, you are not guaranteed to get back the exact same amount of deposit
            tokens at time of withdraw and your position will be exposed to impermanent loss.
          </Typography>
        </div>

        <PrimaryButton fullWidth onClick={() => console.log("submit")} disabled={true} loading={false}>
          Submit
        </PrimaryButton>
      </>
    </Modal>
  );
};
