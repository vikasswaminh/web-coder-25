import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { LoadingScreen } from '@/components/layout/LoadingScreen';
import { Button } from '@/components/ui/button';
import { Code2, Sparkles, Zap, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Index(): JSX.Element {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-2xl bg-primary/10">
              <Code2 className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Code Smarter with{' '}
            <span className="text-primary">AI</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            WebCoder25 is your intelligent coding companion. Write, edit, and collaborate 
            on code with the power of AI assistance.
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" onClick={() => navigate('/signup')}>
              Get Started Free
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/login')}>
              Sign In
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20 border-t border-border">
        <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-lg bg-card border border-border">
            <Sparkles className="h-8 w-8 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI Assistant</h3>
            <p className="text-muted-foreground">
              Get intelligent code suggestions, explanations, and debugging help from our AI assistant.
            </p>
          </div>
          <div className="p-6 rounded-lg bg-card border border-border">
            <Zap className="h-8 w-8 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Fast & Efficient</h3>
            <p className="text-muted-foreground">
              Built with modern technology for lightning-fast code editing and project management.
            </p>
          </div>
          <div className="p-6 rounded-lg bg-card border border-border">
            <Shield className="h-8 w-8 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Secure</h3>
            <p className="text-muted-foreground">
              Your code is protected with enterprise-grade security and authentication.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 WebCoder25. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
