
import React, { createContext, useContext, useState, useEffect } from 'react';
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
  login: (username: string, password: string) => boolean;
  logout: () => void;
  hasPermission: (requiredRole: UserRole) => boolean;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Dummy users for development
const DUMMY_USERS = {
  'admin': {
    password: 'admin',
    userData: {
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin' as UserRole,
      picture: 'https://avatars.githubusercontent.com/u/1?v=4'
    }
  },
  'hod': {
    password: 'hod',
    userData: {
      email: 'hod@example.com',
      name: 'HOD User',
      role: 'hod' as UserRole,
      picture: 'https://avatars.githubusercontent.com/u/2?v=4'
    }
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Check for stored auth on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('faculty-dashboard-user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('faculty-dashboard-user');
      }
    }
  }, []);

  // Login function
  const login = (username: string, password: string): boolean => {
    setIsLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      const userRecord = DUMMY_USERS[username as keyof typeof DUMMY_USERS];
      
      if (userRecord && userRecord.password === password) {
        setUser(userRecord.userData);
        localStorage.setItem('faculty-dashboard-user', JSON.stringify(userRecord.userData));
        
        // Show welcome toast
        toast({
          title: "Welcome back!",
          description: `Logged in as ${userRecord.userData.role.toUpperCase()}`,
        });
        
        navigate('/');
        setIsLoading(false);
        return true;
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Invalid username or password",
        });
        setIsLoading(false);
        return false;
      }
    }, 500);
    
    return false;
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('faculty-dashboard-user');
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
        isAuthenticated: !!user,
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
