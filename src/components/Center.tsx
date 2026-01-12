import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "../redux/Store"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import SideBar from "./SideBar"
import EmptyBoard from "./EmptyBoard"
import Column from "./Column"


interface Props {
  isBoardModalOpen : boolean,
  setIsBoardModalOpen :React.Dispatch<React.SetStateAction<boolean>>
}

function Center({setIsBoardModalOpen, isBoardModalOpen} : Props) {

  const boards = useSelector((state : RootState) => state.board.boards)
  const board = boards.find((board ) => board.isActive)
  const columns = board?.columns
  const [isSideBarOpen, setIsSideBarOpen] = useState<boolean>(true)
  const [windowSize, setWindowSize] = useState<number[]>([
    window.innerWidth,
    window.innerHeight,
  ])

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize([window.innerWidth, window.innerHeight])
    }
    window.addEventListener("resize", handleWindowResize)
    return () => {
      window.removeEventListener("resize", handleWindowResize)
    }
  })

  return <>
    <div className={windowSize[0] >= 768 && isSideBarOpen ? " bg-[#f4f7fd]  scrollbar-hide h-screen flex dark:bg-[#20212c]  overflow-x-scroll gap-6  ml-[261px]" : "bg-[#f4f7fd]  scrollbar-hide h-screen flex    dark:bg-[#20212c] overflow-x-scroll gap-6"}>
      {
        windowSize[0] >= 768 && <SideBar setIsBoardModalOpen={setIsBoardModalOpen} isBoardModalOpen={isBoardModalOpen} isSideBarOpen={isSideBarOpen} setIsSideBarOpen={setIsSideBarOpen}/>
      }

      {/* Columns Section */}
      {
        columns && columns?.length > 0 ? <>
          {
            columns?.map((_col, i) => {
              return <Column key={i} colIndex={i} />
            })
          }
          <div onClick={()=>{setIsBoardModalOpen(true)}} className=" h-screen dark:bg-[#2b2c3740] flex justify-center items-center font-bold text-2xl hover:text-[#635FC7] transition duration-300 cursor-pointer bg-[#E9EFFA] scrollbar-hide mb-2   mx-5 pt-[90px] min-w-[280px] text-[#828FA3] mt-[135px] rounded-lg "><FontAwesomeIcon icon={faPlus}/>New Column</div>
        </>
        : 
        <>
          <EmptyBoard type="edit" setIsBoardModalOpen={setIsBoardModalOpen} isBoardModalOpen={isBoardModalOpen}/>
        </>
      }
    </div>
  </>
}

export default Center