import { fireEvent } from "@testing-library/dom";
import * as GiveInfo from "src/hooks/useGiveInfo";
import * as useWeb3Context from "src/hooks/web3Context";
import { mockWeb3Context } from "src/testHelpers";

import { act, render, screen } from "../../../testUtils";
import RedeemYield from "../RedeemYield";

let context;
beforeEach(() => {
  context = jest.spyOn(useWeb3Context, "useWeb3Context");
});

afterEach(() => {
  //jest.restoreAllMocks();
  jest.clearAllMocks();
});

describe("Redeem Yield", () => {
  it("should render Redeem Yield Screen", async () => {
    context.mockReturnValue(mockWeb3Context);
    let container;
    await act(async () => {
      ({ container } = render(<RedeemYield />));
    });
    expect(container).toMatchSnapshot();
  });

  it("should have disabled redeem button when there are pending transaction(s)", async () => {
    context.mockReturnValue(mockWeb3Context);

    let container;
    await act(async () => {
      ({ container } = render(<RedeemYield />)); //eslint-disable-line
    });

    fireEvent.click(screen.getByText("Redeem Yield").closest("button"));
    expect(screen.getByText("Redeem Yield").closest("button")).toHaveAttribute("disabled");
  });

  it("should show redeemable balance as 100 sOHM", async () => {
    context.mockReturnValue(mockWeb3Context);
    const redeemable = jest.spyOn(GiveInfo, "useRedeemableBalance");
    redeemable.mockReturnValue({ data: "100" });

    let container;
    await act(async () => {
      ({ container } = render(<RedeemYield />)); //eslint-disable-line
    });
    expect(container).toMatchSnapshot();
    expect(screen.getByTestId("redeemable-balance")).toHaveTextContent("100 sOHM");
  });

  it("should show extra content if project wallet", async () => {
    context.mockReturnValue({ ...mockWeb3Context, address: "0xd3B4a9604c78DDA8692d85Dc15802BA12Fb82b6c" });
    const redeemable = jest.spyOn(GiveInfo, "useRedeemableBalance");
    redeemable.mockReturnValue({ data: "100" });

    let container;
    await act(async () => {
      ({ container } = render(<RedeemYield />)); //eslint-disable-line
    });
    expect(screen.getByText("sOHM Goal")).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
