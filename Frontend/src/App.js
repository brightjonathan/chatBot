import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './Pages/Login'
import Register from './Pages/Register'
import Chat from './Pages/Chat'
import SetAvatar from './Components/SetAvatar'


const App = () => {
  return (
    <>
     <Router>
       <Routes>
        <Route path='/' element={<Chat/> }/>
         <Route path='/register' element={<Register/>}/>
         <Route path='/login' element={<Login/>}/>
         <Route path='/setAvatar' element={<SetAvatar/>}/>
       </Routes>
     </Router>
    
    </>
  )
}

export default App
