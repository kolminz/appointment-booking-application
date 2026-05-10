import type {CalendarProps} from "./types.ts";

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

export function formatWeekdayLabel(date: string): string {
	const WEEKDAY_LABELS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	const dayIndex = new Date(`${date}T00:00:00`).getDay();
	return WEEKDAY_LABELS[dayIndex];
}

export function formatHour(hour: number): string {
	return `${hour.toString().padStart(2, "0")}:00`;
}
