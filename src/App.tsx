import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { LoadingScreen } from '@/components/layout/LoadingScreen';
import { ProtectedRoute } from '@/components/features/Routes';

// Lazy load pages
const Login = lazy(() => import('@/pages/Login'));
const Signup = lazy(() => import('@/pages/Signup'));
const AuthCallback = lazy(() => import('@/pages/AuthCallback'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Workspace = lazy(() => import('@/pages/Workspace'));
const Settings = lazy(() => import('@/pages/Settings'));
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard'));
const CodeSnippets = lazy(() => import('@/pages/CodeSnippets'));
const Index = lazy(() => import('@/pages/Index'));

function App(): JSX.Element {
  return (
    <Router>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/workspace/:projectId" element={<ProtectedRoute><Workspace /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/snippets" element={<ProtectedRoute><CodeSnippets /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
        </Routes>
      </Suspense>
      <Toaster />
    </Router>
  );
}

export default App;
