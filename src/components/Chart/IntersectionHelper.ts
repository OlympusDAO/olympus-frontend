import { getFloat } from "src/helpers/NumberHelper";

export const RANGE_KEY = "range";
const COLOR_HIGHER = "green";
const COLOR_LOWER = "#FF8585";

export const getDataWithRange = (data: Record<string, unknown>[], dataKey: string[]): Record<string, unknown>[] => {
  return data.map((value: Record<string, unknown>) => ({
    ...value,
    [RANGE_KEY]:
      value[dataKey[0]] !== undefined && value[dataKey[1]] !== undefined ? [value[dataKey[0]], value[dataKey[1]]] : [],
  }));
};

type IntersectType = {
  x?: number;
  y?: number;
  /**
   * true if line1 is currently higher than line2
   */
  line1isHigher?: boolean;
  /**
   * true if line1 will be higher than line2 after this intersection
   */
  line1isHigherNext?: boolean;
};

// line intercept math by Paul Bourke http://paulbourke.net/geometry/pointlineplane/
// Determine the intersection point of two line segments
// Return {} if the lines don't intersect
function intersect(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
  x4: number,
  y4: number,
): IntersectType {
  // Check if none of the lines are of length 0
  if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
    return {};
  }

  const denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

  // Lines are parallel
  if (denominator === 0) {
    return {};
  }

  const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
  const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

  // is the intersection along the segments
  if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
    return {};
  }

  // Return a object with the x and y coordinates of the intersection
  const x = x1 + ua * (x2 - x1);
  const y = y1 + ua * (y2 - y1);

  const line1isHigher = y1 > y3;
  const line1isHigherNext = y2 > y4;

  return { x, y, line1isHigher, line1isHigherNext };
}

export const getDataIntersections = (data: Record<string, unknown>[], dataKey: string[]): IntersectType[] => {
  // need to find intersections as points where we to change fill color
  const intersections: IntersectType[] = data
    .map((value: Record<string, unknown>, index: number) => {
      const key1 = dataKey[0];
      const key2 = dataKey[1];

      const value1 = getFloat(value[key1]);
      const value2 = getFloat(value[key2]);
      const nextValue1 = data[index + 1] && getFloat(data[index + 1][key1]);
      const nextValue2 = data[index + 1] && getFloat(data[index + 1][key2]);

      return intersect(index, value1, index + 1, nextValue1, index, value2, index + 1, nextValue2);
    })
    .filter(value => value && value.x && !isNaN(value.x));

  // filtering out segments without intersections & duplicates (in case end current 2 segments are also
  // start of 2 next segments)
  const filteredIntersections = intersections.filter(
    (d, i) => i === intersections.length - 1 || d.x !== intersections[i - 1]?.x,
  );

  return filteredIntersections;
};

/**
 * Returns the color for an area based on {isLine1Higher}.
 *
 * @param isLine1Higher
 * @returns
 */
export const getAreaColor = (isLine1Higher: boolean | undefined): string => {
  return isLine1Higher ? COLOR_HIGHER : COLOR_LOWER;
};

/**
 * Returns the color for an intersection.
 */
export const getIntersectionColor = (_intersection: IntersectType, isLast: boolean) => {
  return getAreaColor(isLast ? _intersection.line1isHigherNext : _intersection.line1isHigher);
};
