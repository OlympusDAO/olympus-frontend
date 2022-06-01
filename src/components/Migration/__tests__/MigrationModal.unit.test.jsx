import { configureStore } from "@reduxjs/toolkit";
import { trim } from "src/helpers";
import accountReducer from "src/slices/AccountSlice";
import appReducer from "src/slices/AppSlice";
import pendingTransactionsReducer from "src/slices/PendingTxnsSlice";

import { render, screen } from "../../../testUtils";
import MigrationModal from "../MigrationModal";

describe("<MigrationModal/>", () => {
  it("should render closed component", () => {
    render(<MigrationModal open={false} handleClose={() => console.log("handleClose")} />);
    expect(screen.queryByText("Migration Output")).not.toBeInTheDocument();
  });

  it("should render user account v1 assets and estimated v2 amounts", async () => {
    // preload user account with v1 ohm, sohm and wsohm tokens
    // and test migration flow
    const preloadedState = {
      account: {
        balances: {
          ohmV1: 11,
          sohmV1: 12,
          wsohm: 13,
        },
        migration: {
          ohm: 0,
          sohm: 0,
          wsohm: 0,
        },
      },
      app: {
        currentIndexV1: 94,
        currentIndex: 46,
      },
    };

    // use only reducers required for this component test
    const reducer = {
      account: accountReducer,
      app: appReducer,
      pendingTransactions: pendingTransactionsReducer,
    };

    const store = configureStore({
      reducer,
      devTools: true,
      preloadedState,
    });

    const migrationModal = <MigrationModal open={true} handleClose={() => console.log("handleClose")} />;
    render(migrationModal, store);

    // there should be a header inviting user to migrate v1 tokens to v2
    expect(await screen.getByText("You have assets ready to migrate to v2")).toBeInTheDocument();

    // there should be token details table headers
    expect(await screen.getByText("Asset")).toBeInTheDocument();
    expect(await screen.getByText("Pre-migration")).toBeInTheDocument();
    expect(await screen.getByText("Post-migration")).toBeInTheDocument();

    // there should be token details table data
    expect(await screen.getByText("sOHM -> sOHM (v2)")).toBeInTheDocument();
    expect(await screen.getByText("12.0000 sOHM")).toBeInTheDocument();

    // verify that the dialog displays the correct conversion formula
    // prevent regression for bug report:
    // https://github.com/OlympusDAO/olympus-frontend/issues/1394
    const sOHMv2Value =
      (preloadedState.account.balances.sohmV1 * preloadedState.app.currentIndex) / preloadedState.app.currentIndexV1;
    const trimmed = trim(sOHMv2Value, 4);
    expect(await screen.getByText(`${trimmed} sOHM (v2)`)).toBeInTheDocument();

    // screen.debug(undefined, 100000);
    // Approve button should appear as many times as there are v1 asset rows
    const approveButtons = await screen.findAllByRole("button", { name: /Approve/i });
    expect(approveButtons).toHaveLength(3);
  });
});
