import type {Appointment} from "../../types.ts";

export interface CalendarProps {
	appointments: Appointment[];
	startHour: number;
	endHour: number;
}