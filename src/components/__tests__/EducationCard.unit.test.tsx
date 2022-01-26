import { render } from "../../testUtils";
import {
  ArrowGraphic,
  CurrPositionGraphic,
  DepositSohm,
  LockInVault,
  NewPositionGraphic,
  ReceivesYield,
  RedeemGraphic,
  VaultGraphic,
  WalletGraphic,
  YieldGraphic,
} from "../EducationCard";

describe("<ArrowGraphic/>", () => {
  it("should render component", () => {
    const { container } = render(<ArrowGraphic />);
    expect(container).toMatchSnapshot();
  });
});

describe("<NewPositionGraphic/>", () => {
  it("should render component", () => {
    const { container } = render(<NewPositionGraphic quantity={"1"} />);
    expect(container).toMatchSnapshot();
  });
});

describe("<CurrPositionGraphic/>", () => {
  it("should render component", () => {
    const { container } = render(<CurrPositionGraphic quantity={"1"} />);
    expect(container).toMatchSnapshot();
  });
});

describe("<ReceivesYield/>", () => {
  it("should render component", () => {
    const { container } = render(<ReceivesYield message={"test123"} />);
    expect(container).toMatchSnapshot();
  });
});

describe("<RedeemGraphic/>", () => {
  it("should render component", () => {
    const { container } = render(<RedeemGraphic quantity={"1"} />);
    expect(container).toMatchSnapshot();
  });
});

describe("<YieldGraphic/>", () => {
  it("should render component", () => {
    const { container } = render(<YieldGraphic quantity={"1"} />);
    expect(container).toMatchSnapshot();
  });
});

describe("<VaultGraphic/>", () => {
  it("should render component", () => {
    const { container } = render(<VaultGraphic quantity={"1"} />);
    expect(container).toMatchSnapshot();
  });
});

describe("<DepositSohm/>", () => {
  it("should render component", () => {
    const { container } = render(<DepositSohm message={"test123"} />);
    expect(container).toMatchSnapshot();
  });
});

describe("<LockInVault/>", () => {
  it("should render component", () => {
    const { container } = render(<LockInVault message={"test123"} />);
    expect(container).toMatchSnapshot();
  });
});

describe("<WalletGraphic/>", () => {
  it("should render component", () => {
    const { container } = render(<WalletGraphic quantity={"1"} />);
    expect(container).toMatchSnapshot();
  });
});
