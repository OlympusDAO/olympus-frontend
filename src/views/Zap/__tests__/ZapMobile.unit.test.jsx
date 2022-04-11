import * as useWeb3Context from "src/hooks/web3Context";
import { createMatchMedia } from "src/testHelpers";
import { mockWeb3Context } from "src/testHelpers";
import { render, screen } from "src/testUtils";

import Zap from "../Zap";

beforeAll(() => {
  window.matchMedia = createMatchMedia("300px");
  const data = jest.spyOn(useWeb3Context, "useWeb3Context");
  data.mockReturnValue(mockWeb3Context);
  render(<Zap />);
});

describe("Zap Mobile", () => {
  it("should display Any asset text in the header", () => {
    expect(screen.getByText("Any asset")).toBeInTheDocument();
  });
});
