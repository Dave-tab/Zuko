
import { supabase } from '../lib/supabase';
import { StudentProfile } from '../types/finance';

type StudentProfileRow = {
  id: string;
  university: string | null;
  department: string | null;
  year_of_study: string | null;
  academic_semester: string | null;
  matric_number: string | null;
  avatar_url: string | null;
  updated_at?: string;
};

async function getAuthenticatedUser() {
  const { data, error } = await supabase.auth.getUser();

  if (error) throw error;
  if (!data.user) throw new Error('You must be logged in to manage your profile.');

  return data.user;
}

export async function loadStudentProfile(): Promise<StudentProfile> {
  const user = await getAuthenticatedUser();

  const { data, error } = await supabase
    .from('student_profiles')
    .select('id, university, department, year_of_study, academic_semester, matric_number, avatar_url')
    .eq('id', user.id)
    .maybeSingle();

  if (error) throw error;

  const row = data as StudentProfileRow | null;
  const metadataName = user.user_metadata?.full_name;

  const name =
    typeof metadataName === 'string' && metadataName.trim()
      ? metadataName.trim()
      : user.email?.split('@')[0] || '';

  return {
    name,
    email: user.email || '',
    university: row?.university || '',
    major: row?.department || '',
    year: row?.year_of_study || '',
    semester: row?.academic_semester || '',
    matricNumber: row?.matric_number || '',
    avatarUrl: row?.avatar_url || '',
  };
}

export async function saveStudentProfile(
  updates: Partial<StudentProfile>,
): Promise<StudentProfile> {
  const user = await getAuthenticatedUser();

  // Keep the student's name in Supabase Auth metadata.
  if (typeof updates.name === 'string') {
    const { error } = await supabase.auth.updateUser({
      data: { full_name: updates.name.trim() },
    });

    if (error) throw error;
  }

  const databaseUpdates: Partial<StudentProfileRow> = {};

  if (typeof updates.university === 'string') {
    databaseUpdates.university = updates.university.trim();
  }
  if (typeof updates.major === 'string') {
    databaseUpdates.department = updates.major.trim();
  }
  if (typeof updates.year === 'string') {
    databaseUpdates.year_of_study = updates.year.trim();
  }
  if (typeof updates.semester === 'string') {
    databaseUpdates.academic_semester = updates.semester.trim();
  }
  if (typeof updates.matricNumber === 'string') {
    databaseUpdates.matric_number = updates.matricNumber.trim();
  }
  if (typeof updates.avatarUrl === 'string') {
    databaseUpdates.avatar_url = updates.avatarUrl;
  }

  if (Object.keys(databaseUpdates).length > 0) {
const { error } = await supabase
  .from('student_profiles')
  .upsert(
    {
      id: user.id,
      ...databaseUpdates,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' },
  );

if (error) {
  console.error('Supabase profile save failed:', error);
  throw new Error(`Profile save failed: ${error.message}`);
}

console.log('Student profile saved successfully.');
  }

  // Read back the saved record and the latest authentication metadata.
  return loadStudentProfile();
}

export async function uploadStudentAvatar(file: File): Promise<string> {
  const user = await getAuthenticatedUser();

  if (!file.type.startsWith('image/')) {
    throw new Error('Please select an image file.');
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Your profile picture must be 5 MB or smaller.');
  }

  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const filePath = `${user.id}/profile.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from('student-avatars')
    .upload(filePath, file, {
      upsert: true,
      contentType: file.type,
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('student-avatars')
    .getPublicUrl(filePath);

  const avatarUrl = data.publicUrl;

  await saveStudentProfile({ avatarUrl });

  return avatarUrl;
}

export async function logoutStudent(): Promise<void> {
  const { error } = await supabase.auth.signOut();

  if (error) throw error;
}
