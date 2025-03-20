
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, ShieldCheck, User } from 'lucide-react';

const Login: React.FC = () => {
  const { isAuthenticated, login, isLoading } = useAuth();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
      <Card className="w-[350px] shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Faculty Dashboard</CardTitle>
          <CardDescription>Login to access the dashboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col space-y-2 text-center">
              <h3 className="font-medium">Select a role to continue</h3>
              <p className="text-sm text-muted-foreground">
                Choose the appropriate role based on your access level
              </p>
            </div>
            
            <div className="space-y-2">
              <Button
                variant="outline"
                size="lg"
                className="w-full justify-start"
                onClick={login}
                disabled={isLoading}
              >
                <ShieldCheck className="mr-2 h-4 w-4" />
                HOD Login
                <span className="ml-auto text-xs text-muted-foreground">(View Only)</span>
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="w-full justify-start"
                onClick={login}
                disabled={isLoading}
              >
                <User className="mr-2 h-4 w-4" />
                Admin Login
                <span className="ml-auto text-xs text-muted-foreground">(Full Access)</span>
              </Button>
            </div>
          </div>
          
          <div className="text-xs text-center text-muted-foreground">
            <p>Demo credentials:</p>
            <p>HOD: hod@example.com / password</p>
            <p>Admin: admin@example.com / password</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={login} disabled={isLoading}>
            <LogIn className="mr-2 h-4 w-4" />
            Login with Auth0
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
