"use client";

import { useState, type FormEvent } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

export default function TaskDashboard() {
  const tasks = useQuery(api.tasks.list);

  const createTask = useMutation(api.tasks.create);
  const setCompleted = useMutation(api.tasks.setCompleted);
  const removeTask = useMutation(api.tasks.remove);

  const [title, setTitle] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function showError(err: unknown) {
    setError(err instanceof Error ? err.message : "Something went wrong");
  }

  async function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = title.trim();
    if (!trimmed || adding) return;

    setAdding(true);
    setError(null);

    try {
      await createTask({ title: trimmed });
      setTitle("");
    } catch (err) {
      showError(err);
    } finally {
      setAdding(false);
    }
  }

  async function handleToggle(id: Id<"tasks">, completed: boolean) {
    setError(null);
    try {
      await setCompleted({ id, completed });
    } catch (err) {
      showError(err);
    }
  }

  async function handleRemove(id: Id<"tasks">) {
    setError(null);
    try {
      await removeTask({ id });
    } catch (err) {
      showError(err);
    }
  }

  if (tasks === undefined) {
    return <p>Loading your tasks...</p>;
  }

  const done = tasks.filter((task) => task.completed).length;
  const percent = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">My tasks</h2>
        <span className="text-sm text-zinc-500">
          {done} / {tasks.length} completed
        </span>
      </div>

      <div className="mt-4 h-2 rounded-full bg-zinc-100">
        <div
          className="h-full rounded-full bg-emerald-500"
          style={{ width: `${percent}%` }}
        />
      </div>

      <form onSubmit={handleAdd} className="mt-7 flex gap-2">
        <input
          aria-label="New task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={120}
          placeholder="What needs to be done?"
          className="min-w-0 flex-1 rounded-lg border p-3"
        />
        <button
          type="submit"
          disabled={!title.trim() || adding}
          className="rounded-lg bg-zinc-900 px-4 text-white disabled:opacity-40"
        >
          {adding ? "Adding..." : "Add task"}
        </button>
      </form>

      {error && (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <ul className="mt-6 divide-y">
        {tasks.map((task) => (
          <li key={task._id} className="flex items-center gap-3 py-3">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={(e) => void handleToggle(task._id, e.target.checked)}
              aria-label={`Toggle ${task.title}`}
            />

            <span
              className={`min-w-0 flex-1 wrap-break-word ${
                task.completed ? "text-zinc-400 line-through" : ""
              }`}
            >
              {task.title}
            </span>

            <button
              type="button"
              onClick={() => void handleRemove(task._id)}
              className="text-sm text-red-600"
              aria-label={`Delete ${task.title}`}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {tasks.length === 0 && (
        <p className="mt-6 text-center text-zinc-500">
          No tasks yet. Add your first one!
        </p>
      )}
    </section>
  );
}
