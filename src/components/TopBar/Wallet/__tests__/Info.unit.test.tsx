import { render, screen } from "src/testUtils";

import Info from "../Info";

describe("Info View", () => {
  it("Should Display News for news Path", async () => {
    render(<Info path="news" />);
    expect(screen.getByTestId("news")).toBeInTheDocument();
  });
  it("Should Display News for news Path", async () => {
    render(<Info path="proposals" />);
    expect(screen.getByTestId("proposals")).toBeInTheDocument();
  });
  it("Should Display News for news Path", async () => {
    render(<Info path="faq" />);
    expect(screen.getByTestId("faq")).toBeInTheDocument();
  });
});
