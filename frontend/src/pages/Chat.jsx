import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import { api } from "../api/api";

export default function Chat() {
	const navigate = useNavigate();
	const [messages, setMessages] = useState([]);
	const [messageText, setMessageText] = useState("");
	const [loading, setLoading] = useState(true);
	const [sending, setSending] = useState(false);
	const [clearing, setClearing] = useState(false);
	const [editingMessageId, setEditingMessageId] = useState("");
	const [editingText, setEditingText] = useState("");
	const [updatingMessage, setUpdatingMessage] = useState(false);
	const [deletingMessageId, setDeletingMessageId] = useState("");
	const [status, setStatus] = useState("");
	const [isErrorStatus, setIsErrorStatus] = useState(false);
	const endOfChatRef = useRef(null);

	useEffect(() => {
		async function loadChat() {
			setLoading(true);
			setStatus("");
			setIsErrorStatus(false);
			try {
				const rows = await api.getChatMessages();
				if (!rows.length) {
					setMessages([
						{
							_id: "welcome",
							role: "assistant",
							text: "Hello there. I'm here to listen and support you today. How are you feeling?"
						}
					]);
				} else {
					setMessages(rows);
				}
				setStatus("");
			} catch (error) {
				setStatus(error.message || "Could not load chat");
				setIsErrorStatus(true);
			} finally {
				setLoading(false);
			}
		}

		loadChat();
	}, []);

	useEffect(() => {
		endOfChatRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
	}, [messages]);

	async function handleSend(text) {
		const payload = (text || messageText).trim();
		if (!payload || sending) {
			return;
		}

		setSending(true);
		setStatus("");
		setIsErrorStatus(false);
		try {
			const response = await api.sendChatMessage({ text: payload });
			setMessages((prev) => [...prev, response.userMessage, response.assistantMessage]);
			setMessageText("");
		} catch (error) {
			setStatus(error.message || "Could not send message");
			setIsErrorStatus(true);
		} finally {
			setSending(false);
		}
	}

	function startEditMessage(message) {
		if (!message?._id || message.role !== "user") {
			return;
		}
		setEditingMessageId(message._id);
		setEditingText(message.text || "");
		setStatus("");
		setIsErrorStatus(false);
	}

	function cancelEditMessage() {
		setEditingMessageId("");
		setEditingText("");
	}

	async function saveEditedMessage() {
		const text = editingText.trim();
		if (!editingMessageId || !text || updatingMessage) {
			return;
		}

		setUpdatingMessage(true);
		setStatus("");
		setIsErrorStatus(false);
		try {
			const updated = await api.updateChatMessage(editingMessageId, { text });
			setMessages((prev) => prev.map((msg) => (msg._id === editingMessageId ? updated : msg)));
			setStatus("Message updated.");
			cancelEditMessage();
		} catch (error) {
			setStatus(error.message || "Could not update message");
			setIsErrorStatus(true);
		} finally {
			setUpdatingMessage(false);
		}
	}

	async function handleDeleteMessage(id) {
		if (!id || deletingMessageId) {
			return;
		}

		setDeletingMessageId(id);
		setStatus("");
		setIsErrorStatus(false);
		try {
			await api.deleteChatMessage(id);
			setMessages((prev) => prev.filter((msg) => msg._id !== id));
			setStatus("Message deleted.");
		} catch (error) {
			setStatus(error.message || "Could not delete message");
			setIsErrorStatus(true);
		} finally {
			setDeletingMessageId("");
		}
	}

	async function handleClearHistory() {
		if (clearing) {
			return;
		}

		setClearing(true);
		setStatus("");
		setIsErrorStatus(false);
		try {
			await api.clearChatMessages();
			setMessages([
				{
					_id: "welcome",
					role: "assistant",
					text: "Conversation reset. I am here whenever you are ready to share."
				}
			]);
			setStatus("Chat history cleared.");
			setIsErrorStatus(false);
		} catch (error) {
			setStatus(error.message || "Could not clear chat history");
			setIsErrorStatus(true);
		} finally {
			setClearing(false);
		}
	}

	return (
		<main className="page chat-page">
			<section className="hero-intro">
				<h1>MindfulCare Assistant</h1>
				<p>Your empathetic space for reflection and support.</p>
			</section>

			<Card className="chat-panel">
				{status ? <p className={`status-line ${isErrorStatus ? "error" : ""}`}>{status}</p> : null}
				{loading ? <p className="status-line">Loading conversation...</p> : null}
				<div className="chat-tools">
					<button type="button" className="ghost-btn" onClick={handleClearHistory} disabled={clearing || loading}>
						{clearing ? "Clearing..." : "Clear Chat"}
					</button>
				</div>
				<div className="chat-stream">
					{messages.map((msg, idx) => {
						const isEditing = editingMessageId === msg._id;
						const canEdit = msg.role === "user" && Boolean(msg._id);
						return (
							<div key={msg._id || idx} className={`bubble ${msg.role} ${idx === 1 ? "wide" : ""}`}>
								{isEditing ? (
									<div className="bubble-edit-wrap">
										<textarea
											rows="3"
											value={editingText}
											onChange={(event) => setEditingText(event.target.value)}
										/>
										<div className="bubble-actions">
											<button type="button" className="text-btn" onClick={saveEditedMessage} disabled={updatingMessage}>
												{updatingMessage ? "Saving..." : "Save"}
											</button>
											<button type="button" className="text-btn" onClick={cancelEditMessage}>Cancel</button>
										</div>
									</div>
								) : (
									<>
										{msg.text}
										{canEdit ? (
											<div className="bubble-actions">
												<button type="button" className="text-btn" onClick={() => startEditMessage(msg)}>Edit</button>
												<button type="button" className="text-btn" onClick={() => handleDeleteMessage(msg._id)} disabled={deletingMessageId === msg._id}>
													{deletingMessageId === msg._id ? "Deleting..." : "Delete"}
												</button>
											</div>
										) : null}
									</>
								)}
							</div>
						);
					})}
					<div ref={endOfChatRef} />
				</div>

				<div className="chips">
					<button type="button" onClick={() => handleSend("I'm feeling anxious")} disabled={sending}>I'm feeling anxious</button>
					<button type="button" onClick={() => handleSend("I feel low")} disabled={sending}>I feel low</button>
					<button type="button" onClick={() => handleSend("Let's try the exercise")} disabled={sending}>Let's try the exercise</button>
					<button type="button" onClick={() => handleSend("Help me focus")} disabled={sending}>Help me focus</button>
				</div>

				<div className="chat-input-wrap">
					<input
						placeholder="Type your message..."
						value={messageText}
						onChange={(event) => setMessageText(event.target.value)}
						onKeyDown={(event) => {
							if (event.key === "Enter") {
								event.preventDefault();
								handleSend();
							}
						}}
					/>
					<button type="button" onClick={() => handleSend()} disabled={sending || loading}>
						{sending ? "..." : "Send"}
					</button>
				</div>
			</Card>

			<section className="chat-bottom">
				<Card title="Daily Insight">
					"Rest is not idleness, and to lie sometimes on the grass under trees on a summer's
					day..."
				</Card>
				<Card title="Track your progress" subtitle="See how your mood and mindfulness practices have evolved.">
					<button type="button" onClick={() => navigate("/analytics")}>View Analytics</button>
				</Card>
			</section>
		</main>
	);
}
