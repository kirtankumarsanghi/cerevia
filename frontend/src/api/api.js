const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
	const response = await fetch(`${API_BASE}${path}`, {
		headers: { "Content-Type": "application/json", ...(options.headers || {}) },
		...options
	});

	if (!response.ok) {
		const message = await response.text();
		throw new Error(message || "Request failed");
	}

	return response.json();
}

export const api = {
	getMoods: () => request("/moods"),
	saveMood: (payload) =>
		request("/moods", {
			method: "POST",
			body: JSON.stringify({ ...payload, mood: payload.mood || payload.emotion })
		}),
	getJournals: () => request("/journals"),
	saveJournal: (payload) =>
		request("/journals", { method: "POST", body: JSON.stringify(payload) }),
	getTasks: () => request("/tasks"),
	saveTask: (payload) =>
		request("/tasks", { method: "POST", body: JSON.stringify(payload) })
};
