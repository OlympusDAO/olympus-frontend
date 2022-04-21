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
import YieldRecipients from "../YieldRecipients";

const project = {
  title: "Angel Protocol",
  owner: "",
  slug: "angel-protocol",
  shortDescription: "Enables charities to create an endowment that makes better use of decentralized finance.",
  details:
    "Angel Protocol is the leading crypto-native nonprofit platform on Terra, bringing an entirely new angle to the concept of charity: Generative Giving. When you donate to Angel Protocol, your donations are locked in permanent endowments (Anchor Yield accounts) for the over 50 NGOs that have been onboarded. Yield (not principal) from the endowments is paid into individual NGO accounts every week, which they can then withdraw and spend to resolve the greatest issues our planet faces. These endowments are meant to provide a perpetual income stream so these organizations can focus on having boots on the ground.",
  finishDate: "",
  photos: ["/assets/images/give/angel-protocol/angel-protocol-logo.svg"],
  category: "Grants",
  wallet: "0xB61503E276C489F786068BB54108777133957c54",
  depositGoal: 1000,
  website: "https://www.angelprotocol.io/",
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

  const reducer = {
    account: accountReducer,
  };

  const store = configureStore({
    reducer,
    devTools: true,
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

  /*
  it("should render correct units on Manage Donation Modal", async () => {
    const data = jest.spyOn(useWeb3Context, "useWeb3Context");
    data.mockReturnValue(mockWeb3Context);
    useCurrentIndex.mockReturnValue({ data: new DecimalBigNumber("100", 9) });

    const handleEdit = (walletAddress, depositId, eventSource, depositAmount) => {
      const doNothing = "do nothing";
    };

    const handleManageModalCancel = () => {
      const doNothing = "do nothing";
    };

    const eventSource = "Project Details";
    const currentDepositId = "1";
    const currentWalletAddress = "0x8A8b5a97978dB4a54367D7DCF6a50980990F2373";
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

    expect(await screen.getByText("2")).toBeInTheDocument();
    expect(await screen.getByText("gOHM Goal")).toBeInTheDocument();

    expect(await screen.getByText("1.2")).toBeInTheDocument();
    expect(await screen.getByText("Total gOHM Donated")).toBeInTheDocument();

    expect(await screen.getByText("60%")).toBeInTheDocument();
    expect(await screen.getByText("of gOHM Goal")).toBeInTheDocument();

    expect(await screen.getByText("0.1 gOHM")).toBeInTheDocument();

    giveAssetType = "sOHM";
    await act(async () => {
      render(
        <ManageDonationModal
          isModalOpen={true}
          eventSource={eventSource}
          submitEdit={handleEdit}
          submitWithdraw={handleEdit}
          cancelFunc={handleManageModalCancel}
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
  */
});
