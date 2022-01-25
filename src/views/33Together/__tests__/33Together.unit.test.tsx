import { render } from "../../../testUtils";
import PoolTogether from "../33together";

describe("<PoolTogether/>", () => {
  it("should render component", () => {
    const { container } = render(<PoolTogether />);
    expect(container).toMatchSnapshot();
  });
});
