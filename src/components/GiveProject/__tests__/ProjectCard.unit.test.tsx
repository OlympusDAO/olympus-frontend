import { render } from "src/testUtils";

import ProjectCard, { ProjectDetailsMode } from "../ProjectCard";

describe("<ProjectCard/>", () => {
  const project = {
    title: "some project",
    owner: "project Owner",
    slug: "project-1",
    shortDescription: "A short description for the card",
    details: "A longer description for the profile",
    finishDate: "2021-03-30T18:00:00Z",
    photos: ["/assets/images/grants/playgrounds/playgrounds_logo.svg"],
    category: "project",
    wallet: "0x43600Fe18A6f3ff9ef40a7611952Cc51Db9AF53a",
    depositGoal: 100,
    website: "https://project.co",
  };

  it("should render card", () => {
    const { container } = render(<ProjectCard project={project} mode={ProjectDetailsMode.Card} />);
    expect(container).toMatchSnapshot();
  });

  it("should render card without image", () => {
    const projectWithoutImage = {
      title: "some project",
      owner: "project Owner",
      slug: "project-1",
      shortDescription: "A short description for the card",
      details: "A longer description for the profile",
      finishDate: "2021-03-30T18:00:00Z",
      photos: [],
      category: "project",
      wallet: "0x43600Fe18A6f3ff9ef40a7611952Cc51Db9AF53a",
      depositGoal: 100,
      website: "https://project.co",
    };

    const { container } = render(<ProjectCard project={projectWithoutImage} mode={ProjectDetailsMode.Card} />);
    expect(container).toMatchSnapshot();
  });

  it("should render page", () => {
    const { container } = render(<ProjectCard project={project} mode={ProjectDetailsMode.Page} />);
    expect(container).toMatchSnapshot();
  });

  it("should render page without image", () => {
    const projectWithoutImage = {
      title: "some project",
      owner: "project Owner",
      slug: "project-1",
      shortDescription: "A short description for the card",
      details: "A longer description for the profile",
      finishDate: "2021-03-30T18:00:00Z",
      photos: [],
      category: "project",
      wallet: "0x43600Fe18A6f3ff9ef40a7611952Cc51Db9AF53a",
      depositGoal: 100,
      website: "https://project.co",
    };

    const { container } = render(<ProjectCard project={projectWithoutImage} mode={ProjectDetailsMode.Page} />);
    expect(container).toMatchSnapshot();
  });

  it("should render page without finish date", () => {
    const projectWithoutFinishDate = {
      title: "some project",
      owner: "project Owner",
      slug: "project-1",
      shortDescription: "A short description for the card",
      details: "A longer description for the profile",
      photos: ["/assets/images/grants/playgrounds/playgrounds_logo.svg"],
      category: "project",
      wallet: "0x43600Fe18A6f3ff9ef40a7611952Cc51Db9AF53a",
      depositGoal: 100,
      website: "https://project.co",
    };

    const { container } = render(<ProjectCard project={projectWithoutFinishDate} mode={ProjectDetailsMode.Page} />);
    expect(container).toMatchSnapshot();
  });
});
