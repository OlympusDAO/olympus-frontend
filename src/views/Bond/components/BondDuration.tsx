import { prettifySecondsInDays } from "src/helpers/timeUtil";

export const BondDuration: React.VFC<{ duration: number }> = props => {
  console.log(props.duration);
  return <>{prettifySecondsInDays(props.duration)}</>;
};
