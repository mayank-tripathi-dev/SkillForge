import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Layers, ArrowRight, UserCheck, Shield, GraduationCap } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      setSubmitting(true);
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'instructor') {
        navigate('/instructor/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemoUser = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-surface-base border border-border-subtle rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center mx-auto shadow-sm">
            <Layers className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary tracking-tight">Welcome Back</h2>
          <p className="text-xs text-text-secondary">Log in to your SkillForge account to access your courses.</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              className="w-full h-10 px-3 bg-surface-subtle border border-border-subtle rounded-lg text-xs text-text-primary focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full h-10 px-3 bg-surface-subtle border border-border-subtle rounded-lg text-xs text-text-primary focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full h-10 bg-primary text-white text-xs font-medium rounded-lg flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all shadow-sm disabled:opacity-50"
          >
            {submitting ? 'Authenticating...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Interview Demo Fill Buttons */}
        <div className="pt-4 border-t border-border-subtle space-y-2">
          <p className="text-[11px] font-code text-text-tertiary text-center uppercase tracking-wider">
            Interview Demo One-Click Login
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => fillDemoUser('student@skillforge.com')}
              className="py-1.5 px-2 bg-surface-subtle border border-border-subtle rounded-lg text-[11px] font-medium text-text-secondary hover:text-text-primary hover:border-primary flex items-center justify-center gap-1"
            >
              <GraduationCap className="w-3 h-3" />
              Student
            </button>
            <button
              onClick={() => fillDemoUser('instructor@skillforge.com')}
              className="py-1.5 px-2 bg-surface-subtle border border-border-subtle rounded-lg text-[11px] font-medium text-text-secondary hover:text-text-primary hover:border-primary flex items-center justify-center gap-1"
            >
              <UserCheck className="w-3 h-3" />
              Instructor
            </button>
            <button
              onClick={() => fillDemoUser('admin@skillforge.com')}
              className="py-1.5 px-2 bg-surface-subtle border border-border-subtle rounded-lg text-[11px] font-medium text-text-secondary hover:text-text-primary hover:border-primary flex items-center justify-center gap-1"
            >
              <Shield className="w-3 h-3" />
              Admin
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-text-secondary">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-primary hover:underline">
            Sign up now
          </Link>
        </div>
      </div>
    </div>
  );
};
