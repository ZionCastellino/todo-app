import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { GripVertical, Check, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

const priorityColor = {
  low: "text-blue-400",
  medium: "text-yellow-400",
  high: "text-red-400",
};

export default function Task({ task, onDelete, onToggle, onToggleEdit }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const [editPriority, setEditPriority] = useState(task.priority);

  const handleEditSave = () => {
    if (!editText.trim()) return;
    onToggleEdit(task.id, editText, editPriority);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditText(task.text);
    setEditPriority(task.priority);
    setIsEditing(false);
  };

  return (
    <motion.li
      ref={setNodeRef}
      style={style}
      {...attributes}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-200 hover:scale-[1.02] hover:shadow-lg ${task.completed
          ? "bg-neutral-900 border-neutral-800 text-neutral-500"
          : "bg-neutral-800/80 border-neutral-700 text-neutral-200 hover:border-purple-500/40"
        }`}
    >

      {/* ======================= */}
      {/* LEFT SECTION */}
      {/* ======================= */}
      <div className="flex items-center gap-3 flex-1 group">

        {/* DRAG HANDLE */}
        <span
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-neutral-400 hover:text-white"
        >
          <GripVertical size={16} />
        </span>

        {/* CHECKBOX */}
        <div
          onClick={() => onToggle(task.id)}
          className={`w-5 h-5 flex items-center justify-center rounded border cursor-pointer ${task.completed
              ? "bg-purple-500 border-purple-500 text-white"
              : "border-neutral-500"
            }`}
        >
          {task.completed && <Check size={14} />}
        </div>

        {/* TEXT + EDIT */}
        <div className="flex flex-col flex-1">

          {isEditing ? (
            <div className="flex flex-col gap-1">

              <input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleEditSave();
                  if (e.key === "Escape") handleCancelEdit();
                }}
                autoFocus
                className="bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-sm outline-none"
              />

              <select
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value)}
                className="bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-xs"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>

              {/* CENTERED BUTTONS */}
              <div className="flex justify-center gap-4 mt-2">
                <button
                  onClick={handleEditSave}
                  className="text-green-400 text-xs hover:scale-110 transition"
                >
                  ✔️
                </button>

                <button
                  onClick={handleCancelEdit}
                  className="text-red-400 text-xs hover:scale-110 transition"
                >
                  ❌
                </button>
              </div>

            </div>
          ) : (
            <div className="flex items-center gap-2">

              <span
                className={`${task.completed ? "line-through opacity-50" : ""}`}
              >
                {task.text}
              </span>

              <span
                onClick={() => setIsEditing(true)}
                className="cursor-pointer text-neutral-400 hover:text-white text-sm opacity-0 group-hover:opacity-100 transition"
              >
                <Pencil size={14} />
              </span>

            </div>
          )}

          <span className={`text-xs ${priorityColor[task.priority]}`}>
            {task.priority}
          </span>

        </div>
      </div>

      {/* DELETE BUTTON */}
      <button
        type="button"
        onClick={() => onDelete(task.id)}
        className="text-neutral-500 hover:text-red-400 ml-2 transition hover:scale-110"
      >
        <Trash2 size={16} />
      </button>

    </motion.li>
  );
}