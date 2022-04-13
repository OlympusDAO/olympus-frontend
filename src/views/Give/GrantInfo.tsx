import GrantCard, { GrantDetailsMode } from "src/components/GiveProject/GrantCard";
import { Project } from "src/components/GiveProject/project.type";
import { ChangeAssetType } from "src/slices/interfaces";

type GrantInfoProps = {
  grant: Project;
  giveAssetType: string;
  changeAssetType: ChangeAssetType;
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
