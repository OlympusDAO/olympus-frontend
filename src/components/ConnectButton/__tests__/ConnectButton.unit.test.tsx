import { render, screen } from "../../../testUtils";
import ConnectButton from "../ConnectButton";

describe("<ConnectButton/>", () => {
  it("should display Connect Wallet", () => {
    render(<ConnectButton />);
    expect(screen.getByText("Connect Wallet"));
  });
});
