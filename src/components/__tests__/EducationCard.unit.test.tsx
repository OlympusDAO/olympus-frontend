import {
  ArrowGraphic,
  CompactRebases,
  CompactVault,
  CompactWallet,
  LargeRebases,
  LargeVault,
  LargeWallet,
} from "src/components/EducationCard";
import { render, screen } from "src/testUtils";

describe("<ArrowGraphic/>", () => {
  it("should render component with correct fill", () => {
    render(<ArrowGraphic fill="#999999" />);
    expect(screen.getByTestId("arrow")).toHaveStyle({ fill: "#999999" });
  });
});

describe("<CompactRebases/>", () => {
  const giveAssetType = "sOHM";

  it("should render component with quantity 1 exact", () => {
    render(<CompactRebases quantity={"1"} asset={giveAssetType} isQuantityExact={true} />);
    expect(screen.getByText("Receives sOHM rebases from 1 sOHM"));
  });

  it("should render component with quantity not exact", () => {
    render(<CompactRebases quantity={"1"} asset={giveAssetType} isQuantityExact={false} />);
    expect(screen.getByText("Receives sOHM rebases from ≈ 1 sOHM"));
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

describe("<LargeRebases/>", () => {
  it("should render component", () => {
    render(<LargeRebases />);
    expect(screen.getByText("Recipient earns sOHM rebases"));
  });
});
