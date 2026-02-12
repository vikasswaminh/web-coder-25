import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/stores/authStore';
import { neonAuth } from '@/lib/neonAuth';
import { Code2, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function Login(): JSX.Element {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, login, setLoading } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState(false);

  // Check for auth callback
  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      toast({
        title: 'Authentication Error',
        description: error,
        variant: 'destructive',
      });
      return;
    }

    if (code) {
      handleAuthCallback(code);
    }
  }, [searchParams]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleAuthCallback = async (code: string) => {
    setIsProcessing(true);
    setLoading(true);

    try {
      const result = await neonAuth.handleCallback(code);

      if (result) {
        login(result.user, result.token);
        toast({
          title: 'Welcome back!',
          description: `Signed in as ${result.user.email}`,
        });
        navigate('/dashboard');
      } else {
        toast({
          title: 'Sign in failed',
          description: 'Unable to complete authentication. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Sign in error',
        description: 'An error occurred during sign in.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
      setLoading(false);
    }
  };

  const handleLogin = () => {
    const loginUrl = neonAuth.getLoginUrl();
    window.location.href = loginUrl;
  };

  const handleSignup = () => {
    const signupUrl = neonAuth.getSignupUrl();
    window.location.href = signupUrl;
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Completing sign in...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Code2 className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>
            Sign in to your WebCoder25 account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            className="w-full" 
            size="lg"
            onClick={handleLogin}
          >
            Sign In with Neon Auth
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full" 
            size="lg"
            onClick={handleSignup}
          >
            Create Account
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            By continuing, you agree to our{' '}
            <a href="#" className="underline hover:text-primary">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="underline hover:text-primary">
              Privacy Policy
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
