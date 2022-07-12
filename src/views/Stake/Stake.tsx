import "./Stake.scss";

import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { usePathForNetwork } from "src/hooks/usePathForNetwork";
import { useNetwork } from "wagmi";

import { ExternalStakePools } from "./components/ExternalStakePools/ExternalStakePools";
import { StakeArea } from "./components/StakeArea/StakeArea";

const Stake: React.FC = () => {
  const navigate = useNavigate();
  const { chain = { id: 1 } } = useNetwork();
  usePathForNetwork({ pathName: "stake", networkID: chain.id, navigate });

  return (
    <div id="stake-view">
      <StakeArea />

      <ExternalStakePools />
    </div>
  );
};

export default memo(Stake);
