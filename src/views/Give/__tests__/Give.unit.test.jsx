import { configureStore } from "@reduxjs/toolkit";
import { act } from "react-dom/test-utils";
import ProjectCard, { ProjectDetailsMode } from "src/components/GiveProject/ProjectCard";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useCurrentIndex } from "src/hooks/useCurrentIndex";
import * as useWeb3Context from "src/hooks/web3Context";
import accountReducer from "src/slices/AccountSlice";
import { mockWeb3Context } from "src/testHelpers";

import { render, screen } from "../../../testUtils";
import CausesDashboard from "../CausesDashboard";
import { DepositTableRow } from "../DepositRow";
import Give from "../Give";
import GrantsDashboard from "../GrantsDashboard";
import { ManageDonationModal } from "../ManageDonationModal";
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

jest.mock("src/hooks/useCurrentIndex");

afterEach(() => {
  jest.restoreAllMocks();
});

describe("Give View Disconnected", () => {
  let giveAssetType = "sOHM";

  const changeGiveAssetType = checked => {
    if (checked) {
      giveAssetType = "gOHM";
    } else {
      giveAssetType = "sOHM";
    }
  };

  it("should render Causes Dashboard as Default", async () => {
    useCurrentIndex.mockReturnValue({ data: new DecimalBigNumber("100", 9) });
    let container;
    await act(async () => {
      ({ container } = await render(<Give giveAssetType={giveAssetType} changeAssetType={changeGiveAssetType} />));
    });
    expect(container).toMatchSnapshot();
  });

  it("should render Causes Dashboard", async () => {
    useCurrentIndex.mockReturnValue({ data: new DecimalBigNumber("100", 9) });
    let container;
    await act(async () => {
      ({ container } = await render(
        <CausesDashboard giveAssetType={giveAssetType} changeAssetType={changeGiveAssetType} />,
      ));
    });
    expect(container).toMatchSnapshot();
  });

  it("should render Grants Dashboard", async () => {
    useCurrentIndex.mockReturnValue({ data: new DecimalBigNumber("100", 9) });
    let container;
    await act(async () => {
      ({ container } = await render(
        <GrantsDashboard giveAssetType={giveAssetType} changeAssetType={changeGiveAssetType} />,
      ));
    });
    expect(container).toMatchSnapshot();
  });

  it("should render Yield Recipients Screen with Donate to a cause button", async () => {
    useCurrentIndex.mockReturnValue({ data: new DecimalBigNumber("100", 9) });
    let container;
    await act(async () => {
      ({ container } = await render(
        <YieldRecipients giveAssetType={giveAssetType} changeAssetType={changeGiveAssetType} changeView={() => null} />,
      ));
    });

    expect(await screen.getByText("Donate to a cause")).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it("should render project card with connect wallet button", async () => {
    useCurrentIndex.mockReturnValue({ data: new DecimalBigNumber("100", 9) });
    let container;
    await act(async () => {
      ({ container } = render(
        <ProjectCard
          key={project.slug}
          project={project}
          giveAssetType={giveAssetType}
          changeAssetType={changeGiveAssetType}
          mode={ProjectDetailsMode.Page}
        />,
      ));
    });
    expect(await screen.getByText("Connect Wallet")).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});

describe("Give View Connected", () => {
  let giveAssetType = "sOHM";

  const changeGiveAssetType = checked => {
    if (checked) {
      giveAssetType = "gOHM";
    } else {
      giveAssetType = "sOHM";
    }
  };

  const preloadedState = {
    account: {
      giving: {
        sohmGive: 999999999000000000,
        gohmGive: 99999999900000000000000000,
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
    useCurrentIndex.mockReturnValue({ data: new DecimalBigNumber("100", 9) });
    const data = jest.spyOn(useWeb3Context, "useWeb3Context");
    data.mockReturnValue(mockWeb3Context);

    let container;
    await act(async () => {
      ({ container } = render(
        <ProjectCard
          key={project.slug}
          project={project}
          giveAssetType={giveAssetType}
          changeAssetType={changeGiveAssetType}
          mode={ProjectDetailsMode.Page}
        />,
        store,
      ));
    });
    expect(await screen.getByText("Donate Yield")).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it("should render correct units on Deposits Row", async () => {
    giveAssetType = "gOHM";
    useCurrentIndex.mockReturnValue({ data: new DecimalBigNumber("100", 9) });

    const donationInfo = {
      id: "1",
      date: "03/16/2022",
      deposit: "1.2",
      recipient: "0x8A8b5a97978dB4a54367D7DCF6a50980990F2373",
      yieldDonated: "0.1",
    };

    await act(async () => {
      render(
        <DepositTableRow
          depositObject={donationInfo}
          giveAssetType={giveAssetType}
          changeAssetType={changeGiveAssetType}
        />,
      );
    });

    const sohmBal = await screen.getByText("120 sOHM");
    const sohmYield = await screen.getByText("10 sOHM");
    expect(sohmBal).toBeInTheDocument();
    expect(sohmYield).toBeInTheDocument();
  });

  it("should render correct units on Manage Donation Modal", async () => {
    useCurrentIndex.mockReturnValue({ data: new DecimalBigNumber("100", 9) });

    const handleEdit = (walletAddress, depositId, eventSource, depositAmount) => {
      const doNothing = "do nothing";
    };

    const handleManageModalCancel = () => {
      const doNothing = "do nothing";
    };

    const isModalOpen = true;
    const eventSource = "Project Details";
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
    const currentDepositId = "1";
    const currentWalletAddress = "0xd3B4a9604c78DDA8692d85Dc15802BA12Fb82b6c";
    const currentDepositAmount = "1.2";
    const depositDate = "03/16/2022";
    const yieldSent = "0.1";

    await act(async () => {
      render(
        <ManageDonationModal
          isModalOpen={true}
          eventSource={eventSource}
          submitEdit={handleEdit}
          submitWithdraw={handleEdit}
          cancelFunc={handleManageModalCancel}
          project={project}
          currentDepositId={currentDepositId}
          currentWalletAddress={currentWalletAddress}
          currentDepositAmount={currentDepositAmount}
          depositDate={depositDate}
          giveAssetType={giveAssetType}
          changeAssetType={changeGiveAssetType}
          yieldSent={yieldSent}
        />,
        store,
      );
    });

    const gohmGoal = await screen.getByText("2");
    const goalText = await screen.getByText("gOHM Goal");
    expect(gohmGoal).toBeInTheDocument();
    expect(goalText).toBeInTheDocument();

    const gohmDeposit = await screen.getByText("1.2");
    const depositText = await screen.getByText("Total gOHM Donated");
    expect(gohmDeposit).toBeInTheDocument();
    expect(depositText).toBeInTheDocument();

    const pctOfGoal = await screen.getByText("60%");
    const pctGoalText = await screen.getByText("of gOHM Goal");
    expect(pctOfGoal).toBeInTheDocument();
    expect(pctGoalText).toBeInTheDocument();

    const gohmYield = await screen.getByText("0.1 gOHM");
    expect(gohmYield).toBeInTheDocument();

    giveAssetType = "sOHM";
    await act(async () => {
      render(
        <ManageDonationModal
          isModalOpen={true}
          eventSource={eventSource}
          submitEdit={handleEdit}
          submitWithdraw={handleEdit}
          cancelFunc={handleManageModalCancel}
          project={project}
          currentDepositId={currentDepositId}
          currentWalletAddress={currentWalletAddress}
          currentDepositAmount={currentDepositAmount}
          depositDate={depositDate}
          giveAssetType={giveAssetType}
          changeAssetType={changeGiveAssetType}
          yieldSent={yieldSent}
        />,
        store,
      );
    });

    const sohmGoal = await screen.getByText("200");
    const sohmGoalText = await screen.getByText("sOHM Goal");
    expect(sohmGoal).toBeInTheDocument();
    expect(sohmGoalText).toBeInTheDocument();

    const sohmDeposit = await screen.getByText("120");
    const sohmDepositText = await screen.getByText("Total sOHM Donated");
    expect(sohmDeposit).toBeInTheDocument();
    expect(sohmDepositText).toBeInTheDocument();

    const sohmPctGoalText = await screen.getByText("of sOHM Goal");
    expect(pctOfGoal).toBeInTheDocument();
    expect(sohmPctGoalText).toBeInTheDocument();

    const sohmYield = await screen.getByText("10 sOHM");
    expect(sohmYield).toBeInTheDocument();
  });
});
