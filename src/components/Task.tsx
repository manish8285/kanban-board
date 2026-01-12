import { useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "../redux/Store"
import TaskModal from "../modals/TaskModal"

interface Props {
  taskIndex : number,
  colIndex : number
}

function Task({taskIndex, colIndex}:Props) {

  const boards = useSelector((state : RootState) => state.board.boards)
  const board = boards.find((board) => board.isActive === true)
  const columns = board?.columns
  const col = columns?.find((_col, i) => i === colIndex)
  const task = col?.tasks.find((_task, i) => i === taskIndex)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false)

  let completed = 0
  let subtasks = task?.subtasks

  subtasks?.forEach((subtask) => {
    if (subtask.isCompleted) {
      completed++
    }
  })

  const handleOnDrag = (e : any) => {
    e.dataTransfer.setData("text",JSON.stringify({ taskIndex, prevColIndex: colIndex }))
  }

  return <>
    <div>
      <div onClick={() => {setIsTaskModalOpen(true)}} draggable onDragStart={handleOnDrag} 
        className={`w-[280px] first:my-5 rounded-lg text-black  bg-white hover:text-gray-500 dark:bg-[#2b2c37] shadow-[#364e7e1a] py-6 px-3 shadow-lg cursor-pointer
          ${
            task?.selectedPriority === "Medium"
              ? "bg-yellow-200 dark:bg-yellow-200"
              : task?.selectedPriority === "Low"
              ? "bg-green-200 dark:bg-green-200"
              : "bg-red-200 dark:bg-red-200"
          }
        `}>
        <p className="font-bold tracking-wide ">{task?.title}</p>
        <p className="font-bold tracking-wide ">{task?.selectedPriority}</p>
        <p className="font-bold text-xs tracking-tighter mt-2 text-black hover:text-gray-500">
          {completed} of {subtasks?.length} completed tasks
        </p>
      </div>
      {
        isTaskModalOpen && <TaskModal colIndex={colIndex} taskIndex={taskIndex} setIsTaskModalOpen={setIsTaskModalOpen}/>
      }
    </div>
  </>
}

export default Task