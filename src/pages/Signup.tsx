import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/stores/authStore';
import { neonAuth } from '@/lib/neonAuth';
import { Code2, Sparkles, Zap, Shield } from 'lucide-react';

export default function Signup(): JSX.Element {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSignup = () => {
    const signupUrl = neonAuth.getSignupUrl();
    window.location.href = signupUrl;
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-2xl bg-primary/10">
                <Code2 className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4">
              Start Coding with AI
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of developers using WebCoder25 to write better code faster
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 rounded-lg bg-card border border-border text-center">
              <Sparkles className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">AI Assistant</h3>
              <p className="text-sm text-muted-foreground">
                Get intelligent code suggestions and explanations
              </p>
            </div>
            <div className="p-6 rounded-lg bg-card border border-border text-center">
              <Zap className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Fast & Efficient</h3>
              <p className="text-sm text-muted-foreground">
                Lightning-fast code editing with modern tools
              </p>
            </div>
            <div className="p-6 rounded-lg bg-card border border-border text-center">
              <Shield className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Secure</h3>
              <p className="text-sm text-muted-foreground">
                Enterprise-grade security for your code
              </p>
            </div>
          </div>

          {/* Signup Card */}
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle>Create Your Account</CardTitle>
              <CardDescription>
                Get started for free with Neon Auth
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                className="w-full" 
                size="lg"
                onClick={handleSignup}
              >
                Sign Up with Neon Auth
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Already have an account?
                  </span>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full" 
                size="lg"
                onClick={handleLogin}
              >
                Sign In
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                By signing up, you agree to our{' '}
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
      </div>
    </div>
  );
}
