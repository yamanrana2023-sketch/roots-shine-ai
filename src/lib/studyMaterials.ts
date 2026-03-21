import { supabase } from "./supabase";

export interface StudyMaterial {
  id: string;
  title: string;
  type: "Notes" | "Homework";
  class: string;
  subject: string;
  pdf_link: string;
  created_at: string;
}

export type NewStudyMaterial = Omit<StudyMaterial, "id" | "created_at">;

export async function fetchMaterials(): Promise<StudyMaterial[]> {
  const { data, error } = await supabase
    .from("study_materials")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function addMaterial(m: NewStudyMaterial): Promise<StudyMaterial> {
  const { data, error } = await supabase
    .from("study_materials")
    .insert(m)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateMaterial(id: string, m: Partial<NewStudyMaterial>): Promise<void> {
  const { error } = await supabase
    .from("study_materials")
    .update(m)
    .eq("id", id);
  if (error) throw error;
}

export async function deleteMaterial(id: string): Promise<void> {
  const { error } = await supabase
    .from("study_materials")
    .delete()
    .eq("id", id);
  if (error) throw error;
}
