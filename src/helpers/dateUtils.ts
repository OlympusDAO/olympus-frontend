// TODO: Move date related functions from /helpers/index.tsx here, e.g. subtractDates()
import { addSeconds as dateFnsAddSeconds, format as dateFnsFormat } from "date-fns";

export function addSeconds(date: number | Date, amount: number): Date {
  return dateFnsAddSeconds(date, amount);
}

export function format(date: number | Date, format: string): string {
  return dateFnsFormat(date, format);
}

export function nowInMilliseconds(): number {
  return Date.now();
}
