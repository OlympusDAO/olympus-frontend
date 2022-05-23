import { Dispatch, SetStateAction } from "react";
import { useLocation } from "react-router-dom";
import { useOldAssetsDetected } from "src/hooks/useOldAssetsDetected";
import { useOldAssetsEnoughToMigrate } from "src/hooks/useOldAssetsEnoughToMigrate";

import CallToAction from "./CallToAction/CallToAction";

export const MigrationCallToAction: React.FC<{ setMigrationModalOpen: Dispatch<SetStateAction<boolean>> }> = props => {
  const location = useLocation();
  const trimmedPath = location.pathname + location.hash;
  const oldAssetsDetected = useOldAssetsDetected();
  const oldAssetsEnoughToMigrate = useOldAssetsEnoughToMigrate();

  if (oldAssetsDetected && trimmedPath.indexOf("dashboard") === -1 && oldAssetsEnoughToMigrate)
    return <CallToAction setMigrationModalOpen={props.setMigrationModalOpen} />;

  return null;
};
