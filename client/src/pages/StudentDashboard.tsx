import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { Enrollment } from '../types';
import { useAuth } from '../context/AuthContext';
import { BookOpen, CheckCircle, Clock, PlayCircle, ArrowRight } from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState({ totalEnrolled: 0, completedCourses: 0, inProgressCourses: 0 });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [enrollRes, statsRes] = await Promise.all([
        API.get('/enrollments/my-courses'),
        API.get('/student/dashboard'),
      ]);

      if (enrollRes.data.success) {
        setEnrollments(enrollRes.data.enrollments);
      }
      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }
    } catch (error) {
      console.error('Error loading student dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto py-6 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-surface-base border border-border-subtle rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Welcome back, {user?.name}! 👋</h1>
          <p className="text-xs text-text-secondary mt-1">
            Track your course progress, resume learning lessons, and manage your enrollments.
          </p>
        </div>
        <Link
          to="/courses"
          className="h-9 px-4 rounded-lg bg-primary text-white text-xs font-medium flex items-center gap-1.5 hover:bg-zinc-800 transition-all"
        >
          <span>Explore More Courses</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-surface-base border border-border-subtle rounded-xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-glow-cyan/40 text-cyan-900 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-2xl font-bold text-text-primary">{stats.totalEnrolled}</span>
            <span className="text-xs text-text-secondary block">Enrolled Courses</span>
          </div>
        </div>

        <div className="bg-surface-base border border-border-subtle rounded-xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-glow-mint/40 text-emerald-900 flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-2xl font-bold text-text-primary">{stats.completedCourses}</span>
            <span className="text-xs text-text-secondary block">Completed Courses</span>
          </div>
        </div>

        <div className="bg-surface-base border border-border-subtle rounded-xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-glow-lavender/40 text-purple-900 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-2xl font-bold text-text-primary">{stats.inProgressCourses}</span>
            <span className="text-xs text-text-secondary block">In Progress</span>
          </div>
        </div>
      </div>

      {/* Enrolled Courses List */}
      <div className="bg-surface-base border border-border-subtle rounded-2xl p-6 shadow-xs space-y-6">
        <h2 className="text-base font-semibold text-text-primary">Your Enrolled Courses</h2>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((n) => (
              <div key={n} className="h-24 bg-surface-muted rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : enrollments.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-border-subtle rounded-xl">
            <p className="text-sm font-semibold text-text-primary mb-1">No Enrolled Courses Yet</p>
            <p className="text-xs text-text-secondary mb-4">Browse our catalog and enroll in your first course.</p>
            <Link to="/courses" className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-medium">
              Browse Marketplace
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enrollments.map((item) => {
              const course = item.course;
              if (!course) return null;
              const progressPct = item.progress?.completionPercentage || 0;

              return (
                <div key={item._id} className="border border-border-subtle rounded-xl p-4 hover:border-primary/50 transition-all bg-surface-base flex flex-col justify-between space-y-4">
                  <div className="flex gap-4">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-24 h-20 rounded-lg object-cover bg-surface-muted"
                    />
                    <div className="space-y-1 flex-1">
                      <span className="font-code text-[10px] text-text-secondary bg-surface-subtle border border-border-subtle px-2 py-0.5 rounded">
                        {course.category}
                      </span>
                      <h3 className="text-sm font-semibold text-text-primary line-clamp-1">{course.title}</h3>
                      <p className="text-xs text-text-secondary">Instructor: {course.instructor?.name || 'Vance'}</p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-border-subtle">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-text-secondary">Progress</span>
                      <span className="font-code font-bold text-text-primary">{progressPct}%</span>
                    </div>
                    <div className="w-full bg-surface-muted h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full transition-all duration-300"
                        style={{ width: `${progressPct}%` }}
                      ></div>
                    </div>

                    <Link
                      to={`/learn/${course._id}`}
                      className="w-full h-9 mt-2 bg-surface-subtle border border-border-subtle hover:bg-primary hover:text-white text-text-primary text-xs font-medium rounded-lg flex items-center justify-center gap-2 transition-all"
                    >
                      <PlayCircle className="w-4 h-4" />
                      <span>{progressPct > 0 ? 'Continue Learning' : 'Start Course'}</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
