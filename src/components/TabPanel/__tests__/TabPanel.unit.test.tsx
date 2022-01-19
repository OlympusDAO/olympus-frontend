import { render } from "../../../testUtils";
import TabPanel from "../TabPanel";

describe("<TabPanel/>", () => {
  it("should render component", () => {
    const { container } = render(
      <TabPanel value={0} index={0}>
        Tab Panel Content
      </TabPanel>,
    );
    expect(container).toMatchSnapshot();
  });
});
