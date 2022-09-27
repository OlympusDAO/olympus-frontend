import { prettifySecondsInDays } from "src/helpers/timeUtil";

export const BondDuration: React.VFC<{ duration: number }> = props => {
  if (props.duration === 0) return <>Instantly</>;
  return <>{prettifySecondsInDays(props.duration)}</>;
};
