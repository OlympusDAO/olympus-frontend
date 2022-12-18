import Sidebar from "src/components/Sidebar/Sidebar";
import { render } from "src/testUtils";
import { test } from "vitest";
import { describe, expect, it } from "vitest";

describe("<Sidebar/>", () => {
  test("should render component", () => {
    it("should render component", () => {
      const { container } = render(<Sidebar />);
      expect(container).toMatchSnapshot();
    });
  });
});
