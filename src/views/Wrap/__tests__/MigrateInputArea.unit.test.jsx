import { fireEvent } from "@testing-library/react";
import { BigNumber } from "ethers";
import Messages from "src/components/Messages/Messages";
import { useContractAllowance } from "src/hooks/useContractAllowance";
import * as useWeb3Context from "src/hooks/web3Context";
import { mockWeb3Context } from "src/testHelpers";

import { act, render, screen } from "../../../testUtils";
import { MigrateInputArea } from "../components/MigrateInputArea/MigrateInputArea";
import Wrap from "../Wrap";

jest.mock("src/hooks/useContractAllowance");
let container;

beforeEach(async () => {
  const data = jest.spyOn(useWeb3Context, "useWeb3Context");
  useContractAllowance.mockReturnValue({ data: BigNumber.from(10000) });
  data.mockReturnValue({
    ...mockWeb3Context,
    networkId: 43114,
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
    fireEvent.change(await screen.findByPlaceholderText("Enter an amount of wsOHM"), { target: { value: "1" } });
    expect(screen.getByTestId("migrate-button"));
    expect(container).toMatchSnapshot();
  });
});

describe("Check Migrate to gOHM Error Messages", () => {
  it("Should error when not on Avalanche or Arbitrum", async () => {
    const data = jest.spyOn(useWeb3Context, "useWeb3Context");
    data.mockReturnValue({
      ...mockWeb3Context,
      networkId: 137, //polygon isnt supported for wsOHM to gOHM
    });
    expect(() => render(<MigrateInputArea />)).toThrowError(
      "Component should only be mounted when connected to Arbitrum or Avalanche",
    );
  });
  it("Error message with no amount", async () => {
    fireEvent.click(screen.getByTestId("migrate-button"));
    expect(await screen.findByText("Please enter a number")).toBeInTheDocument();
  });

  it("Error message with amount <=0", async () => {
    fireEvent.change(await screen.findByPlaceholderText("Enter an amount of wsOHM"), { target: { value: "-1" } });
    fireEvent.click(screen.getByTestId("migrate-button"));
    expect(await screen.findByText("Please enter a number greater than 0")).toBeInTheDocument();
  });

  // it("Error message amount > 0 but no wallet balance", async () => {
  //   fireEvent.change(await screen.findByPlaceholderText("Enter an amount of wsOHM"), { target: { value: "10000" } });
  //   fireEvent.click(screen.getByTestId("migrate-button"));
  //   expect(
  //     (await screen.findByText("Please refresh your page and try again")) ||
  //       (await screen.findByText("You cannot migrate more than your wsOHM balance")),
  //   ).toBeInTheDocument();
  // });
});
