import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Award, BookOpen, DollarSign, Users, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

export const BecomeInstructorPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [expertise, setExpertise] = useState('Full-Stack Web Development');
  const [bio, setBio] = useState('');
  const [sampleVideoUrl, setSampleVideoUrl] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      alert('Please agree to the instructor guidelines.');
      return;
    }

    if (!user) {
      navigate('/login?redirect=/become-instructor');
      return;
    }

    try {
      setLoading(true);
      const res = await API.post('/auth/become-instructor', { bio, expertise });

      if (res.data.success) {
        updateUser(res.data.user);
        setMessage('Your account has been successfully upgraded to Instructor!');
        setTimeout(() => {
          navigate('/instructor/create-course');
        }, 1200);
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to submit application.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-8 space-y-12">
      {/* Hero Lead */}
      <section className="bg-surface-base border border-border-subtle rounded-3xl p-8 md:p-12 shadow-sm text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-glow-lavender/50 border border-border-subtle">
            <Sparkles className="w-4 h-4 text-purple-700" />
            <span className="font-code text-xs text-text-primary">SkillForge Partner Program</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-text-primary tracking-tight font-body leading-tight">
            Teach the Next Generation of CSE Engineers
          </h1>

          <p className="text-sm md:text-base text-text-secondary leading-relaxed">
            Share your expertise, publish project-based technical courses, build your professional brand, and earn revenue on SkillForge.
          </p>

          {user?.role === 'instructor' || user?.role === 'admin' ? (
            <div className="pt-4">
              <div className="inline-flex items-center gap-2 p-3 bg-glow-mint/40 border border-glow-mint text-emerald-900 rounded-xl text-xs font-semibold mb-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>You are already a verified SkillForge Instructor!</span>
              </div>
              <div>
                <Link
                  to="/instructor/dashboard"
                  className="px-6 py-3 bg-primary text-white text-xs font-semibold rounded-xl inline-flex items-center gap-2 hover:bg-zinc-800 transition-all"
                >
                  <span>Go to Instructor Studio</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="pt-2">
              <a
                href="#apply-form"
                className="px-6 py-3 bg-primary text-white text-xs font-semibold rounded-xl inline-flex items-center gap-2 hover:bg-zinc-800 transition-all shadow-md"
              >
                <span>Start Teaching Today</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Feature Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-base border border-border-subtle rounded-2xl p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-glow-cyan/40 text-cyan-900 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-text-primary">Earn Course Revenue</h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            Set your own course prices or offer free modules. Earn 80% revenue share on every direct student enrollment.
          </p>
        </div>

        <div className="bg-surface-base border border-border-subtle rounded-2xl p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-glow-mint/40 text-emerald-900 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-text-primary">Section & Lesson Builder</h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            Use our built-in studio tool to easily organize curriculum modules, upload video streams, and set free lesson previews.
          </p>
        </div>

        <div className="bg-surface-base border border-border-subtle rounded-2xl p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-glow-lavender/40 text-purple-900 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-text-primary">Reach 3,400+ Engineers</h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            Connect directly with B.Tech CSE students, developers, and tech professionals looking to level up their skills.
          </p>
        </div>
      </section>

      {/* Instructor Application Form */}
      {(!user || user.role === 'student') && (
        <section id="apply-form" className="bg-surface-base border border-border-subtle rounded-3xl p-8 shadow-md space-y-6">
          <div className="border-b border-border-subtle pb-4">
            <h2 className="text-xl font-bold text-text-primary">Instructor Application & Upgrade Form</h2>
            <p className="text-xs text-text-secondary mt-1">
              Fill out your teaching preferences below to instantly upgrade your account to Instructor status.
            </p>
          </div>

          {message && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1">Primary Area of Expertise</label>
              <select
                value={expertise}
                onChange={(e) => setExpertise(e.target.value)}
                className="w-full h-10 px-3 bg-surface-subtle border border-border-subtle rounded-lg text-xs text-text-primary focus:ring-1 focus:ring-primary"
              >
                <option value="Full-Stack Web Development">Full-Stack Web Development</option>
                <option value="AI & LLM Systems Engineering">AI & LLM Systems Engineering</option>
                <option value="System Design & Architecture">System Design & Architecture</option>
                <option value="DevOps & Kubernetes">DevOps & Kubernetes</option>
                <option value="UI/UX & Design Systems">UI/UX & Design Systems</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1">Instructor Bio & Experience</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Briefly describe your engineering background or topics you plan to teach..."
                className="w-full p-3 bg-surface-subtle border border-border-subtle rounded-lg text-xs text-text-primary focus:ring-1 focus:ring-primary"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1">Sample Video Lesson URL (Optional)</label>
              <input
                type="url"
                value={sampleVideoUrl}
                onChange={(e) => setSampleVideoUrl(e.target.value)}
                placeholder="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
                className="w-full h-10 px-3 bg-surface-subtle border border-border-subtle rounded-lg text-xs font-code text-text-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 rounded text-primary focus:ring-0 border-border-strong cursor-pointer"
              />
              <span className="text-xs text-text-secondary">
                I agree to the SkillForge Course Quality Guidelines & Instructor Terms.
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-primary text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all shadow-sm disabled:opacity-50"
            >
              {loading ? 'Processing Upgrade...' : 'Upgrade My Account to Instructor'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </section>
      )}
    </div>
  );
};
