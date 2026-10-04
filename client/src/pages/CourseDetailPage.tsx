import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { Course } from '../types';
import { useAuth } from '../context/AuthContext';
import { Star, Clock, PlayCircle, CheckCircle, ShieldCheck, CreditCard, Lock } from 'lucide-react';

export const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [enrolling, setEnrolling] = useState<boolean>(false);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/courses/${id}`);
      if (res.data.success) {
        setCourse(res.data.course);
        setIsEnrolled(res.data.isEnrolled);
        if (res.data.course.sections && res.data.course.sections.length > 0) {
          setActiveSection(res.data.course.sections[0].sectionId);
        }
      }
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchCourseDetails();
  }, [id]);

  const handleEnrollClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (course?.price === 0) {
      processEnrollment('free');
    } else {
      setShowPaymentModal(true);
    }
  };

  const processEnrollment = async (method: string) => {
    try {
      setEnrolling(true);
      const res = await API.post('/enrollments', {
        courseId: course?._id,
        paymentMethod: method,
      });

      if (res.data.success) {
        setIsEnrolled(true);
        setShowPaymentModal(false);
        navigate(`/learn/${course?._id}`);
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Enrollment failed.');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 animate-pulse">
        <div className="h-8 bg-surface-muted rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-surface-muted rounded w-2/3 mb-8"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-96 bg-surface-muted rounded-xl"></div>
          <div className="h-80 bg-surface-muted rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <h2 className="text-xl font-bold text-text-primary mb-2">Course Not Found</h2>
        <p className="text-xs text-text-secondary mb-4">The course you are looking for does not exist.</p>
        <Link to="/courses" className="px-4 py-2 bg-primary text-white rounded-lg text-xs">Back to Courses</Link>
      </div>
    );
  }

  const totalLessons = course.sections?.reduce((acc, sec) => acc + (sec.lessons ? sec.lessons.length : 0), 0) || 0;

  return (
    <div className="w-full max-w-7xl mx-auto py-6">
      {/* Header Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center gap-2">
            <span className="font-code text-xs text-text-secondary bg-surface-subtle border border-border-subtle px-2.5 py-1 rounded">
              {course.category}
            </span>
            <span className="text-xs text-text-secondary">{course.level}</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight font-body leading-tight">
            {course.title}
          </h1>

          <p className="text-sm text-text-secondary leading-relaxed">{course.description}</p>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-1 text-amber-500 font-medium">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-text-primary font-bold">{course.rating}</span>
              <span className="text-text-tertiary">({course.ratingCount} reviews)</span>
            </div>

            <div className="flex items-center gap-1.5 text-text-secondary">
              <Clock className="w-4 h-4" />
              <span>{totalLessons} lessons</span>
            </div>

            <div className="flex items-center gap-2 border-l border-border-subtle pl-4">
              <img
                src={course.instructor?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={course.instructor?.name}
                onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'; }}
                className="w-6 h-6 rounded-full object-cover border border-border-subtle"
              />
              <span className="text-text-primary font-medium">{course.instructor?.name || 'Marcus Vance'}</span>
            </div>
          </div>

          {/* Curriculum Section */}
          <div className="bg-surface-base border border-border-subtle rounded-xl p-6 shadow-xs mt-8">
            <h2 className="text-base font-semibold text-text-primary mb-4">Course Curriculum</h2>

            <div className="space-y-4">
              {course.sections && course.sections.length > 0 ? (
                course.sections.map((section, idx) => (
                  <div key={section.sectionId || idx} className="border border-border-subtle rounded-lg overflow-hidden">
                    <button
                      onClick={() => setActiveSection(activeSection === section.sectionId ? null : section.sectionId)}
                      className="w-full flex items-center justify-between p-4 bg-surface-subtle text-left text-xs font-semibold text-text-primary hover:bg-surface-muted transition-colors"
                    >
                      <span>{section.title}</span>
                      <span className="font-code text-[11px] text-text-tertiary">{section.lessons?.length || 0} lessons</span>
                    </button>

                    {activeSection === section.sectionId && (
                      <div className="divide-y divide-border-subtle bg-surface-base">
                        {section.lessons?.map((lesson, lIdx) => (
                          <div key={lesson.lessonId || lIdx} className="p-3.5 flex items-center justify-between hover:bg-surface-subtle/50 transition-colors">
                            <div className="flex items-center gap-3">
                              <PlayCircle className="w-4 h-4 text-text-tertiary" />
                              <span className="text-xs text-text-primary">{lesson.title}</span>
                              {lesson.freePreview && (
                                <span className="bg-glow-mint/80 text-[10px] font-code px-1.5 py-0.5 rounded text-text-primary">
                                  Preview
                                </span>
                              )}
                            </div>
                            <span className="font-code text-[11px] text-text-tertiary">{lesson.duration}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-text-secondary">Curriculum content is being updated by the instructor.</p>
              )}
            </div>
          </div>
        </div>

        {/* Pricing Sidebar Card */}
        <div className="lg:col-span-4 sticky top-24">
          <div className="bg-surface-base border border-border-subtle rounded-xl overflow-hidden shadow-md p-6 space-y-6">
            <div className="aspect-video rounded-lg overflow-hidden bg-surface-muted">
              <img
                src={course.thumbnail}
                alt={course.title}
                onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'; }}
                className="w-full h-full object-cover"
              />
            </div>


            <div>
              <span className="text-xs text-text-tertiary block font-code">Total Course Price</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-bold text-text-primary">
                  {course.price === 0 ? 'Free' : `$${course.price}`}
                </span>
                {course.price > 0 && <span className="text-xs text-text-tertiary line-through">$199</span>}
              </div>
            </div>

            {isEnrolled ? (
              <div className="space-y-3">
                <div className="p-3 bg-glow-mint/30 border border-glow-mint rounded-lg flex items-center gap-2 text-xs text-text-primary font-medium">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>You are enrolled in this course</span>
                </div>
                <Link
                  to={`/learn/${course._id}`}
                  className="w-full h-11 bg-primary text-white rounded-lg font-medium text-xs flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all shadow-sm"
                >
                  <PlayCircle className="w-4 h-4" />
                  Go to Course Player
                </Link>
              </div>
            ) : (
              <button
                onClick={handleEnrollClick}
                disabled={enrolling}
                className="w-full h-11 bg-primary text-white rounded-lg font-medium text-xs flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all shadow-sm disabled:opacity-50"
              >
                {course.price === 0 ? 'Enroll Now for Free' : 'Purchase Course'}
              </button>
            )}

            <div className="space-y-2 pt-2 border-t border-border-subtle text-xs text-text-secondary">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Full Lifetime Access</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-600" />
                <span>Secure Session Payment Verification</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Checkout Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-surface-base border border-border-subtle rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h3 className="text-base font-semibold text-text-primary">Demo Payment Gateway</h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-text-tertiary hover:text-text-primary">✕</button>
            </div>

            <p className="text-xs text-text-secondary">
              This is a simulated demo checkout flow. Real payment integrations (Stripe/Razorpay) hook directly into this handler.
            </p>

            <div className="bg-surface-subtle p-3 rounded-lg border border-border-subtle space-y-1">
              <p className="text-xs font-semibold text-text-primary">{course.title}</p>
              <p className="text-xs font-bold text-text-primary">${course.price}</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => processEnrollment('demo_card')}
                disabled={enrolling}
                className="w-full py-2.5 bg-primary text-white text-xs font-medium rounded-lg flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all"
              >
                <CreditCard className="w-4 h-4" />
                {enrolling ? 'Processing...' : 'Pay with Simulated Card'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
