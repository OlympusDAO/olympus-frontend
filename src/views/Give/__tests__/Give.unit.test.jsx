import { configureStore } from "@reduxjs/toolkit";
import { act } from "react-dom/test-utils";
import ProjectCard, { ProjectDetailsMode } from "src/components/GiveProject/ProjectCard";
import * as useWeb3Context from "src/hooks/web3Context";
import accountReducer from "src/slices/AccountSlice";
import { mockWeb3Context } from "src/testHelpers";

import { render, screen } from "../../../testUtils";
import CausesDashboard from "../CausesDashboard";
import Give from "../Give";
import GrantsDashboard from "../GrantsDashboard";
import YieldRecipients from "../YieldRecipients";

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

afterEach(() => {
  jest.restoreAllMocks();
});

describe("Give View Disconnected", () => {
  it("should render Causes Dashboard as Default", async () => {
    let container;
    await act(async () => {
      ({ container } = await render(<Give />));
    });
    expect(container).toMatchSnapshot();
  });

  it("should render Causes Dashboard", async () => {
    let container;
    await act(async () => {
      ({ container } = await render(<CausesDashboard />));
    });
    expect(container).toMatchSnapshot();
  });

  it("should render Grants Dashboard", async () => {
    let container;
    await act(async () => {
      ({ container } = await render(<GrantsDashboard />));
    });
    expect(container).toMatchSnapshot();
  });

  it("should render Yield Recipients Screen with Donate to a cause button", async () => {
    let container;
    await act(async () => {
      ({ container } = await render(<YieldRecipients changeView={() => null} />));
    });

    expect(await screen.getByText("Donate to a cause")).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it("should render project card with connect wallet button", async () => {
    let container;
    await act(async () => {
      ({ container } = render(<ProjectCard key={project.slug} project={project} mode={ProjectDetailsMode.Page} />));
    });
    expect(await screen.getByText("Connect Wallet")).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});

describe("Give View Connected", () => {
  const preloadedState = {
    account: {
      giving: {
        sohmGive: 999999999000000000,
        donationInfo: [
          {
            date: "Mar 30, 2022",
            deposit: "1.0",
            recipient: "0xd3B4a9604c78DDA8692d85Dc15802BA12Fb82b6c",
            yieldDonated: "0.0",
          },
        ],
        loading: false,
      },
    },
  };

  const reducer = {
    account: accountReducer,
  };

  const store = configureStore({
    reducer,
    devTools: true,
    preloadedState,
  });

  it("should render project card with Donate Yield Button", async () => {
    const data = jest.spyOn(useWeb3Context, "useWeb3Context");
    data.mockReturnValue(mockWeb3Context);

    let container;
    await act(async () => {
      ({ container } = render(
        <ProjectCard key={project.slug} project={project} mode={ProjectDetailsMode.Page} />,
        store,
      ));
    });
    expect(await screen.getByText("Donate Yield")).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
