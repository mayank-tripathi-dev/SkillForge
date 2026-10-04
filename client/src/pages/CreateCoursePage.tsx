import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { Section } from '../types';
import { ArrowLeft, Plus, Trash2, Video } from 'lucide-react';

export const CreateCoursePage: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('99');
  const [thumbnail, setThumbnail] = useState('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800');
  const [category, setCategory] = useState('Development');
  const [level, setLevel] = useState('Intermediate');
  const [badge, setBadge] = useState('New');
  const [sections, setSections] = useState<Section[]>([
    {
      sectionId: `sec_${Date.now()}`,
      title: 'Section 1: Course Overview & Introduction',
      order: 1,
      lessons: [
        {
          lessonId: `les_${Date.now()}_1`,
          title: 'Lesson 1: Welcome to the Course',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          duration: '10:00',
          order: 1,
          freePreview: true,
        },
      ],
    },
  ]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const addSection = () => {
    const newSec: Section = {
      sectionId: `sec_${Date.now()}`,
      title: `Section ${sections.length + 1}: New Curriculum Module`,
      order: sections.length + 1,
      lessons: [],
    };
    setSections([...sections, newSec]);
  };

  const removeSection = (sectionId: string) => {
    setSections(sections.filter((s) => s.sectionId !== sectionId));
  };

  const addLesson = (sectionId: string) => {
    setSections(
      sections.map((sec) => {
        if (sec.sectionId === sectionId) {
          const newLes = {
            lessonId: `les_${Date.now()}_${sec.lessons.length + 1}`,
            title: `Lesson ${sec.lessons.length + 1}: New Video Topic`,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            duration: '12:00',
            order: sec.lessons.length + 1,
            freePreview: false,
          };
          return { ...sec, lessons: [...sec.lessons, newLes] };
        }
        return sec;
      })
    );
  };

  const updateLessonField = (sectionId: string, lessonId: string, field: string, value: any) => {
    setSections(
      sections.map((sec) => {
        if (sec.sectionId === sectionId) {
          const updatedLessons = sec.lessons.map((les) => {
            if (les.lessonId === lessonId) {
              return { ...les, [field]: value };
            }
            return les;
          });
          return { ...sec, lessons: updatedLessons };
        }
        return sec;
      })
    );
  };

  const removeLesson = (sectionId: string, lessonId: string) => {
    setSections(
      sections.map((sec) => {
        if (sec.sectionId === sectionId) {
          return { ...sec, lessons: sec.lessons.filter((l) => l.lessonId !== lessonId) };
        }
        return sec;
      })
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title || !description || price === '') {
      setError('Please fill in required fields.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await API.post('/courses', {
        title,
        description,
        price: Number(price),
        thumbnail,
        category,
        level,
        badge,
        sections,
      });

      if (res.data.success) {
        navigate('/instructor/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create course.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/instructor/dashboard" className="p-2 border border-border-subtle rounded-lg text-text-secondary hover:text-text-primary">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-2xl font-bold text-text-primary">Create New Course</h1>
        </div>
      </div>

      {error && <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Course Overview Card */}
        <div className="bg-surface-base border border-border-subtle rounded-xl p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-semibold text-text-primary">Course Details</h2>

          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">Course Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Master Enterprise Node.js & System Design"
              required
              className="w-full h-10 px-3 bg-surface-subtle border border-border-subtle rounded-lg text-xs text-text-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">Course Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Detailed breakdown of what students will build and learn..."
              required
              className="w-full p-3 bg-surface-subtle border border-border-subtle rounded-lg text-xs text-text-primary focus:ring-1 focus:ring-primary"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1">Price ($) *</label>
              <input
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full h-10 px-3 bg-surface-subtle border border-border-subtle rounded-lg text-xs text-text-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 px-3 bg-surface-subtle border border-border-subtle rounded-lg text-xs text-text-primary focus:ring-1 focus:ring-primary"
              >
                <option value="Development">Development</option>
                <option value="Design">Design</option>
                <option value="Business">Business</option>
                <option value="Marketing">Marketing</option>
                <option value="IT & Software">IT & Software</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1">Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full h-10 px-3 bg-surface-subtle border border-border-subtle rounded-lg text-xs text-text-primary focus:ring-1 focus:ring-primary"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">Thumbnail Image URL</label>
            <input
              type="url"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              className="w-full h-10 px-3 bg-surface-subtle border border-border-subtle rounded-lg text-xs text-text-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Section & Curriculum Builder */}
        <div className="bg-surface-base border border-border-subtle rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-text-primary">Curriculum Builder</h2>
            <button
              type="button"
              onClick={addSection}
              className="px-3 py-1.5 bg-surface-subtle border border-border-subtle hover:bg-primary hover:text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Section
            </button>
          </div>

          <div className="space-y-4">
            {sections.map((section, sIdx) => (
              <div key={section.sectionId} className="border border-border-subtle rounded-xl p-4 space-y-3 bg-surface-subtle/30">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) => {
                      const newSecs = [...sections];
                      newSecs[sIdx].title = e.target.value;
                      setSections(newSecs);
                    }}
                    className="flex-1 h-9 px-3 bg-surface-base border border-border-subtle rounded-lg text-xs font-semibold text-text-primary"
                  />
                  <button
                    type="button"
                    onClick={() => removeSection(section.sectionId)}
                    className="p-2 text-text-tertiary hover:text-red-600 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Lessons List */}
                <div className="space-y-2 pl-4 border-l-2 border-border-subtle">
                  {section.lessons.map((lesson) => (
                    <div key={lesson.lessonId} className="bg-surface-base p-3 rounded-lg border border-border-subtle space-y-2">
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4 text-text-tertiary" />
                        <input
                          type="text"
                          value={lesson.title}
                          onChange={(e) => updateLessonField(section.sectionId, lesson.lessonId, 'title', e.target.value)}
                          placeholder="Lesson Title"
                          className="flex-1 h-8 px-2 bg-surface-subtle border border-border-subtle rounded text-xs text-text-primary"
                        />
                        <input
                          type="text"
                          value={lesson.duration}
                          onChange={(e) => updateLessonField(section.sectionId, lesson.lessonId, 'duration', e.target.value)}
                          placeholder="12:00"
                          className="w-20 h-8 px-2 bg-surface-subtle border border-border-subtle rounded text-xs font-code text-text-primary"
                        />
                        <button
                          type="button"
                          onClick={() => removeLesson(section.sectionId, lesson.lessonId)}
                          className="p-1.5 text-text-tertiary hover:text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <input
                        type="url"
                        value={lesson.videoUrl}
                        onChange={(e) => updateLessonField(section.sectionId, lesson.lessonId, 'videoUrl', e.target.value)}
                        placeholder="Video Stream URL (MP4 / HLS)"
                        className="w-full h-8 px-2 bg-surface-subtle border border-border-subtle rounded text-xs font-code text-text-primary"
                      />
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => addLesson(section.sectionId)}
                    className="text-xs text-primary font-semibold hover:underline flex items-center gap-1 mt-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Lesson to Section
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full h-11 bg-primary text-white text-xs font-medium rounded-xl hover:bg-zinc-800 transition-all shadow-md disabled:opacity-50"
        >
          {submitting ? 'Publishing Course...' : 'Publish Course'}
        </button>
      </form>
    </div>
  );
};
