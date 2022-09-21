import { useLocation, useNavigate, useParams } from "react-router";
import { usePathForNetwork } from "src/hooks/usePathForNetwork";
import { BondModal } from "src/views/Bond/components/BondModal/BondModal";
import { useLiveBondsV3 } from "src/views/Bond/hooks/useLiveBonds";
import { useNetwork } from "wagmi";

export const BondModalContainerV3: React.VFC = () => {
  const navigate = useNavigate();
  const { chain = { id: 1 } } = useNetwork();
  const { id } = useParams<{ id: string }>();
  usePathForNetwork({ pathName: "bonds", networkID: chain.id, navigate });

  const { pathname } = useLocation();
  const isInverseBond = pathname.includes("/inverse/");

  const bonds = useLiveBondsV3({ isInverseBond }).data;
  const bond = bonds?.find(bond => bond.id === id);

  if (!bond) return null;

  return <BondModal bond={bond} />;
};
