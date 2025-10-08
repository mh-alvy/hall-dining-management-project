import { supabase } from './supabase';

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  phone_number: string | null;
  profile_photo: string | null;
  roles: Array<'student' | 'manager' | 'admin'>;
}

export async function signIn(email: string, password: string): Promise<{ user: AuthUser | null; error: Error | null }> {
  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('No user returned');

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .maybeSingle();

    if (profileError) throw profileError;

    if (!profile) {
      throw new Error('Profile not found. Please contact administrator.');
    }

    const { data: roles, error: rolesError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', authData.user.id);

    if (rolesError) throw rolesError;

    if (!roles || roles.length === 0) {
      throw new Error('No roles assigned. Please contact administrator.');
    }

    const user: AuthUser = {
      id: profile.id,
      email: profile.email,
      full_name: profile.full_name,
      phone_number: profile.phone_number,
      profile_photo: profile.profile_photo,
      roles: roles.map(r => r.role)
    };

    return { user, error: null };
  } catch (error) {
    return { user: null, error: error as Error };
  }
}

export async function signOut(): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
}

export async function getCurrentUser(): Promise<{ user: AuthUser | null; error: Error | null }> {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) throw sessionError;
    if (!session) return { user: null, error: null };

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .maybeSingle();

    if (profileError) throw profileError;

    if (!profile) {
      return { user: null, error: null };
    }

    const { data: roles, error: rolesError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id);

    if (rolesError) throw rolesError;

    if (!roles || roles.length === 0) {
      return { user: null, error: null };
    }

    const user: AuthUser = {
      id: profile.id,
      email: profile.email,
      full_name: profile.full_name,
      phone_number: profile.phone_number,
      profile_photo: profile.profile_photo,
      roles: roles.map(r => r.role)
    };

    return { user, error: null };
  } catch (error) {
    return { user: null, error: error as Error };
  }
}

export function onAuthStateChange(callback: (user: AuthUser | null) => void) {
  return supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session) {
      const { user } = await getCurrentUser();
      callback(user);
    } else if (event === 'SIGNED_OUT') {
      callback(null);
    }
  });
}
