import { screen } from "@testing-library/react";

import { render } from "../../../../testUtils";
import { Tokens } from "../Token";

describe("<Tokens/>", () => {
  let container: HTMLElement;

  beforeEach(() => {
    const component = render(<Tokens />);
    container = component.container;
  });

  it("should render component", () => {
    expect(container).toMatchSnapshot();
  });

  it("should show default tokens", async () => {
    const gOhmElement = await screen.findByText(/gOhm/i);
    expect(gOhmElement).toBeInTheDocument();

    const sOhmElement = await screen.findByText(/sOhm/i);
    expect(sOhmElement).toBeInTheDocument();
  });
});
