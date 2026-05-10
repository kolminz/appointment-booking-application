import {useMemo, useState} from "react";
// External imports
import type {Appointment} from "../../mockApi.ts";
// Local imports
import type {CalendarProps, CollapsedBlock} from "./types.ts";
import "./style.css";
import {buildCollapsedBlocks, collectWeekDates, formatHour, formatWeekdayLabel} from "./utils.ts";

function Calendar(props: CalendarProps) {
	const {appointments = [], startHour, endHour} = props;

	const hours = Array.from({length: endHour - startHour}, (_, index) => startHour + index);

	// STATES
	const [expandedBlocks, setExpandedBlocks] = useState<Record<string, boolean>>({});

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

	const collapsedBlocks = useMemo(() => {
		return buildCollapsedBlocks(appointments, hours)
	}, [appointments, hours]);

	const collapsedHours = useMemo(() => {
		const map = new Map<number, CollapsedBlock>();
		for (const block of collapsedBlocks) {
			for (let hour = block.startHour; hour < block.endHour; hour += 1) {
				map.set(hour, block);
			}
		}
		return map;
	}, [collapsedBlocks]);

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
					const block = collapsedHours.get(hour);
					if (block) {
						const blockKey = `${block.startHour}-${block.endHour}`;
						const isExpanded = expandedBlocks[blockKey] ?? false;
						const isStartOfBlock = block.startHour === hour;

						if (!isStartOfBlock && !isExpanded) {
							return null;
						}

						if (isStartOfBlock) {
							return (
								<tr key={blockKey} className="collapsedRow">
									<td className="timeCell">
										{formatHour(block.startHour)}
									</td>
									<td colSpan={weekDates.length}>
										<button
											type="button"
											className="expandButton"
											onClick={() => setExpandedBlocks((prev) => ({...prev, [blockKey]: !isExpanded}))}
										>
											Empty slot {formatHour(block.startHour)} - {formatHour(block.endHour)} ({isExpanded ? "open" : "close"})
										</button>
									</td>
								</tr>
							);
						}
					}

					return (
						<tr key={`hour-${hour}`}>
							<td className="timeCell">{formatHour(hour)}</td>
							{weekDates.map((date) => {
								const appointment = appointmentsByDateAndHour.get(`${date}-${hour}`);
								const isMultiHourAppointment = Boolean(appointment && appointment.endHour - appointment.startHour > 1);
								const isStartHour = Boolean(isMultiHourAppointment && appointment && hour === appointment.startHour);
								const isEndHour = Boolean(isMultiHourAppointment && appointment && hour === appointment.endHour - 1);
								const dayCellClasses = [
									"dayCell",
									isStartHour ? "appointmentStartHour" : "",
									isEndHour ? "appointmentEndHour" : "",
								].filter(Boolean).join(" ");

								return (
									<td key={`${date}-${hour}`} className={dayCellClasses}>
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