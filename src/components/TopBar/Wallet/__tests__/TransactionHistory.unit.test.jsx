import { fireEvent, render, screen } from "src/testUtils";

import {
  bondClaimTransaction,
  bondPurchaseTransaction,
  stakeTransaction,
  supplyToFuseTransaction,
  unstakeTransaction,
} from "../__mocks__/mockTransactionHistory";
import Wallet from "../index";
import * as queries from "../queries";

describe("<TransactionHistory />", () => {
  describe("Show no transactions", () => {
    beforeEach(() => {
      const useTransactionHistory = jest.spyOn(queries, "useTransactionHistory");
      useTransactionHistory.mockReturnValue({ data: { pages: [[]] }, isFetched: true });

      const useTransferHistory = jest.spyOn(queries, "useTransferHistory");
      useTransferHistory.mockReturnValue({ data: { pages: [[]] }, isFetched: true });

      render(<Wallet component="wallet/history" open />);
    });

    afterEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it("Should show no transaction history", () => {
      expect(screen.getByText("No transactions")).toBeInTheDocument();
    });

    it("Should filter the list when clicking on Staking", () => {
      fireEvent.click(screen.getByText("Staking"));
      expect(screen.getByText("No transactions")).toBeInTheDocument();
    });
  });

  describe("Show important transactions", () => {
    beforeEach(() => {
      const useTransactionHistory = jest.spyOn(queries, "useTransactionHistory");
      useTransactionHistory.mockReturnValue({
        data: {
          pages: [
            [
              stakeTransaction,
              unstakeTransaction,
              supplyToFuseTransaction,
              bondClaimTransaction,
              bondPurchaseTransaction,
            ],
          ],
        },
        isFetched: true,
      });

      const useTransferHistory = jest.spyOn(queries, "useTransferHistory");
      useTransferHistory.mockReturnValue({ data: { pages: [[]] }, isFetched: true });

      render(<Wallet component="wallet/history" open />);
    });

    it("Should display an unstake transaction", () => {
      expect(screen.getByText("Unstake")).toBeInTheDocument();
    });

    it("Should display a stake transaction", () => {
      expect(screen.getByText("Stake")).toBeInTheDocument();
    });

    it("Should display a bond purchased transaction", () => {
      expect(screen.getByText("Bond Purchased")).toBeInTheDocument();
    });

    it("Should display a bond claimed transaction", () => {
      expect(screen.getByText("Bond Claimed")).toBeInTheDocument();
    });

    it("Should display a fuse supply transaction", () => {
      expect(screen.getByText("Supply to Fuse")).toBeInTheDocument();
    });
  });
});
