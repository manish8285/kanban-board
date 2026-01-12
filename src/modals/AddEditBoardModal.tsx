import { useState } from "react"
import { v4 as uuidv4 } from 'uuid'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { useDispatch, useSelector } from "react-redux"
import { Column } from "../type"
import { addBoard, editBoard } from "../redux/boardSlice"
import { RootState } from "../redux/Store"
import crossIcon from '../assets/crossIcon.svg'

interface Props {
    setIsBoardModalOpen :React.Dispatch<React.SetStateAction<boolean>>,
    boardCreateType : string
}

function AddEditBoardModal({setIsBoardModalOpen, boardCreateType} : Props) {

    const dispatch = useDispatch()
    const [name, setName] = useState<string>("")
    const [_isValid, setIsValid] = useState<boolean>(true)
    const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true)
    const [newColumns, setNewColumns] = useState<Column[]>([
        { name: "Todo", tasks: [], id: uuidv4() },
        { name: "In Progress", tasks: [], id: uuidv4() },
        { name: "Done", tasks: [], id: uuidv4() },
    ])    
    const board = useSelector((state :RootState) => state?.board?.boards).find((board) => board?.isActive)

    if (boardCreateType === "edit" && isFirstLoad) {
        // if(board?.columns) {
        //     setNewColumns(
        //         board.columns.map((col) => {
        //             return { ...col, id: uuidv4() };
        //           })
        //     )
        // }
        if(board) setName(board?.name)
        setIsFirstLoad(false)
      }

    const handletScreenClickTarget = (e : any) => {
        if(e.target !== e.currentTarget) return               // to close the dropdown on click anywhere in screen
        setIsBoardModalOpen(false)
    }

    const validate = () => {
        setIsValid(false)
        if (!name.trim()) {
          return false
        }
        for (let i = 0 ; i < newColumns.length ; i++) {
            if (!newColumns[i].name.trim()) {
                return false
            }
        }
        setIsValid(true)
        return true
    }

    const onSubmit = (boardCreateType : string) => {
        setIsBoardModalOpen(false)
        if (boardCreateType === "add") {
          dispatch(addBoard({name, newColumns}))
        } else {
          dispatch(editBoard({name, newColumns}))
        }
    }

    const onChange = (id:string, newValue : string) => {
        setNewColumns((prevState) => {
            const newState = [...prevState]
            const column = newState.find((col) => col.id === id)
            if(column) column.name = newValue
            return newState
        })
    }
    
    const onDelete = (id : string) => {
        setNewColumns((prevState) => prevState.filter((el) => el.id !== id))
    }

    const handleAddNewColumn = () => {
        setNewColumns((state) => [
            ...state,
            { name: "", tasks: [], id: uuidv4() },
        ])
    }
    
    const handleBoardChange = () => {
        const isValid = validate()
        if (isValid) onSubmit(boardCreateType)
    }

    return <>
        <div onClick={(e) => handletScreenClickTarget(e)} className="fixed right-0 top-0 px-2 py-4 overflow-scroll scrollbar-hide  z-50 left-0 bottom-0 justify-center items-center flex dropdown">
            {/* Modal Section */}
            <div className="scrollbar-hide overflow-y-scroll max-h-[95vh] bg-slate-100 dark:bg-[#2b2c37] text-black dark:text-white font-bold shadow-md shadow-[#364e7e1a] max-w-md mx-auto mt-32 w-full px-8 py-8 rounded-xl">
                <h3 className="text-lg">{boardCreateType === 'edit' ? 'Edit': "Add New"} Board</h3>
                {/* Task Name */}
                <div className="mt-8 flex flex-col space-y-1">
                    <label className="  text-sm dark:text-white text-gray-500">
                        Board Name
                    </label>
                    <input placeholder=" e.g Web Design" value={name} onChange={(e) => setName(e.target.value)} id="board-name-input" className="bg-transparent  px-4 py-2 rounded-md text-sm  border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-1  ring-0"/>
                </div>
                <div className="mt-8 flex flex-col space-y-3">
                    <label className=" text-sm dark:text-white text-gray-500">
                        Board Columns
                    </label>
                    {
                         newColumns?.map((column,index)=> {
                            return <div key={index} className=" flex items-center w-full ">
                                    <input onChange={(e) => { onChange(column.id, e.target.value)}} type="text" value={column.name} className=" bg-transparent flex-grow px-4 py-2 rounded-md text-sm  border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-[1px]"/>
                                    <img src={crossIcon} onClick={() => onDelete(column.id)} className="m-4 cursor-pointer"/>
                                </div>
                        })
                    }
                    <div className="space-y-8">
                        <button onClick={() => handleAddNewColumn()} className="w-full items-center hover:opacity-70 dark:text-[#635fc7] dark:bg-white text-white bg-[#635fc7] py-2 mx-auto rounded-full"><FontAwesomeIcon icon={faPlus}/> Add New Column</button>
                        <button onClick={() => handleBoardChange()} className=" w-full items-center hover:opacity-70 dark:text-white dark:bg-[#635fc7] relative text-white bg-[#635fc7] py-2 mx-auto rounded-full">{boardCreateType === "add" ? "Create New Board" : "Save Changes"}</button>
                    </div>
                </div>
            </div>            
        </div>
    </>
}

export default AddEditBoardModal