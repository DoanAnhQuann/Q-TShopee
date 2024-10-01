import useRouteElements from './useRouteElements'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
function App() {
  const routeRElements = useRouteElements()
  return (
    <div>
      {routeRElements}
      <ToastContainer />
    </div>
  )
}

export default App
