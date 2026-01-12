import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons"
import { RootState } from "../redux/Store"
import { deleteTask, setTaskStatus } from "../redux/boardSlice"
import EllipsisMenu from "../components/EllipsisMenu"
import Subtask from "../components/Subtask"
import DeleteModal from "./DeleteModal"
import AddEditTaskModal from "./AddEditTaskModal"

interface Props {
  taskIndex : number,
  colIndex : number,
  setIsTaskModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

function TaskModal({taskIndex, colIndex, setIsTaskModalOpen}:Props) {

  const dispatch = useDispatch()
  const boards = useSelector((state : RootState) => state.board.boards)
  const board = boards.find((board) => board.isActive)
  const columns = board?.columns
  const col = columns?.find((_col, i) => i === colIndex)
  const task = col?.tasks.find((_task, i) => i === taskIndex)
  const subtasks = task?.subtasks
  const [boardCreateType, setBoardCreateType] = useState<string>("edit")
  const [isElipsisMenuOpen, setIsElipsisMenuOpen] = useState<boolean>(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)
  const [status, setStatus] = useState<any>(task?.status)
  const [newColIndex, setNewColIndex] = useState<any>(col && columns?.indexOf(col))
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false)

  let completed = 0
  subtasks?.forEach((subtask) => {
    if (subtask.isCompleted) {
      completed++
    }
  })

  const onChange = (e:any) => {
    setStatus(e.target.value);
    setNewColIndex(e.target.selectedIndex)
  }

  const onClose = (e : any) => {
    if (e.target !== e.currentTarget) return
    dispatch(setTaskStatus({taskIndex,colIndex,newColIndex,status,}))
    setIsTaskModalOpen(false)
  }

  const onDeleteBtnClick = (e: any) => {
    if (e.target.textContent === "Delete") {
      dispatch(deleteTask({ taskIndex, colIndex }))
      setIsTaskModalOpen(false)
      setIsDeleteModalOpen(false)
    } else {
      setIsDeleteModalOpen(false)
    }
  }

  const setOpenEditModal = () => {
    setIsAddTaskModalOpen(true)
    setIsElipsisMenuOpen(false)
  };

  const setOpenDeleteModal = () => {
    setIsElipsisMenuOpen(false)
    setIsDeleteModalOpen(true)
  };

  return <>
    <div onClick={onClose} className=" fixed right-0 top-0 px-2 py-4 overflow-scroll scrollbar-hide  z-50 left-0 bottom-0 justify-center items-center flex dropdown ">
      {/* MODAL SECTION */}
      <div className=" scrollbar-hide overflow-y-scroll max-h-[95vh]  my-auto  bg-white dark:bg-[#2b2c37] text-black dark:text-white font-bold shadow-md shadow-[#364e7e1a] max-w-md mx-auto  w-full px-8  py-8 rounded-xl">
        <div className=" relative flex   justify-between w-full items-center">
          <h1 className=" text-lg">{task?.title}</h1>
          <div className='pe-2 cursor-pointer h-6' onClick={() => setIsElipsisMenuOpen((prevState) => !prevState)}><FontAwesomeIcon icon={faEllipsisVertical}/></div>    
          {
            isElipsisMenuOpen && <EllipsisMenu boardCreateType={boardCreateType} setBoardCreateType={setBoardCreateType} setOpenEditModal={setOpenEditModal} setOpenDeleteModal={setOpenDeleteModal} type="Task"/>
          }
        </div>
        <p className=" text-gray-500 font-[600] tracking-wide text-xs pt-6">{task?.description}</p>
        <p className=" pt-6 text-gray-500 tracking-widest text-sm">Subtasks ({completed} of {subtasks?.length})</p>

        {/* subtasks section */}

        <div className=" mt-3 space-y-2">
          {
            subtasks?.map((_subtask, index) => {
              return <Subtask index={index} taskIndex={taskIndex} colIndex={colIndex} key={index}/>
            })
          }
        </div>

        {/* Current Status Section */}

        <div className="mt-8 flex flex-col space-y-3">
          <label className="  text-sm dark:text-white text-gray-500">Current Status</label>
          <select value={status} onChange={onChange} className=" select-status flex-grow px-4 py-2 rounded-md text-sm bg-transparent focus:border-0  border-[1px] border-gray-300 focus:outline-[#635fc7] outline-none">
            {
              columns?.map((col, index) => {
                return <option className="status-options" key={index}>
                  {col.name}
                </option>
              })
            }
          </select>
        </div>
      </div>
      
      {
        isDeleteModalOpen && <DeleteModal onDeleteBtnClick={onDeleteBtnClick} type="task" title={task?.title} setIsDeleteModalOpen={setIsDeleteModalOpen}/>      
      }

      {
        isAddTaskModalOpen && <AddEditTaskModal setIsAddTaskModalOpen={setIsAddTaskModalOpen} setIsTaskModalOpen={setIsTaskModalOpen} taskType="edit" taskIndex={taskIndex} prevColIndex={colIndex} device={""}/>     
      }
    </div>
  </>
}

export default TaskModal