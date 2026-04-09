import Card from "../components/Card";

export default function Mood() {
	return (
		<main className="page mood-page">
			<section className="hero-intro">
				<small className="eyebrow">Personal Growth</small>
				<h1>
					Mood <em>Landscape</em>
				</h1>
				<p>Visualizing the gentle currents of your emotional journey over the past month.</p>
			</section>

			<section className="mood-layout">
				<div className="mood-left-stack">
					<Card title="How are you feeling?">
						<div className="mini-moods">
							<span>✨ Radiant</span>
							<span>🌱 Calm</span>
							<span>☁ Muted</span>
							<span>⚡ Active</span>
							<span>🌊 Flow</span>
							<span>🌙 Tired</span>
						</div>
						<textarea placeholder="A quiet morning, a warm cup of coffee..." rows="4" />
					</Card>

					<Card className="tip-card" title="Breathe into the data">
						Your consistency in logging has improved by 14% this week. Keep nurturing this
						 habit.
					</Card>
				</div>

				<div className="mood-right-stack">
					<Card className="chart-card" title="Mood Fluctuations" subtitle="Past 14 days analysis">
						<div className="chart-placeholder wave" />
					</Card>

					<div className="mood-subgrid">
						<Card title="October 2023" subtitle="Mood calendar">
							<div className="calendar-dots">• • • • • • •</div>
						</Card>
						<Card title="Mood Distribution">
							<div className="dist-row"><span>Radiant</span><strong>42%</strong></div>
							<div className="dist-row"><span>Calm</span><strong>30%</strong></div>
							<div className="dist-row"><span>Active</span><strong>18%</strong></div>
							<div className="dist-row"><span>Other</span><strong>10%</strong></div>
						</Card>
					</div>
				</div>
			</section>

			<Card className="reflection-bar" title="AI-Powered Reflection">
				We noticed you feel most radiant on Tuesdays after morning exercise. Consider
				scheduling a 5-minute breathing session at 2 PM this Thursday.
			</Card>
		</main>
	);
}
