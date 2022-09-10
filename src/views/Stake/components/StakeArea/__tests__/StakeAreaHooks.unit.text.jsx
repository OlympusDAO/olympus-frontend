import { fireEvent } from "@testing-library/react";
import { BigNumber } from "ethers";
import Messages from "src/components/Messages/Messages";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import * as Balance from "src/hooks/useBalance";
import { useContractAllowance } from "src/hooks/useContractAllowance";
import { connectWallet } from "src/testHelpers";
import { render, screen } from "src/testUtils";
import { StakeArea } from "src/views/Stake/components/StakeArea/StakeArea";
import { vi } from "vitest";

vi.mock("src/hooks/useContractAllowance");

beforeEach(async () => {
  connectWallet();
  useContractAllowance.mockReturnValue({ data: BigNumber.from(10000) });
  Balance.useBalance = vi.fn().mockReturnValue({ 1: { data: new DecimalBigNumber("10", 9) } });

  render(
    <>
      <Messages />
      <StakeArea />
    </>,
  );
});

afterEach(() => {
  vi.clearAllMocks();
  vi.restoreAllMocks();
});

describe("Check Stake to sOHM Error Messages", () => {
  it("Error message with no amount", async () => {
    fireEvent.click(screen.getByText("Stake to sOHM"));
    expect(await screen.findByText("Please enter a number"));
  });

  it("Error message with amount <=0", async () => {
    fireEvent.input(await screen.findByRole("textbox"), { target: { value: "-1" } });
    fireEvent.click(screen.getByText("Stake to sOHM"));
    expect(await screen.findByText("Please enter a number greater than 0"));
  });

  it("Error message amount > 0 but no wallet balance", async () => {
    Balance.useBalance = vi.fn().mockReturnValue({ 1: { data: undefined } });
    fireEvent.input(await screen.findByRole("textbox"), { target: { value: "100" } });
    fireEvent.click(screen.getByText("Stake to sOHM"));
    expect(await screen.findByText("Please refresh your page and try again"));
  });

  it("Error message amount > balance", async () => {
    fireEvent.input(await screen.findByRole("textbox"), { target: { value: "100" } });
    fireEvent.click(screen.getByText("Stake to sOHM"));
    expect(await screen.findByText("You cannot stake more than your OHM balance"));
  });

  it("Error message no address", async () => {
    fireEvent.input(await screen.findByRole("textbox"), { target: { value: "1" } });
    fireEvent.click(screen.getByText("Stake to sOHM"));
    expect(await screen.findByText("Please refresh your page and try again"));
  });
});

describe("Check Unstake sOHM Error Messages", () => {
  beforeEach(() => {
    fireEvent.click(screen.getByText("Unstake"));
  });
  it("Error message with no amount", async () => {
    fireEvent.click(screen.getByText("Unstake sOHM"));
    expect(await screen.findByText("Please enter a number"));
  });

  it("Error message with amount <=0", async () => {
    fireEvent.input(await screen.findByRole("textbox"), { target: { value: "-1" } });
    fireEvent.click(screen.getByText("Unstake sOHM"));
    expect(await screen.findByText("Please enter a number greater than 0"));
  });

  it("Error message with amount <=0 gOHM", async () => {
    fireEvent.click(await screen.findByRole("checkbox"));
    fireEvent.input(await screen.findByRole("textbox"), { target: { value: "-1" } });
    fireEvent.click(screen.getByText("Unstake gOHM"));
    expect(screen.getAllByText("Please enter a number greater than 0")[0]);
  });

  it("Error message amount > balance sOHM", async () => {
    fireEvent.input(await screen.findByRole("textbox"), { target: { value: "11" } });
    fireEvent.click(screen.getByText("Unstake sOHM"));
    expect(await screen.findByText("You cannot unstake more than your sOHM balance"));
  });

  it("Error message amount > balance gOHM", async () => {
    fireEvent.click(await screen.findByRole("checkbox"));
    fireEvent.input(await screen.findByRole("textbox"), { target: { value: "11" } });
    fireEvent.click(screen.getByText("Unstake gOHM"));
    expect(await screen.findByText("You cannot unstake more than your gOHM balance"));
  });

  it("Error message amount > 0 but no wallet balance", async () => {
    Balance.useBalance = vi.fn().mockReturnValue({ 1: { data: undefined } });
    fireEvent.input(await screen.findByRole("textbox"), { target: { value: "100" } });
    fireEvent.click(screen.getByText("Unstake sOHM"));
    expect(screen.getAllByText("Please refresh your page and try again")[0]);
  });

  it("Error message no address", async () => {
    fireEvent.input(await screen.findByRole("textbox"), { target: { value: "1" } });
    fireEvent.click(screen.getByText("Unstake sOHM"));
    expect(screen.getAllByText("Please refresh your page and try again")[0]);
  });
});
