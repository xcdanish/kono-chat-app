'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSignupMutation } from '@/lib/api/authApi';
import { useAppDispatch } from '@/lib/hooks';
import { setCredentials } from '@/lib/slices/authSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ThemeToggle } from '@/components/theme-toggle';
import { AlertCircle, Loader2, Search, FileText, Zap, Brain, Eye, ArrowRight, Users, Shield, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function Signup() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [signup, { isLoading }] = useSignupMutation();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    dob: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      return 'Full name is required';
    }
    
    if (!formData.username.trim()) {
      return 'Username is required';
    }
    
    if (formData.username.length < 3) {
      return 'Username must be at least 3 characters';
    }
    
    if (!formData.email.trim()) {
      return 'Email is required';
    }
    
    if (!formData.email.includes('@')) {
      return 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      return 'Password is required';
    }
    
    if (formData.password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match';
    }
    
    if (!formData.dob) {
      return 'Date of birth is required';
    }
    
    // Check if user is at least 13 years old
    const birthDate = new Date(formData.dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (age < 13 || (age === 13 && monthDiff < 0) || (age === 13 && monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return 'You must be at least 13 years old to create an account';
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const result = await signup({
        name: formData.name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        dob: formData.dob
      }).unwrap();
      
      dispatch(setCredentials({
        user: result.result.user,
        token: result.result.token
      }));
      toast.success('Account created successfully!', {
        description: `Welcome to QueryDocs AI, ${result.result.user.name}!`,
        duration: 3000,
      });
      router.push('/chat');
    } catch (err: any) {
      setError(err?.data?.message || 'Failed to create account. Please try again.');
      toast.error('Signup failed', {
        description: err?.data?.message || 'Failed to create account. Please try again.',
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
              <div className="absolute inset-0 bg-emerald-50 dark:bg-emerald-900/20 rounded-3xl transform rotate-3"></div>
              <div className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-3xl transform -rotate-2"></div>
              
              {/* Main Content Area */}
              <div className="relative bg-white dark:bg-slate-700 rounded-3xl p-8 shadow-xl border border-slate-100 dark:border-slate-600">
                {/* User Community */}
                <div className="relative mb-8 flex justify-center">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    {/* Floating user icons */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-400 rounded-full flex items-center justify-center shadow-md">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                    <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center shadow-md">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Security Shield */}
                <div className="absolute -top-4 -right-4 bg-emerald-500 rounded-full p-4 shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>

                {/* AI Sparkles */}
                <div className="absolute -bottom-6 -left-6 bg-purple-500 rounded-full p-4 shadow-lg">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>

                {/* Document Processing */}
                <div className="flex justify-center items-center space-x-4 mb-6">
                  <div className="w-12 h-16 bg-slate-200 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-slate-600" />
                  </div>
                  <ArrowRight className="w-6 h-6 text-slate-400" />
                  <div className="w-12 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <ArrowRight className="w-6 h-6 text-slate-400" />
                  <div className="w-12 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Feature Highlights */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-xl p-4 text-center">
                    <Search className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-blue-800">Smart Search</p>
                  </div>
                  <div className="bg-emerald-50 rounded-xl p-4 text-center">
                    <Zap className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-emerald-800">Instant Results</p>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-8 left-1/4 bg-rose-400 rounded-lg p-3 shadow-lg transform rotate-12">
                <FileText className="w-5 h-5 text-white" />
              </div>
              
              <div className="absolute -bottom-8 right-1/4 bg-blue-400 rounded-lg p-3 shadow-lg transform -rotate-12">
                <Search className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Bottom Text */}
            <div className="mt-12 text-center">
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-3">
                Join Thousands of Users
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Start your journey with AI-powered document intelligence today
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
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

          {/* Signup Form */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">Create your account</h2>
              <p className="text-slate-600 dark:text-slate-400">Get started with QueryDocs AI today</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-slate-700 dark:text-slate-300 font-medium">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="mt-2 h-11 rounded-xl border-slate-200 dark:border-slate-600 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-slate-700 dark:text-slate-200"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="username" className="text-slate-700 dark:text-slate-300 font-medium">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="johndoe"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className="mt-2 h-11 rounded-xl border-slate-200 dark:border-slate-600 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-slate-700 dark:text-slate-200"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 font-medium">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="mt-2 h-11 rounded-xl border-slate-200 dark:border-slate-600 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-slate-700 dark:text-slate-200"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="dob" className="text-slate-700 dark:text-slate-300 font-medium">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.dob}
                  onChange={(e) => handleInputChange('dob', e.target.value)}
                  className="mt-2 h-11 rounded-xl border-slate-200 dark:border-slate-600 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-slate-700 dark:text-slate-200"
                  required
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password" className="text-slate-700 dark:text-slate-300 font-medium">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="mt-2 h-11 rounded-xl border-slate-200 dark:border-slate-600 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-slate-700 dark:text-slate-200"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="confirmPassword" className="text-slate-700 dark:text-slate-300 font-medium">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="mt-2 h-11 rounded-xl border-slate-200 dark:border-slate-600 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-slate-700 dark:text-slate-200"
                    required
                  />
                </div>
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
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-600 dark:text-slate-400">
                Already have an account?{' '}
                <Link href="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}