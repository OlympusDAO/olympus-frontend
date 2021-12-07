import { Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

interface MetricProps {
  className?: string;
  label?: string;
  metric?: string;
  isLoading?: boolean;
}

const Metric = (props: MetricProps) => {
  return (
    <div className={props.className}>
      <Typography variant="h5" color="textSecondary">
        {props.label}
      </Typography>
      <Typography variant="h4">{props.isLoading ? <span>{props.metric}</span> : <Skeleton width="150px" />}</Typography>
    </div>
  );
};
export default Metric;
