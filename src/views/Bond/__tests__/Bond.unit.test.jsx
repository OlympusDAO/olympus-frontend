import { render } from "src/testUtils";

import { Bond } from "../Bond";

describe("<ChooseBond/>", () => {
  it("should render component", () => {
    const { container } = render(<Bond />);
    expect(container).toMatchSnapshot();
  });
});
