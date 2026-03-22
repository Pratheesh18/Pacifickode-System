import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import type { Department } from '../types'
import  { departmentSchema } from '../schemas/departmentSchema'
import  type { DepartmentFormData } from '../schemas/departmentSchema'
import {
  getDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment,
} from '../api/departmentApi'
import FormInput from '../components/FormInput'
import PageHeader from '../components/PageHeader'
import ConfirmDeleteModal from '../components/ConfirmDeleteModal'
import TableSpinner from '../components/TableSpinner'
import { getErrorMessage } from '../utils/errorHelper'

export default function Departments() {
  const [departments,  setDepartments]  = useState<Department[]>([])
  const [loading,      setLoading]      = useState(false)
  const [showModal,    setShowModal]    = useState(false)
  const [editingId,    setEditingId]    = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Department | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema),
  })

  useEffect(() => {
    loadDepartments()
  }, [])
  
const loadDepartments = async () => {
  setLoading(true)
  try {
    const res = await getDepartments()
    const data = Array.isArray(res.data) ? res.data : []  // ← this line
    setDepartments(data)
  } catch {
    toast.error('Failed to load departments.')
    setDepartments([])
  } finally {
    setLoading(false)
  }
}

  const openAdd = () => {
    reset({ departmentId: '', departmentName: '' })
    setEditingId(null)
    setShowModal(true)
  }

  const openEdit = (dept: Department) => {
    reset({
      departmentId: dept.departmentId,
      departmentName: dept.departmentName,
    })
    setEditingId(dept.departmentId)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingId(null)
    reset()
  }

  const onSubmit = async (data: DepartmentFormData) => {
    try {
      if (editingId) {
        await updateDepartment(editingId, {
          departmentId: editingId,
          departmentName: data.departmentName,
        })
        toast.success('Department updated successfully.')
      } else {
        await addDepartment({
          departmentId: data.departmentId.trim().toUpperCase(),
          departmentName: data.departmentName.trim(),
        })
        toast.success('Department added successfully.')
      }
      closeModal()
      loadDepartments()
    } catch (err: unknown) {
         toast.error(getErrorMessage(err, 'Failed to load departments'))
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteDepartment(deleteTarget.departmentId)
      toast.success('Department deleted successfully.')
      setDeleteTarget(null)
      loadDepartments()
    } catch (err: unknown) {
   toast.error(getErrorMessage(err, 'Cannot delete'))
      setDeleteTarget(null)
    }
  }

  return (
    <div className="container">
      <div className="page-card">
        <PageHeader title="Departments"  buttonLabel="+ Add Department"  onButtonClick={openAdd}/>
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>Department ID</th>
                <th>Department name</th>
                <th style={{ width: '170px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              <TableSpinner  colSpan={3}  loading={loading}  emptyMessage="No departments found. Click '+ Add Department' to create one." >
                {departments.map((dept) => (
                  <tr key={dept.departmentId}>
                    <td>
                      <span className="badge bg-primary fs-6 fw-normal px-3 py-1">
                        {dept.departmentId}
                      </span>
                    </td>
                    <td>{dept.departmentName}</td>
                    <td>
                      <button className="btn btn-outline-secondary btn-sm me-2" onClick={() => openEdit(dept)}>
                        Edit
                      </button>
                      <button className="btn btn-outline-danger btn-sm" onClick={() => setDeleteTarget(dept)}>
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
          <div className="modal-box modal-box-sm" onClick={(e) => e.stopPropagation()}>
            <h5 className="mb-4 fw-semibold">
              {editingId ? 'Edit Department' : 'Add Department'}
            </h5>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="mb-3">
                <FormInput label="Department ID" type="text" placeholder="e.g. ENG" maxLength={10} disabled={!!editingId} registration={register('departmentId')} error={errors.departmentId}/>
              </div>
              <div className="mb-4">
                <FormInput label="Department name" type="text" placeholder="e.g. Engineering" maxLength={100} registration={register('departmentName')} error={errors.departmentName}/>
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm px-4" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Saving...
                    </>
                  ) : editingId ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <ConfirmDeleteModal message={`Are you sure you want to delete department "${deleteTarget.departmentId} — ${deleteTarget.departmentName}"?`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)}/>
      )}
    </div>
  )
}