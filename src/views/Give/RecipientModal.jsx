import { Box, Modal, Paper, Typography, SvgIcon, Link, Button } from "@material-ui/core";
import { FormControl, FormHelperText } from "@material-ui/core";
import { InputLabel } from "@material-ui/core";
import { OutlinedInput } from "@material-ui/core";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as XIcon } from "../../assets/icons/x.svg";
import { isAddress } from "@ethersproject/address";
import { useWeb3Context } from "src/hooks/web3Context";
import { Skeleton } from "@material-ui/lab";
import { changeApproval, changeGive } from "../../slices/GiveThunk";
import { isPendingTxn, txnButtonText } from "../../slices/PendingTxnsSlice";
import { getTokenImage } from "../../helpers";
import { BigNumber } from "bignumber.js";

const sOhmImg = getTokenImage("sohm");

export function RecipientModal({ isModalOpen, callbackFunc, cancelFunc, currentWalletAddress, currentDepositAmount }) {
  const dispatch = useDispatch();
  const { provider, address, connected, connect, chainID } = useWeb3Context();

  const [depositAmount, setDepositAmount] = useState(currentDepositAmount ? currentDepositAmount : null);
  const [isDepositAmountValid, setIsDepositAmountValid] = useState(false);
  const [isDepositAmountValidError, setIsDepositAmountValidError] = useState("");

  const [walletAddress, setWalletAddress] = useState(currentWalletAddress ? currentWalletAddress : "");
  const [isWalletAddressValid, setIsWalletAddressValid] = useState(false);
  const [isWalletAddressValidError, setIsWalletAddressValidError] = useState("");

  useEffect(() => {
    checkIsDepositAmountValid(depositAmount);
    checkIsWalletAddressValid(walletAddress);
  }, []);

  /**
   * Returns the user's sOHM balance
   *
   * Copied from Stake.jsx
   *
   * TODO consider extracting this into a helper file
   */
  const sohmBalance = useSelector(state => {
    return state.account.balances && state.account.balances.sohm;
  });

  const giveAllowance = useSelector(state => {
    return state.account.giving && state.account.giving.sohmGive;
  });

  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });

  const onSeekApproval = async () => {
    await dispatch(changeApproval({ address, token: "sohm", provider, networkID: chainID }));
  };

  const hasAllowance = useCallback(() => {
    return giveAllowance > 0;
  }, [giveAllowance]);

  const isAllowanceDataLoading = giveAllowance == null;

  /**
   * Returns the maximum deposit that can be directed to the recipient.
   *
   * This is equal to the current wallet balance and the current deposit amount (in the vault).
   *
   * @returns boolean
   */
  const getMaximumDepositAmount = () => {
    return parseFloat(sohmBalance) + parseFloat(currentDepositAmount ? currentDepositAmount : 0.0);
  };

  const handleSetDepositAmount = value => {
    checkIsDepositAmountValid(value);
    setDepositAmount(value);
    console.log(value);
    console.log(depositAmount);
    console.log(currentDepositAmount);
  };

  const checkIsDepositAmountValid = value => {
    const valueFloat = parseFloat(value);
    const sohmBalanceFloat = parseFloat(sohmBalance);

    if (!value || value == "" || valueFloat == 0) {
      setIsDepositAmountValid(false);
      setIsDepositAmountValidError("Please enter a value");
      return;
    }

    if (valueFloat < 0) {
      setIsDepositAmountValid(false);
      setIsDepositAmountValidError("Value must be positive");
      return;
    }

    if (sohmBalanceFloat == 0) {
      setIsDepositAmountValid(false);
      setIsDepositAmountValidError("You must have a balance of sOHM (staked OHM) to continue");
    }

    if (valueFloat > getMaximumDepositAmount()) {
      setIsDepositAmountValid(false);
      setIsDepositAmountValidError("Value cannot be more than your sOHM balance of " + getMaximumDepositAmount());
      return;
    }

    setIsDepositAmountValid(true);
    setIsDepositAmountValidError("");
  };

  const handleSetWallet = value => {
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
  const checkIsWalletAddressValid = value => {
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
  const isCreateMode = () => {
    if (currentDepositAmount || currentWalletAddress) return false;

    return true;
  };

  const getTitle = () => {
    if (!isCreateMode()) return "Edit Recipient";

    return "Add Recipient";
  };

  const getIntroduction = () => {
    if (!isCreateMode())
      return (
        <>
          <Typography variant="body1">
            You have currently deposited {currentDepositAmount} sOHM into the vault for this recipient. Enter in the
            revised amount that you would like to direct yield for.
          </Typography>
          <Typography variant="body1">
            Please note that your sOHM will be transferred into the vault when you submit. You will need to approve the
            transaction and pay for gas fees.
          </Typography>
        </>
      );

    return (
      <>
        <Typography variant="body1">
          The rebase rewards from the sOHM that you deposit will be redirected to the wallet address that you specify.
        </Typography>
        <Typography variant="body1">
          Please note that your sOHM will be transferred into the vault when you submit. You will need to approve the
          transaction and pay for gas fees.
        </Typography>
      </>
    );
  };

  /**
   * Indicates whether the form can be submitted.
   *
   * This will return false if:
   * - the deposit amount is invalid
   * - the wallet address is invalid
   * - there is no sender address
   *
   * @returns boolean
   */
  const canSubmit = () => {
    if (!isDepositAmountValid) return false;
    if (!isWalletAddressValid) return false;
    if (!address) return false;
    if (isPendingTxn(pendingTransactions, "editingGive")) return false;

    return true;
  };

  const getDepositAmountDiff = () => {
    // We can't trust the accuracy of floating point arithmetic of standard JS libraries, so we use BigNumber
    const depositAmountBig = new BigNumber(depositAmount);
    return depositAmountBig.minus(new BigNumber(currentDepositAmount));
  };

  /**
   * Calls the submission callback function that is provided to the component.
   */
  const handleSubmit = () => {
    callbackFunc(walletAddress, depositAmountBig, getDepositAmountDiff());
  };

  // TODO stop modal from moving when validation messages are shown

  return (
    <Modal open={isModalOpen}>
      <Paper className="ohm-card ohm-modal">
        <div className="yield-header">
          <Link onClick={() => cancelFunc()}>
            <SvgIcon color="primary" component={XIcon} />
          </Link>
          <Typography variant="h4">{getTitle()}</Typography>
        </div>
        <Typography variant="body1">{getIntroduction()}</Typography>
        {hasAllowance() ? (
          !isCreateMode() ? (
            <>
              <Typography variant="h5">Amount of sOHM</Typography>
              <FormControl className="modal-input" variant="outlined" color="primary">
                <InputLabel htmlFor="amount-input"></InputLabel>
                <OutlinedInput
                  id="amount-input"
                  type="number"
                  placeholder="Enter an amount"
                  className="stake-input"
                  value={depositAmount}
                  error={!isDepositAmountValid}
                  onChange={e => handleSetDepositAmount(e.target.value)}
                  labelWidth={0}
                />
                <FormHelperText>{isDepositAmountValidError}</FormHelperText>
                {!isCreateMode() && (
                  <Typography variant="body2">Difference: {getDepositAmountDiff().toString()}</Typography>
                )}
              </FormControl>
            </>
          ) : (
            <>
              <Typography variant="h5">Amount of sOHM</Typography>
              <FormControl className="modal-input" variant="outlined" color="primary">
                <InputLabel htmlFor="amount-input"></InputLabel>
                <OutlinedInput
                  id="amount-input"
                  type="number"
                  placeholder="Enter an amount"
                  className="stake-input"
                  value={depositAmount}
                  error={!isDepositAmountValid}
                  onChange={e => handleSetDepositAmount(e.target.value)}
                  labelWidth={0}
                />
                <FormHelperText>{isDepositAmountValidError}</FormHelperText>
                {!isCreateMode() && (
                  <Typography variant="body2">Difference: {getDepositAmountDiff().toString()}</Typography>
                )}
              </FormControl>
              <Typography variant="h5">Recipient Address</Typography>
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
              </FormControl>
            </>
          )
        ) : (
          <Box className="help-text">
            <Typography variant="body1" className="stream-note" color="textSecondary">
              First time giving <b>sOHM</b>?
              <br />
              Please approve Olympus DAO to use your <b>sOHM</b> for giving.
            </Typography>
          </Box>
        )}
        {isAllowanceDataLoading ? (
          <Skeleton />
        ) : isCreateMode() ? (
          address && hasAllowance() ? (
            <FormControl className="ohm-modal-submit">
              <Button
                variant="contained"
                color="primary"
                disabled={!canSubmit() || isPendingTxn(pendingTransactions, "giving")}
                onClick={handleSubmit}
              >
                {txnButtonText(pendingTransactions, "giving", "Give sOHM")}
              </Button>
            </FormControl>
          ) : (
            <FormControl className="ohm-modal-submit">
              <Button variant="contained" color="primary" onClick={onSeekApproval}>
                {txnButtonText(pendingTransactions, "approve_giving", "Approve")}
              </Button>
            </FormControl>
          )
        ) : (
          <FormControl className="ohm-modal-submit">
            <Button
              variant="contained"
              color="primary"
              disabled={!canSubmit() || isPendingTxn(pendingTransactions, "editingGive")}
              onClick={handleSubmit}
            >
              {txnButtonText(pendingTransactions, "editingGive", "Edit Give Amount")}
            </Button>
          </FormControl>
        )}
        {!address ? (
          <>
            <FormHelperText>
              You must be logged into your wallet to use this feature. Click on the "Connect Wallet" button and try
              again.
            </FormHelperText>
          </>
        ) : (
          <></>
        )}
      </Paper>
    </Modal>
  );
}
