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
  hasPendingGiveTxn,
  PENDING_TXN_GIVE,
  PENDING_TXN_EDIT_GIVE,
  PENDING_TXN_GIVE_APPROVAL,
} from "src/slices/GiveThunk";
import { IPendingTxn, txnButtonText } from "../../slices/PendingTxnsSlice";
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

type RecipientModalProps = {
  isModalOpen: boolean;
  callbackFunc: SubmitCallback;
  cancelFunc: CancelCallback;
  project?: Project;
  currentWalletAddress?: string;
  currentDepositAmount?: number; // As per IUserDonationInfo
};

// TODO consider shifting this into interfaces.ts
type State = {
  account: IAccountSlice;
  pendingTransactions: IPendingTxn[];
};

export interface SubmitCallback {
  (walletAddress: string, depositAmount: BigNumber, depositAmountDiff?: BigNumber): void;
}

export interface CancelCallback {
  (): void;
}

export function RecipientModal({
  isModalOpen,
  callbackFunc,
  cancelFunc,
  project,
  currentWalletAddress,
  currentDepositAmount,
}: RecipientModalProps) {
  const dispatch = useDispatch();
  const { provider, address, connected, connect, chainID } = useWeb3Context();

  const [depositAmount, setDepositAmount] = useState(currentDepositAmount ? currentDepositAmount : 0);
  const [isDepositAmountValid, setIsDepositAmountValid] = useState(false);
  const [isDepositAmountValidError, setIsDepositAmountValidError] = useState("");

  const [walletAddress, setWalletAddress] = useState(currentWalletAddress ? currentWalletAddress : "");
  const [isWalletAddressValid, setIsWalletAddressValid] = useState(false);
  const [isWalletAddressValidError, setIsWalletAddressValidError] = useState("");

  const [isAmountSet, setIsAmountSet] = useState(false);

  useEffect(() => {
    checkIsDepositAmountValid(getDepositAmount().toFixed());
    checkIsWalletAddressValid(getWalletAddress());
  }, []);

  /**
   * Returns the user's sOHM balance
   *
   * Copied from Stake.jsx
   *
   * TODO consider extracting this into a helper file
   */
  const sohmBalance: string = useSelector((state: State) => {
    return state.account.balances && state.account.balances.mockSohm;
  });

  const giveAllowance: number = useSelector((state: State) => {
    return state.account.giving && state.account.giving.sohmGive;
  });

  const pendingTransactions: IPendingTxn[] = useSelector((state: State) => {
    return state.pendingTransactions;
  });

  const onSeekApproval = async () => {
    await dispatch(changeApproval({ address, token: "sohm", provider, networkID: chainID }));
  };

  const hasAllowance = useCallback(() => {
    return giveAllowance > 0;
  }, [giveAllowance]);

  const isAllowanceDataLoading = giveAllowance == null;

  const getSOhmBalance = (): BigNumber => {
    return new BigNumber(sohmBalance);
  };

  /**
   * Returns the maximum deposit that can be directed to the recipient.
   *
   * This is equal to the current wallet balance and the current deposit amount (in the vault).
   *
   * @returns BigNumber
   */
  const getMaximumDepositAmount = (): BigNumber => {
    return new BigNumber(sohmBalance).plus(currentDepositAmount ? currentDepositAmount : 0);
  };

  const handleSetDepositAmount = (value: string) => {
    checkIsDepositAmountValid(value);
    setDepositAmount(parseFloat(value));
  };

  const checkIsDepositAmountValid = (value: string) => {
    const valueNumber = new BigNumber(value);
    const sOhmBalanceNumber = getSOhmBalance();

    if (!value || value == "" || valueNumber.isEqualTo(0)) {
      setIsDepositAmountValid(false);
      setIsDepositAmountValidError("Please enter a value");
      return;
    }

    if (valueNumber.isLessThan(0)) {
      setIsDepositAmountValid(false);
      setIsDepositAmountValidError("Value must be positive");
      return;
    }

    if (sOhmBalanceNumber.isEqualTo(0)) {
      setIsDepositAmountValid(false);
      setIsDepositAmountValidError("You must have a balance of sOHM (staked OHM) to continue");
    }

    if (valueNumber.isGreaterThan(getMaximumDepositAmount())) {
      setIsDepositAmountValid(false);
      setIsDepositAmountValidError("Value cannot be more than your sOHM balance of " + getMaximumDepositAmount());
      return;
    }

    setIsDepositAmountValid(true);
    setIsDepositAmountValidError("");
  };

  const handleSetWallet = (value: string) => {
    checkIsWalletAddressValid(value);
    setWalletAddress(value);
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
      setIsWalletAddressValidError("Please enter a valid Ethereum address");
      return;
    }

    if (value == address) {
      setIsWalletAddressValid(false);
      setIsWalletAddressValidError("Please enter a different address: cannot direct to the same wallet");
      return;
    }

    setIsWalletAddressValid(true);
    setIsWalletAddressValidError("");
  };

  /**
   * Determines if an existing recipient entry is being edited (false)
   * or if a new entry is being added (true).
   *
   * @returns boolean
   */
  const isCreateMode = (): boolean => {
    if (currentWalletAddress) return false;

    return true;
  };

  const isProjectMode = (): boolean => {
    if (project) return true;

    return false;
  };

  const getTitle = (): string => {
    if (!isCreateMode()) return "Edit Yield";

    return "Give Yield";
  };

  /**
   * Indicates whether the form can be submitted.
   *
   * This will return false if:
   * - the deposit amount is invalid
   * - the wallet address is invalid
   * - there is no sender address
   * - an add/edit transaction is pending
   * - it is not in create mode and there is no difference in the amount
   *
   * @returns boolean
   */
  const canSubmit = (): boolean => {
    if (!isDepositAmountValid) return false;
    if (!isWalletAddressValid) return false;
    if (!address) return false;
    if (hasPendingGiveTxn(pendingTransactions)) return false;
    if (!isCreateMode() && getDepositAmountDiff().isEqualTo(0)) return false;

    return true;
  };

  /**
   * Indicates the amount retained in the user's wallet after a deposit to the vault.
   *
   * If a yield direction is being created, it returns the current sOHM balance minus the entered deposit.
   * If a yield direction is being edited, it returns the current sOHM balance minus the difference in the entered deposit.
   *
   * @returns BigNumber instance
   */
  const getRetainedAmountDiff = (): BigNumber => {
    const tempDepositAmount: BigNumber = !isCreateMode() ? getDepositAmountDiff() : getDepositAmount();
    return new BigNumber(sohmBalance).minus(tempDepositAmount);
  };

  const getDepositAmountDiff = (): BigNumber => {
    // We can't trust the accuracy of floating point arithmetic of standard JS libraries, so we use BigNumber
    const depositAmountBig = new BigNumber(depositAmount);
    return depositAmountBig.minus(getCurrentDepositAmount());
  };

  /**
   * Ensures that the depositAmount returned is a valid number.
   *
   * @returns
   */
  const getDepositAmount = (): BigNumber => {
    if (!depositAmount) return new BigNumber(0);

    return new BigNumber(depositAmount);
  };

  const getCurrentDepositAmount = (): BigNumber => {
    if (!currentDepositAmount) return new BigNumber(0);

    return new BigNumber(currentDepositAmount);
  };

  /**
   * Returns the wallet address. If a project is defined, it uses the
   * project wallet, else what was passed in as a parameter.
   */
  const getWalletAddress = (): string => {
    if (project) return project.wallet;

    return walletAddress;
  };

  const handleContinue = () => {
    setIsAmountSet(true);
  };

  /**
   * Calls the submission callback function that is provided to the component.
   */
  const handleSubmit = () => {
    const depositAmountBig = new BigNumber(depositAmount);

    callbackFunc(getWalletAddress(), depositAmountBig, getDepositAmountDiff());
  };

  const getRecipientElements = () => {
    // If project mode is enabled, the amount is editable, but the recipient is not
    if (isProjectMode()) {
      return (
        <>
          <Typography variant="h5">Recipient</Typography>
          <Typography variant="h6">
            {project?.title} by {project?.owner}
          </Typography>
        </>
      );
    }

    // If not in create mode, don't display the recipient wallet address
    if (!isCreateMode()) {
      return <></>;
    }

    return (
      <>
        <Typography variant="h5">Recipient</Typography>
        <FormControl className="modal-input" variant="outlined" color="primary">
          <InputLabel htmlFor="wallet-input"></InputLabel>
          <OutlinedInput
            id="wallet-input"
            type="text"
            placeholder="Enter a wallet address in the form of 0x ..."
            className="stake-input"
            value={walletAddress}
            error={!isWalletAddressValid}
            onChange={e => handleSetWallet(e.target.value)}
            labelWidth={0}
            disabled={!isCreateMode()}
          />
          <FormHelperText>{isWalletAddressValidError}</FormHelperText>
        </FormControl>{" "}
      </>
    );
  };

  // TODO stop modal from moving when validation messages are shown

  return (
    <Modal className="modal-container" open={isModalOpen}>
      <Paper className="ohm-card ohm-modal">
        <div className="yield-header">
          <Link onClick={() => cancelFunc()}>
            <SvgIcon color="primary" component={XIcon} />
          </Link>
          <Typography variant="h4">{getTitle()}</Typography>
        </div>
        {!address ? (
          <>
            <FormHelperText>
              You must be logged into your wallet to use this feature. Click on the "Connect Wallet" button and try
              again.
            </FormHelperText>
          </>
        ) : !hasAllowance() ? (
          <Box className="help-text">
            <Typography variant="body1" className="stream-note" color="textSecondary">
              First time giving <b>sOHM</b>?
              <br />
              Please approve Olympus DAO to use your <b>sOHM</b> for giving.
            </Typography>
          </Box>
        ) : isAllowanceDataLoading ? (
          <Skeleton />
        ) : isAmountSet ? (
          <>
            <div className="give-confirmation-details">
              <Typography variant="h6">Details</Typography>
              <div className="details-row">
                <div className="sohm-allocation-col">
                  <Typography variant="body1">sOHM Allocation</Typography>
                  <Typography variant="h6">{shorten(address)}</Typography>
                </div>
                <ArrowGraphic />
                <div className="recipient-address-col">
                  <Typography variant="body1">Recipient Address</Typography>
                  <Typography variant="h6">
                    {project ? project.title + " - " + project.owner : shorten(walletAddress)}
                  </Typography>
                </div>
              </div>
            </div>
            <div className="give-confirmation-divider">
              <Divider />
            </div>
            <div className="give-confirmation-details">
              <Typography variant="h6" className="confirmation-sect-header">
                Transaction
              </Typography>
              <div className="details-row">
                <Typography variant="body1">Amount</Typography>
                <Typography variant="h6">{depositAmount} sOHM</Typography>
              </div>
            </div>
          </>
        ) : (
          <>
            <Typography variant="body1">sOHM Allocation</Typography>
            <FormControl className="modal-input" variant="outlined" color="primary">
              <InputLabel htmlFor="amount-input"></InputLabel>
              <OutlinedInput
                id="amount-input"
                type="number"
                placeholder="Enter an amount"
                className="stake-input"
                value={getDepositAmount().isEqualTo(0) ? null : getDepositAmount()}
                error={!isDepositAmountValid}
                onChange={e => handleSetDepositAmount(e.target.value)}
                labelWidth={0}
                startAdornment={
                  <InputAdornment position="start">
                    <div className="logo-holder">{sOhmImg}</div>
                  </InputAdornment>
                }
                endAdornment={
                  <InputAdornment position="end">
                    <Button variant="text" onClick={() => handleSetDepositAmount(getMaximumDepositAmount().toFixed())}>
                      Max
                    </Button>
                  </InputAdornment>
                }
              />
              <FormHelperText>{isDepositAmountValidError}</FormHelperText>
              <div className="give-staked-balance">
                <Typography variant="body2" align="left">
                  Your Staked Balance (depositable)
                </Typography>
                <Typography variant="body2" align="right">
                  {new Intl.NumberFormat("en-US").format(getSOhmBalance().toNumber())} sOHM
                </Typography>
              </div>
            </FormControl>
            {getRecipientElements()}
            {isCreateMode() ? (
              <div className="give-education-graphics">
                <WalletGraphic quantity={getRetainedAmountDiff().toFixed()} />
                <ArrowGraphic />
                <VaultGraphic quantity={getDepositAmount().toFixed()} />
                <ArrowGraphic />
                <YieldGraphic quantity={getDepositAmount().toFixed()} />
              </div>
            ) : (
              <div className="give-education-graphics">
                <CurrPositionGraphic quantity={getCurrentDepositAmount().toFixed()} />
                <NewPositionGraphic quantity={getDepositAmount().toFixed()} />
              </div>
            )}
          </>
        )}
        {isCreateMode() ? (
          address && hasAllowance() && !isAmountSet ? (
            <FormControl className="ohm-modal-submit">
              <Button variant="contained" color="primary" disabled={!canSubmit()} onClick={handleContinue}>
                Continue
              </Button>
            </FormControl>
          ) : isAmountSet ? (
            <FormControl className="ohm-modal-submit">
              <Button variant="contained" color="primary" disabled={!canSubmit()} onClick={handleSubmit}>
                {txnButtonText(pendingTransactions, PENDING_TXN_GIVE, "Confirm sOHM")}
              </Button>
            </FormControl>
          ) : (
            <FormControl className="ohm-modal-submit">
              <Button variant="contained" color="primary" disabled={!canSubmit()} onClick={onSeekApproval}>
                {txnButtonText(pendingTransactions, PENDING_TXN_GIVE_APPROVAL, "Approve")}
              </Button>
            </FormControl>
          )
        ) : !isAmountSet ? (
          <FormControl className="ohm-modal-submit">
            <Button variant="contained" color="primary" disabled={!canSubmit()} onClick={handleContinue}>
              Continue
            </Button>
          </FormControl>
        ) : (
          <FormControl className="ohm-modal-submit">
            <Button variant="contained" color="primary" disabled={!canSubmit()} onClick={handleSubmit}>
              {txnButtonText(pendingTransactions, PENDING_TXN_EDIT_GIVE, "Edit Give Amount")}
            </Button>
          </FormControl>
        )}
      </Paper>
    </Modal>
  );
}
