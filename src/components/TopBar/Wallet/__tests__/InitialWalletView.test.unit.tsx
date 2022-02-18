import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { render } from "../../../../testUtils";
import InitialWalletView from "../InitialWalletView";

describe("<InitialWalletView/>", () => {
  it("Should render component", () => {
    const { container } = render(<InitialWalletView onClose={() => console.log("onClose")} />);
    expect(container).toMatchSnapshot();
  });

  it("Has a close button that calls onClose", () => {
    let onCloseCalled = false;
    render(<InitialWalletView onClose={() => (onCloseCalled = true)} />);
    expect(onCloseCalled).toBeFalsy();
    const closeBtn = screen.getByLabelText("close wallet");
    userEvent.click(closeBtn);
    expect(onCloseCalled).toBeTruthy();
  });
});
