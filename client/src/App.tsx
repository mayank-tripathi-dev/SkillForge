import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MicroPixelsCanvas } from './components/MicroPixelsCanvas';
import { ProtectedRoute } from './components/ProtectedRoute';

import { MarketplacePage } from './pages/MarketplacePage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { LearningInterface } from './pages/LearningInterface';
import { InstructorDashboard } from './pages/InstructorDashboard';
import { CreateCoursePage } from './pages/CreateCoursePage';
import { AdminDashboard } from './pages/AdminDashboard';
import { ProfilePage } from './pages/ProfilePage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-surface flex flex-col relative selection:bg-glow-cyan selection:text-text-primary">
          <MicroPixelsCanvas />
          <Navbar />

          <main className="flex-grow w-full max-w-7xl mx-auto px-margin-mobile md:px-margin py-6 z-10">
            <Routes>
              <Route path="/" element={<Navigate to="/courses" replace />} />
              <Route path="/courses" element={<MarketplacePage />} />
              <Route path="/courses/:id" element={<CourseDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['student', 'instructor', 'admin']}>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/learn/:courseId"
                element={
                  <ProtectedRoute allowedRoles={['student', 'instructor', 'admin']}>
                    <LearningInterface />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/instructor/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['instructor', 'admin']}>
                    <InstructorDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/instructor/create-course"
                element={
                  <ProtectedRoute allowedRoles={['instructor', 'admin']}>
                    <CreateCoursePage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/courses" replace />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
