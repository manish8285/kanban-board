import React from "react";
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../redux/Store"
import { setBoardActive } from '../redux/boardSlice'
import boardIcon from '../assets/boardIcon.svg'
import Theme from "./Theme"

interface Props {
    setOpenDropDown : React.Dispatch<React.SetStateAction<boolean>>,
    setIsBoardModalOpen :React.Dispatch<React.SetStateAction<boolean>>,
}

function HeaderDropDown ({setOpenDropDown, setIsBoardModalOpen} : Props) {

    const boards = useSelector((state :RootState) => state.board)
    const dispatch = useDispatch()

    const handletScreenClickTarget = (e : any) => {
        if(e.target !== e.currentTarget) return         // to close the dropdown on click anywhere in screen
        setOpenDropDown(false)
    }

    const handleCreateBoard = () => {
        setOpenDropDown(false)
        setIsBoardModalOpen(true)
    }

    return <>
        <div className="py-10 px-6 absolute left-0 right-0 bottom-[-100vh] top-20 bg-slate-400" onClick={(e)=> {handletScreenClickTarget(e)}}>
            {/* dropdown modal */}
            <div className=" bg-white dark:bg-[#2b2c37] shadow-md shadow-[#364e7e1a]  w-full py-4 rounded-xl">
                <h3 className=" dark:text-gray-300 text-gray-600 font-semibold mx-4 mb-8">ALL BOARDS ({boards?.boards?.length})</h3>
                <div>
                    {
                        boards?.boards.map((e,i) => {
                            return <div key={i}>
                                <div onClick={() => dispatch(setBoardActive({i}))}  className={`flex items-baseline space-x-2 px-5 py-4 ${e.isActive && "bg-[#635fc7] rounded-r-full text-white mr-8 "}`}>
                                    <img src={boardIcon} className="filter-white  h-4 " />{" "}
                                    <p className=" text-lg font-bold  ">{e.name}</p>
                                </div>
                            </div>
                        })
                    }
                    <div onClick={() => handleCreateBoard()} className=" flex items-baseline space-x-2 text-[#635fc7] px-5 py-4">
                        <img src={boardIcon} className="filter-white  h-4 " />
                        <p className=" text-lg font-bold">Create New Board</p>
                    </div>
                    <Theme/>
                </div>
            </div>
        </div>
    </>
}

export default HeaderDropDown