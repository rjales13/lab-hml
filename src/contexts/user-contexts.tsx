// contexts/user-context.tsx
'use client';

import { userRoles, UserRoleValue } from '@/models/user-role';
import { createContext, useContext, ReactNode } from 'react';

interface User {
  name: string;
  role: UserRoleValue;
  email?: string;
  id?: string;
}

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({
  children,
  user,
}: {
  children: ReactNode;
  user: User | null;
}) {
  const isAuthenticated = !!user;
  const isAdmin = user?.role === userRoles.ADMIN;

  return (
    <UserContext.Provider value={{ user, isAuthenticated, isAdmin }}>
      {children}
    </UserContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a UserProvider');
  }
  return context;
}
