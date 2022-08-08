import Wallet from "src/components/TopBar/Wallet/index";
import { connectWallet } from "src/testHelpers";
import { render, screen } from "src/testUtils";

describe("Wallet Drawer Disconnected", () => {
  it("Default State Should Prompt to Connect Wallet", async () => {
    render(<Wallet component="wallet" open={true} />);
    expect(screen.getByText("Please Connect Your Wallet")).toBeInTheDocument();
  });

  it("Should Display Utility View", async () => {
    render(<Wallet component="utility" open={true} />);
    expect(screen.getByText("Exchanges")).toBeInTheDocument();
    expect(screen.getByText("Farm Pool")).toBeInTheDocument();
  });

  it("Should Display Info View", async () => {
    render(<Wallet component="info" open={true} />);
    expect(screen.getByText("Votes")).toBeInTheDocument();
  });
});

describe("Wallet Drawer Connected", () => {
  beforeEach(() => {
    connectWallet();
  });
  it("Default State Should Prompt to Connect Wallet", async () => {
    render(<Wallet component="wallet" open={true} />);
    expect(screen.getByText("My Wallet")).toBeInTheDocument();
    expect(screen.getByText("Disconnect")).toBeInTheDocument();
  });
});
