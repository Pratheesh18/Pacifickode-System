import axios from 'axios'
import type { Employee } from '../types'

const BASE = `${import.meta.env.VITE_BACKEND_API_URL}/employee`

export const getEmployees = () =>
  axios.get<Employee[]>(BASE)

export const addEmployee = (data: Employee) =>
  axios.post(BASE, data)

export const updateEmployee = (employeeId: number, data: Employee) =>
  axios.put(`${BASE}/${employeeId}`, data)

export const deleteEmployee = (employeeId: number) =>
  axios.delete(`${BASE}/${employeeId}`)