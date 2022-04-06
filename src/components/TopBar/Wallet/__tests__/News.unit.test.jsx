import { MediumArticles } from "src/components/TopBar/Wallet/queries";
import { render, screen } from "src/testUtils";

import News from "../Info/News";
import { feedContent } from "./mockFeedContent.json";

jest.mock("src/components/TopBar/Wallet/queries");
describe("News View", () => {
  beforeEach(() => {
    MediumArticles.mockReturnValue({ data: { items: feedContent }, isFetched: true });
  });
  it("Should Parse RSS Feed Correctly", async () => {
    render(<News />);
    expect(screen.getByTestId("news")).toBeInTheDocument();
    expect(screen.getByText("The Olympus Treasury Dashboard")).toBeInTheDocument();
  });
});
