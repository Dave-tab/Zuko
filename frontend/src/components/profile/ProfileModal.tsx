import React, { useEffect, useRef, useState } from 'react';
import {
  X,
  User,
  School,
  BookOpen,
  Calendar,
  Mail,
  Hash,
  Check,
  Edit3,
  Camera,
  LogOut,
} from 'lucide-react';
import { StudentProfile } from '../../types/finance';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  onSaveProfile: (
    updated: Partial<StudentProfile>,
  ) => Promise<void> | void;
  onUploadAvatar: (file: File) => Promise<void> | void;
  onLogout: () => Promise<void> | void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  onUploadAvatar,
  onLogout,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<StudentProfile>({
    ...profile,
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({ ...profile });
      setIsEditing(false);
      setErrorMessage('');
    }
  }, [profile, isOpen]);

  if (!isOpen) return null;

  const updateField = (
    field: keyof StudentProfile,
    value: string,
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSaving(true);

    try {
      await onSaveProfile({
        name: formData.name,
        university: formData.university,
        major: formData.major,
        year: formData.year,
        semester: formData.semester,
        matricNumber: formData.matricNumber,
      });

      setIsEditing(false);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Could not save your profile. Please try again.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData({ ...profile });
    setIsEditing(false);
    setErrorMessage('');
  };

  const handleAvatarChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setErrorMessage('');
    setIsUploading(true);

    try {
      await onUploadAvatar(file);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Could not upload your profile picture.',
      );
    } finally {
      setIsUploading(false);

      // Allow the same file to be selected again.
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleLogout = async () => {
    setErrorMessage('');
    setIsLoggingOut(true);

    try {
      await onLogout();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Could not log you out. Please try again.',
      );
      setIsLoggingOut(false);
    }
  };

  const inputClassName =
    'w-full px-3 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent';

  const iconInputClassName =
    `${inputClassName} pl-9`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-modal-title"
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-slate-200 animate-in zoom-in-95 duration-200"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-br from-emerald-800 to-emerald-600 px-6 pt-8 pb-6 text-white">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-emerald-100 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close profile dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4 pr-8">
            <div className="relative shrink-0">
             {formData.avatarUrl?.trim() ? (
  <img
    src={formData.avatarUrl}
    alt={`${formData.name || 'Student'} profile`}
    className="w-16 h-16 rounded-2xl object-cover border-2 border-white/80 shadow-md"
  />
) : (
                <div className="w-16 h-16 rounded-2xl bg-white/15 border-2 border-white/50 flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                aria-label="Change profile picture"
                className="absolute -bottom-2 -right-2 p-1.5 rounded-lg bg-white text-emerald-800 shadow-md hover:bg-emerald-50 disabled:opacity-60"
              >
                {isUploading ? (
                  <span className="text-[9px] font-bold">...</span>
                ) : (
                  <Camera className="w-4 h-4" />
                )}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3
                  id="profile-modal-title"
                  className="text-xl font-bold tracking-tight break-words"
                >
                  {formData.name || 'Student Profile'}
                </h3>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/40 text-emerald-100 border border-emerald-400/30">
                  Student
                </span>
              </div>

              <p className="text-xs text-emerald-100/90 font-medium mt-1">
                {formData.major || 'Department not set'}
              </p>

              <p className="text-[11px] text-emerald-200/80 mt-1">
                {formData.university || 'University not set'}
              </p>

<button
  type="button"
  onClick={() => fileInputRef.current?.click()}
  disabled={isUploading}
  className="mt-3 inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-bold text-emerald-800 shadow-sm transition-colors hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
>
  <Camera className="h-4 w-4" />
  {isUploading ? 'Uploading picture...' : 'Change Profile Picture'}
</button>
            </div>
          </div>
        </div>

        {/* Profile content */}
        <div className="p-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {isEditing
                ? 'Edit Profile Details'
                : 'Academic & Identity Records'}
            </h4>

            <button
              type="button"
              onClick={() => {
                if (isEditing) {
                  handleCancelEdit();
                } else {
                  setFormData({ ...profile });
                  setErrorMessage('');
                  setIsEditing(true);
                }
              }}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-emerald-50"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
            </button>
          </div>

          {errorMessage && (
            <div
              role="alert"
              className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"
            >
              {errorMessage}
            </div>
          )}

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Student Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(event) =>
                      updateField('name', event.target.value)
                    }
                    required
                    className={iconInputClassName}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  University / Institution
                </label>
                <div className="relative">
                  <School className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={formData.university}
                    onChange={(event) =>
                      updateField('university', event.target.value)
                    }
                    required
                    className={iconInputClassName}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department
                  </label>
                  <div className="relative">
                    <BookOpen className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={formData.major}
                      onChange={(event) =>
                        updateField('major', event.target.value)
                      }
                      required
                      className={iconInputClassName}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Year of Study
                  </label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(event) =>
                      updateField('year', event.target.value)
                    }
                    placeholder="e.g. 200 Level"
                    required
                    className={inputClassName}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Academic Semester
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={formData.semester}
                    onChange={(event) =>
                      updateField('semester', event.target.value)
                    }
                    placeholder="e.g. First Semester"
                    required
                    className={iconInputClassName}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Matric Number
                </label>
                <div className="relative">
                  <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={formData.matricNumber}
                    onChange={(event) =>
                      updateField('matricNumber', event.target.value)
                    }
                    placeholder="Enter your matric number"
                    className={iconInputClassName}
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm disabled:opacity-60 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              <ProfileRecord
                icon={<School className="w-4 h-4" />}
                label="University"
                value={formData.university}
              />

              <ProfileRecord
                icon={<BookOpen className="w-4 h-4" />}
                label="Department & Year"
                value={[formData.major, formData.year]
                  .filter(Boolean)
                  .join(' • ')}
              />

              <ProfileRecord
                icon={<Calendar className="w-4 h-4" />}
                label="Academic Semester"
                value={formData.semester}
              />

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="min-w-0 p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      Student Mail
                    </span>
                    <p className="text-[11px] font-medium text-slate-700 break-words">
                      {formData.email || 'Not provided'}
                    </p>
                  </div>
                </div>

                <div className="min-w-0 p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                  <Hash className="w-4 h-4 text-slate-400 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      Matric No.
                    </span>
                    <p className="text-[11px] font-medium text-slate-700 break-words">
                      {formData.matricNumber || 'Not provided'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-3 space-y-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Done
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full py-2.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  {isLoggingOut ? 'Logging out...' : 'Log Out'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface ProfileRecordProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const ProfileRecord: React.FC<ProfileRecordProps> = ({
  icon,
  label,
  value,
}) => (
  <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div className="min-w-0">
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </span>
      <p className="text-xs font-semibold text-slate-800 break-words">
        {value || 'Not provided'}
      </p>
    </div>
  </div>
);
