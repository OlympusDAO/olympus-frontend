import GrantCard, { GrantDetailsMode } from "src/components/GiveProject/GrantCard";
import { Project } from "src/components/GiveProject/project.type";

type GrantInfoProps = {
  grant: Project;
  giveAssetType: string;
  changeAssetType: (checked: boolean) => void;
};

export default function GrantInfo({ grant, giveAssetType, changeAssetType }: GrantInfoProps) {
  return (
    <GrantCard
      grant={grant}
      giveAssetType={giveAssetType}
      changeAssetType={changeAssetType}
      mode={GrantDetailsMode.Page}
    />
  );
}
