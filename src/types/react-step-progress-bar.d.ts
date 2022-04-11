// Source: https://github.com/pierreericgarcia/react-step-progress-bar/issues/20#issuecomment-1033223029
declare module "react-step-progress-bar" {
  import React from "react";

  interface ProgressBarProps {
    percent: number;
    stepPositions?: Array<number>;
    unfilledBackground?: string;
    filledBackground?: string;
    width?: number;
    height?: number;
    hasStepZero?: boolean;
    text?: string;
  }
  interface StepProps {
    children: (props: {
      accomplished: boolean;
      transitionState: string;
      index: number;
      position: number;
    }) => React.ReactNode;
    transition?: "scale" | "rotate" | "skew";
    transitionDuration?: number;
  }
  class ProgressBar extends React.Component<ProgressBarProps, any> {}
  class Step extends React.Component<StepProps, any> {}
}
