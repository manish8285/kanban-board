import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical, faPlus } from '@fortawesome/free-solid-svg-icons'
import { RootState } from '../redux/Store'
import { deleteBoard, setBoardActive } from '../redux/boardSlice'
import logo from '../assets/logo.svg'
import iconUp from '../assets/dropDownUp.svg'
import iconDown from '../assets/dropDownDown.svg'
import HeaderDropDown from './HeaderDropDown'
import AddEditBoardModal from '../modals/AddEditBoardModal'
import AddEditTaskModal from '../modals/AddEditTaskModal'
import EllipsisMenu from './EllipsisMenu'
import DeleteModal from '../modals/DeleteModal'
interface Props {
    isBoardModalOpen : boolean,
    setIsBoardModalOpen :React.Dispatch<React.SetStateAction<boolean>>
}

function Header({setIsBoardModalOpen, isBoardModalOpen} : Props) {

    const [openDropDown, setOpenDropDown] = useState<boolean>(false)
    const [isEllipsisMenuOpen, setIsEllipsisMenuOpen] = useState<boolean>(false)
    const [boardCreateType, setBoardCreateType] = useState<string>("add")
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)
    const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false)
    const boards = useSelector((state :RootState) => state?.board?.boards)
    const boardHeader = boards.find(board => board.isActive)
    const dispatch = useDispatch()

    const handleDropDown = () => {
        setOpenDropDown(prev => !prev)
        setIsEllipsisMenuOpen(false)
        setBoardCreateType("add")
    }

    const handleCreateTask = () => {
        setIsTaskModalOpen(state => !state)
        setOpenDropDown(false)
    }

    const handleEllipsisMenu = () => {
        setIsEllipsisMenuOpen(state => !state)
        setOpenDropDown(false)
        setBoardCreateType("edit")
        
    }

    const onDeleteBtnClick = (e : any) => {
        if (e.target.textContent === "Delete") {
            dispatch(deleteBoard())
            dispatch(setBoardActive({ i: 0 }));
            setIsDeleteModalOpen(false)
        } else {
            setIsDeleteModalOpen(false)
        }
    }

    const setOpenEditModal = () => {
        setBoardCreateType("edit")
        setIsBoardModalOpen(true)
        setIsEllipsisMenuOpen(false)
        console.log('boardCreateType :', boardCreateType)
    }
  
    const setOpenDeleteModal = () => {
        setIsDeleteModalOpen(true)
        setIsEllipsisMenuOpen(false)
    }    

    return <>
        <div className='p-4 '>
            <header className='flex justify-between'>
                <div className='flex w-1/2 space-x-2 justify-start md:justify-between items-center'>
                    <div className='flex items-center space-x-2'>
                        <img src={logo} alt="logo" className='h-6 w-6' />
                        <h3 className='text-2xl hidden md:block'>KanbanFlow</h3>
                    </div>
                    <div className='flex justify-start items-center space-x-1'>
                        <h3 className='text-xl'>{boardHeader?.name}</h3>
                        <img src={openDropDown ? iconUp : iconDown} onClick={() => handleDropDown()} alt="dropdownIcon" className='cursor-pointer md:hidden w-2.25 h-2.25 '/>
                    </div>
                </div>
                <div className='flex justify-center items-center space-x-5'>
                    <button onClick={handleCreateTask} className='newTaskbutton text-lg hidden md:block px-2 py-1.5 text-white m-1 w-32 rounded-lg bg-purple-600'><span className='me-2'><FontAwesomeIcon icon={faPlus}/></span>Add Task</button>
                    <button onClick={handleCreateTask} className='newTaskbutton md:hidden p-0 m-1 w-10 h-10 rounded-full bg-purple-600'><FontAwesomeIcon icon={faPlus}/></button>
                    <div className='pe-2 cursor-pointer' onClick={handleEllipsisMenu}><FontAwesomeIcon icon={faEllipsisVertical}/></div>
                </div>
                {
                    isEllipsisMenuOpen && <EllipsisMenu boardCreateType='edit' setBoardCreateType={setBoardCreateType} setOpenEditModal={setOpenEditModal} setOpenDeleteModal={setOpenDeleteModal} type="Boards"/>
                }
            </header>
        </div>

        {
            openDropDown && <HeaderDropDown setOpenDropDown={setOpenDropDown} setIsBoardModalOpen={setIsBoardModalOpen}/>
        }

        {
            isBoardModalOpen && <AddEditBoardModal boardCreateType={boardCreateType} setIsBoardModalOpen={setIsBoardModalOpen}/>
        }

        {
            isTaskModalOpen && <AddEditTaskModal setIsAddTaskModalOpen={setIsTaskModalOpen} setIsTaskModalOpen={setIsTaskModalOpen} taskType="add" device="mobile" prevColIndex={0} taskIndex={0} />
        }

        {
            isDeleteModalOpen && <DeleteModal setIsDeleteModalOpen={setIsDeleteModalOpen}  type="board" title={boardHeader?.name} onDeleteBtnClick={onDeleteBtnClick} />        
        }
    </>
}

export default Header