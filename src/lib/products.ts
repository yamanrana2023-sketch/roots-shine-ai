import { supabase } from "./supabase";

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  class: string;
  subject: string;
  image_url: string;
  pdf_url: string;
  preview_text: string;
  created_at: string;
}

export type NewProduct = Omit<Product, "id" | "created_at">;

export interface Order {
  id: string;
  product_id: string;
  customer_name: string;
  customer_phone: string;
  amount: number;
  utr_number: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  product_title?: string;
}

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data;
}

export async function addProduct(p: NewProduct): Promise<Product> {
  const { data, error } = await supabase.from("products").insert(p).select().single();
  if (error) throw error;
  return data;
}

export async function updateProduct(id: string, p: Partial<NewProduct>): Promise<void> {
  const { error } = await supabase.from("products").update(p).eq("id", id);
  if (error) throw error;
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

// Orders
export async function createOrder(o: Omit<Order, "id" | "created_at" | "status" | "product_title">): Promise<Order> {
  const { data, error } = await supabase
    .from("orders")
    .insert({ ...o, status: "pending" })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function fetchOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*, products(title)")
    .order("created_at", { ascending: false });
  if (error) {
    const { data: d2, error: e2 } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (e2) throw e2;
    return d2 || [];
  }
  return (data || []).map((o: any) => ({
    ...o,
    product_title: o.products?.title,
  }));
}

export async function fetchOrdersByPhone(phone: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*, products(title, pdf_url)")
    .eq("customer_phone", phone)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map((o: any) => ({
    ...o,
    product_title: o.products?.title,
    pdf_url: o.products?.pdf_url,
  }));
}

export async function updateOrderStatus(id: string, status: "approved" | "rejected"): Promise<void> {
  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  if (error) throw error;
}
