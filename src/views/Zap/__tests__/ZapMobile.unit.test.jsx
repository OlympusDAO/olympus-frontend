import { connectWallet, createMatchMedia } from "src/testHelpers";
import { render, screen } from "src/testUtils";
import Zap from "src/views/Zap/Zap";

beforeAll(() => {
  window.matchMedia = createMatchMedia("300px");
  connectWallet();
  render(<Zap />);
});

describe("Zap Mobile", () => {
  it("should display Any asset text in the header", () => {
    expect(screen.getByText("Any asset"));
  });
});
