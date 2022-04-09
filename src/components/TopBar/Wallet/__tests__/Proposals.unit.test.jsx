import { ActiveProposals } from "src/components/TopBar/Wallet/queries";
import { render, screen } from "src/testUtils";

import Proposals from "../Info/Proposals";
import { proposalContent } from "./mockProposalContent.json";

jest.mock("src/components/TopBar/Wallet/queries");
describe("Proposal View", () => {
  beforeEach(() => {
    ActiveProposals.mockReturnValue({ data: { proposals: proposalContent }, isFetched: true });
  });
  it("Should Load Proposals Correctly", async () => {
    render(<Proposals />);
    expect(screen.getByTestId("proposals")).toBeInTheDocument();
    expect(screen.getByText("OIP-88: KlimaDAO Love Letter")).toBeInTheDocument();
    expect(screen.getByText("TAP-9 Rocket Pool Whitelist")).toBeInTheDocument();
  });
});
