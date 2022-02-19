import projectData from "src/views/Give/projects.json";

const getGiveProjectName = (address: string) => {
  if (!address) {
    return;
  }

  const { projects } = projectData;

  const recipient = projects.filter(item => item.wallet === address);

  return recipient.length ? recipient[0].title : address;
};

export { getGiveProjectName };
