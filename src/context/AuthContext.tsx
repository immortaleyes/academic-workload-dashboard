
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

// Define user roles
export type UserRole = 'admin' | 'hod' | 'guest';

// Define user interface
interface User {
  email: string;
  name: string;
  role: UserRole;
  picture?: string;
}

// Define auth context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  hasPermission: (requiredRole: UserRole) => boolean;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default roles mapping - in a real app, this would come from Auth0 roles/permissions
const EMAIL_ROLE_MAP: Record<string, UserRole> = {
  'admin@example.com': 'admin',
  'hod@example.com': 'hod',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    isAuthenticated, 
    isLoading, 
    loginWithRedirect, 
    logout: auth0Logout, 
    user: auth0User 
  } = useAuth0();
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Effect to set user data when Auth0 authenticates
  useEffect(() => {
    if (isAuthenticated && auth0User) {
      // Map the Auth0 user to our app's user model
      const email = auth0User.email || '';
      const role = EMAIL_ROLE_MAP[email] || 'guest';
      
      setUser({
        email,
        name: auth0User.name || '',
        role,
        picture: auth0User.picture
      });

      // Show welcome toast
      toast({
        title: "Welcome back!",
        description: `Logged in as ${role.toUpperCase()}`,
      });
    } else {
      setUser(null);
    }
  }, [isAuthenticated, auth0User]);

  // Login function
  const login = () => {
    loginWithRedirect({
      appState: { returnTo: window.location.pathname }
    });
  };

  // Logout function
  const logout = () => {
    auth0Logout({
      logoutParams: {
        returnTo: window.location.origin + '/login'
      }
    });
    navigate('/login');
  };

  // Check if user has permission based on role
  const hasPermission = (requiredRole: UserRole): boolean => {
    if (!user) return false;
    
    // Admin has all permissions
    if (user.role === 'admin') return true;
    
    // HOD can access HOD and guest content
    if (user.role === 'hod' && (requiredRole === 'hod' || requiredRole === 'guest')) {
      return true;
    }
    
    // Direct role match
    return user.role === requiredRole;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        hasPermission
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
