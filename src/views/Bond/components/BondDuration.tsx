import { prettifySecondsInDays } from "src/helpers/timeUtil";

export const BondDuration: React.VFC<{ duration: number }> = props => {
  return <>{prettifySecondsInDays(props.duration)}</>;
};
