import { render } from "../../../testUtils";
import { ConfirmDialog } from "../ConfirmDialog";

describe("<ConfirmDialog/>", () => {
  it("should render component", () => {
    const { container } = render(
      <ConfirmDialog
        quantity={"1"}
        currentIndex={"1"}
        view={1}
        onConfirm={() => console.log("onConfirm")}
        isLoading={false}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it("should render component with initial check value", () => {
    const { container } = render(
      <ConfirmDialog
        quantity={"1"}
        currentIndex={"1"}
        view={1}
        onConfirm={() => console.log("onConfirm")}
        isLoading={false}
        initialChecked={true}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
