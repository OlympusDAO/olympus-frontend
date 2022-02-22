import "./Stake.scss";

import { memo } from "react";
import { useHistory } from "react-router-dom";
import { useWeb3Context } from "src/hooks";
import { usePathForNetwork } from "src/hooks/usePathForNetwork";

import ExternalStakePools from "./components/ExternalStakePools/ExternalStakePools";
import { StakeArea } from "./components/StakeArea/StakeArea";

const Stake: React.FC = () => {
  const history = useHistory();
  const { networkId } = useWeb3Context();
  usePathForNetwork({ pathName: "stake", networkID: networkId, history });

  return (
    <div id="stake-view">
      <StakeArea />

      {/* NOTE (appleseed-olyzaps) olyzaps disabled until v2 contracts */}
      {/* <ZapCta /> */}

      <ExternalStakePools />
    </div>
  );
};

export default memo(Stake);
