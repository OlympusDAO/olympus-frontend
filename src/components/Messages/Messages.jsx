import { useDispatch, useSelector } from "react-redux";
import { set } from "../../slices/MessagesSlice";
import store from "../../store";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import "./messages.scss";
import "./ConsoleInterceptor.js";

// A component that displays error messages
function Messages() {
  const messages = useSelector(state => state.messages);
  return (
    <div className="messages-pane">
      {messages.items.map((message, index) => {
        return (
          <Alert icon={false} key={index} severity={message.severity}>
            <AlertTitle>{message.title}</AlertTitle>
            {message.text}
          </Alert>
        );
      })}
    </div>
  );
  return res;
}
// Deletes expired message (should be in slice file but I cannot find a way to access the store from there)
const MESSAGES_DISPLAY_DURATION = 5000;
window.setInterval(() => {
  const messages = store.getState().messages.items;
  const activeMessages = messages.filter(message => {
    return Date.now() - message.created < MESSAGES_DISPLAY_DURATION;
  });
  if (messages.length != activeMessages.length) {
    store.dispatch(set(activeMessages));
  }
}, 100);

export default Messages;
