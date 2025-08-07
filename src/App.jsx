import { useEffect, useState } from 'react'
import './App.css'
import Board from './components/Board'
import InputBar from './components/InputBar'
import { DragDropContext } from "@hello-pangea/dnd";


function App() {
  
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("kanban-dark") === "true";
  });

  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
    localStorage.setItem("kanban-dark", darkMode);
  }, [darkMode]);

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("kanban-tasks");
    
    return saved ? JSON.parse(saved) :
    {
        todo:[],
        active:[],
        done:[],
    }
  })

  useEffect(() => {
    localStorage.setItem("kanban-tasks" , JSON.stringify(tasks))
  },[tasks])

  const [recentBackup, setRecentBackup] = useState(null);
  const [undoTimeoutId, setUndoTimeoutId] = useState(null);
  const [countdown, setCountdown] = useState(0);


  function addTask(Task){
    const newTask = {
      id: crypto.randomUUID(),
      text: Task
    }
    setTasks((prevTasks) => ({
        ...prevTasks,
        todo:[...prevTasks.todo, newTask],
    }))
  }

  function deleteTask(column, taskId) {
    setTasks((prev) => ({
      ...prev,
      [column]: prev[column].filter((task) => task.id  !== taskId),
    }));
  }

  function editTask(column, taskId, newText) {
  setTasks((prev) => ({
    ...prev,
    [column]: prev[column].map((task) =>
      task.id === taskId ? { ...task, text: newText } : task
    ),
  }));
  }

  function resetBoard() {
    const backup = { ...tasks };
    setRecentBackup(backup);
    setCountdown(5);

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setRecentBackup(null);
          setUndoTimeoutId(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const timeout = setTimeout(() => {
      clearTimeout(interval); // extra safety
      setRecentBackup(null);
      setUndoTimeoutId(null);
    }, 5200);

    setUndoTimeoutId(timeout);

    setTasks({
      todo: [],
      active: [],
      done: [],
    });
  }


  function undoReset() {
    if (recentBackup) {
      setTasks(recentBackup);
      clearTimeout(undoTimeoutId);
      setRecentBackup(null);
      setUndoTimeoutId(null);
    }
  }


  function handleDragEnd(result) {
    const { source, destination } = result;
    if (!destination) return;

    const sourceCol = source.droppableId;
    const destCol   = destination.droppableId;

    if (sourceCol === destCol) {
      setTasks(prev => {
        const items = Array.from(prev[sourceCol]);
        const [moved] = items.splice(source.index, 1);
        items.splice(destination.index, 0, moved);
        return { ...prev, [sourceCol]: items };
      });
      return;
    }

    setTasks(prev => {
      const sourceItems = Array.from(prev[sourceCol]);
      const [moved]     = sourceItems.splice(source.index, 1);

      const destItems = Array.from(prev[destCol]);
      destItems.splice(destination.index, 0, moved);

      return {
        ...prev,
        [sourceCol]: sourceItems,
        [destCol]:   destItems,
      };
    });
  }

  const isBoardEmpty = Object.values(tasks).every(column => column.length === 0);


  return (
    <div className="p-4 bg-white min-h-screen text-black dark:bg-gray-800 dark:text-white">
      <div className="relative mb-12 sm:mb-6 ">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="mt-2 text-sm px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 dark:text-white"
        >
          {darkMode ? "Light" : "Dark"} Mode
        </button>
        <h1 className="text-2xl font-bold text-center text-black dark:text-white">Kanban To-Do</h1>
        {recentBackup && (
          <div className="absolute right-0 top-10 text-sm text-black dark:text-white">
            <button
              onClick={undoReset}
              className="bg-yellow-100/50 text-yellow-800 px-3 py-1 rounded shadow hover:bg-yellow-200 transition dark:bg-yellow-900/50 dark:text-yellow-300 dark:hover:bg-yellow-800"
            >
              Undo Reset ({countdown}s)
            </button>
          </div>
        )}
        <button
          onClick={resetBoard}
          disabled={isBoardEmpty}
          className="absolute right-0 top-1 bg-red-100 text-red-600 hover:bg-red-200 px-4 py-1 text-sm rounded shadow-sm dark:bg-red-900 dark:text-red-400 dark:hover:bg-red-800"
        >
          Reset
        </button>

      </div>
      <InputBar onAddTask={addTask} />
      <DragDropContext onDragEnd={handleDragEnd}>
      <Board tasks={tasks} onDeleteTask={deleteTask} onEditTask={editTask}/>
      </DragDropContext>
    </div>
  )
}

export default App
