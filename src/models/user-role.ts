export interface iUserRole {
  role: 'admin' | 'editor' | 'user';
}

export const userRoles = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  USER: 'user',
} as const;

export type UserRoleValue = (typeof userRoles)[keyof typeof userRoles];
