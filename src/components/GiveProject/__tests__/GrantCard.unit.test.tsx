import { render } from "src/testUtils";

import GrantCard, { GrantDetailsMode } from "../GrantCard";

describe("<GrantCard/>", () => {
  const grant = {
    title: "some grant",
    owner: "Grant Owner",
    slug: "grant-1",
    shortDescription: "A short description for the card",
    details: "A longer description for the profile",
    photos: ["/assets/images/grants/playgrounds/playgrounds_logo.svg"],
    category: "grant",
    wallet: "0x43600Fe18A6f3ff9ef40a7611952Cc51Db9AF53a",
    website: "https://grant.co",
    depositGoal: 0,
    milestones: [
      {
        amount: 100,
        description: "Achieve 1, Achieve B, Achieve Z",
      },
    ],
  };

  it("should render card", () => {
    const { container } = render(<GrantCard grant={grant} mode={GrantDetailsMode.Card} />);
    expect(container).toMatchSnapshot();
  });

  it("should render card without image", () => {
    const grantWithoutImage = {
      title: "some grant",
      owner: "Grant Owner",
      slug: "grant-1",
      shortDescription: "A short description for the card",
      details: "A longer description for the profile",
      photos: [],
      category: "grant",
      wallet: "0x43600Fe18A6f3ff9ef40a7611952Cc51Db9AF53a",
      website: "https://grant.co",
      depositGoal: 0,
      milestones: [
        {
          amount: 100,
          description: "Achieve 1, Achieve B, Achieve Z",
        },
      ],
    };

    const { container } = render(<GrantCard grant={grantWithoutImage} mode={GrantDetailsMode.Card} />);
    expect(container).toMatchSnapshot();
  });

  it("should render page", () => {
    const { container } = render(<GrantCard grant={grant} mode={GrantDetailsMode.Page} />);
    expect(container).toMatchSnapshot();
  });

  it("should render page without image", () => {
    const grantWithoutImage = {
      title: "some grant",
      owner: "Grant Owner",
      slug: "grant-1",
      shortDescription: "A short description for the card",
      details: "A longer description for the profile",
      photos: [],
      category: "grant",
      wallet: "0x43600Fe18A6f3ff9ef40a7611952Cc51Db9AF53a",
      website: "https://grant.co",
      depositGoal: 0,
      milestones: [
        {
          amount: 100,
          description: "Achieve 1, Achieve B, Achieve Z",
        },
      ],
    };

    const { container } = render(<GrantCard grant={grantWithoutImage} mode={GrantDetailsMode.Page} />);
    expect(container).toMatchSnapshot();
  });

  it("should render page without milestones", () => {
    const grantWithoutMilestones = {
      title: "some grant",
      owner: "Grant Owner",
      slug: "grant-1",
      shortDescription: "A short description for the card",
      details: "A longer description for the profile",
      photos: ["/assets/images/grants/playgrounds/playgrounds_logo.svg"],
      category: "grant",
      wallet: "0x43600Fe18A6f3ff9ef40a7611952Cc51Db9AF53a",
      website: "https://grant.co",
      depositGoal: 0,
    };

    const { container } = render(<GrantCard grant={grantWithoutMilestones} mode={GrantDetailsMode.Page} />);
    expect(container).toMatchSnapshot();
  });

  it("should render page with multiple milestones", () => {
    const grantWithMilestones = {
      title: "some grant",
      owner: "Grant Owner",
      slug: "grant-1",
      shortDescription: "A short description for the card",
      details: "A longer description for the profile",
      photos: ["/assets/images/grants/playgrounds/playgrounds_logo.svg"],
      category: "grant",
      wallet: "0x43600Fe18A6f3ff9ef40a7611952Cc51Db9AF53a",
      website: "https://grant.co",
      depositGoal: 0,
      milestones: [
        {
          amount: 100,
          description: "Achieve 1, Achieve B, Achieve Z",
        },
        {
          amount: 200,
          description: "Achieve 3, Achieve 4, Achieve 5",
        },
      ],
    };

    const { container } = render(<GrantCard grant={grantWithMilestones} mode={GrantDetailsMode.Page} />);
    expect(container).toMatchSnapshot();
  });

  it("should render page without milestone description", () => {
    const grantWithMilestones = {
      title: "some grant",
      owner: "Grant Owner",
      slug: "grant-1",
      shortDescription: "A short description for the card",
      details: "A longer description for the profile",
      photos: ["/assets/images/grants/playgrounds/playgrounds_logo.svg"],
      category: "grant",
      wallet: "0x43600Fe18A6f3ff9ef40a7611952Cc51Db9AF53a",
      website: "https://grant.co",
      depositGoal: 0,
      milestones: [
        {
          amount: 100,
          description: "",
        },
      ],
    };

    const { container } = render(<GrantCard grant={grantWithMilestones} mode={GrantDetailsMode.Page} />);
    expect(container).toMatchSnapshot();
  });
});
