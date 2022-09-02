import axios from "axios";
import { feedContent } from "src/components/TopBar/Wallet/__mocks__/mockFeedContent";
import News from "src/components/TopBar/Wallet/Info/News";
import { render, screen } from "src/testUtils";

describe("News View", () => {
  beforeEach(() => {
    axios.get = jest.fn().mockResolvedValue({ data: { items: feedContent } });
    render(<News />);
  });
  it("Should Parse RSS Feed Correctly", async () => {
    expect(screen.getByTestId("news")).toBeInTheDocument();
    expect(await screen.findByText("The Olympus Treasury Dashboard")).toBeInTheDocument();
  });
});
