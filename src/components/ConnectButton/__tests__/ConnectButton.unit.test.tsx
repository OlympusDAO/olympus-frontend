import { render, screen } from "../../../testUtils";
import { ConnectButton, InPageConnectButton } from "../ConnectButton";

describe("<ConnectButton/>", () => {
  it("should display Connect Button for TopBar", () => {
    render(<ConnectButton />);
    expect(screen.getByText("Connect"));
  });

  it("should display Connect Wallet for In-Page Connect Buttons", () => {
    render(<InPageConnectButton />);
    expect(screen.getByText("Connect Wallet"));
  });
});
