import {useMemo} from "react";
import type {Appointment} from "../../types.ts";
import type {CalendarProps} from "./types.ts";
import "./style.css";
import {collectWeekDates, formatHour, formatWeekdayLabel} from "./utils.ts";

function Calendar(props: CalendarProps) {
	const {appointments, startHour, endHour} = props;

	const hours = Array.from({ length: endHour - startHour }, (_, index) => startHour + index);

	// MEMOS
	const weekDates = useMemo(() => collectWeekDates(appointments), [appointments]);

	const appointmentsByDateAndHour = useMemo(() => {
		const map = new Map<string, Appointment>();

		for (const appointment of appointments) {
			for (let hour = appointment.startHour; hour < appointment.endHour; hour += 1) {
				map.set(`${appointment.date}-${hour}`, appointment);
			}
		}

		return map;
	}, [appointments]);

	// RENDER
	return (
		<div className="container">
			<table className="calendarTable">
				<thead>
				<tr>
					<th className="timeCol">Hour</th>
					{weekDates.map((date) => (
						<th key={date}>
							{formatWeekdayLabel(date)}
						</th>
					))}
				</tr>
				</thead>

				<tbody>
				{hours.map((hour) => {
					return (
						<tr key={`hour-${hour}`}>
							<td className="timeCell">{formatHour(hour)}</td>
							{weekDates.map((date) => {
								const appointment = appointmentsByDateAndHour.get(`${date}-${hour}`);
								return (
									<td key={`${date}-${hour}`} className="dayCell">
										{appointment ? <span className="appointmentTitle">{appointment.title}</span> : null}
									</td>
								);
							})}
						</tr>
					);
				})}
				</tbody>
			</table>
		</div>
	);
}

export default Calendar;