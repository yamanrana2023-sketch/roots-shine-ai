import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Loader2, ShoppingCart } from "lucide-react";
import { fetchProductById, Product } from "@/lib/products";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchProductById(id)
      .then(setProduct)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <BookOpen className="h-12 w-12 text-muted-foreground/40" />
        <p className="text-muted-foreground">Product not found</p>
        <button onClick={() => navigate("/store")} className="text-primary text-sm font-medium">← Back to Store</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="glass border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center gap-3">
          <button onClick={() => navigate("/store")} className="p-2 rounded-xl hover:bg-muted active:scale-95 transition-all">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-display font-bold text-foreground truncate">{product.title}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
          {product.image_url ? (
            <img src={product.image_url} alt={product.title} className="w-full aspect-video object-cover" />
          ) : (
            <div className="w-full aspect-video gradient-bg flex items-center justify-center">
              <BookOpen className="h-16 w-16 text-primary-foreground/50" />
            </div>
          )}

          <div className="p-6 md:p-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">Class {product.class}</span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-accent/10 text-accent">{product.subject}</span>
            </div>

            <h2 className="text-2xl font-display font-bold text-foreground mb-3">{product.title}</h2>
            <p className="text-muted-foreground mb-6">{product.description}</p>

            {product.preview_text && (
              <div className="bg-muted/50 rounded-xl p-4 mb-6 border border-border">
                <p className="text-xs font-semibold text-muted-foreground mb-2">PREVIEW</p>
                <p className="text-sm text-foreground">{product.preview_text}</p>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div>
                <p className="text-sm text-muted-foreground">Price</p>
                <p className="text-3xl font-display font-bold text-primary">₹{product.price}</p>
              </div>
              <button
                onClick={() => navigate(`/buy/${product.id}`)}
                className="inline-flex items-center gap-2 gradient-bg text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:brightness-110 active:scale-[0.97] transition-all glow-primary"
              >
                <ShoppingCart className="h-4 w-4" />
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
