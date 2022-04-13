import * as useWeb3Context from "src/hooks/web3Context";
import { mockWeb3Context } from "src/testHelpers";

import { render } from "../../../testUtils";
import PoolTogether from "../33together";
import { ConfirmationModal } from "../ConfirmationModal";
import { PoolDeposit } from "../PoolDeposit";

describe("<PoolTogether/>", () => {
  it("should render component", () => {
    const { container } = render(<PoolTogether />);
    expect(container).toMatchSnapshot();
  });

  it("should display the confirmation modal", async () => {
    const { container } = render(
      <ConfirmationModal show={true} quantity={10} onClose={() => undefined} onSubmit={() => undefined} />,
    );
    expect(container).toMatchSnapshot();
  });

  it("should display the pool deposit form", async () => {
    const data = jest.spyOn(useWeb3Context, "useWeb3Context");
    data.mockReturnValue(mockWeb3Context);
    const { container } = render(
      <PoolDeposit
        totalPoolDeposits={1000000}
        winners="Lots of Winners"
        setInfoTooltipMessage={() => [
          "Deposit sOHM to win! Once deposited, you will receive a corresponding amount of 33T and be entered to win until your sOHM is withdrawn.",
        ]}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
