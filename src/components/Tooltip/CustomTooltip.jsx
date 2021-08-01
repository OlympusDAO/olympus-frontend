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
  if (active && payload && payload.length) {
    return (
      <div className="tooltip-container">
        {renderTooltipItems(payload, bulletpointColors, itemNames, itemType, isStaked)}
      </div>
    );
  }
  return null;
}

export default CustomTooltip;
