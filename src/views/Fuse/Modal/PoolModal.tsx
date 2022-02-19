import { Box, Fade, Grid, Typography } from "@material-ui/core";
import { Modal, TextButton, TokenStack } from "@olympusdao/component-library";
import { useEffect, useState } from "react";

import { USDPricedFuseAsset } from "../../../fuse-sdk/helpers/fetchFusePoolData";
import { Mode } from "../../../fuse-sdk/helpers/fetchMaxAmount";
import { AmountSelect } from "./AmountSelect";

interface Props {
  onClose: () => any;
  defaultMode: Mode;
  asset: USDPricedFuseAsset;
  comptrollerAddress: string;
  borrowLimit: number;
}
export function PoolModal(props: Props) {
  const [mode, setMode] = useState(props.defaultMode);

  useEffect(() => {
    setMode(props.defaultMode);
  }, [props.defaultMode]);

  const headerContent = (
    <Box display="flex" flexDirection="row">
      {/* @ts-ignore */}
      <TokenStack token={props.asset.underlyingSymbol} />
      <Box display="flex" flexDirection="column" ml={1} justifyContent="center" alignItems="center">
        <Typography variant="h5">{`${props.asset.underlyingName}`}</Typography>
        {/* TODO href */}
        <TextButton href="http://mfwo">View contract</TextButton>
      </Box>
    </Box>
  );

  return (
    <Fade in={true} mountOnEnter unmountOnExit>
      <Grid container>
        <Modal
          open={true}
          id="fuse-view"
          minHeight="auto"
          onClose={props.onClose}
          closePosition="left"
          headerContent={headerContent}
          // topRight={advSettings}
        >
          <AmountSelect
            comptrollerAddress={props.comptrollerAddress}
            onClose={props.onClose}
            asset={props.asset}
            mode={mode}
            setMode={setMode}
            borrowLimit={props.borrowLimit}
          />
        </Modal>
      </Grid>
    </Fade>
  );
}
