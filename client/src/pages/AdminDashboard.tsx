import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { AdminStats, User, Course } from '../types';
import { Shield, Users, BookOpen, DollarSign, UserCheck, Trash2, Award } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'courses'>('users');
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, coursesRes] = await Promise.all([
        API.get('/admin/dashboard'),
        API.get('/admin/users'),
        API.get('/admin/courses'),
      ]);

      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (usersRes.data.success) setUsers(usersRes.data.users);
      if (coursesRes.data.success) setCourses(coursesRes.data.courses);
    } catch (error) {
      console.error('Error loading admin dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const res = await API.put(`/admin/users/${userId}/role`, { role: newRole });
      if (res.data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId || (u as any)._id === userId ? { ...u, role: newRole as any } : u))
        );
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update role.');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const res = await API.delete(`/admin/users/${userId}`);
      if (res.data.success) {
        setUsers((prev) => prev.filter((u) => u.id !== userId && (u as any)._id !== userId));
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete user.');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="bg-surface-base border border-border-subtle rounded-2xl p-6 shadow-xs flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Admin Control Panel</h1>
          <p className="text-xs text-text-secondary">
            System metrics, user role management, and course moderation.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-surface-base border border-border-subtle rounded-xl p-4 shadow-xs">
            <div className="flex items-center gap-2 text-text-secondary text-xs mb-1">
              <Users className="w-4 h-4 text-cyan-600" />
              <span>Total Registered Users</span>
            </div>
            <p className="text-2xl font-bold text-text-primary">{stats.totalUsers}</p>
            <p className="text-[11px] text-text-tertiary mt-1 font-code">
              {stats.totalStudents} Students • {stats.totalInstructors} Instructors
            </p>
          </div>

          <div className="bg-surface-base border border-border-subtle rounded-xl p-4 shadow-xs">
            <div className="flex items-center gap-2 text-text-secondary text-xs mb-1">
              <BookOpen className="w-4 h-4 text-purple-600" />
              <span>Platform Courses</span>
            </div>
            <p className="text-2xl font-bold text-text-primary">{stats.totalCourses}</p>
            <p className="text-[11px] text-text-tertiary mt-1 font-code">
              {stats.publishedCourses} Published
            </p>
          </div>

          <div className="bg-surface-base border border-border-subtle rounded-xl p-4 shadow-xs">
            <div className="flex items-center gap-2 text-text-secondary text-xs mb-1">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Total Enrollments</span>
            </div>
            <p className="text-2xl font-bold text-text-primary">{stats.totalEnrollments}</p>
            <p className="text-[11px] text-text-tertiary mt-1 font-code">Completed Checkouts</p>
          </div>

          <div className="bg-surface-base border border-border-subtle rounded-xl p-4 shadow-xs">
            <div className="flex items-center gap-2 text-text-secondary text-xs mb-1">
              <DollarSign className="w-4 h-4 text-amber-600" />
              <span>Gross Platform Revenue</span>
            </div>
            <p className="text-2xl font-bold text-text-primary">${stats.totalPlatformRevenue}</p>
            <p className="text-[11px] text-text-tertiary mt-1 font-code">Demo Payments Volume</p>
          </div>
        </div>
      )}

      {/* Tabs & Content */}
      <div className="bg-surface-base border border-border-subtle rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex items-center gap-4 border-b border-border-subtle pb-3">
          <button
            onClick={() => setActiveTab('users')}
            className={`text-xs font-semibold pb-2 border-b-2 transition-colors ${
              activeTab === 'users' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            User Management ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`text-xs font-semibold pb-2 border-b-2 transition-colors ${
              activeTab === 'courses' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            Course Moderation ({courses.length})
          </button>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-text-tertiary">Loading admin control panel data...</div>
        ) : activeTab === 'users' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-text-primary">
              <thead className="bg-surface-subtle uppercase font-code text-[11px] text-text-secondary border-b border-border-subtle">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Current Role</th>
                  <th className="p-3">Change Role</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {users.map((u) => {
                  const uid = u.id || (u as any)._id;
                  return (
                    <tr key={uid} className="hover:bg-surface-subtle/50 transition-colors">
                      <td className="p-3 flex items-center gap-2.5 font-medium">
                        <img src={u.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} alt={u.name} className="w-6 h-6 rounded-full object-cover border" />
                        <span>{u.name}</span>
                      </td>
                      <td className="p-3 font-code text-[11px] text-text-secondary">{u.email}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-code uppercase bg-surface-subtle border border-border-subtle">
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(uid, e.target.value)}
                          className="bg-surface-subtle border border-border-subtle rounded px-2 py-1 text-xs text-text-primary focus:ring-1 focus:ring-primary cursor-pointer"
                        >
                          <option value="student">Student</option>
                          <option value="instructor">Instructor</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDeleteUser(uid)}
                          className="p-1.5 hover:bg-red-50 text-text-secondary hover:text-red-600 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-text-primary">
              <thead className="bg-surface-subtle uppercase font-code text-[11px] text-text-secondary border-b border-border-subtle">
                <tr>
                  <th className="p-3">Course</th>
                  <th className="p-3">Instructor</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {courses.map((c) => (
                  <tr key={c._id} className="hover:bg-surface-subtle/50 transition-colors">
                    <td className="p-3 flex items-center gap-3 font-medium">
                      <img src={c.thumbnail} alt={c.title} className="w-10 h-7 object-cover rounded bg-surface-muted" />
                      <span className="line-clamp-1">{c.title}</span>
                    </td>
                    <td className="p-3 text-text-secondary">{c.instructor?.name || 'Unknown'}</td>
                    <td className="p-3 font-code text-[11px]">{c.category}</td>
                    <td className="p-3 font-semibold">${c.price}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-code bg-emerald-100 text-emerald-800">
                        {c.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
