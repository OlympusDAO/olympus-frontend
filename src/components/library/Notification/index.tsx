import Notification from "src/components/library/Notification/Notification";

export const DefaultNotification = (props: any) => {
  return <Notification template="default" {...props} />;
};

export const SuccessNotification = (props: any) => {
  return <Notification template="success" {...props} />;
};

export const ErrorNotification = (props: any) => {
  return <Notification template="error" {...props} />;
};

export const InfoNotification = (props: any) => {
  return <Notification template="info" {...props} />;
};
export const WarningNotification = (props: any) => {
  return <Notification template="warning" {...props} />;
};

export default DefaultNotification;
export type { OHMNotificationProps } from "./Notification";
