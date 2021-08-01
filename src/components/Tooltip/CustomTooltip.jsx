import "./customtooltip.scss";

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

//create function to conditionally render itemType either in front 'if %' or in beginning 'if $'

//ternary to check if staked chart or not;

const renderTooltipItems = (payload, bulletpointColors, itemNames, itemType) => {
  return payload.map((item, index) => (
    <div key={index}>
      <div className="items">
        <p style={{ position: "relative" }}>
          <span className="tooltip-bulletpoint" style={bulletpointColors[index]}></span>
          {`${itemNames[index]}`}
        </p>
        <p>{`${itemType}${Math.round(item.value).toLocaleString("en-US")}`}</p>
      </div>
      <div>{renderDate(index, payload, item)}</div>
    </div>
  ));
};

function CustomTooltip({ active, payload, bulletpointColors, itemNames, itemType }) {
  if (active && payload && payload.length) {
    return (
      <div className="tooltip-container">{renderTooltipItems(payload, bulletpointColors, itemNames, itemType)}</div>
    );
  }
  return null;
}

export default CustomTooltip;
