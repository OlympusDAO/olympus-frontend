import { Typography, TypographyTypeMap } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import InfoTooltip from "src/components/InfoTooltip/InfoTooltip";

interface MetricProps {
  className?: string;
  label?: string;
  metric?: string;
  isLoading?: boolean;
  labelVariant?: TypographyTypeMap["props"]["variant"];
  metricVariant?: TypographyTypeMap["props"]["variant"];
  tooltip?: string;
}

const Metric = (props: MetricProps) => {
  return (
    <div className={props.className}>
      <Typography variant={props.labelVariant || `h5`} color="textSecondary">
        {props.label}
        {props.tooltip && <InfoTooltip message={props.tooltip} children={undefined} />}
      </Typography>
      <Typography variant={props.metricVariant || `h4`} style={{ width: "100%" }}>
        {props.isLoading ? <Skeleton width="100%" /> : <span>{props.metric}</span>}
      </Typography>
    </div>
  );
};
export default Metric;
