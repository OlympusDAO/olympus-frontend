import GrantCard, { GrantDetailsMode } from "src/components/GiveProject/GrantCard";
import { Project } from "src/components/GiveProject/project.type";

type GrantInfoProps = {
  grant: Project;
};

export default function GrantInfo({ grant }: GrantInfoProps) {
  return <GrantCard grant={grant} mode={GrantDetailsMode.Page} />;
}
