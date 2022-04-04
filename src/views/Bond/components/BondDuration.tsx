import { Skeleton } from "@material-ui/lab";
import { prettifySecondsInDays } from "src/helpers/timeUtil";

export const BondDuration: React.VFC<{ duration?: number }> = props => {
  if (!props.duration) return <Skeleton width={60} />;

  return <>{prettifySecondsInDays(props.duration)}</>;
};
