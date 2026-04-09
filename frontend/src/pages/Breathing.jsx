import Card from "../components/Card";

export default function Breathing() {
	return (
		<main className="page breathing-page">
			<section className="breathing-top">
				<Card className="breathing-card">
					<h1>Box Breathing</h1>
					<p>Inhale for 4 • hold for 4 • exhale for 4 • hold for 4</p>
					<div className="breath-orb">Breathe</div>
					<div className="breathing-actions">
						<button type="button">Start Session</button>
						<button className="ghost-btn" type="button">
							Reset
						</button>
					</div>
				</Card>

				<Card className="duration-card" title="Duration Select">
					<div className="duration-grid">
						<button type="button">5 min</button>
						<button type="button" className="active">
							10 min
						</button>
						<button type="button">20 min</button>
						<button type="button">30 min</button>
					</div>
					<div className="metric">42:15</div>
				</Card>
			</section>

			<Card className="grounding-card" title="5-4-3-2-1 Grounding" subtitle="Reconnect with the present moment through sensory awareness.">
				<div className="grid-five">
					<div><strong>5</strong> Things you see</div>
					<div><strong>4</strong> Things you feel</div>
					<div><strong>3</strong> Things you hear</div>
					<div><strong>2</strong> Things you smell</div>
					<div><strong>1</strong> Thing you taste</div>
				</div>
			</Card>

			<h2 className="section-title">Recommended for You</h2>

			<section className="recommended-grid">
				<Card className="rec-card morning" title="Morning Clarity Flow" subtitle="15 min" />
				<Card className="rec-card nature" title="Nature Ambience Drift" subtitle="10 min" />
				<Card className="rec-card bowl" title="Quick Calm Recharge" subtitle="5 min" />
			</section>
		</main>
	);
}
