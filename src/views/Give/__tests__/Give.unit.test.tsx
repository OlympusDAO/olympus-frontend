import { configureStore } from "@reduxjs/toolkit";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useWeb3Context } from "src/hooks";
import { useCurrentIndex } from "src/hooks/useCurrentIndex";
import accountReducer from "src/slices/AccountSlice";
import { mockWeb3Context } from "src/testHelpers";

import { act, render, screen } from "../../../testUtils";
import { DepositTableRow } from "../DepositRow";
import Give from "../Give";
import { ManageDonationModal } from "../ManageDonationModal";
import RedeemYield from "../RedeemYield";

interface IUserDonationInfo {
  id: string;
  date: string;
  deposit: string;
  recipient: string;
  yieldDonated: string;
}

jest.mock("src/hooks/useCurrentIndex");

afterEach(() => {
  jest.restoreAllMocks();
});

describe("<Give/>", () => {
  const preloadedState = {
    account: {
      giving: {
        sohmGive: 999999999000000000,
        gohmGive: 999999999000000000000000000000,
        donationInfo: [
          {
            id: "1",
            date: "03/16/2022",
            deposit: "1.2",
            recipient: "0x8A8b5a97978dB4a54367D7DCF6a50980990F2373",
            yieldDonated: "0.1",
          },
        ],
        loading: false,
      },
      redeeming: {
        gohmRedeemable: "0.1",
        recipientInfo: {
          totalDebt: "100",
          agnosticDebt: "1",
        },
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

  let giveAssetType = "gOHM";

  const changeGiveAssetType = (checked: boolean) => {
    if (checked) {
      giveAssetType = "gOHM";
    } else {
      giveAssetType = "sOHM";
    }
  };

  it("should render component", async () => {
    (useCurrentIndex as jest.Mock).mockReturnValue({ data: new DecimalBigNumber("100", 9) });
    let container;

    await act(async () => {
      ({ container } = render(<Give giveAssetType={giveAssetType} changeAssetType={changeGiveAssetType} />));
    });

    expect(container).toMatchSnapshot();
  });

  it("should render correct units on Deposits Row", async () => {
    (useCurrentIndex as jest.Mock).mockReturnValue({ data: new DecimalBigNumber("100", 9) });

    const donationInfo: IUserDonationInfo = {
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

    const gohmBal = await screen.getByText("1.2 gOHM");
    const gohmYield = await screen.getByText("0.1 gOHM");
    expect(gohmBal).toBeInTheDocument();
    expect(gohmYield).toBeInTheDocument();

    giveAssetType = "sOHM";

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

  it("should render correct units on Redeem Yield", async () => {
    giveAssetType = "gOHM";
    (useCurrentIndex as jest.Mock).mockReturnValue({ data: new DecimalBigNumber("100", 9) });
    const data = jest.spyOn(useWeb3Context, "useWeb3Context");
    data.mockReturnValue(mockWeb3Context);

    await act(async () => {
      render(<RedeemYield />);
    });

    const sohmDeposit = await screen.getByText("100 sOHM");
    const sohmRedeemable = await screen.getByText("10 sOHM");
    expect(sohmDeposit).toBeInTheDocument();
    expect(sohmRedeemable).toBeInTheDocument();
  });

  it("should render correct units on Manage Donation Modal", async () => {
    (useCurrentIndex as jest.Mock).mockReturnValue({ data: new DecimalBigNumber("100", 9) });

    const handleEdit = (
      walletAddress: string,
      depositId: string,
      eventSource: string,
      depositAmount: DecimalBigNumber,
    ) => {
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
