import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import type { Employee, Department } from '../types'
import { employeeSchema} from '../schemas/employeeSchema'
import type { EmployeeFormData} from '../schemas/employeeSchema'
import {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
} from '../api/employeeApi'
import { getDepartments } from '../api/departmentApi'
import FormInput from '../components/FormInput'
import FormSelect from '../components/FormSelect'
import PageHeader from '../components/PageHeader'
import ConfirmDeleteModal from '../components/ConfirmDeleteModal'
import TableSpinner from '../components/TableSpinner'
import { getErrorMessage } from '../utils/errorHelper'

const calculateAge = (dob: string): number => {
  if (!dob) return 0
  const today = new Date()
  const birth = new Date(dob)
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}

const formatCurrency = (val: number): string =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(val)

const formatDate = (val: string): string =>
  new Date(val).toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

const getMaxDOB = (): string => {
  const d = new Date()
  d.setFullYear(d.getFullYear() - 18)
  return d.toISOString().split('T')[0]
}

export default function Employees() {
  const [employees,setEmployees]    = useState<Employee[]>([])
  const [departments,setDepartments]  = useState<Department[]>([])
  const [loading,setLoading]      = useState(false)
  const [showModal,setShowModal]    = useState(false)
  const [editingId,setEditingId]    = useState<number | null>(null)
  const [deleteTarget,setDeleteTarget] = useState<Employee | null>(null)
  const [watchedDOB,setWatchedDOB]   = useState('')

  const {register, handleSubmit, reset, watch, formState: { errors, isSubmitting },} = useForm<EmployeeFormData>({ resolver: zodResolver(employeeSchema),})
  const dobValue = watch('dateOfBirth')

  useEffect(() => {
    setWatchedDOB(dobValue ?? '')
  }, [dobValue])

  useEffect(() => {
    loadAll()
  }, [])

  const loadAll = async () => {
    setLoading(true)
    try {
      const [empRes, deptRes] = await Promise.all([
        getEmployees(),
        getDepartments(),
      ])
      setEmployees(empRes.data)
      setDepartments(deptRes.data)
    } catch {
      toast.error('Failed to load data.')
    } finally {
      setLoading(false)
    }
  }

  const openAdd = () => {
    reset({
      firstName:    '',
      lastName:     '',
      email:        '',
      dateOfBirth:  '',
      salary:       undefined,
      departmentId: '',
    })
    setEditingId(null)
    setWatchedDOB('')
    setShowModal(true)
  }

  const openEdit = (emp: Employee) => {
    const dob = emp.dateOfBirth.split('T')[0]
    reset({
      firstName:    emp.firstName,
      lastName:     emp.lastName,
      email:        emp.email,
      dateOfBirth:  dob,
      salary:       emp.salary,
      departmentId: emp.departmentId,
    })
    setEditingId(emp.employeeId!)
    setWatchedDOB(dob)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingId(null)
    setWatchedDOB('')
    reset()
  }

  const onSubmit = async (data: EmployeeFormData) => {
    const payload: Employee = {
      firstName:    data.firstName.trim(),
      lastName:     data.lastName.trim(),
      email:        data.email.trim(),
      dateOfBirth:  data.dateOfBirth,
      salary:       data.salary,
      departmentId: data.departmentId,
    }
    try {
      if (editingId !== null) {
        await updateEmployee(editingId, payload)
        toast.success('Employee updated successfully.')
      } else {
        await addEmployee(payload)
        toast.success('Employee added successfully.')
      }
      closeModal()
      loadAll()
    } catch (err: unknown) {
         toast.error(getErrorMessage(err, 'error occurred.'))
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteEmployee(deleteTarget.employeeId!)
      toast.success('Employee deleted successfully.')
      setDeleteTarget(null)
      loadAll()
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'Cannot delete'))
      setDeleteTarget(null)
    }
  }

  const departmentOptions = departments.map((d) => ({
    value: d.departmentId,
    label: `${d.departmentId} — ${d.departmentName}`,
  }))

  return (
    <div className="container">
      <div className="page-card">
        <PageHeader title="Employees" buttonLabel="+ Add Employee" onButtonClick={openAdd}/>
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Date of birth</th>
                <th>Age</th>
                <th>Salary</th>
                <th>Department</th>
                <th style={{ width: '170px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              <TableSpinner colSpan={7} loading={loading} emptyMessage="No employees found">
                {employees.map((emp) => (
                  <tr key={emp.employeeId}>
                    <td className="fw-medium">
                      {emp.firstName} {emp.lastName}
                    </td>
                    <td className="text-muted">{emp.email}</td>
                    <td>{formatDate(emp.dateOfBirth)}</td>
                    <td>
                      <span className="age-badge">{emp.age}</span>
                    </td>
                    <td>{formatCurrency(emp.salary)}</td>
                    <td>
                      <span className="badge bg-success fw-normal px-2 py-1">
                        {emp.departmentId}
                      </span>
                      <span className="text-muted ms-2" style={{ fontSize: '0.8rem' }}>
                        {emp.departmentName}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-outline-secondary btn-sm me-2" onClick={() => openEdit(emp)}>
                        Edit
                      </button>
                      <button className="btn btn-outline-danger btn-sm" onClick={() => setDeleteTarget(emp)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </TableSpinner>
            </tbody>
          </table>
        </div>
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h5 className="mb-4 fw-semibold">
              {editingId !== null ? 'Edit Employee' : 'Add Employee'}
            </h5>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="row g-3">
                <div className="col-md-6">
                  <FormInput label="First name" type="text" placeholder="Prathees" maxLength={50} registration={register('firstName')} error={errors.firstName}/>
                </div>
                <div className="col-md-6">
                  <FormInput label="Last name"  type="text" placeholder="balachandran" maxLength={50} registration={register('lastName')} error={errors.lastName}/>
                </div>
                <div className="col-12">
                  <FormInput label="Email address" type="email" placeholder="pratheesh@gmail.com" maxLength={100} registration={register('email')} error={errors.email}
                  />
                </div>
                <div className="col-md-6">
                  <FormInput label="Date of birth" type="date" max={getMaxDOB()} registration={register('dateOfBirth')} error={errors.dateOfBirth}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium text-muted">
                    Age (auto-calculated)
                  </label>
                  <div className="mt-1">
                    {watchedDOB ? (
                      <span className="age-badge">
                        {calculateAge(watchedDOB)} years old
                      </span>
                    ) : (
                      <span className="text-muted" style={{ fontSize: '0.875rem' }}>
                        Select  date of birth
                      </span>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <FormInput label="Salary (USD)" type="number" placeholder="0.00"  min={0} step="0.01" registration={register('salary', { valueAsNumber: true })} error={errors.salary}
                  />
                </div>
                <div className="col-md-6">
                  <FormSelect label="Department" options={departmentOptions} placeholder="Select department" registration={register('departmentId')} error={errors.departmentId}
                  />
                </div>
              </div>
              <div className="d-flex justify-content-end gap-2 mt-4">
                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm px-4" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Saving...
                    </>
                  ) : editingId !== null ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {deleteTarget && (
        <ConfirmDeleteModal message={`Are you sure you want to delete "${deleteTarget.firstName} ${deleteTarget.lastName}"?`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}