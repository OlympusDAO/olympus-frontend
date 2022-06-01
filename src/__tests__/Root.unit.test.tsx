import { render, screen } from "@testing-library/react";

import Root from "../Root";

//We need to use @testing-library vs our custom render here, or else we'll have nested routers.
describe("<Root/>", () => {
  it("should render component", () => {
    render(<Root />);
    expect(screen.getByText("Safety Check: Always verify you're on app.olympusdao.finance!"));
  });
});
