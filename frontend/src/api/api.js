const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const USER_STORAGE_KEY = "cerevia_user";
const REQUEST_TIMEOUT_MS = 10000;

function getStoredUser() {
	try {
		const raw = localStorage.getItem(USER_STORAGE_KEY);
		return raw ? JSON.parse(raw) : null;
	} catch (_error) {
		return null;
	}
}

async function request(path, options = {}) {
	const currentUser = getStoredUser();
	const authHeaders = currentUser?._id ? { "x-user-id": currentUser._id } : {};
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

	let response;
	try {
		response = await fetch(`${API_BASE}${path}`, {
			headers: {
				"Content-Type": "application/json",
				...authHeaders,
				...(options.headers || {})
			},
			signal: controller.signal,
			...options
		});
	} catch (error) {
		if (error?.name === "AbortError") {
			throw new Error("Request timed out. Please check if backend is running.");
		}
		throw new Error("Unable to reach server. Please check your backend connection.");
	} finally {
		clearTimeout(timeout);
	}

	if (!response.ok) {
		let message = "Request failed";
		try {
			const errorPayload = await response.json();
			message = errorPayload.message || JSON.stringify(errorPayload);
		} catch (_error) {
			message = await response.text();
		}
		throw new Error(message || "Request failed");
	}

	return response.json();
}

export const api = {
	googleLogin: (payload) => request("/auth/google", { method: "POST", body: JSON.stringify(payload) }),
	getMe: () => request("/auth/me"),
	getMoods: () => request("/moods"),
	saveMood: (payload) =>
		request("/moods", {
			method: "POST",
			body: JSON.stringify({ ...payload, mood: payload.mood || payload.emotion })
		}),
	getJournals: () => request("/journals"),
	saveJournal: (payload) =>
		request("/journals", { method: "POST", body: JSON.stringify(payload) }),
	updateJournal: (id, payload) =>
		request(`/journals/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
	deleteJournal: (id) => request(`/journals/${id}`, { method: "DELETE" }),
	getTasks: () => request("/tasks"),
	saveTask: (payload) =>
		request("/tasks", { method: "POST", body: JSON.stringify(payload) }),
	updateTask: (id, payload) =>
		request(`/tasks/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
	toggleTask: (id) => request(`/tasks/${id}/toggle`, { method: "PATCH" }),
	deleteTask: (id) => request(`/tasks/${id}`, { method: "DELETE" }),
	getChatMessages: () => request("/chat"),
	clearChatMessages: () => request("/chat", { method: "DELETE" }),
	updateChatMessage: (id, payload) =>
		request(`/chat/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
	deleteChatMessage: (id) => request(`/chat/${id}`, { method: "DELETE" }),
	sendChatMessage: (payload) =>
		request("/chat", { method: "POST", body: JSON.stringify(payload) })
};
