import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useCurrentIndex } from "src/hooks/useCurrentIndex";

import { act, render, screen } from "../../../testUtils";
import { DepositTableRow } from "../DepositRow";
import Give from "../Give";

interface IUserDonationInfo {
  id: string;
  date: string;
  deposit: string;
  recipient: string;
  yieldDonated: string;
}

jest.mock("src/hooks/useCurrentIndex");

describe("<Give/>", () => {
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
});
