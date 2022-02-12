import { Backdrop, Fade, Paper } from "@material-ui/core";
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

  return (
    <Fade in mountOnEnter unmountOnExit>
      <div id="bond-view">
        <Backdrop open className="pool-modal">
          <Fade in>
            <Paper className="hec-card hec-modal">
              <AmountSelect
                comptrollerAddress={props.comptrollerAddress}
                onClose={props.onClose}
                asset={props.asset}
                mode={mode}
                setMode={setMode}
                borrowLimit={props.borrowLimit}
              />
            </Paper>
          </Fade>
        </Backdrop>
      </div>
    </Fade>
  );
}
