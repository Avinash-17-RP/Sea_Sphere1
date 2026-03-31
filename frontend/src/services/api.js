import { supabase } from '../lib/supabase';

// ─── Tasks ───
export async function fetchTasks(category) {
  let query = supabase.from('tasks').select('*').order('created_at', { ascending: false });
  if (category) {
    query = query.eq('category', category);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function createTask(task) {
  const { data, error } = await supabase.from('tasks').insert([task]).select().single();
  if (error) throw error;
  return data;
}

export async function updateTask(taskId, updates) {
  const { data, error } = await supabase.from('tasks').update(updates).eq('id', taskId).select().single();
  if (error) throw error;
  return data;
}

export async function deleteTask(taskId) {
  const { error } = await supabase.from('tasks').delete().eq('id', taskId);
  if (error) throw error;
}

// ─── Profiles ───
export async function fetchProfiles() {
  const { data, error } = await supabase.from('user_profiles').select('*');
  if (error) throw error;
  return data;
}

export async function createProfile(profile) {
  const { data, error } = await supabase.from('user_profiles').insert([profile]).select().single();
  if (error) throw error;
  return data;
}

export async function fetchProfile(username) {
  const { data, error } = await supabase.from('user_profiles').select('*').eq('username', username).single();
  if (error) throw error;
  return data;
}

// ─── Projects ───
export async function fetchProjects() {
  const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createProject(project) {
  const { data, error } = await supabase.from('projects').insert([project]).select().single();
  if (error) throw error;
  return data;
}

export async function deleteProject(projectId) {
  const { error } = await supabase.from('projects').delete().eq('id', projectId);
  if (error) throw error;
}
