import { fireEvent } from "@testing-library/react";
import { BigNumber } from "ethers";
import { useContractAllowance } from "src/hooks/useContractAllowance";
import * as useWeb3Context from "src/hooks/web3Context";
import { mockWeb3Context } from "src/testHelpers";

import { act, render, screen, within } from "../../../testUtils";
import Wrap from "../Wrap";

jest.mock("src/hooks/useContractAllowance");
let container;
beforeEach(async () => {
  const data = jest.spyOn(useWeb3Context, "useWeb3Context");
  useContractAllowance.mockReturnValue({ data: BigNumber.from(10000) });
  data.mockReturnValue({
    ...mockWeb3Context,
    networkId: 1,
  });

  await act(async () => {
    ({ container } = render(<Wrap />));
  });
});

afterEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});

describe("Wrap Input Area", () => {
  it("Should Render Input when has Token Approval", async () => {
    fireEvent.change(await screen.findByPlaceholderText("Enter an amount of sOHM"), { target: { value: "1" } });
    expect(await screen.findByText("Wrap to gOHM"));
    expect(container).toMatchSnapshot();
  });

  it("Display Unwrap to sOHM when gOHM is selected", async () => {
    fireEvent.mouseDown(await screen.getByRole("button", { name: "sOHM" }));
    const listbox = within(screen.getByRole("listbox"));
    fireEvent.click(listbox.getByTestId("gohm-dropdown-select"));
    expect(await screen.findByText("Unwrap from gOHM"));
    expect(container).toMatchSnapshot();
  });
});
