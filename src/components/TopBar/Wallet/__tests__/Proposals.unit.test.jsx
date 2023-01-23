import { proposalContent } from "src/components/TopBar/Wallet/__mocks__/mockProposalContent";
import { Proposals } from "src/components/TopBar/Wallet/Info/Proposals";
import { render, screen } from "src/testUtils";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("Proposal View", () => {
  beforeEach(() => {
    vi.mock("graphql-request", () => ({
      request: vi.fn().mockReturnValue({ proposals: proposalContent }),
      gql: vi.fn(),
    }));
    render(<Proposals />);
  });
  it("Should Load Proposals Correctly", async () => {
    expect(screen.getByTestId("proposals"));
    expect(await screen.findByText("OIP-88: KlimaDAO Love Letter"));
    expect(await screen.findByText("TAP-9 Rocket Pool Whitelist"));
  });
});
