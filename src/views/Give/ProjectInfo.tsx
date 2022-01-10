import { Project } from "src/components/GiveProject/project.type";
import ProjectCard, { ProjectDetailsMode } from "src/components/GiveProject/ProjectCard";

type ProjectInfoProps = {
  project: Project;
};

export default function ProjectInfo({ project }: ProjectInfoProps) {
  return <ProjectCard project={project} mode={ProjectDetailsMode.Page} />;
}
