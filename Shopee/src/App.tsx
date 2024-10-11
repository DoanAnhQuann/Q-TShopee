import { useContext, useEffect } from 'react'
import useRouteElements from './useRouteElements'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { localStorageEventTarget } from './utils/auth'
import { AppContext } from './Contexts/app.context'
function App() {
  const routeRElements = useRouteElements()

  //goi su kien reset tu appcontext
  const { reset } = useContext(AppContext)

  //lang nghe 1 su kien len dung useeffect va sau khi dung xong clear de an toan bo nho
  useEffect(() => {
    //ben nay dung de lang nghe su kien tren toan file clearLS neu co su kien se chay ham nay return lai function reset 
    localStorageEventTarget.addEventListener('clearLS', () => {
      reset()
    })
    return () => {
      localStorageEventTarget.removeEventListener('clearLs', () => {
        reset()
      })
    }
  }, [reset])
  return (
    <div>
      {routeRElements}
      <ToastContainer />
    </div>
  )
}

export default App
