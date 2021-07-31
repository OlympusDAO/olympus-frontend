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
    right: 20,
    top: -12,
    borderRadius: 10,
    background: "#49A1F2",
    margin: 10,
  },
];

const apy = ["APY"];

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
  return payload.map((item, index) => (
    <div key={index}>
      <div style={containerStyle}>
        <p style={{ position: "relative" }}>
          <div style={bulletPointsStyle[index]}></div>
          {`${apy[index]}`}
        </p>
        <p>{`${Math.round(item.value).toLocaleString("en-US")}%`}</p>
      </div>
      <div>{renderDate(index, payload, item)}</div>
    </div>
  ));
};

function LineTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return <div style={tooltipStyle}>{renderTooltipItems(payload)}</div>;
  }
  return null;
}

export default LineTooltip;
