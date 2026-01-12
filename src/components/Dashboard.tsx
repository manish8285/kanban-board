import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../redux/Store"
import { setBoardActive } from "../redux/boardSlice"
import Header from "./Header"
import Center from "./Center"
import EmptyBoard from "./EmptyBoard"

function Dashboard() {
  const dispatch = useDispatch()
  const boards = useSelector((state:RootState)=> state.board.boards)
  const activeBoard = boards.find((board)=> board.isActive)

  const [isBoardModalOpen, setIsBoardModalOpen] = useState<boolean>(false)
  
  if(!activeBoard && boards.length>0){
    dispatch(setBoardActive({i:0}))
  }
  
  return  <>
    <div className="overflow-hidden overflow-x-scroll">
      {
        boards.length>0 ? <>
          <Header isBoardModalOpen={isBoardModalOpen} setIsBoardModalOpen={setIsBoardModalOpen}/>
          <Center isBoardModalOpen={isBoardModalOpen} setIsBoardModalOpen={setIsBoardModalOpen}/>
        </>
        :
        <>
          <EmptyBoard type='add' isBoardModalOpen={isBoardModalOpen} setIsBoardModalOpen={setIsBoardModalOpen}/>
        </>
      }
    </div>
  </>
}

export default Dashboard