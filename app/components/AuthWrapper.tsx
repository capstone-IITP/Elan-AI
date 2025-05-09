'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '../context/AuthContext';

function AuthWrapper({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

export default AuthWrapper; 