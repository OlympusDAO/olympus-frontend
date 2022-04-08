import * as useWeb3Context from "src/hooks/web3Context";
import { mockWeb3Context } from "src/testHelpers";

import { act, render } from "../../../testUtils";
import Wrap from "../Wrap";

afterEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});

describe("<Wrap/>", () => {
  it("Should show Connect Button when not Connected", () => {
    const { container } = render(<Wrap />);
    expect(container).toMatchSnapshot();
  });
  it("should Render Migrate Input Area on Avalanche", async () => {
    const data = jest.spyOn(useWeb3Context, "useWeb3Context");
    data.mockReturnValue({
      ...mockWeb3Context,
      networkId: 43114,
    });
    let container;
    await act(async () => {
      ({ container } = render(<Wrap />));
    });

    expect(container).toMatchSnapshot();
  });
  it("should Render Migrate Input Area on Arbitrum", async () => {
    const data = jest.spyOn(useWeb3Context, "useWeb3Context");
    data.mockReturnValue({
      ...mockWeb3Context,
      networkId: 42161,
    });

    let container;
    await act(async () => {
      ({ container } = render(<Wrap />));
    });

    expect(container).toMatchSnapshot();
  });

  it("Should Render Wrap Input Area with Wallet Connected", async () => {
    const data = jest.spyOn(useWeb3Context, "useWeb3Context");
    data.mockReturnValue({
      ...mockWeb3Context,
      networkId: 1,
    });

    let container;
    await act(async () => {
      ({ container } = render(<Wrap />));
    });
    expect(container).toMatchSnapshot();
  });
});
