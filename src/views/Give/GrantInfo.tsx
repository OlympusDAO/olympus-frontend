import { useNavigate, useParams } from "react-router-dom";
import GrantCard, { GrantDetailsMode } from "src/components/GiveProject/GrantCard";
import { Project } from "src/components/GiveProject/project.type";
import { ChangeAssetType } from "src/slices/interfaces";
import grantData from "src/views/Give/grants.json";

type GrantInfoProps = {
  giveAssetType: string;
  changeAssetType: ChangeAssetType;
};

export default function GrantInfo({ giveAssetType, changeAssetType }: GrantInfoProps) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const grant = grantData.grants.find((p: Project) => p.slug === slug);
  if (grant) {
    return (
      <GrantCard
        grant={grant ? grant : grantData.grants[0]}
        giveAssetType={giveAssetType}
        changeAssetType={changeAssetType}
        mode={GrantDetailsMode.Page}
      />
    );
  }
  navigate("/not-found");
  return <></>;
}
