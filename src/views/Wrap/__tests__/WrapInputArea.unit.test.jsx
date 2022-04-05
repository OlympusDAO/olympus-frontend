import { fireEvent } from "@testing-library/react";
import { BigNumber } from "ethers";
import Messages from "src/components/Messages/Messages";
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
    ({ container } = render(
      <>
        <Messages />
        <Wrap />
      </>,
    ));
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

describe("Check Wrap to gOHM Error Messages", () => {
  it("Error message with no amount", async () => {
    fireEvent.click(await screen.getByText("Wrap to gOHM"));
    expect(await screen.findByText("Please enter a number")).toBeInTheDocument();
  });

  it("Error message with amount <=0", async () => {
    fireEvent.change(await screen.findByPlaceholderText("Enter an amount of sOHM"), { target: { value: "-1" } });
    fireEvent.click(await screen.getByText("Wrap to gOHM"));
    expect(await screen.findByText("Please enter a number greater than 0")).toBeInTheDocument();
  });

  // it("Error message amount > 0 but no wallet balance", async () => {
  //   fireEvent.change(await screen.findByPlaceholderText("Enter an amount of sOHM"), { target: { value: "10000" } });
  //   fireEvent.click(await screen.getByText("Wrap to gOHM"));
  //   expect(await screen.findByText("Please refresh your page and try again")).toBeInTheDocument();
  // });
});

describe("Check Unwrap from gOHM Error Messages", () => {
  beforeEach(() => {
    fireEvent.mouseDown(screen.getByRole("button", { name: "sOHM" }));
    const listbox = within(screen.getByRole("listbox"));
    fireEvent.click(listbox.getByTestId("gohm-dropdown-select"));
  });
  it("Error message with no amount", async () => {
    fireEvent.click(screen.getByText("Unwrap from gOHM"));
    expect(await screen.findByText("Please enter a number")).toBeInTheDocument();
  });

  it("Error message with amount <=0", async () => {
    fireEvent.change(await screen.findByPlaceholderText("Enter an amount of gOHM"), { target: { value: "-1" } });
    fireEvent.click(screen.getByText("Unwrap from gOHM"));
    expect(await screen.findByText("Please enter a number greater than 0")).toBeInTheDocument();
  });

  // it("Error message amount > 0 but no wallet balance", async () => {
  //   fireEvent.change(await screen.findByPlaceholderText("Enter an amount of gOHM"), { target: { value: "10000" } });
  //   fireEvent.click(screen.getByText("Unwrap from gOHM"));
  //   expect(await screen.findByText("Please refresh your page and try again")).toBeInTheDocument();
  // });
});
