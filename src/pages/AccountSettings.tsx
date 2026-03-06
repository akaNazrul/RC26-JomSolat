import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Camera, User, Lock, Mail, Check, Loader2 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { supabase } from '@/lib/supabase';

export default function AccountSettings() {
  const { user, setUser } = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [displayName, setDisplayName] = useState(user?.display_name || '');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage('Image must be less than 2MB');
      return;
    }

    setIsUploadingAvatar(true);
    setErrorMessage('');

    try {
      // Delete old avatar if exists
      if (user.avatar_url) {
        const oldPath = new URL(user.avatar_url).pathname.split('/').pop();
        if (oldPath) {
          await supabase.storage.from('avatars').remove([oldPath]);
        }
      }

      // Upload new avatar
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      
      const { data: _uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update user profile in database
      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Update local state
      setUser({ ...user, avatar_url: publicUrl });
      setSuccessMessage('Profile picture updated successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setErrorMessage('Failed to upload profile picture. Please try again.');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleNameUpdate = async () => {
    if (!user || !displayName.trim()) return;
    if (displayName === user.display_name) return;

    setIsUpdatingName(true);
    setErrorMessage('');

    try {
      const { error: updateError } = await supabase
        .from('users')
        .update({ display_name: displayName.trim() })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Update local state
      setUser({ ...user, display_name: displayName.trim() });
      setSuccessMessage('Display name updated successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating name:', error);
      setErrorMessage('Failed to update display name. Please try again.');
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;

    setErrorMessage('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setSuccessMessage('Password reset link sent to your email');
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error('Error sending password reset:', error);
      setErrorMessage('Failed to send password reset email. Please try again.');
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-bg-base">
      <header className="sticky top-0 z-40 bg-bg-base/80 backdrop-blur-md border-b border-border-color">
        <div className="flex items-center gap-2 px-4 py-4">
          <Link to="/profile" className="p-2 -ml-2 rounded-full hover:bg-bg-surface">
            <ChevronLeft size={24} className="text-text-primary" />
          </Link>
          <h1 className="font-display text-xl text-text-primary">Account Settings</h1>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Success/Error Messages */}
        {successMessage && (
          <div className="p-3 rounded-lg bg-green-500/20 text-green-400 text-sm flex items-center gap-2">
            <Check size={16} />
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="p-3 rounded-lg bg-red-500/20 text-red-400 text-sm">
            {errorMessage}
          </div>
        )}

        {/* Profile Picture Section */}
        <div className="p-4 rounded-2xl bg-bg-surface border border-border-color">
          <h3 className="font-body font-semibold text-text-primary mb-4">Profile Picture</h3>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-2 border-accent-primary"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-accent-primary flex items-center justify-center border-2 border-accent-primary">
                  <span className="text-2xl font-body font-bold text-white">
                    {user?.display_name ? getInitials(user.display_name) : 'U'}
                  </span>
                </div>
              )}
              
              <button
                onClick={handleAvatarClick}
                disabled={isUploadingAvatar}
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-accent-warm text-white flex items-center justify-center hover:bg-accent-warm/90 transition-colors disabled:opacity-50"
              >
                {isUploadingAvatar ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Camera size={14} />
                )}
              </button>
            </div>
            
            <div className="flex-1">
              <p className="font-body text-sm text-text-secondary">
                Upload a new profile picture
              </p>
              <p className="font-body text-xs text-text-muted mt-1">
                JPG, PNG or GIF. Max 2MB.
              </p>
            </div>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>

        {/* Display Name Section */}
        <div className="p-4 rounded-2xl bg-bg-surface border border-border-color">
          <h3 className="font-body font-semibold text-text-primary mb-4 flex items-center gap-2">
            <User size={18} className="text-text-muted" />
            Display Name
          </h3>
          
          <div className="flex gap-3">
            <input
              id="display-name"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your name"
              autoComplete="name"
              className="flex-1 px-4 py-3 rounded-xl bg-bg-base border border-border-color text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary"
            />
            <button
              onClick={handleNameUpdate}
              disabled={isUpdatingName || displayName === user?.display_name || !displayName.trim()}
              className="px-4 py-3 rounded-xl bg-accent-warm text-white font-body font-semibold hover:bg-accent-warm/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdatingName ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                'Save'
              )}
            </button>
          </div>
        </div>

        {/* Email Section (Read-only) */}
        <div className="p-4 rounded-2xl bg-bg-surface border border-border-color">
          <h3 className="font-body font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Mail size={18} className="text-text-muted" />
            Email Address
          </h3>
          
          <div className="px-4 py-3 rounded-xl bg-bg-base border border-border-color">
            <p className="font-body text-text-primary">{user?.email}</p>
          </div>
          <p className="font-body text-xs text-text-muted mt-2">
            Email cannot be changed
          </p>
        </div>

        {/* Password Section */}
        <div className="p-4 rounded-2xl bg-bg-surface border border-border-color">
          <h3 className="font-body font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Lock size={18} className="text-text-muted" />
            Password
          </h3>
          
          <button
            onClick={handlePasswordReset}
            className="w-full px-4 py-3 rounded-xl bg-bg-base border border-border-color text-text-primary font-body hover:bg-bg-elevated transition-colors text-left"
          >
            Change Password
          </button>
          <p className="font-body text-xs text-text-muted mt-2">
            We'll send you a link to reset your password
          </p>
        </div>

        {/* Account Info */}
        <div className="p-4 rounded-2xl bg-bg-surface border border-border-color">
          <h3 className="font-body font-semibold text-text-primary mb-4">Account Information</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-body text-sm text-text-secondary">Account Type</span>
              <span className="font-body text-sm text-text-primary capitalize">{user?.role}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-body text-sm text-text-secondary">Sign-in Method</span>
              <span className="font-body text-sm text-text-primary capitalize">{user?.provider}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-body text-sm text-text-secondary">Member Since</span>
              <span className="font-body text-sm text-text-primary">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

