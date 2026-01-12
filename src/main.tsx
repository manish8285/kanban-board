import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Provider } from 'react-redux'
import { store } from './redux/Store.ts'
import { setTheme } from './redux/ThemeSlice.ts'

const savedTheme = localStorage.getItem('theme') === 'dark' ? 'dark' : 'light'
if (savedTheme) {
  store.dispatch(setTheme(savedTheme));
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App/>
    </Provider>
  </React.StrictMode>,
)
