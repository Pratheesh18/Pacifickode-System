import axios from 'axios'
import type { Department } from '../types/index'

const BASE = `${import.meta.env.VITE_BACKEND_API_URL}/department`

export const getDepartments = () =>
  axios.get<Department[]>(BASE)

export const addDepartment = (data: Department) =>
  axios.post(BASE, data)

export const updateDepartment = (departmentId: string, data: Department) =>
  axios.put(`${BASE}/${departmentId}`, data)

export const deleteDepartment = (departmentId: string) =>
  axios.delete(`${BASE}/${departmentId}`)