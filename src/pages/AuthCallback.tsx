import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { neonAuth } from '@/lib/neonAuth';
import { LoadingScreen } from '@/components/layout/LoadingScreen';
import { toast } from '@/hooks/use-toast';

export default function AuthCallback(): JSX.Element {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, setLoading } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const errorParam = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      // Handle errors from Neon Auth
      if (errorParam) {
        const message = errorDescription || errorParam;
        setError(message);
        toast({
          title: 'Authentication Failed',
          description: message,
          variant: 'destructive',
        });
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      // No code present
      if (!code) {
        setError('No authorization code received');
        toast({
          title: 'Authentication Error',
          description: 'No authorization code received from Neon Auth',
          variant: 'destructive',
        });
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      setLoading(true);

      try {
        // Exchange code for tokens
        const result = await neonAuth.handleCallback(code);

        if (result) {
          login(result.user, result.token);
          toast({
            title: 'Welcome!',
            description: `Successfully signed in as ${result.user.email}`,
          });
          navigate('/dashboard');
        } else {
          setError('Failed to complete authentication');
          toast({
            title: 'Sign In Failed',
            description: 'Unable to complete authentication. Please try again.',
            variant: 'destructive',
          });
          setTimeout(() => navigate('/login'), 3000);
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        setError('An error occurred during authentication');
        toast({
          title: 'Authentication Error',
          description: 'An unexpected error occurred. Please try again.',
          variant: 'destructive',
        });
        setTimeout(() => navigate('/login'), 3000);
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, [searchParams, navigate, login, setLoading]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="text-destructive text-xl">Authentication Error</div>
          <p className="text-muted-foreground">{error}</p>
          <p className="text-sm text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <LoadingScreen />
        <p className="text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  );
}
