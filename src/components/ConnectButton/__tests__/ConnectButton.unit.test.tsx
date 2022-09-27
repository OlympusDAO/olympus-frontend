import { ConnectButton, InPageConnectButton } from "src/components/ConnectButton/ConnectButton";
import { render, screen } from "src/testUtils";

describe("<ConnectButton/>", () => {
  it("should display Connect Button for TopBar", () => {
    render(<ConnectButton />);
    expect(screen.getByText("Connect Wallet"));
  });

  it("should display Connect Wallet for In-Page Connect Buttons", () => {
    render(<InPageConnectButton />);
    expect(screen.getByText("Connect Wallet"));
  });
});
