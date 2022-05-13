import * as useWeb3Context from "src/hooks/web3Context";
import { mockWeb3Context } from "src/testHelpers";
import { render, screen } from "src/testUtils";

import Wallet from "../index";

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
    const data = jest.spyOn(useWeb3Context, "useWeb3Context");
    data.mockReturnValue(mockWeb3Context);
  });
  it("Default State Should Prompt to Connect Wallet", async () => {
    render(<Wallet component="wallet" open={true} />);
    expect(screen.getByText("My Wallet")).toBeInTheDocument();
    expect(screen.getByText("Disconnect")).toBeInTheDocument();
  });
});
