import Card from "../components/Card";

export default function Journal() {
	return (
		<main className="page journal-page">
			<section className="hero-intro">
				<div className="hero-row">
					<div>
						<h1>Daily Journal</h1>
						<p>Morning session: Tuesday, October 24</p>
					</div>
					<button type="button" className="ghost-btn history-btn">History</button>
				</div>
			</section>

			<section className="journal-layout">
				<Card className="journal-editor">
					<div className="tags">
						<span>Reflection</span>
						<span>Personal</span>
					</div>
					<textarea placeholder="What's on your mind today? Let it flow..." />
					<div className="editor-footer">
						<small>Last autosaved 2m ago • 142 words</small>
						<button type="button">Save Entry</button>
					</div>
				</Card>

				<div className="stack">
					<Card title="Thought Reframing" subtitle="Cognitive Behavioral Tool">
						<input placeholder="What happened?" />
						<input placeholder="What did you tell yourself?" />
						<div className="split-row">
							<input placeholder="Anxious" />
							<input placeholder="80%" />
						</div>
						<textarea rows="4" placeholder="Challenge the thought with evidence..." />
						<button className="full-btn" type="button">
							Store Insights
						</button>
					</Card>

					<Card className="guided-pause" title="Guided Pause" subtitle="Stuck on a thought? Take 60 seconds to reset." />
				</div>
			</section>
		</main>
	);
}
