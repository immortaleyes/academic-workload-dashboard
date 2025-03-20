
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, ShieldCheck, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const loginSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" })
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const { isAuthenticated, login, isLoading } = useAuth();
  const [loginMode, setLoginMode] = useState<'admin' | 'hod' | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  });

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  // Quick login for development
  const handleQuickLogin = (role: 'admin' | 'hod') => {
    login(role, role);
  };

  // Manual login
  const onSubmit = (data: LoginFormValues) => {
    login(data.username, data.password);
  };

  // Login mode selector
  const loginSelector = (
    <div className="space-y-2">
      <Button
        variant="outline"
        size="lg"
        className="w-full justify-start"
        onClick={() => handleQuickLogin('hod')}
        disabled={isLoading}
      >
        <ShieldCheck className="mr-2 h-4 w-4" />
        HOD Login
        <span className="ml-auto text-xs text-muted-foreground">(hod/hod)</span>
      </Button>
      
      <Button
        variant="outline"
        size="lg"
        className="w-full justify-start"
        onClick={() => handleQuickLogin('admin')}
        disabled={isLoading}
      >
        <User className="mr-2 h-4 w-4" />
        Admin Login
        <span className="ml-auto text-xs text-muted-foreground">(admin/admin)</span>
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        className="w-full mt-4"
        onClick={() => setLoginMode('admin')}
      >
        Manual Login
      </Button>
    </div>
  );

  // Manual login form
  const loginForm = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex gap-2">
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                Logging in...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                Login
              </span>
            )}
          </Button>
          
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setLoginMode(null)}
          >
            Back
          </Button>
        </div>
      </form>
    </Form>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
      <Card className="w-[350px] shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Faculty Dashboard</CardTitle>
          <CardDescription>Login to access the dashboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {loginMode ? loginForm : loginSelector}
          
          <div className="text-xs text-center text-muted-foreground">
            <p>Development Login:</p>
            <p>Use <strong>admin/admin</strong> for admin access</p>
            <p>Use <strong>hod/hod</strong> for HOD access</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
