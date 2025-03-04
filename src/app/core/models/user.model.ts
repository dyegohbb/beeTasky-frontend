export type User = {
  identifier: string;
  username: string;
  email: string;
}

export type CreateUserRequest = {
  username: string;
  password: string;
  email: string;
}

export type UpdateUserRequest = {
  username?: string;
  password?: string;
  currentPassword?: string;
  email?: string;
}

export type ApiResponse<T = void> = {
  apiVersion: string;
  content?: T;
  message: string;
  timestamp: string;
}