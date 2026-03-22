import type { AxiosError } from 'axios'

export const getErrorMessage = (err: unknown, fallback: string): string => {
  const axiosErr = err as AxiosError<string>
  return axiosErr.response?.data ?? fallback
}