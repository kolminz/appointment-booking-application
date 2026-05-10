import type {Appointment} from "../../types.ts";

export function collectWeekDates(appointments: Appointment[]): string[] {
	return Array.from(new Set(appointments.map((appointment) => appointment.date))).sort((a, b) =>
		a.localeCompare(b)
	);
}

export function formatWeekdayLabel(date: string): string {
	const WEEKDAY_LABELS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	const dayIndex = new Date(`${date}T00:00:00`).getDay()+1;
	console.log(`${dayIndex} - ${date}`);
	return WEEKDAY_LABELS[dayIndex];
}

export function formatHour(hour: number): string {
	return `${hour.toString().padStart(2, "0")}:00`;
}
