import { NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4 mb-4 shadow-sm">
      <span className="navbar-brand">
        PacificKode System
      </span>
      <div className="navbar-nav ms-auto d-flex flex-row gap-3">
        <NavLink  to="/departments" className={({ isActive }) =>'nav-link' + (isActive ? ' fw-semibold text-white border-bottom border-white border-2' : '')}>
          Departments
        </NavLink>
        <NavLink to="/employees"className={({ isActive }) =>'nav-link' + (isActive ? ' fw-semibold text-white border-bottom border-white border-2' : '')}>
          Employees
        </NavLink>
      </div>
    </nav>
  )
}