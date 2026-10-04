import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { User as UserIcon, Shield, Save } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      setSaving(true);
      const res = await API.put('/auth/profile', { name, profileImage });
      if (res.data.success) {
        updateUser(res.data.user);
        setMessage('Profile updated successfully.');
      }
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-12 px-4">
      <div className="bg-surface-base border border-border-subtle rounded-2xl shadow-xl p-8 space-y-6">
        <div className="flex items-center gap-4 pb-4 border-b border-border-subtle">
          <img
            src={user?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
            alt={user?.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-primary"
          />
          <div>
            <h1 className="text-xl font-bold text-text-primary">{user?.name}</h1>
            <p className="text-xs text-text-secondary">{user?.email}</p>
            <span className="mt-1 inline-block text-[10px] font-code uppercase px-2 py-0.5 rounded bg-glow-lavender/60 border border-border-subtle text-text-primary">
              Role: {user?.role}
            </span>
          </div>
        </div>

        {message && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full h-10 px-3 bg-surface-subtle border border-border-subtle rounded-lg text-xs text-text-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">Avatar Image URL</label>
            <input
              type="url"
              value={profileImage}
              onChange={(e) => setProfileImage(e.target.value)}
              className="w-full h-10 px-3 bg-surface-subtle border border-border-subtle rounded-lg text-xs text-text-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="h-10 px-5 bg-primary text-white text-xs font-medium rounded-lg flex items-center gap-2 hover:bg-zinc-800 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
