import { Backdrop, IconButton, Modal as MuiModal, ModalProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FC, ReactElement, useState } from "react";
import Icon from "src/components/library/Icon";
import Paper from "src/components/library/Paper";

const PREFIX = "Modal";

const classes = {
  paper: `${PREFIX}-paper`,
  backdrop: `${PREFIX}-backdrop`,
};

type Styles = {
  minHeight?: string;
  maxWidth?: string;
};

const StyledMuiModal = styled(MuiModal, {
  shouldForwardProp: prop => prop !== "minHeight" && prop !== "maxWidth",
})<Styles>(({ theme, minHeight, maxWidth }) => ({
  [`& .${classes.paper}.Paper-root`]: {
    "& .MuiIconButton-sizeSmall": {
      padding: "0px",
      marginRight: "-9px",
    },
    "& .modalDismiss": {
      marginLeft: "auto",
      display: "flex",
    },
    position: "absolute",
    minHeight: minHeight ? minHeight : "auto",
    [theme.breakpoints.down("md")]: {
      maxWidth: "none",
    },
    [theme.breakpoints.up("sm")]: {
      maxWidth: maxWidth ? maxWidth : "auto",
    },
  },

  [`& .${classes.backdrop}`]: {
    "&::before": {
      "@supports not ((-webkit-backdrop-filter: none) or (backdrop-filter: none))": {
        content: '""',
        background:
          theme.palette.mode === "light"
            ? `linear-gradient(180deg, #AFCDE9 1%, #F7FBE7 100%)`
            : `linear-gradient(180deg, rgba(8, 15, 53, 0), rgba(0, 0, 10, 0.9)), linear-gradient(333deg, rgba(153, 207, 255, 0.2), rgba(180, 255, 217, 0.08)), radial-gradient(circle at 77% 89%, rgba(125, 163, 169, 0.8), rgba(125, 163, 169, 0) 50%), radial-gradient(circle at 15% 95%, rgba(125, 163, 169, 0.8), rgba(125, 163, 169, 0) 43%), radial-gradient(circle at 65% 23%, rgba(137, 151, 119, 0.4), rgba(137, 151, 119, 0) 70%), radial-gradient(circle at 10% 0%, rgba(187, 211, 204, 0.33), rgba(187,211,204,0) 35%), radial-gradient(circle at 11% 100%, rgba(131, 165, 203, 0.3), rgba(131, 165, 203, 0) 30%)`,
        opacity: "1",
        filter: "blur(333px)",
        height: "100%",
        width: "100%",
        backgroundColor: theme.palette.background.default,
      },
    },
    "@supports not ((-webkit-backdrop-filter: none) or (backdrop-filter: none))": {
      background: "hsla(0,0%,39.2%,.9)",
    },
    background: "hsla(0,0%,39.2%,.1)",
    backdropFilter: "blur(33px)",
    "--webkitBackdropFilter": "blur(33px)",
  },
}));

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

export interface OHMModalProps extends ModalProps {
  /** Header Text for Modal */
  headerText?: string;
  /** Define the minimum height of the modal. Ex: 600px or 100% */
  minHeight?: string;
  /** Define the maximum width of the modal. Ex: 600px or 100% */
  maxWidth?: string;
  /** Specify the position of the close icon. Top left or right */
  closePosition?: "left" | "right";
  /** Custom content for Top Right Position. Prioritized over closePosition */
  topRight?: ReactElement;
  /** Custom content for Top Left Position. Prioritized over closePosition */
  topLeft?: ReactElement;
  /** Used to specify a custom header instead of using the default headerText prop. */
  headerContent?: ReactElement;
  /** Specify additional modal classes. */
  className?: string;
}

/**
 * Primary Modal Component for UI. This component inherits the Paper component and displays it in a modal.
 *
 * ### Controlling Modal State. 
 * ```typescript
 * const [open, setOpen] = useState(true);
 * const handleClose = () => {
 *  setOpen(false);
 * };
 * const handleOpen = () => {
 *  setOpen(true);
 * };
 * 
 * ```
 * ```jsx
 *  <Modal 
 *    onClose={handleClose}
 *    open={open}
 *  >
 *  This can be any type of content
 *  </Modal>
    ```
 */

const Modal: FC<OHMModalProps> = ({
  open = false,
  minHeight = "605px",
  maxWidth = "750px",
  closePosition = "right",
  headerText,
  headerContent,
  topRight,
  topLeft,
  ...props
}) => {
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = useState(getModalStyle);
  const closeButton = (
    <IconButton
      aria-label="close"
      color="inherit"
      size="small"
      onClick={e => {
        if (props.onClose) {
          props.onClose(e, "escapeKeyDown");
        }
      }}
    >
      <Icon name="x" />
    </IconButton>
  );

  //modal must have a close position. Close position and topLeft or topRight cant be used for the same position.
  const topRightPos = closePosition === "right" ? closeButton : topRight;
  const topLeftPos = closePosition === "left" ? closeButton : topLeft;

  return (
    <StyledMuiModal
      open={open}
      className={props.className}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      BackdropComponent={Backdrop}
      BackdropProps={{ className: classes.backdrop }}
      {...props}
      minHeight={minHeight}
      maxWidth={maxWidth}
    >
      <Paper
        style={modalStyle}
        className={classes.paper}
        headerText={headerText}
        topRight={topRightPos}
        topLeft={topLeftPos}
        zoom={false}
        headerContent={headerContent}
      >
        {props.children}
      </Paper>
    </StyledMuiModal>
  );
};

export default Modal;
