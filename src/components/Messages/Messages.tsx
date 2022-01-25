import "./ConsoleInterceptor";

import { LinearProgress, makeStyles, Snackbar } from "@material-ui/core";
import Alert, { Color } from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import { useEffect, useState } from "react";
import React from "react";
import { useDispatch } from "react-redux";

import { useAppSelector } from "../../hooks";
import { close, handle_obsolete, Message } from "../../slices/MessagesSlice";
import store from "../../store";

const useStyles = makeStyles({
  root: {
    width: "100%",
    marginTop: "10px",
  },
});

type LinearProps = {
  message: Message;
};

const Linear: React.FC<LinearProps> = ({ message }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [progress, setProgress] = useState<number>(100);

  useEffect(() => {
    const timer: number = window.setInterval(() => {
      setProgress(oldProgress => {
        if (oldProgress === 0) {
          window.clearInterval(timer);
          dispatch(close(message));
          return 0;
        }
        const diff = oldProgress - 5;
        return diff;
      });
    }, 333);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  return (
    <div className={classes.root}>
      <LinearProgress variant="determinate" value={progress} />
    </div>
  );
};

// A component that displays error messages
const Messages: React.FC = () => {
  const dispatch = useDispatch();
  const messages = useAppSelector(state => state.messages);

  // Returns a function that can closes a message
  const handleClose = (message: Message) => {
    return () => {
      dispatch(close(message));
    };
  };

  return (
    <div>
      <div>
        {messages.items.map((message: Message, index: number) => (
          <Snackbar open={message.open} key={index} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
            <Alert
              variant="filled"
              icon={false}
              severity={message.severity as Color}
              onClose={handleClose(message)}
              // NOTE (appleseed): mui includes overflow-wrap: "break-word", but word-break: "break-word" is needed for webKit browsers
              style={{ wordBreak: "break-word" }}
            >
              <AlertTitle>{message.title}</AlertTitle>
              {message.text}
              <Linear message={message} />
            </Alert>
          </Snackbar>
        ))}
      </div>
    </div>
  );
};

// Invoke repetedly obsolete messages deletion (should be in slice file but I cannot find a way to access the store from there)
window.setInterval(() => {
  store.dispatch(handle_obsolete());
}, 60000);

export default Messages;
