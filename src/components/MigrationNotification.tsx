import MigrationModal from "src/components/Migration/MigrationModal";
import MigrationModalSingle from "src/components/Migration/MigrationModalSingle";
import { useHasDust } from "src/hooks/useHasDust";
import { useOldAssetsDetected } from "src/hooks/useOldAssetsDetected";

export const MigrationNotification: React.FC<{ isModalOpen: boolean; onClose: () => void }> = props => {
  const hasDust = useHasDust();
  const oldAssetsDetected = useOldAssetsDetected();

  if (!oldAssetsDetected) return null;

  if (hasDust) return <MigrationModalSingle open={props.isModalOpen} handleClose={props.onClose} />;

  return <MigrationModal open={props.isModalOpen} handleClose={props.onClose} />;
};
