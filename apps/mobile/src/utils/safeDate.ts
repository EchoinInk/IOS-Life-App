/**
 * Timezone-safe Date constructor.
 *
 * Plain `new Date("YYYY-MM-DD")` is parsed as UTC midnight, which can shift
 * to the previous day in negative timezones. `safeDate` parses date-only
 * strings in the local timezone instead. All other inputs are forwarded.
 */
const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;

export function safeDate(value: string | number | Date): Date {
  if (value instanceof Date) return new Date(value.getTime());

  if (typeof value === "string") {
    const match = DATE_ONLY.exec(value);
    if (match) {
      const [, y, m, d] = match;
      return new Date(Number(y), Number(m) - 1, Number(d));
    }
  }

  return new Date(value);
}
