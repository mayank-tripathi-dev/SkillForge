import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { Course, InstructorStats } from '../types';
import { PlusCircle, BookOpen, Users, DollarSign, Edit3, Trash2, Eye } from 'lucide-react';

export const InstructorDashboard: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<InstructorStats>({ totalCourses: 0, totalStudents: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState<boolean>(true);

  const fetchInstructorData = async () => {
    try {
      setLoading(true);
      const [coursesRes, statsRes] = await Promise.all([
        API.get('/instructor/courses'),
        API.get('/instructor/dashboard'),
      ]);

      if (coursesRes.data.success) {
        setCourses(coursesRes.data.courses);
      }
      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }
    } catch (error) {
      console.error('Error fetching instructor data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructorData();
  }, []);

  const handleDeleteCourse = async (courseId: string) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;

    try {
      const res = await API.delete(`/courses/${courseId}`);
      if (res.data.success) {
        setCourses((prev) => prev.filter((c) => c._id !== courseId));
      }
    } catch (error) {
      alert('Failed to delete course.');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-6 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-surface-base border border-border-subtle rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Instructor Studio</h1>
          <p className="text-xs text-text-secondary mt-1">
            Create high-quality video courses, add curriculum sections, and manage student enrollments.
          </p>
        </div>

        <Link
          to="/instructor/create-course"
          className="h-10 px-4 rounded-lg bg-primary text-white text-xs font-medium flex items-center gap-2 hover:bg-zinc-800 transition-all shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Course</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-surface-base border border-border-subtle rounded-xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-glow-cyan/40 text-cyan-900 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-2xl font-bold text-text-primary">{stats.totalCourses}</span>
            <span className="text-xs text-text-secondary block">Created Courses</span>
          </div>
        </div>

        <div className="bg-surface-base border border-border-subtle rounded-xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-glow-lavender/40 text-purple-900 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-2xl font-bold text-text-primary">{stats.totalStudents}</span>
            <span className="text-xs text-text-secondary block">Total Enrolled Students</span>
          </div>
        </div>

        <div className="bg-surface-base border border-border-subtle rounded-xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-glow-mint/40 text-emerald-900 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-2xl font-bold text-text-primary">${stats.totalRevenue}</span>
            <span className="text-xs text-text-secondary block">Earned Revenue</span>
          </div>
        </div>
      </div>

      {/* Course List Table */}
      <div className="bg-surface-base border border-border-subtle rounded-2xl p-6 shadow-xs space-y-4">
        <h2 className="text-base font-semibold text-text-primary">Your Courses</h2>

        {loading ? (
          <div className="py-8 text-center text-xs text-text-tertiary">Loading studio courses...</div>
        ) : courses.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-border-subtle rounded-xl">
            <p className="text-sm font-semibold text-text-primary mb-1">No Courses Created Yet</p>
            <p className="text-xs text-text-secondary mb-4">Start sharing your expertise by publishing your first course.</p>
            <Link to="/instructor/create-course" className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-medium">
              Create First Course
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-text-primary">
              <thead className="bg-surface-subtle uppercase font-code text-[11px] text-text-secondary border-b border-border-subtle">
                <tr>
                  <th className="p-3">Course</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Students</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {courses.map((course) => (
                  <tr key={course._id} className="hover:bg-surface-subtle/50 transition-colors">
                    <td className="p-3 flex items-center gap-3">
                      <img src={course.thumbnail} alt={course.title} className="w-12 h-9 object-cover rounded bg-surface-muted" />
                      <div>
                        <p className="font-semibold text-text-primary line-clamp-1">{course.title}</p>
                        <p className="text-[11px] text-text-tertiary">{course.level}</p>
                      </div>
                    </td>
                    <td className="p-3 font-code text-[11px]">{course.category}</td>
                    <td className="p-3 font-semibold">${course.price}</td>
                    <td className="p-3 font-code">{course.enrolledStudentsCount || 0}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-code ${
                        course.published ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {course.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/courses/${course._id}`} className="p-1.5 hover:bg-surface-subtle rounded text-text-secondary hover:text-primary">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteCourse(course._id)}
                          className="p-1.5 hover:bg-red-50 rounded text-text-secondary hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
