import { useEffect, useMemo, useState } from "react";
import Card from "../components/Card";
import { api } from "../api/api";

function sameDay(dateA, dateB) {
	return (
		dateA.getFullYear() === dateB.getFullYear() &&
		dateA.getMonth() === dateB.getMonth() &&
		dateA.getDate() === dateB.getDate()
	);
}

export default function Tasks() {
	const [tasks, setTasks] = useState([]);
	const [newTask, setNewTask] = useState("");
	const [newCategory, setNewCategory] = useState("mindfulness");
	const [filter, setFilter] = useState("all");
	const [editingTaskId, setEditingTaskId] = useState("");
	const [editingTitle, setEditingTitle] = useState("");
	const [editingCategory, setEditingCategory] = useState("mindfulness");
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [savingEdit, setSavingEdit] = useState(false);
	const [deletingTaskId, setDeletingTaskId] = useState("");
	const [status, setStatus] = useState("");
	const [error, setError] = useState("");

	useEffect(() => {
		async function loadTasks() {
			try {
				const taskList = await api.getTasks();
				setTasks(taskList);
			} catch (loadError) {
				setError(loadError.message || "Could not load tasks");
			} finally {
				setLoading(false);
			}
		}

		loadTasks();
	}, []);

	const completionRate = useMemo(() => {
		if (!tasks.length) {
			return 0;
		}
		const done = tasks.filter((task) => task.completed).length;
		return Math.round((done / tasks.length) * 100);
	}, [tasks]);

	const filteredTasks = useMemo(() => {
		if (filter === "open") {
			return tasks.filter((task) => !task.completed);
		}
		if (filter === "completed") {
			return tasks.filter((task) => task.completed);
		}
		return tasks;
	}, [tasks, filter]);

	const metrics = useMemo(() => {
		const total = tasks.length;
		const completed = tasks.filter((task) => task.completed).length;
		const open = total - completed;
		const today = new Date();
		const completedToday = tasks.filter((task) => {
			if (!task.completed || !task.updatedAt) {
				return false;
			}
			const updatedAt = new Date(task.updatedAt);
			return !Number.isNaN(updatedAt.getTime()) && sameDay(today, updatedAt);
		}).length;

		const completionByDay = {};
		tasks.forEach((task) => {
			if (!task.completed || !task.updatedAt) {
				return;
			}
			const d = new Date(task.updatedAt);
			if (Number.isNaN(d.getTime())) {
				return;
			}
			const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
			completionByDay[key] = true;
		});

		let streak = 0;
		const cursor = new Date(today);
		while (streak < 30) {
			const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(cursor.getDate()).padStart(2, "0")}`;
			if (!completionByDay[key]) {
				break;
			}
			streak += 1;
			cursor.setDate(cursor.getDate() - 1);
		}

		const momentum = Math.round(Math.min(100, completionRate * 0.75 + Math.min(streak * 6, 25)));

		return {
			total,
			completed,
			open,
			completedToday,
			streak,
			momentum
		};
	}, [tasks, completionRate]);

	const taskInsight = useMemo(() => {
		if (!tasks.length) {
			return "Start with one tiny action today. Momentum follows clarity.";
		}
		if (completionRate >= 80) {
			return "Excellent follow-through. Keep preserving this rhythm with one priority at a time.";
		}
		if (completionRate >= 50) {
			return "Solid progress. Converting one open task now will lift your day quickly.";
		}
		return "Your list has energy but needs closure. Pick the easiest open task and finish it now.";
	}, [tasks, completionRate]);

	async function handleAddTask(event) {
		event.preventDefault();
		const title = newTask.trim();
		if (!title) {
			setError("Task title is required");
			return;
		}

		setSaving(true);
		setError("");
		setStatus("");
		try {
			const created = await api.saveTask({ title, category: newCategory });
			setTasks((prev) => [created, ...prev]);
			setNewTask("");
			setNewCategory("mindfulness");
			setStatus("Task added.");
		} catch (saveError) {
			setError(saveError.message || "Could not add task");
		} finally {
			setSaving(false);
		}
	}

	async function handleToggle(id) {
		setStatus("");
		setError("");
		try {
			const updated = await api.toggleTask(id);
			setTasks((prev) => prev.map((task) => (task._id === id ? updated : task)));
			setStatus(updated.completed ? "Task completed." : "Task reopened.");
		} catch (toggleError) {
			setError(toggleError.message || "Could not update task");
		}
	}

	function handleStartEdit(task) {
		setEditingTaskId(task._id);
		setEditingTitle(task.title || "");
		setEditingCategory(task.category || "mindfulness");
		setStatus("");
		setError("");
	}

	function handleCancelEdit() {
		setEditingTaskId("");
		setEditingTitle("");
		setEditingCategory("mindfulness");
	}

	async function handleSaveEdit() {
		const title = editingTitle.trim();
		if (!editingTaskId || !title) {
			setError("Task title is required");
			return;
		}

		setSavingEdit(true);
		setError("");
		setStatus("");
		try {
			const updated = await api.updateTask(editingTaskId, { title, category: editingCategory });
			setTasks((prev) => prev.map((task) => (task._id === editingTaskId ? updated : task)));
			setStatus("Task updated.");
			handleCancelEdit();
		} catch (updateError) {
			setError(updateError.message || "Could not update task");
		} finally {
			setSavingEdit(false);
		}
	}

	async function handleDeleteTask(id) {
		if (!id || deletingTaskId) {
			return;
		}

		setDeletingTaskId(id);
		setStatus("");
		setError("");
		try {
			await api.deleteTask(id);
			setTasks((prev) => prev.filter((task) => task._id !== id));
			setStatus("Task deleted.");
			if (editingTaskId === id) {
				handleCancelEdit();
			}
		} catch (deleteError) {
			setError(deleteError.message || "Could not delete task");
		} finally {
			setDeletingTaskId("");
		}
	}

	return (
		<main className="page tasks-page">
			<section className="hero-intro">
				<h1>Daily Rituals</h1>
				<p>Align your actions with your intentions. One breath at a time.</p>
			</section>

			<section className="tasks-layout">
				<Card className="todo-card" title="To-Do List" subtitle="Today">
					<div className="task-filters">
						<button type="button" className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>All ({tasks.length})</button>
						<button type="button" className={filter === "open" ? "active" : ""} onClick={() => setFilter("open")}>Open ({metrics.open})</button>
						<button type="button" className={filter === "completed" ? "active" : ""} onClick={() => setFilter("completed")}>Completed ({metrics.completed})</button>
					</div>
					{status ? <p className="status-line">{status}</p> : null}
					{error ? <p className="status-line error">{error}</p> : null}
					{loading ? <p className="status-line">Loading tasks...</p> : null}
					<ul className="todo-list">
						{filteredTasks.map((task) => (
							<li key={task._id} className={task.completed ? "done" : ""}>
								{editingTaskId === task._id ? (
									<div className="task-edit-wrap">
										<input type="text" value={editingTitle} onChange={(event) => setEditingTitle(event.target.value)} />
										<select value={editingCategory} onChange={(event) => setEditingCategory(event.target.value)}>
											<option value="mindfulness">Mindfulness</option>
											<option value="health">Health</option>
											<option value="study">Study</option>
											<option value="work">Work</option>
										</select>
										<div className="task-item-actions">
											<button type="button" className="text-btn" onClick={handleSaveEdit} disabled={savingEdit}>
												{savingEdit ? "Saving..." : "Save"}
											</button>
											<button type="button" className="text-btn" onClick={handleCancelEdit}>Cancel</button>
										</div>
									</div>
								) : (
									<>
										<input
											type="checkbox"
											checked={Boolean(task.completed)}
											onChange={() => handleToggle(task._id)}
										/>
										<div className="task-item-main">
											<span>{task.title}</span>
											<small>{task.category || "mindfulness"}</small>
										</div>
										<div className="task-item-actions">
											<button type="button" className="text-btn" onClick={() => handleStartEdit(task)}>Edit</button>
											<button type="button" className="text-btn" onClick={() => handleDeleteTask(task._id)} disabled={deletingTaskId === task._id}>
												{deletingTaskId === task._id ? "Deleting..." : "Delete"}
											</button>
										</div>
									</>
								)}
							</li>
						))}
						{!loading && filteredTasks.length === 0 ? (
							<li className="todo-empty">
								<span>{tasks.length ? "No tasks in this filter." : "No tasks yet. Add your first intention below."}</span>
							</li>
						) : null}
					</ul>
					<form className="add-task-form" onSubmit={handleAddTask}>
						<input
							type="text"
							placeholder="Add a new intention..."
							value={newTask}
							onChange={(event) => setNewTask(event.target.value)}
						/>
						<select value={newCategory} onChange={(event) => setNewCategory(event.target.value)}>
							<option value="mindfulness">Mindfulness</option>
							<option value="health">Health</option>
							<option value="study">Study</option>
							<option value="work">Work</option>
						</select>
						<button className="ghost-btn" type="submit" disabled={saving}>
							{saving ? "Adding..." : "+ Add New Intention"}
						</button>
					</form>
				</Card>

				<div className="stack task-right">
					<Card className="metric-card" title="Completion Rate" subtitle="Based on all tasks">
						<div className="metric">{completionRate}%</div>
						<div className="bar">
							<span style={{ width: `${completionRate}%` }} />
						</div>
					</Card>
					<Card className="metric-card" title="Momentum" subtitle={`Completed today: ${metrics.completedToday}`}>
						<div className="metric">{metrics.momentum}</div>
						<div className="bar">
							<span style={{ width: `${metrics.momentum}%` }} />
						</div>
						<p className="metric-note">Current streak: {metrics.streak} day(s)</p>
					</Card>
					<Card className="tip-card quote-card" title="Live Task Insight">
						{taskInsight}
					</Card>
				</div>
			</section>
		</main>
	);
}
