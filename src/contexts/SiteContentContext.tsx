import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { SiteContent, defaultContent } from "@/lib/siteContent";
import { supabase } from "@/lib/supabase";

interface SiteContentContextType {
  content: SiteContent;
  loading: boolean;
  updateContent: (updates: Partial<SiteContent>) => Promise<boolean>;
}

const SiteContentContext = createContext<SiteContentContextType>({
  content: defaultContent,
  loading: true,
  updateContent: async () => false,
});

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, []);

  async function loadContent() {
    try {
      const { data, error } = await supabase
        .from("site_content")
        .select("content")
        .eq("id", 1)
        .single();

      if (!error && data?.content) {
        setContent({ ...defaultContent, ...data.content });
      }
    } catch {
      // fallback to defaults
    } finally {
      setLoading(false);
    }
  }

  const updateContent = useCallback(async (updates: Partial<SiteContent>) => {
    const updated = { ...content, ...updates };
    setContent(updated);
    try {
      const { error } = await supabase
        .from("site_content")
        .upsert({ id: 1, content: updated, updated_at: new Date().toISOString() });

      return !error;
    } catch {
      return false;
    }
  }, [content]);

  return (
    <SiteContentContext.Provider value={{ content, loading, updateContent }}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  return useContext(SiteContentContext);
}
