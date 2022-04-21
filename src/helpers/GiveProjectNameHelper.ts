import grantData from "src/views/Give/grants.json";
import projectData from "src/views/Give/projects.json";

const getGiveProjectName = (address: string, fallback?: string): string => {
  if (!address) {
    return fallback || "";
  }

  const { projects } = projectData;
  const projectRecipient = projects.filter(item => item.wallet === address);

  if (projectRecipient.length) return projectRecipient[0].title;

  const { grants } = grantData;
  const grantRecipient = grants.filter(item => item.wallet === address);

  if (grantRecipient.length) return grantRecipient[0].title;

  return address;
};

export { getGiveProjectName };
