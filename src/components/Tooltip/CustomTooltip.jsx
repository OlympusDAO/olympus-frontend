import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

import "./customtooltip.scss";

const useStyles = makeStyles(theme => ({
  tooltipBgColorLight: {
    background: "rgba(255, 255, 255, 0.6)",
  },
  tooltipBgColorDark: {
    background: "rgba(54, 56, 64, 0.5)",
  },
}));

const renderDate = (index, payload, item) => {
  return index === payload.length - 1 ? (
    <div className="tooltip-date">
      {new Date(item.payload.timestamp * 1000).toLocaleString("default", { month: "long" }).charAt(0).toUpperCase()}
      {new Date(item.payload.timestamp * 1000).toLocaleString("default", { month: "long" }).slice(1)}
      &nbsp;
      {new Date(item.payload.timestamp * 1000).getDate()}, {new Date(item.payload.timestamp * 1000).getFullYear()}
    </div>
  ) : (
    ""
  );
};

const renderItem = (type, item) => {
  return type === "$" ? (
    <p>{`${type}${Math.round(item).toLocaleString("en-US")}`}</p>
  ) : (
    <p>{`${Math.round(item).toLocaleString("en-US")}${type}`}</p>
  );
};

const renderTooltipItems = (payload, bulletpointColors, itemNames, itemType, isStaked = false) => {
  return isStaked ? (
    <div>
      <div className="item">
        <p style={{ position: "relative" }}>
          <span className="tooltip-bulletpoint" style={bulletpointColors[0]}></span>
          Stacked
        </p>
        <p>{`${Math.round(payload[0].value)}%`}</p>
      </div>
      <div className="item">
        <p style={{ position: "relative" }}>
          <span className="tooltip-bulletpoint" style={bulletpointColors[1]}></span>
          Not stacked
        </p>
        <p>{`${Math.round(100 - payload[0].value)}%`}</p>
      </div>
      <div>{renderDate(0, payload, payload[0])}</div>
    </div>
  ) : (
    payload.map((item, index) => (
      <div key={index}>
        <div className="item">
          <p style={{ position: "relative" }}>
            <span className="tooltip-bulletpoint" style={bulletpointColors[index]}></span>
            {`${itemNames[index]}`}
          </p>
          {renderItem(itemType, item.value)}
        </div>
        <div>{renderDate(index, payload, item)}</div>
      </div>
    ))
  );
};

function CustomTooltip({ active, payload, bulletpointColors, itemNames, itemType, isStaked }) {
  const [localTheme, setTheme] = useState(window.localStorage.getItem("theme"));
  const classes = useStyles();
  const backgroundColor = () => {
    return localTheme === "dark" ? classes.tooltipBgColorDark : classes.tooltipBgColorLight;
  };

  useEffect(() => {
    setTheme(window.localStorage.getItem("theme"));
  });

  if (active && payload && payload.length) {
    return (
      <div className={`tooltip-container ${backgroundColor()}`}>
        {renderTooltipItems(payload, bulletpointColors, itemNames, itemType, isStaked)}
      </div>
    );
  }
  return null;
}

export default CustomTooltip;
