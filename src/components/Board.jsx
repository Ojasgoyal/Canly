import Column from './Column'


function Board({tasks , onDeleteTask , onEditTask}){
    return (
        <>
        <div className="flex gap-6 justify-center flex-wrap md:flex-nowrap overflow-x-auto p-4">
            <Column title="todo" tasks={tasks.todo} 
            onDeleteTask={(id) => onDeleteTask("todo", id)}
            onEditTask={(id, text) => onEditTask("todo", id, text)}
            />
            <Column title="active" tasks={tasks.active} 
            onDeleteTask={(id) => onDeleteTask("active", id)}
            onEditTask={(id, text) => onEditTask("active", id, text)}
            />
            <Column title="done" tasks={tasks.done} 
            onDeleteTask={(id) => onDeleteTask("done", id)}
            onEditTask={(id, text) => onEditTask("done", id, text)}
            />
        </div>
        
        </>
    )
}


export default Board