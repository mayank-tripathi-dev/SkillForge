import React from 'react';
import { Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-surface-base border-t border-border-subtle mt-16 py-12 px-margin-mobile md:px-margin">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-white">
              <Layers className="w-4 h-4" />
            </div>
            <span className="font-semibold text-lg text-primary">SkillForge</span>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            Enterprise-grade course platform inspired by modern software architecture & engineering practices.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-text-primary mb-3">Platform</h4>
          <ul className="space-y-2 text-xs text-text-secondary">
            <li><Link to="/courses" className="hover:text-primary transition-colors">Browse Catalog</Link></li>
            <li><Link to="/courses?price=free" className="hover:text-primary transition-colors">Free Courses</Link></li>
            <li><Link to="/register?role=instructor" className="hover:text-primary transition-colors">Become an Instructor</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-text-primary mb-3">Roles</h4>
          <ul className="space-y-2 text-xs text-text-secondary">
            <li><Link to="/dashboard" className="hover:text-primary transition-colors">Student Learning Hub</Link></li>
            <li><Link to="/instructor/dashboard" className="hover:text-primary transition-colors">Instructor Studio</Link></li>
            <li><Link to="/admin/dashboard" className="hover:text-primary transition-colors">Admin Dashboard</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-text-primary mb-3">Security & Auth</h4>
          <p className="text-xs text-text-secondary leading-relaxed mb-2">
            Secured using Express Session-based auth with HttpOnly cookies & MongoDB session store.
          </p>
          <span className="font-code text-[11px] text-text-tertiary bg-surface-subtle border border-border-subtle px-2 py-1 rounded inline-block">
            MERN Monolith v1.0
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-border-subtle mt-8 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-text-tertiary">
        <p>© 2026 SkillForge Education Inc. All rights reserved.</p>
        <p className="font-code text-[11px] mt-2 md:mt-0">Designed for B.Tech Placement Technical Interviews</p>
      </div>
    </footer>
  );
};
