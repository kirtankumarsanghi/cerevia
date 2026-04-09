import Card from "../components/Card";
import MoodSelector from "../components/MoodSelector";

export default function Home() {
	return (
		<main className="page home-page">
			<section className="hero-intro home-hero">
				<small className="eyebrow">The Ethereal Sanctuary</small>
				<h1>Hello, Alex</h1>
				<p>
					The morning sun is gentle today. Take a moment to settle into your
					sanctuary.
				</p>
			</section>

			<section className="home-top">
				<Card className="mood-card mood-check" title="How are you feeling right now?">
					<MoodSelector />
					<div className="trend-box">
						<strong>Weekly Trend: Ascending</strong>
						<p>Your mood has improved by 15% compared to last week.</p>
					</div>
				</Card>

				<Card className="session-card forest-card" subtitle="Guided Suggestion">
					<h2>Forest Rain Soundscape</h2>
					<p>
						A 12-minute immersive audio journey to lower cortisol and improve
						focus.
					</p>
					<div className="session-footer">
						<div className="listeners">👤👤 Listening now</div>
						<button type="button">Play Session</button>
					</div>
				</Card>
			</section>

			<section className="quick-grid">
				<Card className="quick-card" title="Start Chat" subtitle="Connect with your dedicated care companion for a quick check-in.">
					<div className="quick-icon">💬</div>
				</Card>
				<Card className="quick-card" title="New Journal" subtitle="Capture your thoughts in your private, encrypted digital diary.">
					<div className="quick-icon">☰</div>
				</Card>
				<Card className="quick-card" title="Breathing Exercise" subtitle="A simple 2-minute rhythm to reset your nervous system.">
					<div className="quick-icon">〰</div>
				</Card>
			</section>

			<section className="home-footer">
				<Card className="journey-card">
					<div className="journey-head">
						<h3>Your Journey</h3>
						<button type="button" className="history-link">View History</button>
					</div>
					<ul className="timeline">
						<li>
							<strong>Completed 'Gratitude' Reflection</strong>
							<p>I'm thankful for the quiet moments this morning.</p>
						</li>
						<li>
							<strong>Sleep Meditation: Deep Ocean</strong>
							<p>25-minute session completed successfully.</p>
						</li>
						<li>
							<strong>High Heart Rate Alert</strong>
							<p>You took a 3-minute breath break to recalibrate.</p>
						</li>
					</ul>
				</Card>

				<div className="stack right-stack">
					<Card className="vitals-card" title="Connected Vitals">
						<div className="vitals">
							<p className="vital-row">
								<span>Heart Rate</span>
								<strong>72 BPM</strong>
							</p>
							<p className="vital-row">
								<span>Sleep Quality</span>
								<strong>84%</strong>
							</p>
							<p className="vital-row">
								<span>Daily Steps</span>
								<strong>6,432</strong>
							</p>
						</div>
					</Card>
					<Card className="tip-card deep-tip" title="Pro Tip">
						Focused breathing for just 5 minutes can lower your heart rate by up
						to 10%.
					</Card>
				</div>
			</section>
		</main>
	);
}
