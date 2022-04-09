import * as useWeb3Context from "src/hooks/web3Context";
import { mockWeb3Context } from "src/testHelpers";
import { fireEvent, render, screen } from "src/testUtils";

import Wallet from "../index";
import * as Trans from "../queries";
import { emptyTransaction, emptyTransfer, mockTransactions } from "./mockTransactionHistory";

describe("Wallet Transaction History - no transactions", () => {
  beforeEach(() => {
    const data = jest.spyOn(useWeb3Context, "useWeb3Context");
    data.mockReturnValue(mockWeb3Context);
    Trans.GetTransferHistory = jest.fn().mockReturnValue(emptyTransfer);

    Trans.GetTransactionHistory = jest.fn().mockReturnValue(emptyTransaction);
  });
  it("Should show no transaction history", async () => {
    render(<Wallet component="wallet/history" open={true} />);

    expect(screen.getByText("No Transactions")).toBeInTheDocument();
  });

  it("Should filter the list when clicking on Bonds", async () => {
    render(<Wallet component="wallet/history" open={true} />);
    fireEvent.click(screen.getByText("Staking"));
    expect(screen.getByText("No Transactions")).toBeInTheDocument();
  });
});

describe("Wallet Transaction History, Transactions", () => {
  beforeEach(() => {
    const data = jest.spyOn(useWeb3Context, "useWeb3Context");
    data.mockReturnValue({ ...mockWeb3Context, address: "0xDd1E5f42baA201050c4686FDF4e3FDE16A58BC6F" });
    Trans.GetTransferHistory = jest.fn().mockReturnValue(emptyTransfer);
    Trans.GetTransactionHistory = jest.fn().mockReturnValue(mockTransactions);
  });

  it("Should display a bond purchased transaction", async () => {
    render(<Wallet component="wallet/history" open={true} />);
    expect(screen.getByText("Bond Purchased")).toBeInTheDocument();
  });
  it("Should display a bond claimed transaction", async () => {
    render(<Wallet component="wallet/history" open={true} />);
    expect(screen.getByText("Bond Claimed")).toBeInTheDocument();
  });
  it("Should display a fuse supply transaction", async () => {
    render(<Wallet component="wallet/history" open={true} />);
    expect(screen.getByText("Supply to Fuse")).toBeInTheDocument();
  });
});
