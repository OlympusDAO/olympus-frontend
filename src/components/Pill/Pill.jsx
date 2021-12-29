import "./pill.scss";

function Pill({ message, style }) {
  let styles;
  if (style) styles = { borderColor: style.color, color: style.color };
  else styles = {};
  return (
    <span className="pill" style={styles}>
      {message}
    </span>
  );
}

export default Pill;
