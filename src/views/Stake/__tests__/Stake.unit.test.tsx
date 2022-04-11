import { render, screen } from "../../../testUtils";
import Stake from "../Stake";

describe("<Stake/>", () => {
  it("should render component", async () => {
    const { container } = render(<Stake />);
    expect(container).toMatchSnapshot();
  });

  it("should render correct staking headers", () => {
    const { container } = render(<Stake />);
    // there should be a header inviting user to Stake
    expect(screen.getByText("Single Stake (3, 3)")).toBeInTheDocument();
    //  there should be a Farm Pool table

    expect(screen.getByText("Farm Pool")).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it("should render all supported multi chain staking contracts", async () => {
    render(<Stake />);
    expect(await screen.getByText("gOHM-AVAX")).toBeInTheDocument();
    expect(await screen.getByText("Stake on Trader Joe").closest("a")).toHaveAttribute(
      "href",
      "https://traderjoexyz.com/farm/0xB674f93952F02F2538214D4572Aa47F262e990Ff-0x188bED1968b795d5c9022F6a0bb5931Ac4c18F00",
    );
    // there should be two sushi contracts, one on Arbitrum and the other on Polygon
    const sushiContracts = await screen.findAllByText("gOHM-wETH");
    expect(sushiContracts).toHaveLength(3);
    expect(await screen.getByText("gOHM-FTM")).toBeInTheDocument();
    expect(await screen.getByText("Stake on Spirit").closest("a")).toHaveAttribute(
      "href",
      "https://app.spiritswap.finance/#/farms/allfarms",
    );
  });
});
