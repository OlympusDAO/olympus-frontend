import { createMatchMedia } from "src/testHelpers";
import { render, screen } from "src/testUtils";
import Stake from "src/views/Stake/Stake";
beforeAll(() => {
  window.matchMedia = createMatchMedia("300px");
});
describe("Mobile Resolution", () => {
  it("should render all supported multi chain staking contracts for mobile", async () => {
    const { container } = render(<Stake />);
    expect(await screen.getByText("gOHM-AVAX"));
    expect(await screen.getByText("Stake on Trader Joe"));
    // there should be two sushi contracts, one on Arbitrum and the other on Polygon
    const sushiContracts = await screen.findAllByText("gOHM-wETH");
    expect(sushiContracts).toHaveLength(2);
    expect(container).toMatchSnapshot();
  });
});
