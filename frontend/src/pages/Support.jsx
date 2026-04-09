import Card from "../components/Card";

export default function Support() {
	return (
		<main className="page support-page">
			<Card className="support-hero">
				<div>
					<small>Urgent Support Active</small>
					<h1>Take a breath. We're right here.</h1>
					<p>
						It takes courage to reach out. You are not alone, and this moment
						will pass.
					</p>
					<div className="support-actions">
						<button type="button">Call Crisis Hotline</button>
						<button type="button" className="ghost-btn">
							Text "HELP" to 741741
						</button>
					</div>
				</div>
				<div className="support-image" />
			</Card>

			<section className="support-grid">
				<Card className="hotline-card" title="National Suicide Prevention" subtitle="A free, confidential service available 24/7 in the US.">
					<h2>988</h2>
				</Card>
				<Card className="hotline-card" title="The Trevor Project" subtitle="Crisis intervention and suicide prevention for LGBTQ+ youth.">
					<h2>1-866-488-7386</h2>
				</Card>
				<Card className="hotline-card" title="Crisis Text Line" subtitle="Text with a volunteer Crisis Counselor.">
					<h2>Text HOME to 741741</h2>
				</Card>
			</section>

			<section className="support-bottom">
				<Card className="near-card" title="Help Near Me">
					<p>San Francisco, CA</p>
					<ul className="timeline">
						<li>City Hope Wellness Center - 1.2 miles</li>
						<li>Safe Space Therapy - 2.5 miles</li>
						<li>BayArea Mental Health - 3.1 miles</li>
					</ul>
				</Card>
				<Card className="map-card" title="Support Map" subtitle="Clinics, therapists, support groups nearby" />
			</section>

			<Card className="breath-prompt" title="Just breathe with us for a minute?" subtitle="A guided exercise to help lower your heart rate." />
		</main>
	);
}
