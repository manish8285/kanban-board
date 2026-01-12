import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../redux/Store"
import shuffle from 'lodash'
import Task from "./Task"
import { dragTask } from "../redux/boardSlice"

interface Props {
  colIndex : number
}

function Column({colIndex}:Props) {

  const colors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-blue-500",
    "bg-purple-500",
    "bg-green-500",
    "bg-indigo-500",
    "bg-yellow-500",
    "bg-pink-500",
    "bg-sky-500",
  ] 

  const dispatch = useDispatch();
  const [color, setColor] = useState<any>(null)
  const boards = useSelector((state : RootState) => state.board.boards)
  const board = boards.find((board) => board.isActive === true)
  const col = board?.columns.find((_col, i) => i === colIndex)

  const handleOnDrop = (e : any) => {
    const { prevColIndex, taskIndex } = JSON.parse( e.dataTransfer.getData("text"))
    if (colIndex !== prevColIndex) {
      dispatch(dragTask({ colIndex, prevColIndex, taskIndex }))
    }
  }

  const handleOnDragOver = (e : any) => {
    e.preventDefault()
  }

  useEffect(() => {
    setColor(shuffle(colors).pop())
  }, [dispatch])

  return <>
    <div className="scrollbar-hide mx-5 pt-[90px] min-w-[280px]" onDrop={handleOnDrop} onDragOver={handleOnDragOver}>      
      <p className=" font-semibold flex  items-center  gap-2 tracking-widest md:tracking-[.2em] text-[#828fa3]">
        <div className={`rounded-full w-4 h-4 ${color} `} />
        {col?.name} ({col?.tasks?.length})
      </p>
      {
        col?.tasks.map((_task, index) => (
          <Task key={index} taskIndex={index} colIndex={colIndex} />
        ))
      }
    </div>
  </>
}

export default Column