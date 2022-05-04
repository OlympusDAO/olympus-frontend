import { render } from "@testing-library/react";

import Root from "../Root";

//We need to use @testing-library vs our custom render here, or else we'll have nested routers.
describe("<Root/>", () => {
  it("should render component", () => {
    const { container } = render(<Root />);
    expect(container).toMatchSnapshot();
  });
});
