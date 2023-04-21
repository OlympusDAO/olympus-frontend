import { render } from "@testing-library/react";
import PageTitle, { OHMPageTitleProps } from "src/components/PageTitle";
import { describe, expect, it, vi } from "vitest";

vi.mock("@mui/material", () => ({
  Box: (props: any) => <div {...props} />,
  Typography: (props: any) => <h1 {...props} />,
  useMediaQuery: () => false,
  useTheme: () => ({ breakpoints: { down: () => "" } }),
}));

describe("PageTitle", () => {
  const props: OHMPageTitleProps = { name: "Splash Page" };

  it("renders the component with the correct name", () => {
    const { getByText } = render(<PageTitle {...props} />);
    expect(getByText("Splash Page")).not.toBeNull();
  });
});
