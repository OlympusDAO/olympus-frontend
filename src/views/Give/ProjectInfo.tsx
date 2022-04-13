import { Project } from "src/components/GiveProject/project.type";
import ProjectCard, { ProjectDetailsMode } from "src/components/GiveProject/ProjectCard";
import { ChangeAssetType } from "src/slices/interfaces";

type ProjectInfoProps = {
  project: Project;
  giveAssetType: string;
  changeAssetType: ChangeAssetType;
};

export default function ProjectInfo({ project, giveAssetType, changeAssetType }: ProjectInfoProps) {
  return (
    <ProjectCard
      project={project}
      giveAssetType={giveAssetType}
      changeAssetType={changeAssetType}
      mode={ProjectDetailsMode.Page}
    />
  );
}
