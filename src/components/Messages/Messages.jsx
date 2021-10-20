import { useDispatch, useSelector } from "react-redux";
import { close, handle_obsolete } from "../../slices/MessagesSlice";
import store from "../../store";
import { Typography, Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import "./ConsoleInterceptor.js";

// A component that displays error messages
function Messages() {
  const messages = useSelector(state => state.messages);
  const dispatch = useDispatch();
  // Returns a function that can closes a message
  const handleClose = function (message) {
    return function () {
      dispatch(close(message));
    };
  };
  return (
    <div>
      <div>
        {messages.items.map((message, index) => {
          return (
            <Snackbar open={message.open} key={index} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
              <Alert
                variant="filled"
                icon={false}
                severity={message.severity}
                onClose={handleClose(message)}
                // NOTE (appleseed): mui includes overflow-wrap: "break-word", but word-break: "break-word" is needed for webKit browsers
                style={{ wordBreak: "break-word" }}
              >
                <AlertTitle>{message.title}</AlertTitle>
                {message.text}
              </Alert>
            </Snackbar>
          );
        })}
      </div>
    </div>
  );
  return res;
}
// Invoke repetedly obsolete messages deletion (should be in slice file but I cannot find a way to access the store from there)
window.setInterval(() => {
  store.dispatch(handle_obsolete());
}, 60000);
export default Messages;
