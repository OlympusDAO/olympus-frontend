import { ContractEdge, getEdge, getEdges } from "../ContractEdge";

const baseEdgeProps = {
  labelBgPadding: [10, 4],
  labelBgBorderRadius: 4,
};

describe("ContractEdge", () => {
  describe("getEdge", () => {
    it("should display a basic edge", () => {
      const contractEdge: ContractEdge = {
        source: "0x0",
        target: "0x1",
      };

      expect(getEdge(contractEdge)).toEqual({
        id: "0x0-0x1",
        source: "0x0",
        target: "0x1",
        ...baseEdgeProps,
      });
    });

    it("should animate", () => {
      const contractEdge: ContractEdge = {
        source: "0x0",
        target: "0x1",
        animated: true,
      };

      expect(getEdge(contractEdge)).toEqual({
        id: "0x0-0x1",
        source: "0x0",
        target: "0x1",
        animated: true,
        ...baseEdgeProps,
      });
    });

    it("should display a basic edge with a specified type", () => {
      const contractEdge: ContractEdge = {
        source: "0x0",
        target: "0x1",
        type: "step",
      };

      expect(getEdge(contractEdge)).toEqual({
        id: "0x0-0x1",
        source: "0x0",
        target: "0x1",
        type: "step",
        ...baseEdgeProps,
      });
    });

    it("should display a basic edge with a specified label", () => {
      const contractEdge: ContractEdge = {
        source: "0x0",
        target: "0x1",
        label: "yay",
      };

      expect(getEdge(contractEdge)).toEqual({
        id: "0x0-0x1",
        source: "0x0",
        target: "0x1",
        label: "yay",
        ...baseEdgeProps,
      });
    });

    it("should use sourceHandle", () => {
      const contractEdge: ContractEdge = {
        source: "0x0",
        target: "0x1",
        sourceHandle: "yay",
      };

      expect(getEdge(contractEdge)).toEqual({
        id: "0x0-0x1",
        source: "0x0",
        target: "0x1",
        sourceHandle: "yay",
        ...baseEdgeProps,
      });
    });

    it("should use targetHandle", () => {
      const contractEdge: ContractEdge = {
        source: "0x0",
        target: "0x1",
        targetHandle: "yay",
      };

      expect(getEdge(contractEdge)).toEqual({
        id: "0x0-0x1",
        source: "0x0",
        target: "0x1",
        targetHandle: "yay",
        ...baseEdgeProps,
      });
    });

    it("should add x offset", () => {
      const contractEdge: ContractEdge = {
        source: "0x0",
        target: "0x1",
        labelOffsetX: "-20px",
      };

      expect(getEdge(contractEdge)).toEqual({
        id: "0x0-0x1",
        source: "0x0",
        target: "0x1",
        labelStyle: {
          transform: "translateX(-20px)",
        },
        labelBgStyle: {
          transform: "translateX(-20px)",
        },
        ...baseEdgeProps,
      });
    });

    it("should add y offset", () => {
      const contractEdge: ContractEdge = {
        source: "0x0",
        target: "0x1",
        labelOffsetY: "-20px",
      };

      expect(getEdge(contractEdge)).toEqual({
        id: "0x0-0x1",
        source: "0x0",
        target: "0x1",
        labelStyle: {
          transform: "translateY(-20px)",
        },
        labelBgStyle: {
          transform: "translateY(-20px)",
        },
        ...baseEdgeProps,
      });
    });

    it("should add x and y offset", () => {
      const contractEdge: ContractEdge = {
        source: "0x0",
        target: "0x1",
        labelOffsetX: "-10px",
        labelOffsetY: "-20px",
      };

      expect(getEdge(contractEdge)).toEqual({
        id: "0x0-0x1",
        source: "0x0",
        target: "0x1",
        labelStyle: {
          transform: "translateX(-10px) translateY(-20px)",
        },
        labelBgStyle: {
          transform: "translateX(-10px) translateY(-20px)",
        },
        ...baseEdgeProps,
      });
    });

    it("should support a specified background color style", () => {
      const contractEdge: ContractEdge = {
        source: "0x0",
        target: "0x1",
        style: { backgroundColor: "yellow" },
      };

      expect(getEdge(contractEdge)).toEqual({
        id: "0x0-0x1",
        source: "0x0",
        target: "0x1",
        style: {
          backgroundColor: "yellow",
        },
        ...baseEdgeProps,
      });
    });

    it("should support a specified color style", () => {
      const contractEdge: ContractEdge = {
        source: "0x0",
        target: "0x1",
        style: { color: "yellow" },
      };

      expect(getEdge(contractEdge)).toEqual({
        id: "0x0-0x1",
        source: "0x0",
        target: "0x1",
        style: {
          color: "yellow",
        },
        ...baseEdgeProps,
      });
    });
  });

  describe("getEdges", () => {
    it("should return edges", () => {
      const contractEdge: ContractEdge = {
        source: "0x0",
        target: "0x1",
      };

      expect(getEdges([contractEdge])).toEqual([
        {
          id: "0x0-0x1",
          source: "0x0",
          target: "0x1",
          ...baseEdgeProps,
        },
      ]);
    });
  });
});
