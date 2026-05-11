import type {Appointment} from "../../mockApi.ts";

export interface CalendarProps {
	appointments: Appointment[];
	startHour: number;
	endHour: number;
}

export interface EmptyBlock {
	startHour: number;
	endHour: number;
}