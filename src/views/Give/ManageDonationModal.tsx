import { Box, Modal, Paper, Typography, SvgIcon, Link, Button, Divider } from "@material-ui/core";
import { FormControl, FormHelperText, InputAdornment } from "@material-ui/core";
import { InputLabel } from "@material-ui/core";
import { OutlinedInput } from "@material-ui/core";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as XIcon } from "../../assets/icons/x.svg";
import { isAddress } from "@ethersproject/address";
import { useWeb3Context } from "src/hooks/web3Context";
import { Skeleton } from "@material-ui/lab";
import {
  changeApproval,
  changeMockApproval,
  hasPendingGiveTxn,
  PENDING_TXN_GIVE,
  PENDING_TXN_EDIT_GIVE,
  PENDING_TXN_GIVE_APPROVAL,
} from "src/slices/GiveThunk";
import { IPendingTxn, txnButtonText, isPendingTxn } from "../../slices/PendingTxnsSlice";
import { getTokenImage } from "../../helpers";
import { BigNumber } from "bignumber.js";
import {
  WalletGraphic,
  VaultGraphic,
  YieldGraphic,
  CurrPositionGraphic,
  NewPositionGraphic,
  ArrowGraphic,
} from "../../components/EducationCard";
import { IAccountSlice } from "../../slices/AccountSlice";
import { Project } from "src/components/GiveProject/project.type";
const sOhmImg = getTokenImage("sohm");
import { shorten } from "src/helpers";
import { InfoTooltip } from "@olympusdao/component-library";
import { useAppSelector } from "src/hooks";
import { t, Trans } from "@lingui/macro";
import { useLocation } from "react-router-dom";
import { EnvHelper } from "src/helpers/Environment";
import { CancelCallback, SubmitCallback } from "./Interfaces";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import ConnectButton from "../../components/ConnectButton";
import { NetworkId } from "src/constants";
import { ChevronLeft } from "@material-ui/icons";

type ManageModalProps = {
  isModalOpen: boolean;
  callbackFunc: SubmitCallback;
  cancelFunc: CancelCallback;
  project?: Project;
  currentWalletAddress?: string;
  currentDepositAmount?: BigNumber; // As per IUserDonationInfo
  depositDate?: string;
  yieldSent?: string;
};

// TODO consider shifting this into interfaces.ts
type State = {
  account: IAccountSlice;
  pendingTransactions: IPendingTxn[];
};

