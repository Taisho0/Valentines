import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Invitation from './Pages/Invitation'
function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Invitation />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
