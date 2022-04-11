import axios from "axios";
import * as useWeb3Context from "src/hooks/web3Context";
import { mockWeb3Context } from "src/testHelpers";
import { fireEvent, render, screen } from "src/testUtils";

import { emptyTransaction } from "../__mocks__/mockTransactionHistory";
import Wallet from "../index";

afterEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
});

describe("Wallet Transaction History - no transactions", () => {
  beforeEach(() => {
    const data = jest.spyOn(useWeb3Context, "useWeb3Context");
    data.mockReturnValue(mockWeb3Context);
    axios.get = jest.fn().mockResolvedValue({ data: emptyTransaction });
    render(<Wallet component="wallet/history" open={true} />);
  });

  it("Should show no transaction history", async () => {
    expect(screen.getByText("No Transactions")).toBeInTheDocument();
  });

  it("Should filter the list when clicking on Staking", async () => {
    fireEvent.click(screen.getByText("Staking"));
    expect(screen.getByText("No Transactions")).toBeInTheDocument();
  });
});
