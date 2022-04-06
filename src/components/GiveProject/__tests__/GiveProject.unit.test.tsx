import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useCurrentIndex } from "src/hooks/useCurrentIndex";

import { act, render } from "../../../testUtils";
import ProjectCard, { ProjectDetailsMode } from "../ProjectCard";

jest.mock("src/hooks/useCurrentIndex");

describe("<ProjectCard />", () => {
  let giveAssetType = "gOHM";

  const changeGiveAssetType = (checked: boolean) => {
    if (checked) {
      giveAssetType = "gOHM";
    } else {
      giveAssetType = "sOHM";
    }
  };

  it("should render detailed component", async () => {
    (useCurrentIndex as jest.Mock).mockReturnValue({ data: new DecimalBigNumber("100", 9) });
    let container;

    const project = {
      title: "Impact Market",
      owner: "",
      slug: "impact-market",
      shortDescription:
        "Enables any vulnerable community to implement poverty alleviation mechanisms, like Unconditional Basic Income.",
      details:
        "ImpactMarket is an open, free, censorship-resistant, and borderless impact-driven crowdfinance marketplace to fight poverty.\n\nIt merges the principles of unconditional basic income with blockchain technology to enable any community to have access to a basic income through its own UBI smart contract with specific parameters based on their reality. Beneficiaries added to those contracts can claim cUSD on a regular basis and use it for whatever they want or need.\nimpactMarket is being built to:\n- Accelerate poverty alleviation, access to finance, and wealth redistribution\n- Ensure the primacy of the individual and the social objective over capital\n- Allow democratic governance, autonomous management, and independence of the protocol from public and central authorities.",
      finishDate: "",
      photos: ["/assets/images/give/impact-market/impact-market-logo.svg"],
      category: "Poverty Alleviation",
      wallet: "0xd3B4a9604c78DDA8692d85Dc15802BA12Fb82b6c",
      depositGoal: 200,
      website: "https://www.impactmarket.com/",
    };

    await act(async () => {
      ({ container } = render(
        <ProjectCard
          project={project}
          giveAssetType={giveAssetType}
          changeAssetType={changeGiveAssetType}
          mode={ProjectDetailsMode.Page}
        />,
      ));
    });

    expect(container).toMatchSnapshot();
  });
});
