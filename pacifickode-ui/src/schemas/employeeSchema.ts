import { z } from 'zod'

export const employeeSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required.')
    .max(50, 'Maximum 50 characters.'),

  lastName: z.string().min(1, 'Last name is required.').max(50, 'Maximum 50 characters.'),

  email: z.string().min(1, 'Email is required.').email('Enter a valid email address.').max(100, 'Maximum 100 characters.'),

  dateOfBirth: z.string().min(1, 'Date of birth is required.')
    .refine((val) => {
      const dob = new Date(val)
      const minDOB = new Date()
      minDOB.setFullYear(minDOB.getFullYear() - 18)
      return dob <= minDOB
    }, 'Employee must be at least 18 years old.'),

  salary: z.number().nonnegative('Salary cannot be negative.').refine((val) => !isNaN(val), 'Salary must be a valid number.'),

  departmentId: z.string().min(1, 'Department is required.'),
})

export type EmployeeFormData = z.infer<typeof employeeSchema>