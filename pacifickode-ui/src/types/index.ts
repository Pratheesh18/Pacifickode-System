export interface Department{
    departmentId : string
    departmentName :string
}

export interface Employee {
  employeeId?: number
  firstName: string
  lastName: string
  email: string
  dateOfBirth: string
  age?: number
  salary: number
  departmentId: string
  departmentName?: string
}