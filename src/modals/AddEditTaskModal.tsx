import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { RootState } from '../redux/Store'
import { addTask, editTask } from '../redux/boardSlice'
import { SubTasks } from '../type'
import crossIcon from '../assets/crossIcon.svg'

interface Props {
    setIsTaskModalOpen :React.Dispatch<React.SetStateAction<boolean>>,
    setIsAddTaskModalOpen:React.Dispatch<React.SetStateAction<boolean>>,
    taskType : string,
    device : string,
    prevColIndex: number | any,
    taskIndex : number
}

function AddEditTaskModal({setIsTaskModalOpen, taskType , device,setIsAddTaskModalOpen,taskIndex,prevColIndex = 0, }:Props) {

    let today = new Date()
    const dispatch = useDispatch()
    const board = useSelector((state : RootState) => state.board.boards).find(board => board.isActive)
    const columns = board?.columns
    const col = columns?.find((_col, index) => index === prevColIndex)
    const task = col ? col.tasks.find((_task, index) => index === taskIndex) : []
    const [title, setTitle] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const [status, setStatus] = useState<string>( columns?.[prevColIndex]?.name || "")
    const [_isValid, setIsValid] = useState<boolean>(true)
    const [newColIndex, setNewColIndex] = useState<number>(prevColIndex)
    const [subtasks, setSubtasks] = useState<SubTasks[]>([{ title: "", isCompleted: false, id: uuidv4() }])
    
    const [assigneeName, setAsigneeName] = useState<string>("")
    const [priority, _setPriority] = useState<string[]>(["High", "Medium", "Low"])
    const [selectedPriority, setSelectedPriority] = useState<string>("High")
    const [dueDate, setDueDate] = useState<string>(`${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`);

    const handleTaskModalToggle = (e : any) => {
        if(e.target !== e.currentTarget)return           // to close the dropdown on click anywhere in screen
        setIsTaskModalOpen(false)
    }

    const onChangeSubtasks = (id: string, newValue : string) => {
        setSubtasks((prevState) => {
          const newState = [...prevState]
          const subtask = newState.find((subtask) => subtask.id === id)
          if(subtask) subtask.title = newValue
          return newState
        })
    }

    const onChangeStatus = (e : any) => {
        setStatus(e.target.value)
        setNewColIndex(e.target.selectedIndex)
    }

    const validate = () => {
        setIsValid(false)
        if (!title.trim()) {
          return false
        }
        for (let i = 0 ; i < subtasks.length ; i++) {
            if (!subtasks[i].title.trim()) {
                return false
            }
        }
        setIsValid(true)
        return true
    }

    const onSubmit = (taskType : string) => {
        if (taskType === "add") {
          dispatch(addTask({title, description,subtasks, status, assigneeName, selectedPriority, dueDate, newColIndex}));
        } else {
            dispatch(editTask({title, description,subtasks, status, assigneeName, selectedPriority, dueDate,prevColIndex, taskIndex, newColIndex}))
        }
    }

    const onDelete = (id : string) => {
        setSubtasks((prevState) => prevState.filter((el) => el.id !== id));
    }

    // if (taskType === "edit" && isFirstLoad) {
    //     setSubtasks(
    //       task?.subtasks?.map((subtask: any) => {
    //         return { ...subtask, id: uuidv4() };
    //       })
    //     );
    //     if(task) setTitle(task?.name);
    //     setDescription(task?.description);
    //     setIsFirstLoad(false);
    // }
    

    const handleNewSubTasks = () => {
        setSubtasks((state) => [
            ...state,
            { title: "", isCompleted: false, id: uuidv4() },
        ])
    }

    const handleTask = () => {
        const isValid = validate()
        if (isValid) {
            onSubmit(taskType)
            setIsAddTaskModalOpen(false)
            taskType === "edit" && setIsTaskModalOpen(false)
        }        
    }

    return <>
        <div onClick={handleTaskModalToggle} className= {device === "mobile" ? "py-6 px-6 pb-40 absolute overflow-y-scroll left-0 flex right-0 bottom-[-100vh] top-0 dropdown" : "py-6 px-6 pb-40 absolute overflow-y-scroll left-0 flex right-0 bottom-0 top-0 dropdown"}>
            <div className=" scrollbar-hide overflow-y-scroll max-h-[95vh] mt-12 bg-white dark:bg-[#2b2c37] text-black dark:text-white font-bold shadow-md shadow-[#364e7e1a] max-w-md mx-auto w-full px-8 py-8 rounded-xl">
                <h3 className="text-lg">
                    {taskType === "edit" ? "Edit" : "Add New"} Task
                </h3>

                {/* Task Name */}
                <div className="mt-8 flex flex-col space-y-1">
                    <label className="  text-sm dark:text-white text-gray-500">Task Name</label>
                    <input value={title} onChange={(e) => setTitle(e.target.value)} id="task-name-input" type="text" placeholder=" e.g Take coffee break" className="bg-transparent px-4 py-2 outline-none focus:border-0 rounded-md text-sm border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-1 ring-0"/>
                </div>

                {/* Description */}
                <div className="mt-8 flex flex-col space-y-1">
                    <label className="text-sm dark:text-white text-gray-500">Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} id="task-description-input" className=" bg-transparent outline-none min-h-[200px] focus:border-0 px-4 py-2 rounded-md text-sm border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-[1px]" placeholder="e.g. It's always good to take a break. This 15 minute break will  recharge the batteries a little."/>
                </div>

                {/* Subtasks */}

                <div className="mt-8 flex flex-col space-y-3">
                    <label className="  text-sm dark:text-white text-gray-500">Subtasks</label>
                    {
                        subtasks.map((subtask, index) => {
                            return <div key={index} className=" flex items-center w-full ">
                            <input onChange={(e) => onChangeSubtasks(subtask.id, e.target.value)} type="text" value={subtask.title} placeholder=" e.g Take coffee break" className=" bg-transparent outline-none focus:border-0 flex-grow px-4 py-2 rounded-md text-sm  border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-[1px]"/>
                            <img src={crossIcon} className="m-4 cursor-pointer" onClick={() => onDelete(subtask.id)}/>
                        </div>
                        })
                    }
                    <button className="w-full items-center dark:text-[#635fc7] dark:bg-white text-white bg-[#635fc7] py-2 rounded-full" onClick={() => handleNewSubTasks()}><FontAwesomeIcon icon={faPlus}/> Add New Subtask</button>
                </div>

                {/* assignee */}
                <div className="mt-8 flex flex-col space-y-1">
                    <label className="text-sm dark:text-white text-gray-500">Assignee</label>
                    <input value={assigneeName} onChange={(e) => setAsigneeName(e.target.value)} id="task-name-input" type="text" placeholder=" e.g Jhon Doe" className="bg-transparent px-4 py-2 outline-none focus:border-0 rounded-md text-sm border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-1 ring-0"/>
                </div>

                {/* priority */}
                <div className="mt-8 flex flex-col space-y-1">
                    <label className="text-sm dark:text-white text-gray-500">Priority</label>
                    <select  value={selectedPriority} onChange={(e) => setSelectedPriority(e.target.value)} className="select-status w-full flex-grow px-4 py-2 rounded-md text-sm bg-transparent focus:border-0 border-[1px] border-gray-300 focus:outline-[#635fc7] outline-none">
                        {
                            priority.map((priority,i) => {
                                return <option key={i} value={priority}>{priority}</option>
                            })
                        }
                    </select>
                </div>

                {/* due date */}                
                <div className="mt-8 flex flex-col space-y-1">
                    <label className="text-sm dark:text-white text-gray-500">Deadline</label>
                    <input value={dueDate} onChange={(e) => setDueDate(e.target.value)} id="task-name-input" type="date" placeholder=" e.g dd-mm-yyyy" className="bg-transparent px-4 py-2 outline-none focus:border-0 rounded-md text-sm border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-1 ring-0"/>
                </div>

                {/* task status */}
                <div className="mt-8 flex flex-col space-y-3">
                    <label className="text-sm dark:text-white text-gray-500">Current Status</label>
                    <div className='space-y-6'>
                        <select  value={status} onChange={(e) => onChangeStatus(e)} className="select-status w-full flex-grow px-4 py-2 rounded-md text-sm bg-transparent focus:border-0 border-[1px] border-gray-300 focus:outline-[#635fc7] outline-none">
                            {
                                columns?.map((column, index) => {
                                    return <option className='dark:text-black' key={index} value={column.name}>{column.name}</option>
                                })
                            }
                        </select>
                        <button onClick={() => handleTask()} className="w-full mx-auto mt-15 items-center text-white bg-[#635fc7] py-2 rounded-full">
                            {taskType === "edit" ? " save edit" : "Create task"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default AddEditTaskModal