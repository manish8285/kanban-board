import { useDispatch, useSelector } from "react-redux"
import { setSubtaskCompleted } from "../redux/boardSlice"
import { RootState } from "../redux/Store"

interface Props {
  taskIndex : number,
  colIndex : number,
  index : number
}

function Subtask({taskIndex, colIndex, index}:Props) {

  const dispatch = useDispatch()
  const boards = useSelector((state : RootState) => state.board.boards)
  const board = boards.find((board) => board.isActive === true)
  const col = board?.columns.find((_col, i) => i === colIndex)
  const task = col?.tasks.find((_task, i) => i === taskIndex)
  const subtask = task?.subtasks.find((_subtask, i) => i === index)
  const checked = subtask?.isCompleted

  const onChange = () => {
    dispatch(setSubtaskCompleted({ index, taskIndex, colIndex }))
  }

  return <>
    <div className=" w-full flex hover:bg-[#635fc740] dark:hover:bg-[#635fc740] rounded-md relative items-center justify-start dark:bg-[#20212c]  p-3 gap-4  bg-[#f4f7fd]">
      <input type="checkbox" checked={checked} onChange={onChange} className=" w-4 h-4  accent-[#635fc7] cursor-pointer"/>
      <p className={checked ? "line-through opacity-30" : undefined}>{subtask?.title}</p>
    </div>
  </>
}

export default Subtask