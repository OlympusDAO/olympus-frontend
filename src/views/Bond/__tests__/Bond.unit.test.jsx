import { render } from "src/testUtils";

import ChooseBond from "../../ChooseBond/ChooseBond";

describe("<ChooseBond/>", () => {
  it("should render component", () => {
    const { container } = render(<ChooseBond />);
    expect(container).toMatchSnapshot();
  });
});
