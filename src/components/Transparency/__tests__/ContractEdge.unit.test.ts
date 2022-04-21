import { ContractEdge, getEdge, getEdges } from "../ContractEdge";

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
        },
      ]);
    });
  });
});
