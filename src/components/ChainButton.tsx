import { Button, Typography } from "@material-ui/core";
import { INetwork } from "src/constants";
const ChainButton: React.FC<{
  click: () => void;
  network: INetwork;
}> = ({ click, network }) => {
  return (
    <Button variant="outlined" style={{ margin: "0.3rem" }} onClick={click}>
      <img height="28px" width="28px" src={String(network.image)} alt={network.imageAltText} />
      <Typography variant="h6" style={{ marginLeft: "8px" }}>
        {network.chainName}
      </Typography>
    </Button>
  );
};

export default ChainButton;
