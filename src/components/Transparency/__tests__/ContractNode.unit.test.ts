import { ContractNode, getNode, getNodes } from "../ContractNode";

describe("ContractNode", () => {
  describe("getNode", () => {
    it("should display a basic node", () => {
      const contractNode: ContractNode = {
        name: "Node 1",
        address: "0x1",
      };

      expect(getNode(contractNode)).toEqual({
        id: "0x1",
        data: { label: "Node 1" },
        position: { x: 0, y: 0 },
      });
    });

    it("should display a basic node with a specified type", () => {
      const contractNode: ContractNode = {
        name: "Node 1",
        address: "0x1",
        type: "input",
      };

      expect(getNode(contractNode)).toEqual({
        id: "0x1",
        data: { label: "Node 1" },
        position: { x: 0, y: 0 },
        type: "input",
      });
    });

    it("should support a specified background color style", () => {
      const contractNode: ContractNode = {
        name: "Node 1",
        address: "0x1",
        style: { backgroundColor: "yellow" },
      };

      expect(getNode(contractNode)).toEqual({
        id: "0x1",
        data: { label: "Node 1" },
        position: { x: 0, y: 0 },
        style: {
          backgroundColor: "yellow",
        },
      });
    });

    it("should support a specified color style", () => {
      const contractNode: ContractNode = {
        name: "Node 1",
        address: "0x1",
        style: { color: "yellow" },
      };

      expect(getNode(contractNode)).toEqual({
        id: "0x1",
        data: { label: "Node 1" },
        position: { x: 0, y: 0 },
        style: {
          color: "yellow",
        },
      });
    });
  });

  describe("getNodes", () => {
    it("should return nodes", () => {
      const contractNode: ContractNode = {
        name: "Node 1",
        address: "0x1",
      };

      expect(getNodes([contractNode])).toEqual([
        {
          id: "0x1",
          data: { label: "Node 1" },
          position: { x: 0, y: 0 },
        },
      ]);
    });
  });
});
