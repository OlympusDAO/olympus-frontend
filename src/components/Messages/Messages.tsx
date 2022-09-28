import Alert from "@mui/material/Alert";
import { Icon } from "@olympusdao/component-library";
import { resolveValue, toast as hotToast } from "react-hot-toast";

// A component that displays error messages
const Messages = ({ toast }: { toast: any }) => {
  return (
    <Alert
      variant="filled"
      severity={toast.type === "blank" ? "info" : toast.type}
      // NOTE (appleseed): mui includes overflow-wrap: "break-word", but word-break: "break-word" is needed for webKit browsers
      style={{ wordBreak: "break-word" }}
      sx={{
        maxWidth: "650px",
        borderRadius: "9px",
        fontSize: "15px",
        fontWeight: 450,
        lineHeight: "24px",
        "& .MuiAlert-message": { display: "flex", alignItems: "center", padding: "0px" },
        // "& .MuiAlert-icon": { paddingTop: "10px" },
      }}
      action={
        <Icon
          name="x"
          sx={{ fontSize: "20px", cursor: "pointer", paddingTop: "5px" }}
          onClick={() => {
            hotToast.dismiss(toast.id);
          }}
        />
      }
      iconMapping={{
        success: <Icon name="check-circle" sx={{ fontSize: "18px" }} />,
        error: <Icon name="alert-circle" sx={{ fontSize: "18px" }} />,
        warning: <Icon name="alert-circle" sx={{ fontSize: "18px" }} />,
        info: <Icon name="info" sx={{ fontSize: "18px" }} />,
      }}
      elevation={12}
    >
      {resolveValue(toast.message, toast)}
    </Alert>
  );
};

export default Messages;
