import { BigNumber } from "bignumber.js";

import { render } from "../../../testUtils";
import { GiveHeader } from "../GiveHeader";

describe("<GiveHeader/>", () => {
  it("should render component", () => {
    const { container } = render(
      <GiveHeader isSmallScreen={false} isVerySmallScreen={false} totalDebt={new BigNumber(123123123)} networkId={1} />,
    );
    expect(container).toMatchSnapshot();
  });
});
