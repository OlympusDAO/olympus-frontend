import { Box, Typography } from "@mui/material";
import { Icon, InfoNotification, Metric, Modal, PrimaryButton } from "@olympusdao/component-library";
import { UseMutationResult } from "@tanstack/react-query";
import { ContractReceipt } from "ethers";
import { TokenAllowanceGuard } from "src/components/TokenAllowanceGuard/TokenAllowanceGuard";
import { WalletConnectedGuard } from "src/components/WalletConnectedGuard";
import { MINTER_ADDRESSES, OHM_ADDRESSES } from "src/constants/addresses";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { IBridgeOhm, useEstimateSendFee } from "src/hooks/useBridging";
import { EthersError } from "src/lib/EthersTypes";
import { useAccount } from "wagmi";

export const BridgeConfirmModal = (props: {
  isOpen: boolean;
  handleConfirmClose: () => void;
  amountExceedsBalance: boolean;
  amount: string;
  bridgeMutation: UseMutationResult<ContractReceipt, EthersError, IBridgeOhm, unknown>;
  destinationChainId: number;
}) => {
  const { address } = useAccount();
  const { data: fee } = useEstimateSendFee({
    destinationChainId: props.destinationChainId,
    recipientAddress: address as string,
    amount: props.amount,
  });
  console.log("fee", fee);
  return (
    <Modal
      data-testid="bridge-confirmation-modal"
      maxWidth="476px"
      topLeft={<></>}
      headerContent={
        <Box display="flex" flexDirection="row">
          <Typography variant="h5">{`Confirm Bridging`}</Typography>
        </Box>
      }
      open={props.isOpen}
      onClose={props.handleConfirmClose}
      minHeight={"100px"}
    >
      <Box display="flex" flexDirection="column">
        {props.bridgeMutation.isLoading && (
          <InfoNotification>
            Please don't close this modal until all wallet transactions are confirmed.
          </InfoNotification>
        )}

        <Box id="bridge-metrics" display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
          <Box display="flex" flexDirection="column">
            <Metric
              label={`Assets to Bridge`}
              metric={new DecimalBigNumber(props.amount).toString({ decimals: 4, format: true, trim: true })}
            />
            <Box display="flex" flexDirection="row" justifyContent="center">
              <Typography>{`OHM`}</Typography>
            </Box>
          </Box>
          <Icon sx={{ transform: "rotate(-90deg)" }} name="caret-down" />
          <Box display="flex" flexDirection="column">
            <Metric
              label="Assets to Receive"
              metric={new DecimalBigNumber(props.amount).toString({ decimals: 4, format: true, trim: true })}
            />
            <Box display="flex" flexDirection="row" justifyContent="center">
              <Typography>{`OHM`}</Typography>
            </Box>
          </Box>
        </Box>
        {fee && (
          <Box id="bridge-fee" display="flex" flexDirection="column" justifyContent="center">
            <Box display="flex" flexDirection="column">
              <Metric
                label={`Bridge Fee (in ETH)`}
                metric={fee.nativeFee.toString({ decimals: 4, format: true, trim: true })}
              />
              <Box display="flex" flexDirection="row" justifyContent="center">
                <Typography>{`ETH`}</Typography>
              </Box>
            </Box>
          </Box>
        )}

        <Box id="bridge-button" sx={{ marginTop: "2rem" }}>
          <WalletConnectedGuard fullWidth>
            <TokenAllowanceGuard
              tokenAddressMap={OHM_ADDRESSES}
              spenderAddressMap={MINTER_ADDRESSES}
              approvalText={`Approve OHM for Bridging`}
              message={
                <>
                  First time bridging <b>OHM</b>? <br /> Please approve Olympus DAO to use your <b>OHM</b> for bridging.
                </>
              }
            >
              <>
                <PrimaryButton
                  data-testid="submit-modal-button"
                  loading={props.bridgeMutation.isLoading}
                  fullWidth
                  disabled={
                    props.bridgeMutation.isLoading ||
                    !props.amount ||
                    props.amountExceedsBalance ||
                    parseFloat(props.amount) === 0
                  }
                  onClick={() =>
                    props.bridgeMutation.mutate({
                      destinationChainId: props.destinationChainId,
                      recipientAddress: address as string,
                      amount: props.amount,
                    })
                  }
                >
                  {props.amountExceedsBalance
                    ? "Amount exceeds balance"
                    : !props.amount || parseFloat(props.amount) === 0
                    ? "Enter an amount"
                    : props.bridgeMutation.isLoading
                    ? "Confirming Bridging in your wallet"
                    : "Bridge"}
                </PrimaryButton>
              </>
            </TokenAllowanceGuard>
          </WalletConnectedGuard>
        </Box>
      </Box>
    </Modal>
  );
};
