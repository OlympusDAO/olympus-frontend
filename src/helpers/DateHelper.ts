export const adjustDateByDays = (date: Date, days: number): Date => {
  const newDate = new Date(date.getTime());
  newDate.setTime(newDate.getTime() + 1000 * 60 * 60 * 24 * days);

  return newDate;
};

export const getISO8601String = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

export const dateGreaterThan = (one: string, two: string): boolean => {
  return new Date(one).getTime() > new Date(two).getTime();
};
