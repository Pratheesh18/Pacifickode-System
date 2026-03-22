import { z } from 'zod'

export const departmentSchema = z.object({
  departmentId: z
    .string()
    .min(1, 'Department ID is required.')
    .max(10, 'Maximum 10 characters.')
    .regex(/^[A-Za-z0-9]+$/, 'Department ID must be alphanumeric only.'),

  departmentName: z
    .string()
    .min(1, 'Department name is required.')
    .max(100, 'Maximum 100 characters.'),
})

export type DepartmentFormData = z.infer<typeof departmentSchema>