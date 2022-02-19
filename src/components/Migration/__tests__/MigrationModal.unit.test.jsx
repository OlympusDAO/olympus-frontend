import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "src/slices/AccountSlice";
import appReducer from "src/slices/AppSlice";
import pendingTransactionsReducer from "src/slices/PendingTxnsSlice";

import { render, screen } from "../../../testUtils";
import MigrationModal from "../MigrationModal";

describe("<MigrationModal/>", () => {
  it("should render closed component", () => {
    const { container } = render(<MigrationModal open={false} handleClose={() => console.log("handleClose")} />);
    expect(container).toMatchSnapshot();
  });

  it("should render open component", () => {
    const { container } = render(<MigrationModal open={true} handleClose={() => console.log("handleClose")} />);
    expect(container).toMatchSnapshot();
  });

  it("should render user account v1 assets and estimated v2 amounts after migration", async () => {
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
        app: {
          currentIndexV1: 94,
          currentIndex: 46,
        },
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
    const { container } = render(migrationModal, store);
    expect(
      await screen.getByText(
        "Save on gas fees by migrating all your assets to the new gOHM or sOHM in one transaction.",
      ),
    ).toBeInTheDocument();
  });
});
