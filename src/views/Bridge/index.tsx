import { Box } from "@material-ui/core";
import { Paper, TertiaryButton, Token } from "@olympusdao/component-library";

/**
 * Component for Displaying BridgeLinks
 */
const Bridge = () => {
  return (
    <div id="stake-view">
      <Paper headerText="Bridge">
        <Box display="flex" flexDirection="row" justifyContent="center" flexWrap="wrap">
          <TertiaryButton href="https://synapseprotocol.com/?inputCurrency=gOHM&outputCurrency=gOHM">
            <Token name="wETH" style={{ marginRight: "10px" }} />
            <span>Bridge on Synapse</span>
          </TertiaryButton>
          <TertiaryButton href="https://synapseprotocol.com/?inputCurrency=gOHM&outputCurrency=gOHM&outputChain=42161">
            <Token name="ARBITRUM" style={{ marginRight: "10px" }} />
            <span>Bridge on Synapse</span>
          </TertiaryButton>
          <TertiaryButton href="https://synapseprotocol.com/?inputCurrency=gOHM&outputCurrency=gOHM&outputChain=10">
            <Token name="OPTIMISM" style={{ marginRight: "10px" }} />
            <span>Bridge on Synapse</span>
          </TertiaryButton>
        </Box>
        <Box display="flex" flexDirection="row" justifyContent="center" flexWrap="wrap">
          <TertiaryButton href="https://synapseprotocol.com/?inputCurrency=gOHM&outputCurrency=gOHM&outputChain=250">
            <Token name="FANTOM" style={{ marginRight: "10px" }} />
            <span>Bridge on Fantom</span>
          </TertiaryButton>
          <TertiaryButton href="https://synapseprotocol.com/?inputCurrency=gOHM&outputCurrency=gOHM&outputChain=137">
            <Token name="POLYGON" style={{ marginRight: "10px" }} />
            <span>Bridge on Polygon</span>
          </TertiaryButton>
          <TertiaryButton href="https://synapseprotocol.com/?inputCurrency=gOHM&outputCurrency=gOHM&outputChain=43114">
            <Token name="AVAX" style={{ marginRight: "10px" }} />
            <span>Bridge on Avalanche</span>
          </TertiaryButton>
          <TertiaryButton href="https://portalbridge.com/#/transfer">
            <Token name="UST" style={{ marginRight: "10px" }} />
            <span>Bridge on Wormhole</span>
          </TertiaryButton>
        </Box>
      </Paper>
    </div>
  );
};

export default Bridge;
