import { Project } from "src/components/GiveProject/project.type";
import ProjectCard, { ProjectDetailsMode } from "src/components/GiveProject/ProjectCard";

type ProjectInfoProps = {
  project: Project;
  giveAssetType: string;
  changeAssetType: (checked: boolean) => void;
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
