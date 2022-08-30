import Faq from "src/components/TopBar/Wallet/Info/Faq";
import News from "src/components/TopBar/Wallet/Info/News";
import { Proposals } from "src/components/TopBar/Wallet/Info/Proposals";
import { render, screen } from "src/testUtils";

describe("Info View", () => {
  it("Should Display News for news Path", async () => {
    render(<News />);
    expect(screen.getByTestId("news")).toBeInTheDocument();
  });
  it("Should Display Proposals for proposal Path", async () => {
    render(<Proposals />);
    expect(screen.getByTestId("proposals")).toBeInTheDocument();
  });
  it("Should Display Faq's for faq Path", async () => {
    render(<Faq />);
    expect(screen.getByTestId("faq")).toBeInTheDocument();
  });
});
