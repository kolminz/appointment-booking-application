import type {Appointment} from "../../mockApi.ts";

export interface CalendarProps {
	appointments: Appointment[];
	startHour: number;
	endHour: number;
}

export interface CollapsedBlock {
	startHour: number;
	endHour: number;
}