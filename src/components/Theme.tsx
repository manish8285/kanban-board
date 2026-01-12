import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme } from '../redux/ThemeSlice'
import { RootState } from '../redux/Store'
import { useEffect } from 'react'
import lightIcon from '../assets/lightIcon.svg'
import darkIcon from '../assets/darkIcon.svg'

function Theme() {

  const theme = useSelector((state:RootState) => state.theme.mode)
  const dispatch = useDispatch()

  useEffect(()=> {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  },[theme])

  return <>
    <div className=" mx-2  p-4  space-x-2 bg-slate-100 dark:bg-[#20212c] flex justify-center items-center rounded-lg">
      <img src={lightIcon} alt="sun indicating light mode" />      
      <label className="inline-flex items-center cursor-pointer">
        <input type="checkbox" value="" className="sr-only peer"/>
        <div onClick={() => dispatch(toggleTheme())} className="relative w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 dark:peer-focus:ring-black-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-none after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-slate-500 after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-white"></div>
      </label>
      <img src={darkIcon} alt="moon indicating dark mode" />
    </div>
  </>
}

export default Theme