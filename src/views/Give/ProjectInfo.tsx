import { useNavigate, useParams } from "react-router-dom";
import { Project } from "src/components/GiveProject/project.type";
import ProjectCard, { ProjectDetailsMode } from "src/components/GiveProject/ProjectCard";
import { ChangeAssetType } from "src/slices/interfaces";
import projectData from "src/views/Give/projects.json";

type ProjectInfoProps = {
  giveAssetType: string;
  changeAssetType: ChangeAssetType;
};

export default function ProjectInfo({ giveAssetType, changeAssetType }: ProjectInfoProps) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const project = projectData.projects.find((p: Project) => p.slug === slug);
  if (project) {
    return (
      <ProjectCard
        project={project}
        giveAssetType={giveAssetType}
        changeAssetType={changeAssetType}
        mode={ProjectDetailsMode.Page}
      />
    );
  }
  navigate("/not-found");
  return <></>;
}
