import { render, screen } from "src/testUtils";

import { StakeActionArea } from "../StakeActionArea";

describe("<StakeActionArea/>", () => {
  it("should ask user to connect wallet", async () => {
    const stakeActionArea = <StakeActionArea isZoomed={true} />;
    const { container } = render(stakeActionArea);
    // there should be a header inviting user to migrate v1 tokens to v2
    expect(await screen.getByText("Connect Wallet")).toBeInTheDocument();
    // When there is a testing library for wallets that allows simulating user interactions
    // we can extend this integration test with more steps such as
    // clicking on Connect, choosing a wallet account and network.
  });
});
