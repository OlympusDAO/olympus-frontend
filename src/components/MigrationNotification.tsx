import { useHasDust } from "src/hooks/useHasDust";
import { useOldAssetsDetected } from "src/hooks/useOldAssetsDetected";

import MigrationModal from "./Migration/MigrationModal";
import MigrationModalSingle from "./Migration/MigrationModalSingle";

export const MigrationNotification: React.FC<{ isModalOpen: boolean; onClose: () => void }> = props => {
  const hasDust = useHasDust();
  const oldAssetsDetected = useOldAssetsDetected();

  if (!oldAssetsDetected) return null;

  if (hasDust) return <MigrationModalSingle open={props.isModalOpen} handleClose={props.onClose} />;

  return <MigrationModal open={props.isModalOpen} handleClose={props.onClose} />;
};
