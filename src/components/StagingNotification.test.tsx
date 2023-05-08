import { useMediaQuery } from "@mui/material";
import { render } from "@testing-library/react";
import StagingNotification from "src/components/StagingNotification";
import { Environment } from "src/helpers/environment/Environment/Environment";
import { describe, expect, it, Mock, vi } from "vitest";

vi.mock("@mui/material", () => ({
  Box: (props: any) => <div {...props} />,
  useMediaQuery: vi.fn(),
}));

vi.mock("@olympusdao/component-library", () => ({
  WarningNotification: (props: any) => <div>{props.children}</div>,
}));

describe("StagingNotification", () => {
  it("renders the notification when on the staging site on large screen", () => {
    (useMediaQuery as Mock).mockReturnValue(false);
    vi.spyOn(Environment, "getStagingFlag").mockReturnValue("true");

    const { getByTestId } = render(<StagingNotification />);
    expect(getByTestId("staging-notification")).not.toBeNull();
  });

  it("does not render the notification when not on the staging site", () => {
    (useMediaQuery as Mock).mockReturnValue(false);
    vi.spyOn(Environment, "getStagingFlag").mockReturnValue("false");

    const { queryByTestId } = render(<StagingNotification />);
    expect(queryByTestId("staging-notification")).toBeNull();
  });
});
