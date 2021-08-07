import { useEffect, useState } from "react";
import { ReactComponent as Info } from "../../assets/icons/v1.2/info.svg";
import { SvgIcon, Tooltip } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import "./infotooltip.scss";

function InfoTooltip({ message }) {
  const [localTheme, setLocalTheme] = useState(window.localStorage.getItem("theme"));

  const bgColors = {
    light: "rgba(255, 255, 255, 0.6)",
    dark: "rgba(54, 56, 64, 0.5)",
  };

  const getCurrentTheme = () => {
    return localTheme === "dark" ? bgColors.dark : bgColors.light;
  };

  useEffect(() => {
    setLocalTheme(window.localStorage.getItem("theme"));
  }, [localTheme]); //this is not triggering because theme update is not done on this component state, so this component does not re-render;

  const StyledTooltip = withStyles(theme => ({
    tooltip: {
      display: "block",
      width: 230,
      padding: 20,
      color: `${localTheme === "dark" ? "white" : "black"}`,
      backgroundColor: `${getCurrentTheme()}`, //this here needs the refactor
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: "rgba(118, 130, 153, 0.2)",
      borderRadius: 10,
      fontStyle: "normal",
      fontSize: 12,
      fontWeight: 400,
      textAlign: "justify",
      whiteSpace: "pre-wrap",
    },
  }))(Tooltip);

  return (
    <StyledTooltip title={message}>
      <SvgIcon component={Info} color="primary" aria-label={message}></SvgIcon>
    </StyledTooltip>
  );
}

export default InfoTooltip;
