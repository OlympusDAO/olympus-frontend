import { render, screen } from "src/testUtils";

import Faq from "../Info/Faq";
import News from "../Info/News";
import { Proposals } from "../Info/Proposals";

describe("Info View", () => {
  it("Should Display News for news Path", async () => {
    render(<News />);
    expect(screen.getByTestId("news")).toBeInTheDocument();
  });
  it("Should Display News for news Path", async () => {
    render(<Proposals />);
    expect(screen.getByTestId("proposals")).toBeInTheDocument();
  });
  it("Should Display News for news Path", async () => {
    render(<Faq />);
    expect(screen.getByTestId("faq")).toBeInTheDocument();
  });
});
