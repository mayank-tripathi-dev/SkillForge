import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import { Course, Lesson, Progress } from '../types';
import { PlayCircle, CheckCircle, ArrowLeft, ChevronRight } from 'lucide-react';

export const LearningInterface: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();

  const [course, setCourse] = useState<Course | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);

  const fetchLearningData = async () => {
    try {
      setLoading(true);
      const [courseRes, progressRes] = await Promise.all([
        API.get(`/courses/${courseId}`),
        API.get(`/student/progress/${courseId}`),
      ]);

      if (courseRes.data.success) {
        const cData: Course = courseRes.data.course;
        setCourse(cData);

        // Select initial lesson
        if (cData.sections && cData.sections.length > 0 && cData.sections[0].lessons?.length > 0) {
          setCurrentLesson(cData.sections[0].lessons[0]);
        }
      }

      if (progressRes.data.success) {
        setProgress(progressRes.data.progress);
      }
    } catch (error) {
      console.error('Error fetching learning interface data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) fetchLearningData();
  }, [courseId]);

  const toggleLessonCompletion = async () => {
    if (!currentLesson || !course) return;

    try {
      setUpdating(true);
      const isCompleted = progress?.completedLessons.includes(currentLesson.lessonId);

      const res = await API.post('/student/progress', {
        courseId: course._id,
        lessonId: currentLesson.lessonId,
        completed: !isCompleted,
      });

      if (res.data.success) {
        setProgress(res.data.progress);
      }
    } catch (error) {
      console.error('Error updating lesson completion:', error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-code text-text-secondary">Loading Video Workspace...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <h2 className="text-lg font-bold text-text-primary mb-2">Course Unavailable</h2>
        <Link to="/dashboard" className="text-xs text-primary font-semibold hover:underline">Return to Dashboard</Link>
      </div>
    );
  }

  const isCurrentCompleted = currentLesson ? progress?.completedLessons.includes(currentLesson.lessonId) : false;

  return (
    <div className="min-h-[88vh] bg-surface flex flex-col">
      {/* Top Header */}
      <div className="bg-surface-base border-b border-border-subtle px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="p-1.5 rounded-lg border border-border-subtle hover:bg-surface-subtle transition-colors text-text-secondary">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-sm font-semibold text-text-primary line-clamp-1">{course.title}</h1>
            <p className="text-[11px] text-text-secondary">{currentLesson?.title || 'Video Player'}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-secondary">Overall Progress</span>
            <span className="font-code text-xs font-bold text-text-primary">{progress?.completionPercentage || 0}%</span>
          </div>
          <div className="w-32 bg-surface-muted h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-300"
              style={{ width: `${progress?.completionPercentage || 0}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12">
        {/* Video Player Column */}
        <div className="lg:col-span-8 bg-black p-4 lg:p-6 flex flex-col justify-between">
          <div className="aspect-video w-full max-w-4xl mx-auto bg-zinc-900 rounded-xl overflow-hidden shadow-2xl flex items-center justify-center relative">
            {currentLesson?.videoUrl ? (
              <video
                key={currentLesson.lessonId}
                src={currentLesson.videoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-center p-8 text-white space-y-2">
                <PlayCircle className="w-12 h-12 text-zinc-500 mx-auto" />
                <p className="text-sm">Select a lesson from the curriculum sidebar to start playback.</p>
              </div>
            )}
          </div>

          {/* Lesson Action Footer */}
          <div className="max-w-4xl mx-auto w-full mt-4 flex items-center justify-between bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-white">
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">{currentLesson?.title}</h3>
              <p className="text-xs text-zinc-400">Duration: {currentLesson?.duration || '10:00'}</p>
            </div>

            <button
              onClick={toggleLessonCompletion}
              disabled={updating}
              className={`h-9 px-4 rounded-lg text-xs font-medium flex items-center gap-2 transition-all ${
                isCurrentCompleted
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-white text-zinc-900 hover:bg-zinc-200'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isCurrentCompleted ? 'Completed' : 'Mark as Completed'}</span>
            </button>
          </div>
        </div>

        {/* Lessons Playlist Sidebar */}
        <div className="lg:col-span-4 bg-surface-base border-l border-border-subtle p-4 overflow-y-auto">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-primary mb-4">Course Curriculum</h2>

          <div className="space-y-4">
            {course.sections?.map((section, sIdx) => (
              <div key={section.sectionId || sIdx} className="space-y-2">
                <div className="text-xs font-semibold text-text-primary bg-surface-subtle p-2.5 rounded-lg border border-border-subtle flex items-center justify-between">
                  <span>{section.title}</span>
                  <span className="font-code text-[10px] text-text-tertiary">{section.lessons?.length || 0} lessons</span>
                </div>

                <div className="space-y-1 pl-2">
                  {section.lessons?.map((lesson) => {
                    const isSelected = currentLesson?.lessonId === lesson.lessonId;
                    const isDone = progress?.completedLessons.includes(lesson.lessonId);

                    return (
                      <button
                        key={lesson.lessonId}
                        onClick={() => setCurrentLesson(lesson)}
                        className={`w-full text-left p-2.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                          isSelected
                            ? 'bg-primary text-white font-medium shadow-xs'
                            : 'hover:bg-surface-subtle text-text-primary'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {isDone ? (
                            <CheckCircle className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-300' : 'text-emerald-600'}`} />
                          ) : (
                            <PlayCircle className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-text-tertiary'}`} />
                          )}
                          <span className="line-clamp-1">{lesson.title}</span>
                        </div>
                        <span className={`font-code text-[10px] ${isSelected ? 'text-zinc-300' : 'text-text-tertiary'}`}>
                          {lesson.duration}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
