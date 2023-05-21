import Button from "src/components/library/Button/Button";

export const PrimaryButton = (props: any) => {
  return <Button template="primary" {...props} />;
};

export const SecondaryButton = (props: any) => {
  return <Button template="secondary" {...props} />;
};

export const TertiaryButton = (props: any) => {
  return <Button template="tertiary" {...props} />;
};

export const TextButton = (props: any) => {
  return <Button template="text" {...props} />;
};
export const SuccessButton = (props: any) => {
  return <Button template="success" {...props} />;
};

export type { OHMButtonProps } from "./Button";
