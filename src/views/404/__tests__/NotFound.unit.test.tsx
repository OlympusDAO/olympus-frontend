import { render } from "src/testUtils";
import NotFound from "src/views/404/NotFound";
import { describe, expect, it, test } from "vitest";

describe("<NotFound/>", () => {
  test("should render component", () => {
    it("should render component", () => {
      const { container } = render(<NotFound />);
      expect(container).toMatchSnapshot();
    });
  });
});
