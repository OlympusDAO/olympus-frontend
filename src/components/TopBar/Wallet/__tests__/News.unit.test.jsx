import axios from "axios";
import { render, screen } from "src/testUtils";

import { feedContent } from "../__mocks__/mockFeedContent";
import News from "../Info/News";

describe("News View", () => {
  beforeEach(() => {
    axios.get = jest.fn().mockResolvedValue({ data: { items: feedContent } });
    render(<News />);
  });
  it("Should Parse RSS Feed Correctly", async () => {
    expect(screen.getByTestId("news")).toBeInTheDocument();
    expect(screen.getByText("The Olympus Treasury Dashboard")).toBeInTheDocument();
  });
});