export function ManageDonationModal({
  isModalOpen,
  callbackFunc,
  cancelFunc,
  project,
  currentWalletAddress,
  currentDepositAmount,
  depositDate,
  yieldSent
}: ManageModalProps) {
  const location = useLocation();
  const dispatch = useDispatch();
  const { provider, address, connect, networkId } = useWeb3Context();

  const _initialDepositAmount = 0;
  const _initialWalletAddress = "";
  const _initialDepositAmountValid = false;
  const _initialDepositAmountValidError = "";
  const _initialWalletAddressValid = false;
  const _initialWalletAddressValidError = "";
  const _initialIsAmountSet = false;

  const getInitialDepositAmount = () => {
    return currentDepositAmount ? currentDepositAmount.toNumber() : _initialDepositAmount;
  };
  const [depositAmount, setDepositAmount] = useState(getInitialDepositAmount());
  const [isDepositAmountValid, setIsDepositAmountValid] = useState(_initialDepositAmountValid);
  const [isDepositAmountValidError, setIsDepositAmountValidError] = useState(_initialDepositAmountValidError);

  const getInitialWalletAddress = () => {
    return currentWalletAddress ? currentWalletAddress : _initialWalletAddress;
  };
  const [walletAddress, setWalletAddress] = useState(getInitialWalletAddress());
  const [isWalletAddressValid, setIsWalletAddressValid] = useState(_initialWalletAddressValid);
  const [isWalletAddressValidError, setIsWalletAddressValidError] = useState(_initialWalletAddressValidError);

  const [isAmountSet, setIsAmountSet] = useState(_initialIsAmountSet);
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  useEffect(() => {
    checkIsDepositAmountValid(getDepositAmount().toFixed());
    checkIsWalletAddressValid(getWalletAddress());
  }, []);

  useEffect(() => {
    // When we close the modal, we ensure that the state is also reset to default
    if (!isModalOpen) {
      handleSetDepositAmount(getInitialDepositAmount().toFixed());
      handleSetWallet(getInitialWalletAddress());
      setIsAmountSet(_initialIsAmountSet);
    }
  }, [isModalOpen]);

  const handleModalInsideClick = (e: any): void => {
    // When the user clicks within the modal window, we do not want to pass the event up the tree
    e.stopPropagation();
  };

  /**
   * Checks if the provided wallet address is valid.
   *
   * This will return false if:
   * - it is an invalid Ethereum address
   * - it is the same as the sender address
   *
   * @param {string} value the proposed value for the wallet address
   */
  const checkIsWalletAddressValid = (value: string) => {
    if (!isAddress(value)) {
      setIsWalletAddressValid(false);
      setIsWalletAddressValidError(t`Please enter a valid Ethereum address`);
      return;
    }

    if (value == address) {
      setIsWalletAddressValid(false);
      setIsWalletAddressValidError(t`Please enter a different address: cannot direct to the same wallet`);
      return;
    }

    setIsWalletAddressValid(true);
    setIsWalletAddressValidError("");
  };

  /**
   * Returns the wallet address. If a project is defined, it uses the
   * project wallet, else what was passed in as a parameter.
   */
  const getWalletAddress = (): string => {
    if (project) return project.wallet;

    return walletAddress;
  };

  /**
   * Returns the appropriate title of the recipient.
   * - No project: shortened wallet address
   * - Project without a separate owner value: project title
   * - Otherwise the project title and owner
   */
  const getRecipientTitle = (): string => {
    if (!project) return shorten(walletAddress);

    if (!project.owner) return project.title;

    return project.owner + " - " + project.title;
  };

  const getRenderedDetails = (shorten: boolean) => {
    return {
      __html: MarkdownIt({ html: true }).render(shorten ? `${shortDescription}` : `${details}`),
    };
  };


  // TODO stop modal from moving when validation messages are shown

  // NOTE: the following warning is caused by the amount-input field:
  // Warning: `value` prop on `%s` should not be null. Consider using an empty string to clear the component or `undefined` for uncontrolled components.%s
  // This is caused by this line (currently 423):
  // value={getDepositAmount().isEqualTo(0) ? null : getDepositAmount()}
  // If we set the value to an empty string instead of null, any decimal number that is entered will not be accepted
  // This appears to be due to the following bug (which is still not resolved);
  // https://github.com/facebook/react/issues/11877

  // TODO re-arrange the below output to be around the state: approval, custom recipient, project recipient, editing

  return (
    /* modal-container displays a background behind the ohm-card container, which means that if modal-container receives a click, we can close the modal */
    <Modal className="modal-container" open={isModalOpen} onClose={cancelFunc} onClick={cancelFunc} hideBackdrop={true}>
      <Paper className={`ohm-card ohm-modal ${isSmallScreen && "smaller"}`} onClick={handleModalInsideClick}>
        <div className="yield-header">
          <Link onClick={() => cancelFunc()}>
            <SvgIcon color="primary" component={XIcon} />
          </Link>
          <Typography variant="h4">
            <strong>Manage Donation</strong>
          </Typography>
        </div>
        <div className="manage-project-info">
          <div className="cause-image">
            <Link href={`#/give/projects/${project.slug}`}>
              <img width="100%" src={`${process.env.PUBLIC_URL}${photos[0]}`} />
            </Link>
          </div>
          <div className="cause-content">
            <Grid container className="cause-header">
              <Grid item className="cause-title">
                <Link href={`#/give/projects/${project.slug}`}>
                  <Typography variant="h4">
                    <strong>{getRecipientTitle()}</strong>
                  </Typography>
                </Link>
              </Grid>
            </Grid>
            <div className="cause-body">
              <Typography variant="body1" style={{ lineHeight: "20px" }}>
                <div dangerouslySetInnerHTML={getRenderedDetails(true)} />
              </Typography>
            </div>
          </div>
        </div>
        <div className="manage-project-stats">
          <Box
            className="project-goal"
            style={{ border: "1px solid #999999", borderRadius: "10px", padding: "20px 40px 20px 40px" }}
          >
            <Typography variant="h5">{project.depositGoal}</Typography>
            <Typography variant="body1" className="subtext">Goal</Typography>
          </Box>
          
        </div>
        <Box
          className="give-confirmation-details"
          style={{ border: "1px solid #999999", borderRadius: "10px", padding: "20px" }}
        >
          <div className="details-row">
            <div className="sohm-allocation-col">
              <Typography variant="body1">
                <Trans>sOHM deposit</Trans>
              </Typography>
              <Typography variant="h6">{getDepositAmount().toFixed(2)} sOHM</Typography>
            </div>
            {!isSmallScreen && <ArrowGraphic />}
            <div className="recipient-address-col">
              <Typography variant="body1">
                <Trans>Recipient address</Trans>
              </Typography>
              <Typography variant="h6">
                <strong>{getRecipientTitle()}</strong>
              </Typography>
            </div>
          </div>
        </Box>
      </Paper>
    </Modal>
  );
}
