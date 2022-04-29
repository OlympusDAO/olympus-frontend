import { Handle, NodeProps, Position } from "react-flow-renderer";

export const BottomTwoHandleNode = ({ data }: NodeProps) => {
  return (
    <>
      <Handle type="target" position={Position.Top} />
      {data?.label}
      <Handle type="source" position={Position.Bottom} id="1" style={{ left: "33%" }} />
      <Handle type="source" position={Position.Bottom} id="2" style={{ left: "67%" }} />
    </>
  );
};

export const BottomThreeHandleNode = ({ data }: NodeProps) => {
  return (
    <>
      <Handle type="target" position={Position.Top} />
      {data?.label}
      <Handle type="source" position={Position.Bottom} id="1" style={{ left: "25%" }} />
      <Handle type="source" position={Position.Bottom} id="2" style={{ left: "50%" }} />
      <Handle type="source" position={Position.Bottom} id="3" style={{ left: "75%" }} />
    </>
  );
};
