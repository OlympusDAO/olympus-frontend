import { Handle, NodeProps, Position } from "react-flow-renderer";

export const BottomMultipleHandleNode = ({ data }: NodeProps) => {
  // TODO styling
  return (
    <>
      <Handle type="target" position={Position.Top} />
      {data?.label}
      <Handle type="source" position={Position.Bottom} id="1" style={{ left: 40 }} />
      <Handle type="source" position={Position.Bottom} id="2" style={{ left: 180 }} />
    </>
  );
};
