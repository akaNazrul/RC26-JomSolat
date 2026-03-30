import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Camera, User, Lock, Mail, Check, Loader2, Info, AlertTriangle } from 'lucide-react';
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
  const [debugInfo, setDebugInfo] = useState('');

  // Sync displayName with user when user object changes
  useEffect(() => {
    if (user?.display_name) {
      setDisplayName(user.display_name);
    }
  }, [user?.display_name]);

  // Clear messages after timeout
  const clearMessages = useCallback(() => {
    setTimeout(() => {
      setSuccessMessage('');
      setErrorMessage('');
      setDebugInfo('');
    }, 5000);
  }, []);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) {
      setErrorMessage('Please sign in to update your profile picture');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select an image file (JPG, PNG, or GIF)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Image must be less than 5MB');
      return;
    }

    setIsUploadingAvatar(true);
    setErrorMessage('');
    setDebugInfo('Starting upload...');

    try {
      // Generate file name
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      
      setDebugInfo('Uploading file to storage...');
      
      // Upload with explicit contentType
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { 
          upsert: true,
          contentType: file.type
        });

      if (uploadError) {
        console.error('Upload error details:', {
          message: uploadError.message,
          statusCode: (uploadError as any).statusCode,
          fullError: uploadError
        });
        
        // Provide helpful error messages based on the error type
        if (uploadError.message.includes('bucket') || uploadError.message.includes('not found')) {
          throw new Error('Error: Storage bucket "avatars" not found. Admin must create it in Supabase Dashboard -> Storage');
        }
        if (uploadError.message.includes('row-level security') || uploadError.message.includes('policy')) {
          throw new Error('Error: Permission denied: Storage policies not configured correctly. Run the SQL migration from SUPABASE_SETUP.md');
        }
        if (uploadError.message.includes('Unauthorized')) {
          throw new Error('Error: Unauthorized: You need to be signed in to upload');
        }
        throw new Error(`Error: Upload failed: ${uploadError.message}`);
      }

      setDebugInfo('Getting public URL...');

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      setDebugInfo('Updating profile in database...');

      // Update user profile in database
      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) {
        console.error('Database update error:', updateError);
        throw new Error(`Database update failed: ${updateError.message}`);
      }

      // Update local state - create new user object to ensure React detects the change
      const updatedUser = { ...user, avatar_url: publicUrl };
      setUser(updatedUser);
      
      setSuccessMessage('Profile picture updated successfully!');
      setDebugInfo('');
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      clearMessages();
    } catch (error) {
      console.error('Error uploading avatar:', error);
      const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
      setErrorMessage(errorMsg);
      setDebugInfo('');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleNameUpdate = async () => {
    if (!user || !displayName.trim()) {
      setErrorMessage('Please enter a display name');
      return;
    }
    
    if (displayName === user.display_name) {
      setErrorMessage('New name is the same as current name');
      return;
    }

    setIsUpdatingName(true);
    setErrorMessage('');
    setDebugInfo('Updating name...');

    try {
      // Update in database
      const { error: updateError } = await supabase
        .from('users')
        .update({ display_name: displayName.trim() })
        .eq('id', user.id);

      if (updateError) {
        console.error('Database update error details:', {
          message: updateError.message,
          code: (updateError as any).code,
          fullError: updateError
        });

        // Provide helpful error messages based on the error type
        if (updateError.message.includes('infinite recursion')) {
          throw new Error('Error: Policy error detected: Run the SQL migration from SUPABASE_SETUP.md to fix RLS policies');
        }
        if (updateError.message.includes('row-level security') || updateError.message.includes('policy')) {
          throw new Error('Error: Permission denied: RLS policies not configured. Run the SQL migration from SUPABASE_SETUP.md');
        }
        if (updateError.message.includes('42501')) {
          throw new Error('Error: Permission denied (42501): User row RLS policy missing or incorrect');
        }
        throw new Error(`Error: Update failed: ${updateError.message}`);
      }

      // Update local state with new user object
      const updatedUser = { ...user, display_name: displayName.trim() };
      setUser(updatedUser);
      
      setSuccessMessage('Display name updated successfully!');
      setDebugInfo('');
      clearMessages();
    } catch (error) {
      console.error('Error updating name:', error);
      const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
      setErrorMessage(errorMsg);
      setDebugInfo('');
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) {
      setErrorMessage('No email found. Please sign in again.');
      return;
    }

    setErrorMessage('');
    setDebugInfo('Sending reset email...');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error('Password reset error:', error);
        throw error;
      }

      setSuccessMessage('Password reset link sent to your email!');
      setDebugInfo('');
      clearMessages();
    } catch (error) {
      console.error('Error sending password reset:', error);
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setErrorMessage(`Failed to send: ${errorMsg}`);
      setDebugInfo('');
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
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
        {/* Debug Info */}
        {debugInfo && (
          <div className="p-3 rounded-lg bg-blue-500/20 text-blue-400 text-sm flex items-center gap-2">
            <Loader2 size={16} className="animate-spin" />
            {debugInfo}
          </div>
        )}

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="p-3 rounded-lg bg-green-500/20 text-green-400 text-sm flex items-center gap-2">
            <Check size={16} />
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="p-3 rounded-lg bg-red-500/20 text-red-400 text-sm flex items-start gap-2">
            <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
            {errorMessage}
          </div>
        )}

        {/* User ID for debugging */}
        {!user?.id && (
          <div className="p-3 rounded-lg bg-yellow-500/20 text-yellow-400 text-sm">
            Warning: Not signed in properly. Please sign out and sign in again.
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
                    {getInitials(user?.display_name || '')}
                  </span>
                </div>
              )}
              
              <button
                onClick={handleAvatarClick}
                disabled={isUploadingAvatar || !user?.id}
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-accent-warm text-white flex items-center justify-center hover:bg-accent-warm/90 transition-colors disabled:opacity-50"
                title={!user?.id ? "Sign in to upload" : "Change profile picture"}
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
                {user?.avatar_url ? 'Change your profile picture' : 'Upload a profile picture'}
              </p>
              <p className="font-body text-xs text-text-muted mt-1">
                JPG, PNG or WEBP. Max 5MB.
              </p>
            </div>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
            disabled={!user?.id}
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
              disabled={!user?.id}
              className="flex-1 px-4 py-3 rounded-xl bg-bg-base border border-border-color text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary disabled:opacity-50"
            />
            <button
              onClick={handleNameUpdate}
              disabled={isUpdatingName || displayName === user?.display_name || !displayName.trim() || !user?.id}
              className="px-4 py-3 rounded-xl bg-accent-warm text-white font-body font-semibold hover:bg-accent-warm/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isUpdatingName ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                'Save'
              )}
            </button>
          </div>
          {user?.id && (
            <p className="font-body text-xs text-text-muted mt-2">
              Current name: {user.display_name || 'Not set'}
            </p>
          )}
        </div>

        {/* Email Section (Read-only) */}
        <div className="p-4 rounded-2xl bg-bg-surface border border-border-color">
          <h3 className="font-body font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Mail size={18} className="text-text-muted" />
            Email Address
          </h3>
          
          <div className="px-4 py-3 rounded-xl bg-bg-base border border-border-color">
            <p className="font-body text-text-primary">{user?.email || 'Not signed in'}</p>
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
            disabled={!user?.email}
            className="w-full px-4 py-3 rounded-xl bg-bg-base border border-border-color text-text-primary font-body hover:bg-bg-elevated transition-colors text-left flex items-center justify-between group disabled:opacity-50"
          >
            <span>Change Password</span>
            <span className="text-xs text-accent-warm opacity-0 group-hover:opacity-100 transition-opacity">
              Click to send reset email ->
            </span>
          </button>
          
          {/* Helpful Info Box */}
          <div className="mt-3 p-3 rounded-lg bg-accent-primary/10 border border-accent-primary/20">
            <div className="flex items-start gap-2">
              <Info size={16} className="text-accent-primary mt-0.5 flex-shrink-0" />
              <div className="font-body text-xs text-text-secondary">
                <p className="font-semibold text-accent-primary mb-1">How it works:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Click the button above to request a reset link</li>
                  <li>Check your email ({user?.email || 'your email'}) for the reset link</li>
                  <li>Click the link to set a new password</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="p-4 rounded-2xl bg-bg-surface border border-border-color">
          <h3 className="font-body font-semibold text-text-primary mb-4">Account Information</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-body text-sm text-text-secondary">Account Type</span>
              <span className="font-body text-sm text-text-primary capitalize">{user?.role || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-body text-sm text-text-secondary">Sign-in Method</span>
              <span className="font-body text-sm text-text-primary capitalize">{user?.provider || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-body text-sm text-text-secondary">Member Since</span>
              <span className="font-body text-sm text-text-primary">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-body text-sm text-text-secondary">User ID</span>
              <span className="font-body text-xs text-text-muted truncate max-w-[150px]">
                {user?.id || 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}