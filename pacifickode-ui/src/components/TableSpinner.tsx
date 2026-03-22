import React from 'react'

interface Props {
  colSpan: number
  emptyMessage?: string
  loading: boolean
  children: React.ReactNode
}

export default function TableSpinner({
  colSpan,
  emptyMessage = 'No records',
  loading,
  children,
}: Props) {
  if (loading) {
    return (
      <tr>
        <td colSpan={colSpan} className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </td>
      </tr>
    )
  }

  if (!React.Children.count(children)) {
    return (
      <tr>
        <td colSpan={colSpan} className="text-center text-muted py-4">
          {emptyMessage}
        </td>
      </tr>
    )
  }

  return <>{children}</>
}