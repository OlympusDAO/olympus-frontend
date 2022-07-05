import { connectWallet } from "src/testHelpers";
import * as WAGMI from "wagmi";

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
    connectWallet();

    //@ts-ignore
    WAGMI.useNetwork = jest.fn(() => {
      return {
        chain: {
          id: 43114,
        },
      };
    });
    let container;
    await act(async () => {
      ({ container } = render(<Wrap />));
    });

    expect(container).toMatchSnapshot();
  });
  it("should Render Migrate Input Area on Arbitrum", async () => {
    connectWallet();
    //@ts-ignore
    WAGMI.useNetwork = jest.fn(() => {
      return {
        chain: {
          id: 42161,
        },
      };
    });
    let container;
    await act(async () => {
      ({ container } = render(<Wrap />));
    });

    expect(container).toMatchSnapshot();
  });

  it("Should Render Wrap Input Area with Wallet Connected", async () => {
    connectWallet();
    //@ts-ignore
    WAGMI.useNetwork = jest.fn(() => {
      return {
        chain: {
          id: 1,
        },
      };
    });

    let container;
    await act(async () => {
      ({ container } = render(<Wrap />));
    });
    expect(container).toMatchSnapshot();
  });
});
