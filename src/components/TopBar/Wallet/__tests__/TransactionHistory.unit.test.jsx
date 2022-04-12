import axios from "axios";
import * as useWeb3Context from "src/hooks/web3Context";
import { mockWeb3Context } from "src/testHelpers";
import { render, screen } from "src/testUtils";

import { emptyTransfer, mockTransactions } from "../__mocks__/mockTransactionHistory";
import Wallet from "../index";
import * as Trans from "../queries";

describe("Wallet Transaction History, Transactions", () => {
  beforeEach(() => {
    const data = jest.spyOn(useWeb3Context, "useWeb3Context");
    axios.get = jest.fn().mockResolvedValue({ data: mockTransactions });
    data.mockReturnValue({ ...mockWeb3Context, address: "0xDd1E5f42baA201050c4686FDF4e3FDE16A58BC6F" });
    Trans.GetTransferHistory = jest.fn().mockReturnValue(emptyTransfer);
    render(<Wallet component="wallet/history" open={true} />);
  });

  it("Should display a bond purchased transaction", async () => {
    expect(screen.getByText("Bond Purchased")).toBeInTheDocument();
  });
  it("Should display a bond claimed transaction", async () => {
    expect(screen.getByText("Bond Claimed")).toBeInTheDocument();
  });
  it("Should display a fuse supply transaction", async () => {
    expect(screen.getByText("Supply to Fuse")).toBeInTheDocument();
  });
});
