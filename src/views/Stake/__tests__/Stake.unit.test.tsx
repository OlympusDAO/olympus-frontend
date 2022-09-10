import { render, screen } from "src/testUtils";
import Stake from "src/views/Stake/Stake";

describe("<Stake/>", () => {
  it("should render component", async () => {
    const { container } = render(<Stake />);
    expect(container).toMatchSnapshot();
  });

  it("should render correct staking headers", () => {
    const { container } = render(<Stake />);
    // there should be a header inviting user to Stake
    expect(screen.getByText("Single Stake"));
    //  there should be a Farm Pool table

    expect(screen.getByText("Farm Pool"));
    expect(container).toMatchSnapshot();
  });

  it("should render all supported multi chain staking contracts", async () => {
    render(<Stake />);
    expect(await screen.getByText("gOHM-AVAX"));
    expect(await screen.getByText("Stake on Trader Joe"));
    // there should be two sushi contracts, one on Arbitrum and the other on Polygon
    const sushiContracts = await screen.findAllByText("gOHM-wETH");
    expect(sushiContracts).toHaveLength(2);
  });
});
