import { useEffect, useMemo, useState } from "react";
import Card from "../components/Card";
import { api } from "../api/api";

export default function Journal() {
	const [title, setTitle] = useState("Daily Reflection");
	const [content, setContent] = useState("");
	const [entries, setEntries] = useState([]);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [deletingId, setDeletingId] = useState("");
	const [editingEntryId, setEditingEntryId] = useState("");
	const [showHistory, setShowHistory] = useState(false);
	const [eventText, setEventText] = useState("");
	const [selfTalk, setSelfTalk] = useState("");
	const [emotion, setEmotion] = useState("Anxious");
	const [intensity, setIntensity] = useState("80%");
	const [reframe, setReframe] = useState("");
	const [storingInsight, setStoringInsight] = useState(false);
	const [status, setStatus] = useState("");

	useEffect(() => {
		async function loadEntries() {
			setLoading(true);
			try {
				const journalEntries = await api.getJournals();
				setEntries(journalEntries);
			} catch (error) {
				setStatus(error.message || "Could not load journal entries");
			} finally {
				setLoading(false);
			}
		}

		loadEntries();
	}, []);

	const wordCount = useMemo(() => {
		const trimmed = content.trim();
		return trimmed ? trimmed.split(/\s+/).length : 0;
	}, [content]);

	async function handleSave() {
		const trimmed = content.trim();
		if (!trimmed) {
			setStatus("Please write something before saving.");
			return;
		}

		setSaving(true);
		setStatus("");
		try {
			const payload = {
				title: (title || "Daily Reflection").trim() || "Daily Reflection",
				content: trimmed,
				tags: ["Reflection", "Personal"]
			};

			if (editingEntryId) {
				const updated = await api.updateJournal(editingEntryId, payload);
				setEntries((prev) => prev.map((entry) => (entry._id === editingEntryId ? updated : entry)));
				setStatus("Entry updated.");
				setEditingEntryId("");
			} else {
				const created = await api.saveJournal(payload);
				setEntries((prev) => [created, ...prev]);
				setStatus("Entry saved.");
			}
			setTitle("Daily Reflection");
			setContent("");
		} catch (error) {
			setStatus(error.message || "Could not save journal entry");
		} finally {
			setSaving(false);
		}
	}

	async function handleDelete(id) {
		if (!id || deletingId) {
			return;
		}

		setDeletingId(id);
		setStatus("");
		try {
			await api.deleteJournal(id);
			setEntries((prev) => prev.filter((entry) => entry._id !== id));
			if (editingEntryId === id) {
				setEditingEntryId("");
				setTitle("Daily Reflection");
				setContent("");
			}
			setStatus("Entry deleted.");
		} catch (error) {
			setStatus(error.message || "Could not delete journal entry");
		} finally {
			setDeletingId("");
		}
	}

	function handleStartEdit(entry) {
		if (!entry?._id) {
			return;
		}
		setEditingEntryId(entry._id);
		setTitle(entry.title || "Daily Reflection");
		setContent(entry.content || "");
		setStatus("Editing selected entry.");
		setShowHistory(true);
	}

	function handleCancelEdit() {
		setEditingEntryId("");
		setTitle("Daily Reflection");
		setContent("");
		setStatus("Edit cancelled.");
	}

	async function handleStoreInsight() {
		const insightContent = [
			`Situation: ${eventText.trim() || "Not provided"}`,
			`Automatic thought: ${selfTalk.trim() || "Not provided"}`,
			`Emotion: ${emotion.trim() || "Not provided"}`,
			`Intensity: ${intensity.trim() || "Not provided"}`,
			`Reframe: ${reframe.trim() || "Not provided"}`
		].join("\n");

		setStoringInsight(true);
		setStatus("");
		try {
			const created = await api.saveJournal({
				title: "Thought Reframing",
				content: insightContent,
				tags: ["CBT", "Reframing"]
			});
			setEntries((prev) => [created, ...prev]);
			setShowHistory(true);
			setStatus("Reframing insight stored.");
			setEventText("");
			setSelfTalk("");
			setEmotion("Anxious");
			setIntensity("80%");
			setReframe("");
		} catch (error) {
			setStatus(error.message || "Could not store insight");
		} finally {
			setStoringInsight(false);
		}
	}

	function formatEntryDate(value) {
		const date = new Date(value);
		if (Number.isNaN(date.getTime())) {
			return "Unknown time";
		}
		return date.toLocaleString(undefined, {
			month: "short",
			day: "numeric",
			hour: "numeric",
			minute: "2-digit"
		});
	}

	return (
		<main className="page journal-page">
			<section className="hero-intro">
				<div className="hero-row">
					<div>
						<h1>Daily Journal</h1>
						<p>{new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}</p>
					</div>
					<button
						type="button"
						className="ghost-btn history-btn"
						onClick={() => setShowHistory((prev) => !prev)}
					>
						{showHistory ? "Hide History" : "History"}
					</button>
				</div>
			</section>

			<section className="journal-layout">
				<Card className="journal-editor">
					<div className="tags">
						<span>Reflection</span>
						<span>Personal</span>
					</div>
					<input
						className="journal-title-input"
						placeholder="Entry title"
						value={title}
						onChange={(event) => setTitle(event.target.value)}
					/>
					<textarea
						placeholder="What's on your mind today? Let it flow..."
						value={content}
						onChange={(event) => setContent(event.target.value)}
					/>
					<div className="editor-footer">
						<small>{status || `Draft • ${wordCount} words`}</small>
						<div className="editor-actions">
							<button type="button" onClick={handleSave} disabled={saving}>
								{saving ? "Saving..." : editingEntryId ? "Update Entry" : "Save Entry"}
							</button>
							{editingEntryId ? (
								<button type="button" className="ghost-btn" onClick={handleCancelEdit}>
									Cancel Edit
								</button>
							) : null}
						</div>
					</div>
					{loading ? <p className="status-line">Loading journal history...</p> : null}
					{showHistory ? (
						<ul className="journal-history">
							{entries.slice(0, 5).map((entry) => (
								<li key={entry._id}>
									<div className="journal-item-head">
										<strong>{entry.title || "Daily Reflection"}</strong>
										<div className="journal-item-actions">
											<button type="button" className="text-btn" onClick={() => handleStartEdit(entry)}>
												Edit
											</button>
											<button type="button" className="text-btn" onClick={() => handleDelete(entry._id)} disabled={deletingId === entry._id}>
												{deletingId === entry._id ? "Deleting..." : "Delete"}
											</button>
										</div>
									</div>
									<small>{formatEntryDate(entry.createdAt)}</small>
									<p>{entry.content}</p>
								</li>
							))}
							{entries.length === 0 ? <li>No saved entries yet.</li> : null}
						</ul>
					) : null}
				</Card>

				<div className="stack">
					<Card title="Thought Reframing" subtitle="Cognitive Behavioral Tool">
						<input placeholder="What happened?" value={eventText} onChange={(event) => setEventText(event.target.value)} />
						<input placeholder="What did you tell yourself?" value={selfTalk} onChange={(event) => setSelfTalk(event.target.value)} />
						<div className="split-row">
							<input placeholder="Anxious" value={emotion} onChange={(event) => setEmotion(event.target.value)} />
							<input placeholder="80%" value={intensity} onChange={(event) => setIntensity(event.target.value)} />
						</div>
						<textarea rows="4" placeholder="Challenge the thought with evidence..." value={reframe} onChange={(event) => setReframe(event.target.value)} />
						<button className="full-btn" type="button" onClick={handleStoreInsight} disabled={storingInsight}>
							{storingInsight ? "Storing..." : "Store Insights"}
						</button>
					</Card>

					<Card className="guided-pause" title="Guided Pause" subtitle="Stuck on a thought? Take 60 seconds to reset." />
				</div>
			</section>
		</main>
	);
}
