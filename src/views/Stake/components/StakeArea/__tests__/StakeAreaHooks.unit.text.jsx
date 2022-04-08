import { fireEvent } from "@testing-library/react";
import { BigNumber } from "ethers";
import Messages from "src/components/Messages/Messages";
import { useContractAllowance } from "src/hooks/useContractAllowance";
import * as useWeb3Context from "src/hooks/web3Context";
import { mockWeb3Context } from "src/testHelpers";
import { act, render, screen } from "src/testUtils";

import { StakeArea } from "../StakeArea";

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
        <StakeArea />
      </>,
    ));
  });
});

afterEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});

describe("Check Stake to sOHM Error Messages", () => {
  it("Error message with no amount", async () => {
    fireEvent.click(await screen.getByText("Stake to sOHM"));
    expect(await screen.findByText("Please enter a number")).toBeInTheDocument();
  });

  it("Error message with amount <=0", async () => {
    fireEvent.input(await screen.findByRole("textbox"), { target: { value: "-1" } });
    fireEvent.click(await screen.getByText("Stake to sOHM"));
    expect(await screen.findByText("Please enter a number greater than 0")).toBeInTheDocument();
  });

  it("Error message amount > 0 but no wallet balance", async () => {
    fireEvent.input(await screen.findByRole("textbox"), { target: { value: "100" } });
    fireEvent.click(await screen.getByText("Stake to sOHM"));
    expect(await screen.findByText("Please refresh your page and try again")).toBeInTheDocument();
  });
});

describe("Check Unstake sOHM Error Messages", () => {
  beforeEach(() => {
    fireEvent.click(screen.getByText("Unstake"));
  });
  it("Error message with no amount", async () => {
    fireEvent.click(await screen.getByText("Unstake sOHM"));
    expect(await screen.findByText("Please enter a number")).toBeInTheDocument();
  });

  it("Error message with amount <=0", async () => {
    fireEvent.input(await screen.findByRole("textbox"), { target: { value: "-1" } });
    fireEvent.click(await screen.getByText("Unstake sOHM"));
    expect(await screen.findByText("Please enter a number greater than 0")).toBeInTheDocument();
  });

  it("Error message amount > 0 but no wallet balance", async () => {
    fireEvent.input(await screen.findByRole("textbox"), { target: { value: "100" } });
    fireEvent.click(await screen.getByText("Unstake sOHM"));
    expect(await screen.findByText("Please refresh your page and try again")).toBeInTheDocument();
  });
});
