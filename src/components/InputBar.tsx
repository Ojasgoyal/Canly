import { useState } from "react";

function InputBar({onAddTask}){
    const [taskText, setTaskText] = useState("");
    const [warning, setWarning] = useState("");

    function handleSubmit(e){
        e.preventDefault();
        if (!taskText.trim()){
            showWarning("Task cannot be empty.")
            return
        }

        if (taskText.length > 50) {
            showWarning("Task is too long (max 50 characters).")
            return
        }

        onAddTask(taskText);
        setTaskText(""); 
    }

    function showWarning(msg) {
    setWarning(msg);
    setTimeout(() => setWarning(""), 2000);
    }


    return(
        <>
        {warning && (
        <div className="mb-2 text-sm text-red-600 bg-red-100 px-3 py-1 rounded shadow dark:text-red-300 dark:bg-red-900">
            {warning}
        </div>
        )}
        <form 
        onSubmit={handleSubmit}
        className="mt-8 mb-4 w-full max-w-md mx-auto gap-3 flex flex-col items-center sm:flex-row"
        >
        <input 
        type="text"
        autoFocus
        placeholder="Add a new todo..."
        className="flex-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:ring-blue-600"
        value={taskText}
        onChange={(e) => setTaskText(e.target.value)}
        />
        <button
        type="submit"
        className="px-4 py-2 bg-blue-600 max-w-20 text-white rounded-lg hover:bg-blue-700 transition dark:bg-blue-500 dark:hover:bg-blue-600"
        >
        Add
        </button>
        </form>
        </>
    )
}

export default InputBar;
