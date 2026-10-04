import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Layers, Search, Grid, LogOut, User as UserIcon, BookOpen, LayoutDashboard, Shield, PlusCircle } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="w-full sticky top-0 z-50 bg-surface-base border-b border-border-subtle transition-colors duration-150 shadow-xs">
      <div className="w-full px-margin-mobile md:px-margin flex items-center justify-between h-16 max-w-7xl mx-auto gap-4">
        {/* Brand Logo */}
        <Link to="/courses" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-sm transition-transform duration-150 group-hover:scale-95">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <span className="text-headline-sm font-semibold tracking-tight text-primary font-body">SkillForge</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 h-full">
          <Link
            to="/courses"
            className={`font-medium pb-1 h-full flex items-center text-sm transition-colors ${
              location.pathname === '/courses'
                ? 'text-primary border-b-2 border-primary'
                : 'text-text-secondary hover:text-primary'
            }`}
          >
            Courses
          </Link>
          <Link
            to="/courses?sort=newest"
            className="text-text-secondary hover:text-primary transition-colors pb-1 h-full flex items-center text-sm"
          >
            Marketplace
          </Link>

          {user?.role === 'student' && (
            <Link
              to="/dashboard"
              className={`font-medium pb-1 h-full flex items-center text-sm transition-colors ${
                location.pathname === '/dashboard'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-text-secondary hover:text-primary'
              }`}
            >
              My Learning
            </Link>
          )}

          {(user?.role === 'instructor' || user?.role === 'admin') && (
            <Link
              to="/instructor/dashboard"
              className={`font-medium pb-1 h-full flex items-center text-sm transition-colors ${
                location.pathname.startsWith('/instructor')
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-text-secondary hover:text-primary'
              }`}
            >
              Instructor Studio
            </Link>
          )}

          {user?.role === 'admin' && (
            <Link
              to="/admin/dashboard"
              className={`font-medium pb-1 h-full flex items-center text-sm transition-colors ${
                location.pathname.startsWith('/admin')
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-text-secondary hover:text-primary'
              }`}
            >
              Admin Panel
            </Link>
          )}
        </nav>

        {/* Search Bar & User Actions */}
        <div className="flex items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center gap-2 bg-surface-subtle border border-border-subtle rounded-xl px-3 h-10 w-64 focus-ring transition-all">
            <Search className="w-4 h-4 text-text-tertiary" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-0 p-0 text-xs text-text-primary placeholder:text-text-tertiary focus:ring-0 w-full"
            />
            <span className="font-code text-[10px] text-text-tertiary bg-surface-base border border-border-subtle px-1.5 py-0.5 rounded shadow-2xs">⌘K</span>
          </form>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 p-1.5 rounded-lg border border-border-subtle hover:bg-surface-subtle transition-colors"
              >
                <img
                  src={user.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover border border-border-subtle"
                />
                <span className="text-xs font-medium text-text-primary hidden sm:inline">{user.name}</span>
                <span className="text-[10px] bg-glow-lavender/60 text-text-primary font-code uppercase px-1.5 py-0.5 rounded border border-border-subtle">
                  {user.role}
                </span>
              </button>

              {showDropdown && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-surface-base border border-border-subtle rounded-xl shadow-lg py-1.5 z-50 animate-in fade-in slide-in-from-top-2"
                  onMouseLeave={() => setShowDropdown(false)}
                >
                  <div className="px-4 py-2 border-b border-border-subtle">
                    <p className="text-xs font-semibold text-text-primary">{user.name}</p>
                    <p className="text-[11px] text-text-secondary truncate">{user.email}</p>
                  </div>

                  {user.role === 'student' && (
                    <Link
                      to="/dashboard"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-text-primary hover:bg-surface-subtle"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-text-secondary" />
                      My Enrolled Courses
                    </Link>
                  )}

                  {(user.role === 'instructor' || user.role === 'admin') && (
                    <>
                      <Link
                        to="/instructor/dashboard"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-text-primary hover:bg-surface-subtle"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 text-text-secondary" />
                        Instructor Dashboard
                      </Link>
                      <Link
                        to="/instructor/create-course"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-text-primary hover:bg-surface-subtle"
                      >
                        <PlusCircle className="w-3.5 h-3.5 text-text-secondary" />
                        Create New Course
                      </Link>
                    </>
                  )}

                  {user.role === 'admin' && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-text-primary hover:bg-surface-subtle"
                    >
                      <Shield className="w-3.5 h-3.5 text-text-secondary" />
                      Admin Control Panel
                    </Link>
                  )}

                  <Link
                    to="/profile"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-text-primary hover:bg-surface-subtle"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-text-secondary" />
                    Account Settings
                  </Link>

                  <div className="border-t border-border-subtle my-1"></div>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-xs font-medium text-text-primary px-3 py-2 hover:text-primary transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="h-9 px-4 rounded-lg bg-primary text-white text-xs font-medium flex items-center justify-center transition-all hover:bg-zinc-800 shadow-sm"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
