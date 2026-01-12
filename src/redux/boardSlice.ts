import { createSlice } from "@reduxjs/toolkit"
// import data from '../data.json'

export interface SubTaskData {
    title : string,
    isCompleted : boolean
}

export interface TaskData {
    title : string,
    description : string,
    status : string
    subtasks : SubTaskData[],
    selectedPriority : string,
    assigneeName : string,
    dueDate : string,
}

export interface ColumnData {
    name : string,
    tasks : TaskData[]
}

export interface BoardData {
    name : string,
    isActive : boolean,
    columns : ColumnData[]
}

export interface BoardState {
    boards : BoardData[]
}

interface BoardActiveStatus {
    isActive: boolean
}

const initialState: BoardState = {
    boards : JSON.parse(localStorage.getItem('boards') || '[]')
    // boards : data.boards
}

const boardSlice = createSlice({
    name: 'kanbanBoard',
    initialState,
    reducers : {
        setBoardActive:(state, action) => {
            state.boards.map((board: BoardActiveStatus, index: number) => {
                index === action.payload.i
                  ? (board.isActive = true)
                  : (board.isActive = false)
                return board;
            })
            localStorage.setItem('boards', JSON.stringify(state.boards))
        },
        addBoard : (state, action ) => {
            const isActive : boolean = state.boards.length > 0 ? false : true;
            const payload = action.payload
            const board : BoardData = {
                name: payload.name,
                isActive,
                columns: payload.newColumns,
            };
            state.boards.push(board)
            localStorage.setItem('boards', JSON.stringify(state.boards))
        },
        editBoard: (state, action) => {
            const payload = action.payload
            const board = state.boards.find((board : any) => board.isActive)
            if(board) board.name = payload.name
            if(board) board.columns = payload.newColumns             
            localStorage.setItem('boards', JSON.stringify(state.boards))
        },
        deleteBoard: (state) => {
            const board = state.boards.find((board) => board.isActive)
            if(board) { state.boards.splice(state.boards.indexOf(board), 1) }
            localStorage.setItem('boards', JSON.stringify(state.boards))
        },
        addTask: (state, action) => {
            const { title, description,subtasks, status, assigneeName, selectedPriority, dueDate, newColIndex} =
              action.payload
            const task = { title, description, subtasks, status, assigneeName, selectedPriority, dueDate }
            const board = state.boards.find((board) => board.isActive)
            const column = board?.columns.find((_col, index) => index === newColIndex)
            column?.tasks.push(task)
            localStorage.setItem('boards', JSON.stringify(state.boards))
        },
        editTask: (state, action) => {
            const { title, description,subtasks, status, assigneeName, selectedPriority, dueDate, prevColIndex, taskIndex, newColIndex} = action.payload
            const board = state.boards.find((board) => board.isActive)
            const column = board?.columns.find((_col, index) => index === prevColIndex)
            const task = column?.tasks.find((_task, index) => index === taskIndex)
            if(task){
                task.title = title
                task.status = status
                task.description = description
                task.subtasks = subtasks
                task.assigneeName = assigneeName
                task.selectedPriority = selectedPriority
                task.dueDate = dueDate
            }           
            if (prevColIndex === newColIndex) return
            if(column) column.tasks = column?.tasks.filter((_task, index) => index !== taskIndex)
            const newCol = board?.columns.find((_col, index) => index === newColIndex)
            if(task) newCol?.tasks.push(task)
            localStorage.setItem('boards', JSON.stringify(state.boards))
        },    
        dragTask: (state, action) => {
            const { colIndex, prevColIndex, taskIndex } = action.payload
            const board = state.boards.find((board: { isActive: any }) => board.isActive)
            const prevCol = board?.columns.find((_col: any, i: any) => i === prevColIndex)
            const task = prevCol?.tasks.splice(taskIndex, 1)[0]
            if(task) board?.columns.find((_col, i) => i === colIndex)?.tasks.push(task)
            localStorage.setItem('boards', JSON.stringify(state.boards))
        },
        setSubtaskCompleted: (state, action) => {
            const payload = action.payload;
            const board = state.boards.find((board) => board.isActive);
            const col = board?.columns.find((_col, i) => i === payload.colIndex);
            const task = col?.tasks.find((_task, i) => i === payload.taskIndex);
            const subtask = task?.subtasks.find((_subtask, i) => i === payload.index);
            if(subtask) subtask.isCompleted = !subtask?.isCompleted;
            localStorage.setItem('boards', JSON.stringify(state.boards))
        },
        setTaskStatus: (state, action) => {
            const payload = action.payload;
            const board = state.boards.find((board) => board.isActive);
            const columns = board?.columns;
            const col = columns?.find((_col, i) => i === payload.colIndex);
            if (payload.colIndex === payload.newColIndex) return;
            const task = col?.tasks.find((_task, i) => i === payload.taskIndex);
            if(task) task.status = payload.status;
            if(col) col.tasks = col?.tasks.filter((_task, i) => i !== payload.taskIndex);
            const newCol = columns?.find((_col, i) => i === payload.newColIndex);
            if(task) newCol?.tasks?.push(task);
            localStorage.setItem('boards', JSON.stringify(state.boards))
        },
        deleteTask: (state, action) => {
            const payload = action.payload;
            const board = state.boards.find((board) => board.isActive);
            const col = board?.columns.find((_col, i) => i === payload.colIndex);
            if(col) col.tasks = col?.tasks.filter((_task, i) => i !== payload.taskIndex);
            localStorage.setItem('boards', JSON.stringify(state.boards))
        },
    }
})

export const { setBoardActive, addBoard, editBoard, deleteBoard, addTask,  editTask, dragTask, setSubtaskCompleted, setTaskStatus, deleteTask} = boardSlice.actions
export default boardSlice.reducer