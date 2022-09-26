import "src/components/Messages/ConsoleInterceptor";

import { Snackbar } from "@mui/material";
import Alert from "@mui/material/Alert";
import { Icon } from "@olympusdao/component-library";
import { useState } from "react";
import { resolveValue } from "react-hot-toast";

// A component that displays error messages
const Messages = ({ toast }: { toast: any }) => {
  const [dismiss, setDismiss] = useState(false);

  return (
    <Snackbar open={dismiss ? false : toast.visible} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
      <Alert
        variant="filled"
        severity={toast.type === "blank" ? "info" : toast.type}
        // NOTE (appleseed): mui includes overflow-wrap: "break-word", but word-break: "break-word" is needed for webKit browsers
        style={{ wordBreak: "break-word" }}
        sx={{ borderRadius: "9px", fontSize: "15px", fontWeight: 450, lineHeight: "24px", alignItems: "center" }}
        onClose={() => setDismiss(true)}
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
    </Snackbar>
  );
};

export default Messages;
