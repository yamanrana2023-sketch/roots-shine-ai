import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Search, Filter, Loader2, ArrowLeft, ShoppingBag } from "lucide-react";
import { fetchProducts, Product } from "@/lib/products";

const CLASSES = ["All", "5", "6", "7", "9", "10", "11", "12"];

export default function Store() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("All");

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.subject.toLowerCase().includes(search.toLowerCase());
    const matchClass = classFilter === "All" || p.class === classFilter;
    return matchSearch && matchClass;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="glass border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center gap-3">
          <button onClick={() => navigate("/")} className="p-2 rounded-xl hover:bg-muted active:scale-95 transition-all">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <ShoppingBag className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-display font-bold text-foreground">Study Material Store</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes, books..."
              className="w-full pl-10 pr-4 py-3 border border-input rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {CLASSES.map((c) => (
              <button
                key={c}
                onClick={() => setClassFilter(c)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  classFilter === c
                    ? "gradient-bg text-primary-foreground glow-primary"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {c === "All" ? "All Classes" : `Class ${c}`}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground">No materials found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate(`/store/${p.id}`)}
                className="bg-card rounded-2xl border border-border overflow-hidden cursor-pointer glow-card group"
              >
                {p.image_url ? (
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={p.image_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                ) : (
                  <div className="aspect-[4/3] gradient-bg flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-primary-foreground/60" />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">Class {p.class}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent/10 text-accent">{p.subject}</span>
                  </div>
                  <h3 className="font-display font-bold text-foreground text-sm mb-1 line-clamp-2">{p.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{p.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">₹{p.price}</span>
                    <span className="text-xs gradient-bg text-primary-foreground px-3 py-1.5 rounded-lg font-semibold">Buy Now</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
