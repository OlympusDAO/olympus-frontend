import { render } from "../../../testUtils";
import AdvancedSettings from "../AdvancedSettings";

describe("<AdvancedSettings/>", () => {
  it("should render component", () => {
    const { container } = render(
      <AdvancedSettings
        open={true}
        recipientAddress={"123"}
        slippage={0.05}
        handleClose={() => console.log("close")}
        onRecipientAddressChange={() => console.log("onRecipientAddressChange")}
        onSlippageChange={() => console.log("onSlippageChange")}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
