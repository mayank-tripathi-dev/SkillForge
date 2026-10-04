import React from 'react';
import { Link } from 'react-router-dom';
import { Course } from '../types';
import { Star, Clock, ArrowRight, Bookmark } from 'lucide-react';

interface CourseCardProps {
  course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const getBadgeStyle = (badge?: string) => {
    switch (badge) {
      case 'Bestseller':
        return 'bg-primary text-white';
      case 'Updated':
        return 'bg-glow-mint/90 border border-glow-mint text-text-primary';
      case 'Hot':
        return 'bg-glow-cyan text-text-primary';
      case 'New':
        return 'bg-glow-yellow text-text-primary';
      default:
        return 'bg-surface-subtle text-text-secondary border border-border-subtle';
    }
  };

  return (
    <article className="bg-surface-base border border-border-subtle rounded-xl overflow-hidden card-glow-hover flex flex-col justify-between group">
      <div>
        {/* Thumbnail */}
        <div className="relative aspect-video w-full overflow-hidden bg-surface-muted">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {course.badge && course.badge !== 'None' && (
            <div className="absolute top-3 left-3 flex gap-2">
              <span className={`text-[11px] font-code font-medium px-2 py-0.5 rounded shadow-xs ${getBadgeStyle(course.badge)}`}>
                {course.badge}
              </span>
            </div>
          )}
          <div className="absolute top-3 right-3">
            <button className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-border-subtle flex items-center justify-center text-text-secondary hover:text-primary transition-colors">
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-code text-[11px] text-text-secondary bg-surface-subtle border border-border-subtle px-2 py-0.5 rounded">
              {course.category}
            </span>
            <span className="text-text-tertiary text-xs">•</span>
            <span className="text-xs text-text-secondary font-medium">{course.level}</span>
          </div>

          <h3 className="text-base font-semibold text-text-primary line-clamp-2 group-hover:text-primary transition-colors">
            {course.title}
          </h3>

          {/* Instructor Info */}
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border-subtle">
            <img
              src={
                course.instructor?.profileImage ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
              }
              alt={course.instructor?.name || 'Instructor'}
              className="w-6 h-6 rounded-full object-cover border border-border-subtle"
            />
            <span className="text-xs text-text-secondary">{course.instructor?.name || 'Senior Instructor'}</span>
          </div>

          {/* Rating and Metrics */}
          <div className="flex items-center justify-between mt-3 text-xs">
            <div className="flex items-center gap-1 text-amber-500 font-medium">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-text-primary">{course.rating || 4.8}</span>
              <span className="text-text-tertiary font-normal">({course.ratingCount || 42})</span>
            </div>
            <div className="flex items-center gap-1.5 text-text-tertiary font-code text-[11px]">
              <Clock className="w-3.5 h-3.5" />
              <span>{course.sections?.reduce((sum, s) => sum + s.lessons.length, 0) || 12} lessons</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Action */}
      <div className="p-4 pt-0 mt-2 flex items-center justify-between border-t border-border-subtle/50">
        <div>
          <span className="text-[10px] text-text-tertiary block font-code">Lifetime Access</span>
          <span className="text-lg font-bold text-text-primary">
            {course.price === 0 ? 'Free' : `$${course.price}`}
          </span>
        </div>
        <Link
          to={`/courses/${course._id}`}
          className="h-9 px-3.5 rounded-lg bg-surface-subtle border border-border-subtle hover:bg-primary hover:text-white text-text-primary text-xs font-medium flex items-center gap-1.5 transition-all"
        >
          <span>View Course</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </article>
  );
};
