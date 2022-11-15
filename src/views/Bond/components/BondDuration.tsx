import { prettifySecondsInDays } from "src/helpers/timeUtil";

export const BondDuration: React.VFC<{ duration: number }> = props => {
  return <>{props.duration === 0 ? "Instantly" : prettifySecondsInDays(props.duration)}</>;
};
