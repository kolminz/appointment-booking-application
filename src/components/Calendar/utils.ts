import type {CalendarProps, EmptyBlock} from "./types.ts";

/**
 * Collects the calendar column dates for the current week view.
 *
 * Behavior:
 * - If appointments are present, it extracts all `date` values
 *   and returns them in ascending ISO date order.
 * - If there are no appointments, it returns a fixed Monday-Sunday fallback week
 *   so the calendar grid can still render with stable columns.
 *
 * @param appointments The appointment list coming from the calendar props.
 * @returns A sorted list of unique dates in `YYYY-MM-DD` format.
 */
export function collectWeekDates(appointments: CalendarProps["appointments"]): string[] {
	if (appointments.length) {
		return Array.from(new Set(appointments.map((appointment) => appointment.date))).sort((a, b) =>
			a.localeCompare(b)
		);
	} else return [
		"2025-04-07",
		"2025-04-08",
		"2025-04-09",
		"2025-04-10",
		"2025-04-11",
		"2025-04-12",
		"2025-04-13"
	];
}

/**
 * Converts an ISO date string into a human-readable weekday label.
 *
 * Behavior:
 * - Parses the provided `YYYY-MM-DD` value as local midnight (`T00:00:00`).
 * - Uses `Date#getDay()` to map the date to a weekday index (0-6).
 * - Returns the matching English weekday name from `WEEKDAY_LABELS`.
 *
 * @param date ISO calendar date in `YYYY-MM-DD` format.
 * @returns Weekday label (e.g. "Monday", "Tuesday").
 */
export function formatWeekdayLabel(date: string): string {
	const WEEKDAY_LABELS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	const dayIndex = new Date(`${date}T00:00:00`).getDay();
	return WEEKDAY_LABELS[dayIndex];
}

/**
 * Formats a numeric hour value into a two-digit clock label.
 *
 * Behavior:
 * - Converts the input number to string.
 * - Left-pads single-digit values with `0`.
 * - Appends `:00` to represent the full-hour slot.
 *
 * @param hour Hour value in 24-hour format.
 * @returns Formatted hour label in `HH:00` format.
 */
export function formatHour(hour: number): string {
	return `${hour.toString().padStart(2, "0")}:00`;
}

/**
 * Builds contiguous collapsed hour ranges from the provided calendar hours.
 *
 * Behavior:
 * - Marks each occupied hour by iterating through all appointments
 *   (`startHour` inclusive, `endHour` exclusive).
 * - Filters the `hours` input to keep only empty hours.
 * - Merges neighboring empty hours into continuous blocks, where:
 *   - `startHour` is inclusive
 *   - `endHour` is exclusive
 *
 * @param appointments Appointment list used to determine occupied hours.
 * @param hours All hour slots displayed in the calendar.
 * @returns Array of merged empty-hour blocks for collapse/expand behavior.
 */
export function buildCollapsedBlocks(appointments: CalendarProps["appointments"], hours: Array<number>): EmptyBlock[] {
	const occupiedHours = new Set<number>();

	for (const appointment of appointments) {
		for (let hour = appointment.startHour; hour < appointment.endHour; hour += 1) {
			occupiedHours.add(hour);
		}
	}

	const emptyHours = hours.filter((hour) => !occupiedHours.has(hour));
	const blocks: EmptyBlock[] = [];

	for (const hour of emptyHours) {
		const last = blocks[blocks.length - 1];
		if (!last || hour !== last.endHour) {
			blocks.push({ startHour: hour, endHour: hour + 1 });
			continue;
		}
		last.endHour = hour + 1;
	}

	return blocks;
}