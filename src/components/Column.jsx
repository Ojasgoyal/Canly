import { useState } from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";

function Column({ title, tasks, onDeleteTask ,onEditTask}) {
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editedText, setEditedText] = useState("");

  let specialClass = ""
  let baseBg = ""
  let borderBg = ""


  if (title === "active"){
    specialClass += "italic border-l-4 animate-[pulse-slow_2s_ease-in-out_infinite]"
    borderBg += "border border-yellow-400 dark:border-yellow-600"
    baseBg += "bg-yellow-50 dark:bg-yellow-900/40"
  } else if (title === "todo"){
    borderBg += "border border-blue-300/50 dark:border-blue-600/50"
    baseBg += "bg-blue-50 dark:bg-blue-900/40"
  } else {
    borderBg += "border border-green-300/50 dark:border-green-600/50"
    baseBg += "bg-green-50 dark:bg-green-900/40"
  }


  return (
    <div className={`bg-white dark:bg-gray-700 dark:border-zinc-500 dark:text-white rounded-xl shadow-md p-4 w-72 min-h-[300px] flex flex-col`}>
      <h2 className={` w-full text-center text-xl font-semibold mb-4 sticky bg-white top-0 dark:bg-gray-700 dark:border-zinc-500 dark:text-white`}>
        {title.charAt(0).toUpperCase() + title.slice(1)}
        <span className="ml-2 inline-block px-2 py-0.5 text-xs bg-gray-200 rounded-full dark:bg-gray-500 dark:text-gray-100">
        {tasks.length}
        </span>
      </h2>

      <Droppable droppableId={title}>
        {(provided,snapshot) => (
          <ul
          {...provided.droppableProps}
          ref={provided.innerRef}
          className={`${baseBg} flex-1 flex flex-col pt-4 pb-4 gap-y-4 min-h-[6rem] ${snapshot.isDraggingOver ? "bg-opacity-80 dark:bg-opacity-80" : ""}`}
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided) => (
                  <li
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`rounded-lg shadow-sm flex justify-between gap-2 items-center p-3
                    ${specialClass} ${borderBg}
                    ${deletingId === task.id ? "fade-out" : ""}
                    `}
                    onDoubleClick={() => {
                      setEditedText(task.text);
                      setEditingId(task.id);
                    }}
                    title="Double click to edit"
                  >
                  {editingId === task.id ? (
                  <input
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    onBlur={() => {
                      if (editedText.trim()) {
                        onEditTask(task.id, editedText);
                      }
                      setEditingId(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (editedText.trim()) {
                          onEditTask(task.id, editedText);
                        }
                        setEditingId(null);
                      } else if (e.key === "Escape") {
                        setEditingId(null);
                      }
                    }}
                    className={`outline-none flex-1 px-2 py-1 rounded ${baseBg}`}
                    autoFocus
                    maxLength={50}
                  />
                  ) : (
                  <span className="inline-flex items-center space-x-2">
                  {title === "active" && (
                  <svg
                    className="h-4 w-4 animate-spin text-yellow-500 dark:text-yellow-300"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12" cy="12" r="10"
                      stroke="currentColor" strokeWidth="4" fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>)}
                    <span className={`break-words max-w-[12rem] ${title === "done" ? "line-through" : ""}`}
                    >
                    
                    {task.text}
                    </span>
                    </span>
                    )}
                    <button
                      onClick={() => {
                        setDeletingId(task.id);
                        setTimeout(() => onDeleteTask(task.id), 400);
                      }}
                      className="ml-auto text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600 text-xs"
                    >
                      Delete
                    </button>
                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </div>
  );
}

export default Column;