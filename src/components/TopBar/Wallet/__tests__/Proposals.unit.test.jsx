import * as Graph from "graphql-request";
import { render, screen } from "src/testUtils";

import { proposalContent } from "../__mocks__/mockProposalContent";
import { Proposals } from "../Info/Proposals";

describe("Proposal View", () => {
  beforeEach(() => {
    Graph.request = jest.fn().mockReturnValue({ proposals: proposalContent });
    render(<Proposals />);
  });
  it("Should Load Proposals Correctly", async () => {
    expect(screen.getByTestId("proposals")).toBeInTheDocument();
    expect(await screen.findByText("OIP-88: KlimaDAO Love Letter")).toBeInTheDocument();
    expect(await screen.findByText("TAP-9 Rocket Pool Whitelist")).toBeInTheDocument();
  });
});
