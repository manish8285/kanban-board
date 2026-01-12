import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../redux/Store"
import { setBoardActive } from "../redux/boardSlice"
import boardIcon from '../assets/boardIcon.svg'
import showSidebarIcon from '../assets/showSidebarIcon.svg'
import hideSidebarIcon from '../assets/hideSidebarIcon.svg'
import AddEditBoardModal from "../modals/AddEditBoardModal"
import Theme from "./Theme"
interface Props {
    isBoardModalOpen : boolean,
    isSideBarOpen: boolean,
    setIsBoardModalOpen :React.Dispatch<React.SetStateAction<boolean>>
    setIsSideBarOpen:React.Dispatch<React.SetStateAction<boolean>>
}

function SideBar({isBoardModalOpen, setIsBoardModalOpen,isSideBarOpen, setIsSideBarOpen}:Props) {

  const [boardCreateType, setBoardCreateType] = useState<string>("edit")
  const dispatch = useDispatch()
  const boards = useSelector((state: RootState) => state.board.boards)

  const toggleSidebar = () => {
    setIsSideBarOpen((curr) => !curr)
  }

  const handleBoardCreate = () => {
    setIsBoardModalOpen(true)
    setBoardCreateType("add")
  }

  return <>
    <div>
      <div className={ isSideBarOpen? `min-w-[261px] bg-white dark:bg-[#2b2c37] fixed top-[72px] h-screen items-center left-0 z-20` : `bg-[#635FC7] dark:bg-[#2b2c37] dark:hover:bg-[#635FC7] top-auto bottom-10 justify-center items-center hover:opacity-80 cursor-pointer  p-0 transition duration-300 transform fixed felx w-[56px] h-[48px] rounded-r-full `}>
        <div>
          {
            isSideBarOpen && <>
              <div className="bg-white dark:bg-[#2b2c37] w-full py-4 rounded-xl">
                <h3 className="dark:text-gray-300 text-gray-600 font-semibold mx-4 mb-8 ">ALL BOARDS ({boards?.length})</h3>
                <div className="dropdown-borad flex flex-col h-[70vh] justify-between ">
                  <div>
                    {
                      boards.map((board, i) => {
                        return <div key={i} onClick={() => {dispatch(setBoardActive({ i }))}} className={` flex items-baseline space-x-2 px-5 mr-8 rounded-r-full duration-500 ease-in-out py-4 cursor-pointer hover:bg-[#635fc71a] hover:text-[#635fc7] dark:hover:bg-white dark:hover:text-[#635fc7] dark:text-white ${board.isActive && "bg-[#635fc7] rounded-r-full text-white mr-8"}`}>
                          <img src={boardIcon} className="  filter-white  h-4 " />{" "}
                          <p className=" text-lg font-bold ">{board.name}</p>
                        </div>
                      })
                    }
                    <div onClick={() => handleBoardCreate()} className=" flex  items-baseline space-x-2  mr-8 rounded-r-full duration-500 ease-in-out cursor-pointer text-[#635fc7] px-5 py-4 hover:bg-[#635fc71a] hover:text-[#635fc7] dark:hover:bg-white  ">
                      <img src={boardIcon} className="filter-white h-4 " />
                      <p className=" text-lg font-bold">Create New Board </p>
                    </div>
                  </div>
                  <div className=" mx-2  p-4 relative space-x-2 bg-slate-100 dark:bg-[#20212c] flex justify-center items-center rounded-lg">
                    <Theme/>
                  </div>
                </div>
              </div>
            </>
          }

          {/* Sidebar toggle */}
          {
            isSideBarOpen ? <>
              <div onClick={() => toggleSidebar()} className=" flex  items-center mt-2  absolute bottom-16  text-lg font-bold  rounded-r-full hover:text-[#635FC7] cursor-pointer mr-6 mb-8 px-8 py-4 hover:bg-[#635fc71a] dark:hover:bg-white  space-x-2 justify-center  my-4 text-gray-500 ">
                <img src={hideSidebarIcon} className=" min-w-[20px]" alt=" side bar show/hide"/>
                {isSideBarOpen && <p> Hide Sidebar </p>}
              </div>
            </> : <>
              <div className=" absolute p-5  " onClick={() => toggleSidebar()}>
                <img src={showSidebarIcon} alt="showSidebarIcon" />
              </div>
            </>
          }
        </div>
      </div>

      {
        isBoardModalOpen && <AddEditBoardModal boardCreateType={boardCreateType} setIsBoardModalOpen={setIsBoardModalOpen}/>
      }
      
    </div>
  </>
}

export default SideBar