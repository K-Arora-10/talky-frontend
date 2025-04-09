
import { Routes,Route } from 'react-router-dom'
import EnterDetails from './components/EnterDetails'
import VideoCallPage from './components/VideoCallPage'
function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<EnterDetails/>}/>
        <Route path='/room/:roomId' element={<VideoCallPage/>}/>
      </Routes>
    </>
  )
}

export default App
