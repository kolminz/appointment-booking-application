import {useEffect, useState} from "react";
// External imports
import Calendar from "./components/Calendar";
import {fetchAppointments, type Appointment} from "./mockApi.ts";
// Local imports
import "./App.css";

const START_HOUR = 8;
const END_HOUR = 20;

function App() {

	// STATES
	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// HOOKS
	// Loading appointments on mount
	useEffect(() => {
		let cancelled = false;

		async function loadAppointments(): Promise<void> {
			setLoading(true);
			setError(null);
			try {
				const data = await fetchAppointments();
				if (!cancelled) {
					setAppointments(data);
				}
			} catch {
				if (!cancelled) {
					setError("Failed to load appointments.");
				}
			} finally {
				if (!cancelled) {
					setLoading(false);
				}
			}
		}

		void loadAppointments();
		return () => {
			cancelled = true;
		};
	}, []);

	// RENDER
	return (
		<div className="container">
			{error && <p className="statusMessage error">{error}</p>}
			{loading ?
				(
					<p className="statusMessage">Loading...</p>
				) : (
					<Calendar appointments={appointments} startHour={START_HOUR} endHour={END_HOUR} />
				)
			}
		</div>
	);
}

export default App