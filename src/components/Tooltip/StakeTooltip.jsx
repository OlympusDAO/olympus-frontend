const tooltipStyle = {
  minWidth: 175,
  padding: 5,
  paddingBottom: 15,
  background: "rgba(54, 56, 64, 0.5)",
  border: "1px solid rgba(118, 130, 153, 0.2)",
  borderRadius: 10,
};

const containerStyle = {
  display: "flex",
  justifyContent: "space-between",
  paddingRight: 12,
  paddingLeft: 35,
  marginBottom: -15,
};

const dateStyle = {
  marginTop: 20,
  paddingLeft: 15,
};

const bulletPointsStyle = [
  {
    position: "absolute",
    width: 16,
    height: 16,
    right: 45,
    top: -11,
    borderRadius: 10,
    background: "linear-gradient(180deg, #55EBC7 -10%, rgba(71, 172, 235, 0) 100%)",
    margin: 10,
  },
  {
    position: "absolute",
    width: 16,
    height: 16,
    right: 68,
    top: -12,
    borderRadius: 10,
    background: "rgba(151, 196, 224, 0.2)",
    margin: 10,
  },
  {
    position: "absolute",
    width: 16,
    height: 16,
    right: 29,
    top: -12,
    borderRadius: 10,
    background: "linear-gradient(180deg, #DC30EB -10%, #EA98F1 100%)",
    margin: 10,
  },
];

const renderDate = (index, payload, item) => {
  return index === payload.length - 1 ? (
    <div style={dateStyle}>
      {new Date(item.payload.timestamp * 1000).toLocaleString("default", { month: "long" }).charAt(0).toUpperCase()}
      {new Date(item.payload.timestamp * 1000).toLocaleString("default", { month: "long" }).slice(1)}
      &nbsp;
      {new Date(item.payload.timestamp * 1000).getDate()}, {new Date(item.payload.timestamp * 1000).getFullYear()}
    </div>
  ) : (
    ""
  );
};

const renderTooltipItems = payload => {
  return (
    <div>
      <div style={containerStyle}>
        <p style={{ position: "relative" }}>
          <div style={bulletPointsStyle[0]}></div>
          Stacked
        </p>
        <p>{`${Math.round(payload[0].value)}%`}</p>
      </div>
      <div style={containerStyle}>
        <p style={{ position: "relative" }}>
          <div style={bulletPointsStyle[1]}></div>
          Not stacked
        </p>
        <p>{`${Math.round(100 - payload[0].value)}%`}</p>
      </div>
      <div>{renderDate(0, payload, payload[0])}</div>
    </div>
  );
};

function StakeTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return <div style={tooltipStyle}>{renderTooltipItems(payload)}</div>;
  }
  return null;
}

export default StakeTooltip;
