import { render, screen } from "../../testUtils";
import {
  ArrowGraphic,
  CompactVault,
  CompactWallet,
  CompactYield,
  LargeVault,
  LargeWallet,
  LargeYield,
} from "../EducationCard";

describe("<ArrowGraphic/>", () => {
  it("should render component with correct fill", () => {
    render(<ArrowGraphic fill="#999999" />);
    expect(screen.getByTestId("arrow")).toHaveStyle({ fill: "#999999" });
  });
});

describe("<CompactYield/>", () => {
  const giveAssetType = "sOHM";

  it("should render component with quantity 1 exact", () => {
    render(<CompactYield quantity={"1"} asset={giveAssetType} isQuantityExact={true} />);
    expect(screen.getByText("Receives yield from 1 sOHM"));
  });

  it("should render component with quantity not exact", () => {
    render(<CompactYield quantity={"1"} asset={giveAssetType} isQuantityExact={false} />);
    expect(screen.getByText("Receives yield from ≈ 1 sOHM"));
  });
});

describe("<CompactVault/>", () => {
  const giveAssetType = "sOHM";

  it("should render component with quantiy 1 exact", () => {
    render(<CompactVault quantity={"1"} asset={giveAssetType} isQuantityExact={true} />);
    expect(screen.getByText("1 sOHM deposited"));
  });

  it("should render component with quantity not exact", () => {
    render(<CompactVault quantity={"1"} asset={giveAssetType} isQuantityExact={false} />);
    expect(screen.getByText("≈ 1 sOHM deposited"));
  });
});

describe("<CompactWallet/>", () => {
  const giveAssetType = "sOHM";

  it("should render component with quantity 1 exact", () => {
    render(<CompactWallet quantity={"1"} asset={giveAssetType} isQuantityExact={true} />);
    expect(screen.getByText("1 sOHM retained"));
  });

  it("should render component with quantity not exact", () => {
    render(<CompactWallet quantity={"1"} asset={giveAssetType} isQuantityExact={false} />);
    expect(screen.getByText("≈ 1 sOHM retained"));
  });
});

describe("<LargeWallet/>", () => {
  it("should render component", () => {
    render(<LargeWallet />);
    expect(screen.getByText("Deposit sOHM from wallet"));
  });
});

describe("<LargeVault/>", () => {
  it("should render component", () => {
    render(<LargeVault />);
    expect(screen.getByText("Lock sOHM in vault"));
  });
});

describe("<LargeYield/>", () => {
  it("should render component", () => {
    render(<LargeYield />);
    expect(screen.getByText("Recipient earns sOHM rebases"));
  });
});
