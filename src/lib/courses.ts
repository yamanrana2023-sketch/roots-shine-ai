import { supabase } from "./supabase";

export interface Course {
  id: string;
  title: string;
  fees: number;
  description: string;
  class: string;
  duration: string;
  created_at: string;
}

export type NewCourse = Omit<Course, "id" | "created_at">;

export async function fetchCourses(): Promise<Course[]> {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function addCourse(c: NewCourse): Promise<Course> {
  const { data, error } = await supabase
    .from("courses")
    .insert(c)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateCourse(id: string, c: Partial<NewCourse>): Promise<void> {
  const { error } = await supabase.from("courses").update(c).eq("id", id);
  if (error) throw error;
}

export async function deleteCourse(id: string): Promise<void> {
  const { error } = await supabase.from("courses").delete().eq("id", id);
  if (error) throw error;
}
