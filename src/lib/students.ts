import { supabase } from "./supabase";

export interface Student {
  id: string;
  name: string;
  phone: string;
  course: string;
  payment_status: "paid" | "pending";
  created_at: string;
}

export interface Payment {
  id: string;
  student_id: string;
  amount: number;
  status: "success" | "failed" | "pending";
  razorpay_payment_id: string | null;
  date: string;
  student_name?: string;
  student_phone?: string;
  course_name?: string;
}

export interface CourseAccess {
  id: string;
  phone: string;
  course_id: string;
  access_status: "active" | "revoked";
  course_name?: string;
}

// Students
export async function fetchStudents(): Promise<Student[]> {
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.warn("students table error:", error.message);
    return [];
  }
  return data || [];
}

export async function addStudent(s: Omit<Student, "id" | "created_at">): Promise<Student> {
  const { data, error } = await supabase.from("students").insert(s).select().single();
  if (error) throw error;
  return data;
}

export async function updateStudentPayment(id: string, status: "paid" | "pending"): Promise<void> {
  const { error } = await supabase.from("students").update({ payment_status: status }).eq("id", id);
  if (error) throw error;
}

// Payments
export async function fetchPayments(): Promise<Payment[]> {
  const { data, error } = await supabase
    .from("payments")
    .select("*, students(name, phone, course)")
    .order("date", { ascending: false });
  if (error) {
    const { data: d2, error: e2 } = await supabase.from("payments").select("*").order("date", { ascending: false });
    if (e2) return [];
    return d2 || [];
  }
  return (data || []).map((p: any) => ({
    ...p,
    student_name: p.students?.name,
    student_phone: p.students?.phone,
    course_name: p.students?.course,
  }));
}

export async function addPayment(p: Omit<Payment, "id" | "student_name" | "student_phone" | "course_name">): Promise<Payment> {
  const { data, error } = await supabase.from("payments").insert(p).select().single();
  if (error) throw error;
  return data;
}

export async function updatePaymentStatus(id: string, status: "success" | "failed" | "pending"): Promise<void> {
  const { error } = await supabase.from("payments").update({ status }).eq("id", id);
  if (error) throw error;
}

// Access
export async function fetchAccess(): Promise<CourseAccess[]> {
  const { data, error } = await supabase.from("access").select("*").order("id", { ascending: false });
  if (error) {
    console.warn("access table not found:", error.message);
    return [];
  }
  return data || [];
}

export async function grantAccess(phone: string, course_id: string): Promise<void> {
  const { error } = await supabase
    .from("access")
    .upsert({ phone, course_id, access_status: "active" }, { onConflict: "phone,course_id" });
  if (error) throw error;
}

export async function revokeAccess(id: string): Promise<void> {
  const { error } = await supabase.from("access").update({ access_status: "revoked" }).eq("id", id);
  if (error) throw error;
}

// Stats
export async function fetchDashboardStats() {
  const [students, payments] = await Promise.all([fetchStudents(), fetchPayments()]);
  const totalStudents = students.length;
  const totalRevenue = payments.filter(p => p.status === "success").reduce((s, p) => s + (p.amount || 0), 0);
  const recentPayments = payments.slice(0, 5);
  const paidStudents = students.filter(s => s.payment_status === "paid").length;
  return { totalStudents, totalRevenue, recentPayments, paidStudents };
}
