import { ApiResponse, PaginatedResponse } from '../types'

export interface SuccessResponse<T = any> {
  success: true
  data: T
  message?: string
}

export interface ErrorResponse {
  success: false
  error: string
  details?: any
}

export type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse

// 성공 응답 생성 함수
export function createSuccessResponse<T>(data: T, message?: string): SuccessResponse<T> {
  return {
    success: true,
    data,
    ...(message && { message })
  }
}

// 에러 응답 생성 함수
export function createErrorResponse(error: string, details?: any): ErrorResponse {
  return {
    success: false,
    error,
    ...(details && { details })
  }
}

// 페이지네이션 응답 생성 함수
export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginatedResponse<T> {
  const totalPages = Math.ceil(total / limit)

  return {
    success: true,
    data,
    total,
    page,
    limit,
    totalPages
  }
}

export function isSuccessResponse<T>(response: ApiResponse<T>): response is SuccessResponse<T> {
  return response.success === true
}

export function isErrorResponse(response: ApiResponse): response is ErrorResponse {
  return response.success === false
}

export default {
  createSuccessResponse,
  createErrorResponse,
  createPaginatedResponse
}
