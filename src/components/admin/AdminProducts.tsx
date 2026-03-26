import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2, BookOpen } from "lucide-react";
import { fetchProducts, addProduct, updateProduct, deleteProduct, Product, NewProduct } from "@/lib/products";
import { toast } from "sonner";

const EMPTY: NewProduct = { title: "", description: "", price: 0, class: "", subject: "", image_url: "", pdf_url: "", preview_text: "" };

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<NewProduct>(EMPTY);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    fetchProducts().then(setProducts).catch(() => toast.error("Failed to load")).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleSave = async () => {
    if (!form.title || !form.price || !form.class) {
      toast.error("Title, price and class are required");
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await updateProduct(editing.id, form);
        toast.success("Product updated");
      } else {
        await addProduct(form);
        toast.success("Product added");
      }
      setShowForm(false);
      setEditing(null);
      setForm(EMPTY);
      load();
    } catch (err: any) {
      toast.error(err.message || "Failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      toast.success("Deleted");
      load();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const startEdit = (p: Product) => {
    setEditing(p);
    setForm({ title: p.title, description: p.description, price: p.price, class: p.class, subject: p.subject, image_url: p.image_url, pdf_url: p.pdf_url, preview_text: p.preview_text });
    setShowForm(true);
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-foreground text-lg">Products ({products.length})</h3>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm(EMPTY); }} className="inline-flex items-center gap-2 gradient-bg text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold hover:brightness-110 active:scale-[0.97] transition-all">
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      {showForm && (
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm space-y-4">
          <h4 className="font-bold text-foreground">{editing ? "Edit Product" : "New Product"}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title *" className="border border-input rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <input type="number" value={form.price || ""} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} placeholder="Price (₹) *" className="border border-input rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <input value={form.class} onChange={(e) => setForm({ ...form, class: e.target.value })} placeholder="Class (e.g. 10) *" className="border border-input rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Subject" className="border border-input rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="Image URL" className="border border-input rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 md:col-span-2" />
            <input value={form.pdf_url} onChange={(e) => setForm({ ...form, pdf_url: e.target.value })} placeholder="PDF Download URL" className="border border-input rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 md:col-span-2" />
          </div>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={2} className="w-full border border-input rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
          <textarea value={form.preview_text} onChange={(e) => setForm({ ...form, preview_text: e.target.value })} placeholder="Preview text (shown on product page)" rows={2} className="w-full border border-input rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving} className="gradient-bg text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-semibold hover:brightness-110 transition-all disabled:opacity-50 flex items-center gap-2">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {editing ? "Update" : "Add"} Product
            </button>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="border border-border px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-muted transition-all">Cancel</button>
          </div>
        </div>
      )}

      {products.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
          <p className="text-muted-foreground">No products yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((p) => (
            <div key={p.id} className="bg-card rounded-xl border border-border p-4 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">Class {p.class}</span>
                  {p.subject && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent/10 text-accent">{p.subject}</span>}
                </div>
                <p className="font-medium text-foreground text-sm truncate">{p.title}</p>
                <p className="text-xs text-muted-foreground">₹{p.price}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(p)} className="p-2 rounded-lg hover:bg-muted transition-colors"><Pencil className="h-4 w-4 text-muted-foreground" /></button>
                <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"><Trash2 className="h-4 w-4 text-destructive" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
