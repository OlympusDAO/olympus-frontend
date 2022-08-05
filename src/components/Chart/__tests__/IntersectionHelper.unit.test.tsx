import { getDataIntersections } from "src/components/Chart/IntersectionHelper";

describe("getDataIntersections", () => {
  test("two intersections", () => {
    const data = [
      {
        key1: 1.0,
        key2: 2.0,
      },
      {
        key1: 2.0,
        key2: 1.0,
      },
      {
        key1: 1.0,
        key2: 2.0,
      },
    ];

    const intersections = getDataIntersections(data, ["key1", "key2"]);

    /**
     * Data has two intersections.
     *
     * Between 0 and 1, halfway between 1.0 and 2.0
     *
     * Between 1 and 2, halfway between 2.0 and 1.0
     */
    expect(intersections[0]).toEqual({
      x: 0.5,
      y: 1.5,
      line1isHigher: false,
      line1isHigherNext: true,
    });
    expect(intersections[1]).toEqual({
      x: 1.5,
      y: 1.5,
      line1isHigher: true,
      line1isHigherNext: false,
    });
    expect(intersections.length).toEqual(2);
  });

  test("two intersections, more points", () => {
    const data = [
      {
        key1: 1.0,
        key2: 2.0,
      },
      {
        key1: 1.1,
        key2: 2.1,
      },
      {
        key1: 1.2,
        key2: 2.2,
      },
      {
        key1: 2.0,
        key2: 1.0,
      },
      {
        key1: 2.0,
        key2: 1.0,
      },
      {
        key1: 1.0,
        key2: 2.0,
      },
    ];

    const intersections = getDataIntersections(data, ["key1", "key2"]);

    /**
     * Data has two intersections.
     *
     * Between 3 and 4, halfway between 1.2 and 2.0
     *
     * Between 5 and 6, halfway between 2.0 and 1.0
     */
    expect(intersections[0]).toEqual({
      x: 2.5,
      y: 1.6,
      line1isHigher: false,
      line1isHigherNext: true,
    });
    expect(intersections[1]).toEqual({
      x: 4.5,
      y: 1.5,
      line1isHigher: true,
      line1isHigherNext: false,
    });
    expect(intersections.length).toEqual(2);
  });

  test("one intersections, line 1 higher", () => {
    const data = [
      {
        key1: 1.0,
        key2: 2.0,
      },
      {
        key1: 2.0,
        key2: 1.0,
      },
      {
        key1: 2.0,
        key2: 1.0,
      },
    ];

    const intersections = getDataIntersections(data, ["key1", "key2"]);

    /**
     * Data has one intersection.
     *
     * Between 0 and 1, halfway between 1.0 and 2.0
     */
    expect(intersections[0]).toEqual({
      x: 0.5,
      y: 1.5,
      line1isHigher: false,
      line1isHigherNext: true,
    });
    expect(intersections.length).toEqual(1);
  });

  test("no intersections", () => {
    const data = [
      {
        key1: 1.0,
        key2: 2.0,
      },
      {
        key1: 1.0,
        key2: 2.0,
      },
      {
        key1: 1.0,
        key2: 2.0,
      },
    ];

    const intersections = getDataIntersections(data, ["key1", "key2"]);

    expect(intersections.length).toEqual(0);
  });
});
