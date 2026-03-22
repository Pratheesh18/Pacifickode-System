import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Navbar from './components/Navbar'
import Departments from './pages/Departments'
import Employees from './pages/Employees'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/departments" replace />} />
        <Route path="/departments" element={<Departments />} />
        <Route path="/employees" element={<Employees />} />
      </Routes>
      <ToastContainer position="bottom-right"  autoClose={3000}  hideProgressBar={false}  closeOnClick  pauseOnHover/>
    </BrowserRouter>
  )
}