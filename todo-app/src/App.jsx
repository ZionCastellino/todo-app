// =======================
// IMPORTS
// =======================
import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Task from "./Task";

// =======================
// COMPONENT
// =======================
export default function App() {

  // =======================
  // STATE
  // =======================
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState("");
  const [filter, setFilter] = useState("all");
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  // =======================
  // MOUSE BACKGROUND EFFECT
  // =======================
  useEffect(() => {
    const handleMove = (e) => {
      setMouse({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  // =======================
  // TASK STATE
  // =======================
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved
      ? JSON.parse(saved)
      : [];
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // =======================
  // DRAG LOGIC
  // =======================
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setTasks((prev) => {
      const oldIndex = prev.findIndex((t) => t.id === active.id);
      const newIndex = prev.findIndex((t) => t.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  // =======================
  // ACTIONS
  // =======================
  const addTask = (e) => {
    e.preventDefault();
    if (!task.trim()) return;
    if (!priority) return;

    setTasks((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: task,
        completed: false,
        priority,
      },
    ]);

    setTask("");
    setPriority("low");
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const clearCompleted = () => {
    setTasks((prev) => prev.filter((t) => !t.completed));
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  // =======================
  // EDIT TASK
  // =======================
  const editTask = (id, newText, newPriority) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, text: newText, priority: newPriority }
          : t
      )
    );
  };

  // =======================
  // STATS CALCULATION
  // =======================
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const active = total - completed;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  // =======================
  // UI
  // =======================
  return (
    <div className="relative min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-4">

      {/* BACKGROUND */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: `
            radial-gradient(600px at ${mouse.x}px ${mouse.y}px, rgba(168,85,247,0.15), transparent 80%),
            radial-gradient(800px at 20% 20%, rgba(255,0,150,0.1), transparent 60%)
          `,
        }}
      />

      {/* MAIN CARD */}
      <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">

        {/* HERO SECTION */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold">
            Organize your{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text italic">
              work & life
            </span>
          </h1>
          <p className="text-neutral-400 mt-2 text-sm">
            Plan, track and complete your tasks easily.
          </p>
        </div>

        {/* ======================= */}
        {/* STATS SECTION */}
        {/* ======================= */}
        <div className="grid grid-cols-4 gap-2 mb-4 text-center">

          <div className="bg-white/5 border border-white/10 rounded-lg p-2">
            <p className="text-xs text-neutral-400">Total</p>
            <p className="font-semibold">{total}</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-2">
            <p className="text-xs text-neutral-400">Done</p>
            <p className="font-semibold text-green-400">{completed}</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-2">
            <p className="text-xs text-neutral-400">Active</p>
            <p className="font-semibold text-yellow-400">{active}</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-2">
            <p className="text-xs text-neutral-400">Progress</p>
            <p className="font-semibold text-purple-400">{percent}%</p>
          </div>

        </div>

        {/* PROGRESS BAR */}
        <div className="w-full h-2 bg-neutral-800 rounded-full mb-6 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* FORM SECTION */}
        <form onSubmit={addTask} className="flex gap-2 mb-4">

          <input
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter task..."
            className="flex-1 bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500"
          />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="bg-neutral-900 border border-neutral-700 rounded-lg px-2 text-sm"
          >
            <option value="" disabled>
              Select priority
            </option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <button
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium shadow-lg hover:scale-105 active:scale-95 transition"
          >
            Add
          </button>

        </form>

        {/* FILTER SECTION */}
        <div className="flex gap-2 mb-4">
          {["all", "active", "completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-lg text-sm transition ${filter === f
                ? "bg-purple-600 text-white"
                : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* TASK LIST */}
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={filteredTasks.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <ul className="space-y-2">
              <AnimatePresence>
                {filteredTasks.map((t) => (
                  <Task onToggleEdit={editTask}
                    key={t.id}
                    task={t}
                    onDelete={deleteTask}
                    onToggle={toggleComplete}
                  />
                ))}
              </AnimatePresence>
            </ul>
          </SortableContext>
        </DndContext>

        {/* CLEAR BUTTON */}
        {tasks.some((t) => t.completed) && (
          <button
            onClick={clearCompleted}
            className="mt-4 w-full bg-red-600 py-2 rounded-lg"
          >
            Clear Completed
          </button>
        )}
      </div>
    </div>
  );
}