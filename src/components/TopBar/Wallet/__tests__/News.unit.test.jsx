import axios from "axios";
import { feedContent } from "src/components/TopBar/Wallet/__mocks__/mockFeedContent";
import News from "src/components/TopBar/Wallet/Info/News";
import { render, screen } from "src/testUtils";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("News View", () => {
  beforeEach(() => {
    axios.get = vi.fn().mockResolvedValue({ data: { items: feedContent } });
    render(<News />);
  });
  it("Should Parse RSS Feed Correctly", async () => {
    expect(screen.getByTestId("news"));
    expect(await screen.findByText("The Olympus Treasury Dashboard"));
  });
});
