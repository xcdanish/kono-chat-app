'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLoginMutation } from '@/lib/api/authApi';
import { useAppDispatch } from '@/lib/hooks';
import { setCredentials } from '@/lib/slices/authSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ThemeToggle } from '@/components/theme-toggle';
import { AlertCircle, Loader2, Search, FileText, Zap, Brain, Eye, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function Login() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [email, setEmail] = useState('xcdanish@gmail.com');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const result = await login({ email, password }).unwrap();
      dispatch(setCredentials({
        user: result.result.user,
        token: result.result.token
      }));
      toast.success('Login successful!', {
        description: `Welcome back, ${result.result.user.name}!`,
        duration: 3000,
      });
      router.push('/chat');
    } catch (err: any) {
      setError(err?.data?.message || 'Invalid email or password');
      toast.error('Login failed', {
        description: err?.data?.message || 'Invalid email or password',
        duration: 4000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-10">
        <ThemeToggle />
      </div>

      {/* Left Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-white dark:bg-slate-800 relative overflow-hidden">
        <div className="w-full h-full flex items-center justify-center p-12">
          <div className="relative w-full max-w-lg">
            {/* Main Illustration Container */}
            <div className="relative">
              {/* Background Elements */}
              <div className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-3xl transform rotate-3"></div>
              <div className="absolute inset-0 bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl transform -rotate-2"></div>
              
              {/* Main Content Area */}
              <div className="relative bg-white dark:bg-slate-700 rounded-3xl p-8 shadow-xl border border-slate-100 dark:border-slate-600">
                {/* Document Stack */}
                <div className="relative mb-8">
                  <div className="absolute top-2 left-2 w-48 h-32 bg-slate-100 dark:bg-slate-600 rounded-lg transform rotate-2"></div>
                  <div className="absolute top-1 left-1 w-48 h-32 bg-slate-200 dark:bg-slate-500 rounded-lg transform rotate-1"></div>
                  <div className="relative w-48 h-32 bg-gradient-to-br from-slate-800 to-slate-700 dark:from-slate-600 dark:to-slate-500 rounded-lg flex items-center justify-center">
                    <FileText className="w-16 h-16 text-white opacity-80" />
                  </div>
                </div>

                {/* Search Element */}
                <div className="absolute -top-4 -right-4 bg-blue-500 rounded-full p-4 shadow-lg">
                  <Search className="w-8 h-8 text-white" />
                </div>

                {/* AI Brain */}
                <div className="absolute -bottom-6 -left-6 bg-indigo-500 rounded-full p-4 shadow-lg">
                  <Brain className="w-8 h-8 text-white" />
                </div>

                {/* Insight Connections */}
                <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                  <div className="flex flex-col space-y-2">
                    <div className="w-3 h-3 bg-emerald-400 rounded-full shadow-md"></div>
                    <div className="w-2 h-2 bg-amber-400 rounded-full shadow-md"></div>
                    <div className="w-4 h-4 bg-rose-400 rounded-full shadow-md"></div>
                  </div>
                </div>

                {/* Discovery Path */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                  <div className="flex items-center space-x-2 bg-emerald-500 rounded-full px-4 py-2 shadow-lg">
                    <Eye className="w-4 h-4 text-white" />
                    <span className="text-white text-sm font-medium">Insight Found</span>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-8 left-1/4 bg-amber-400 rounded-lg p-3 shadow-lg transform rotate-12">
                <Zap className="w-5 h-5 text-white" />
              </div>
              
              <div className="absolute -bottom-8 right-1/4 bg-rose-400 rounded-lg p-3 shadow-lg transform -rotate-12">
                <ArrowRight className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Bottom Text */}
            <div className="mt-12 text-center">
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-3">
                Discover Hidden Insights
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Transform your PDF documents into searchable knowledge bases with AI-powered intelligence
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-2xl mb-6">
              <FileText className="w-8 h-8 text-indigo-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-3">
              Unlock Knowledge from Your PDFs Instantly
            </h1>
            
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
              QueryDocs AI helps you find answers hidden deep inside your documents — no more endless scrolling.
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">Welcome back</h2>
              <p className="text-slate-600 dark:text-slate-400">Sign in to your account to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 font-medium">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 h-12 rounded-xl border-slate-200 dark:border-slate-600 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-slate-700 dark:text-slate-200"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-slate-700 dark:text-slate-300 font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 h-12 rounded-xl border-slate-200 dark:border-slate-600 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-slate-700 dark:text-slate-200"
                  required
                />
              </div>

              {error && (
                <Alert variant="destructive" className="rounded-xl">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-slate-600 dark:text-slate-400">
                Don't have an account?{' '}
                <Link href="/signup" className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline">
                  Create account
                </Link>
              </p>
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600">
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mb-2">Demo credentials:</p>
              <div className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
                <p><span className="font-medium">Email:</span> xcdanish@gmail.com</p>
                <p><span className="font-medium">Password:</span> 123456</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}