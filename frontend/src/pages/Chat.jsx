import Card from "../components/Card";

const messages = [
	{
		role: "assistant",
		text: "Hello there. I'm here to listen and support you today. How are you feeling?"
	},
	{
		role: "user",
		text: "I've been feeling overwhelmed with my workload lately."
	},
	{
		role: "assistant",
		text: "Would you like to try a 2-minute grounding exercise, or prefer to talk through it?"
	}
];

export default function Chat() {
	return (
		<main className="page chat-page">
			<section className="hero-intro">
				<h1>MindfulCare Assistant</h1>
				<p>Your empathetic space for reflection and support.</p>
			</section>

			<Card className="chat-panel">
				<div className="chat-stream">
					{messages.map((msg, idx) => (
						<div key={idx} className={`bubble ${msg.role} ${idx === 1 ? "wide" : ""}`}>
							{msg.text}
						</div>
					))}
				</div>

				<div className="chips">
					<button type="button">I'm feeling anxious</button>
					<button type="button">I feel low</button>
					<button type="button">Let's try the exercise</button>
					<button type="button">Help me focus</button>
				</div>

				<div className="chat-input-wrap">
					<input placeholder="Type your message..." />
					<button type="button">➤</button>
				</div>
			</Card>

			<section className="chat-bottom">
				<Card title="Daily Insight">
					"Rest is not idleness, and to lie sometimes on the grass under trees on a summer's
					day..."
				</Card>
				<Card title="Track your progress" subtitle="See how your mood and mindfulness practices have evolved.">
					<button type="button">View Analytics</button>
				</Card>
			</section>
		</main>
	);
}
