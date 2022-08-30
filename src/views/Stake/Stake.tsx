import "src/views/Stake/Stake.scss";

import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { usePathForNetwork } from "src/hooks/usePathForNetwork";
import { ExternalStakePools } from "src/views/Stake/components/ExternalStakePools/ExternalStakePools";
import { StakeArea } from "src/views/Stake/components/StakeArea/StakeArea";
import { useNetwork } from "wagmi";

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
