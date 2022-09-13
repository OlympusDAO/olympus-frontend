import { fireEvent } from "@testing-library/react";
import { BigNumber } from "ethers";
import Messages from "src/components/Messages/Messages";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import * as Balance from "src/hooks/useBalance";
import { useContractAllowance } from "src/hooks/useContractAllowance";
import { useCurrentIndex } from "src/hooks/useCurrentIndex";
import { connectWallet } from "src/testHelpers";
import { render, screen } from "src/testUtils";
import { StakeInputArea } from "src/views/Stake/components/StakeArea/components/StakeInputArea/StakeInputArea";

jest.mock("src/hooks/useContractAllowance");
jest.mock("src/hooks/useCurrentIndex");

beforeEach(async () => {
  connectWallet();
  useContractAllowance.mockReturnValue({ data: BigNumber.from(10000) });
  useCurrentIndex.mockReturnValue({ data: new DecimalBigNumber("100", 9) });

  Balance.useBalance = jest.fn().mockReturnValue({ 1: { data: new DecimalBigNumber("10", 9) } });
  render(
    <>
      <Messages />
      <StakeInputArea />
    </>,
  );
});

afterEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});

describe("Check Stake to gOHM Error Messages", () => {
  it("Error message with no amount", async () => {
    expect(await screen.findByText("Enter an amount")).toBeInTheDocument();
  });

  it("Error message with amount <=0", async () => {
    fireEvent.input(await screen.findByTestId("ohm-input"), { target: { value: "-1" } });
    expect(await screen.findByText("Enter an amount")).toBeInTheDocument();
  });

  it("Error message amount > 0 but no wallet balance", async () => {
    Balance.useBalance = jest.fn().mockReturnValue({ 1: { data: undefined } });
    fireEvent.input(await screen.findByTestId("ohm-input"), { target: { value: "1000" } });
    fireEvent.click(screen.getAllByText("Stake")[1]);
    expect(await screen.findByText("Please refresh your page and try again")).toBeInTheDocument();
  });

  it("Error message amount > balance", async () => {
    fireEvent.input(await screen.getByTestId("ohm-input"), { target: { value: "100" } });
    expect(screen.getByText("Amount exceeds balance"));
  });

  it("Error message no address", async () => {
    fireEvent.input(await screen.getByTestId("ohm-input"), { target: { value: "1" } });
    fireEvent.click(screen.getAllByText("Stake")[1]);
    expect(await screen.findByText("Please refresh your page and try again")).toBeInTheDocument();
  });
});

describe("Check Unstake gOHM Error Messages", () => {
  beforeEach(() => {
    fireEvent.click(screen.getByText("Unstake"));
  });
  it("Error message with no amount", async () => {
    expect(await screen.findByText("Enter an amount")).toBeInTheDocument();
  });

  it("Error message with amount <=0 gOHM", async () => {
    fireEvent.input(await screen.findByTestId("staked-input"), { target: { value: "-1" } });
    expect(await screen.findByText("Enter an amount")).toBeInTheDocument();
  });

  it("Error message amount > balance gOHM", async () => {
    fireEvent.input(await screen.findByTestId("staked-input"), { target: { value: "11" } });
    fireEvent.click(screen.getByText("Unstake"));
    expect(await screen.findByText("Amount exceeds balance")).toBeInTheDocument();
  });

  it("Error message amount > 0 but no wallet balance", async () => {
    Balance.useBalance = jest.fn().mockReturnValue({ 1: { data: undefined } });
    fireEvent.input(await screen.findByTestId("staked-input"), { target: { value: "100" } });
    fireEvent.click(screen.getAllByText("Unstake")[1]);
    expect(screen.getAllByText("Please refresh your page and try again")[0]).toBeInTheDocument();
  });

  it("Error message no address", async () => {
    fireEvent.input(await screen.findByTestId("staked-input"), { target: { value: "1" } });
    fireEvent.click(await screen.getAllByText("Unstake")[1]);
    expect(screen.getAllByText("Please refresh your page and try again")[0]).toBeInTheDocument();
  });
});
