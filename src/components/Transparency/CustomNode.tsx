import "./CustomNode.scss";

import { Handle, NodeProps, Position } from "react-flow-renderer";

export const BottomTwoHandleNode = ({ data }: NodeProps) => {
  return (
    <>
      <Handle type="target" position={Position.Top} />
      {data?.label}
      <Handle type="source" position={Position.Bottom} id="1" style={{ left: 40 }} />
      <Handle type="source" position={Position.Bottom} id="2" style={{ left: 180 }} />
    </>
  );
};

export const BottomThreeHandleNode = ({ data }: NodeProps) => {
  return (
    <>
      <Handle type="target" position={Position.Top} />
      {data?.label}
      <Handle type="source" position={Position.Bottom} id="1" style={{ left: 40 }} />
      <Handle type="source" position={Position.Bottom} id="2" style={{ left: 100 }} />
      <Handle type="source" position={Position.Bottom} id="3" style={{ left: 180 }} />
    </>
  );
};
