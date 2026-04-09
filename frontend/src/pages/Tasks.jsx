import Card from "../components/Card";

const todo = [
	"Morning Breathwork (5 mins)",
	"Hydrate with lemon water",
	"Journal: Three Gratitudes",
	"Read for 20 minutes"
];

export default function Tasks() {
	return (
		<main className="page tasks-page">
			<section className="hero-intro">
				<h1>Daily Rituals</h1>
				<p>Align your actions with your intentions. One breath at a time.</p>
			</section>

			<section className="tasks-layout">
				<Card className="todo-card" title="To-Do List" subtitle="Today">
					<ul className="todo-list">
						{todo.map((item, idx) => (
							<li key={item}>
								<input type="checkbox" defaultChecked={idx === 1} />
								<span>{item}</span>
							</li>
						))}
					</ul>
					<button className="ghost-btn" type="button">
						+ Add New Intention
					</button>
				</Card>

				<div className="stack task-right">
					<Card className="metric-card" title="Meditation" subtitle="Inner Silence Practice">
						<div className="metric">85%</div>
						<div className="bar">
							<span style={{ width: "85%" }} />
						</div>
					</Card>
					<Card className="metric-card" title="Deep Sleep" subtitle="Recovery & Dreams">
						<div className="metric">7.2h</div>
						<div className="bar">
							<span style={{ width: "72%" }} />
						</div>
					</Card>
					<Card className="tip-card quote-card" title="Mindfulness Quote">
						"The present moment is the only time over which we have dominion."
					</Card>
				</div>
			</section>
		</main>
	);
}
