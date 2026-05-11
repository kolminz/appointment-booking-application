import {useMemo, useState} from "react";
// External imports
import type {Appointment} from "../../mockApi.ts";
// Local imports
import type {CalendarProps, EmptyBlock} from "./types.ts";
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
		// example: {"2025-04-07-9" => AppointmentObject}
	}, [appointments]);

	const emptyBlocks = useMemo(() => {
		return buildCollapsedBlocks(appointments, hours)
		// example: {startHour: 8, endHour: 9}
	}, [appointments, hours]);

	const emptyHours = useMemo(() => {
		const map = new Map<number, EmptyBlock>();
		for (const block of emptyBlocks) {
			for (let hour = block.startHour; hour < block.endHour; hour += 1) {
				map.set(hour, block);
			}
		}
		return map;
		// example: {8 => EmptyBlock Object}
	}, [emptyBlocks]);

	// RENDER
	return (
		<div className="container">
			<div className="calendarLayout">
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
						const block = emptyHours.get(hour);
						if (block) {
							const blockKey = `${block.startHour}-${block.endHour}`;
							const isExpanded = expandedBlocks[blockKey] ?? false;
							if (!isExpanded) {
								if (hour === block.startHour) {
									return (
										<tr key={`collapsed-indicator-${blockKey}`} className="collapsedIndicatorRow">
											<td colSpan={weekDates.length + 1}>
												<span className="collapsedIndicatorLine" />
											</td>
										</tr>
									);
								}
								return null;
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

				<div className="collapseButtons" aria-label="Collapsed empty slots controls">
					{emptyBlocks.map((block) => {
						const blockKey = `${block.startHour}-${block.endHour}`;
						const isExpanded = expandedBlocks[blockKey] ?? false;
						return (
							<button
								key={blockKey}
								type="button"
								className="expandButton"
								onClick={() => setExpandedBlocks((prev) => ({...prev, [blockKey]: !isExpanded}))}
								aria-pressed={isExpanded}
								title={`${isExpanded ? "Hide" : "Show"} ${formatHour(block.startHour)} - ${formatHour(block.endHour)}`}
							>
								<span className="pinLabel">
									{formatHour(block.startHour)} - {formatHour(block.endHour)}
								</span>
							</button>
						);
					})}
				</div>
			</div>
		</div>
	);
}

export default Calendar;