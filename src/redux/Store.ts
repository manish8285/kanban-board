import { configureStore } from "@reduxjs/toolkit"
import themeReducer from './ThemeSlice'
import boardReducer from './boardSlice'

export const store = configureStore({
    reducer : {
        theme: themeReducer,
        board : boardReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch