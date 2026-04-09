import { useMemo, useState } from "react";
import Card from "../components/Card";

const indiaHelplines = [
	{
		name: "Tele-MANAS",
		number: "14416",
		description: "National 24x7 tele-mental health support line by Government of India.",
		availability: "24x7"
	},
	{
		name: "KIRAN Mental Health Helpline",
		number: "1800-599-0019",
		description: "National toll-free mental health rehabilitation helpline.",
		availability: "24x7"
	},
	{
		name: "AASRA Suicide Prevention",
		number: "+91-22-27546669",
		description: "Emotional support and suicide prevention helpline.",
		availability: "24x7"
	},
	{
		name: "iCall Psychosocial Helpline",
		number: "+91-9152987821",
		description: "Professional counseling support from trained mental health experts.",
		availability: "Mon-Sat"
	}
];

const cityResources = {
	"New Delhi": [
		{ name: "VIMHANS Hospital", area: "Nehru Nagar", phone: "+91-11-29849090" },
		{ name: "IHBAS", area: "Dilshad Garden", phone: "+91-11-22597777" },
		{ name: "Fortis Stress Helpline", area: "Delhi NCR", phone: "+91-8376804102" }
	],
	Mumbai: [
		{ name: "KEM Psychiatry OPD", area: "Parel", phone: "+91-22-24107000" },
		{ name: "Sion Hospital Psychiatry", area: "Sion", phone: "+91-22-24076381" },
		{ name: "Mpower 1on1", area: "Bandra", phone: "+91-22-69336666" }
	],
	Bengaluru: [
		{ name: "NIMHANS", area: "Hosur Road", phone: "+91-80-26995000" },
		{ name: "Cadabams Hospitals", area: "JP Nagar", phone: "+91-80-26005547" },
		{ name: "Arogya Sahayavani", area: "Karnataka", phone: "104" }
	],
	Chennai: [
		{ name: "SCARF India", area: "Anna Nagar", phone: "+91-44-26284396" },
		{ name: "Institute of Mental Health", area: "Kilpauk", phone: "+91-44-26412960" },
		{ name: "Sneha Foundation", area: "Chennai", phone: "+91-44-24640050" }
	],
	Kolkata: [
		{ name: "Lifeline Foundation", area: "Kolkata", phone: "+91-33-40447437" },
		{ name: "Pavlov Hospital", area: "Kolkata", phone: "+91-33-24562009" },
		{ name: "Antara Psychiatric Centre", area: "Kolkata", phone: "+91-33-66187000" }
	],
	Hyderabad: [
		{ name: "Asha Hospital", area: "Banjara Hills", phone: "+91-40-23393788" },
		{ name: "Erragadda Mental Health Institute", area: "Erragadda", phone: "+91-40-23814447" },
		{ name: "Roshni Counselling", area: "Hyderabad", phone: "+91-40-66202000" }
	],
	Pune: [
		{ name: "Mpower Pune", area: "Pune", phone: "+91-22-69336666" },
		{ name: "Sancheti Mood Clinic", area: "Shivajinagar", phone: "+91-20-25532284" },
		{ name: "Connecting NGO", area: "Pune", phone: "+91-9922001122" }
	]
};

export default function Support() {
	const [selectedCity, setSelectedCity] = useState("New Delhi");
	const resources = useMemo(() => cityResources[selectedCity] || [], [selectedCity]);

	return (
		<main className="page support-page">
			<Card className="support-hero">
				<div>
					<small>India Mental Health Support</small>
					<h1>Take a breath. We're right here.</h1>
					<p>
						If you are in distress, immediate support is available in India. You do not
						have to handle this alone.
					</p>
					<div className="support-actions">
						<a className="support-link-btn" href="tel:14416">Call Tele-MANAS 14416</a>
						<a className="support-link-btn ghost-btn" href="tel:112">
							Call Emergency 112
						</a>
					</div>
					<p className="support-note">
						For life-threatening situations, call <strong>112</strong> immediately.
					</p>
				</div>
				<div className="support-image" />
			</Card>

			<section className="support-grid">
				{indiaHelplines.map((line) => (
					<Card key={line.name} className="hotline-card" title={line.name} subtitle={line.description}>
						<h2>{line.number}</h2>
						<p className="hotline-meta">Availability: {line.availability}</p>
						<a className="support-link-btn hotline-call-btn" href={`tel:${line.number.replace(/[^+\d]/g, "")}`}>
							Call Now
						</a>
					</Card>
				))}
			</section>

			<section className="support-bottom">
				<Card className="near-card" title="Help Near Me">
					<div className="support-city-head">
						<p>{selectedCity}</p>
						<select
							className="support-city-select"
							value={selectedCity}
							onChange={(event) => setSelectedCity(event.target.value)}
						>
							{Object.keys(cityResources).map((city) => (
								<option key={city} value={city}>{city}</option>
							))}
						</select>
					</div>
					<ul className="timeline resource-list">
						{resources.map((item) => (
							<li key={`${item.name}-${item.phone}`} className="resource-item">
								<strong>{item.name}</strong>
								<p>{item.area}</p>
								<a href={`tel:${item.phone.replace(/[^+\d]/g, "")}`}>{item.phone}</a>
							</li>
						))}
					</ul>
				</Card>
				<Card className="map-card" title="Support Map" subtitle="Clinics, therapists, support groups nearby">
					<a
						className="support-link-btn"
						href={`https://www.google.com/maps/search/mental+health+support+in+${encodeURIComponent(selectedCity)}`}
						target="_blank"
						rel="noreferrer"
					>
						Open {selectedCity} Support Map
					</a>
					<p className="support-note">Data is informational and may change. Please verify before visiting.</p>
				</Card>
			</section>

			<Card className="breath-prompt" title="Immediate Calm Protocol" subtitle="Try this while waiting for support.">
				<p>
					Inhale for 4 seconds, hold for 4, exhale for 6. Repeat for 2 minutes,
					then call a helpline if distress remains high.
				</p>
			</Card>
		</main>
	);
}
