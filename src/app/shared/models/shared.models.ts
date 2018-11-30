export interface AppUser {
  username: string;
  password: string;
  fullName?: string;
}

export enum LoginError {
  USERNAME_NOT_FOUND = 'Username not found',
  INVALID_PASSWORD = 'Invalid password',
}
