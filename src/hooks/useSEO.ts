import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export function useSEO({
  title = "Mistri — The Future Runs on Silicon",
  description = "Curated electronics, robotics kits, IoT rovers, precision tools, and smart home hardware for makers and engineers.",
  image = "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80",
  url = typeof window !== "undefined" ? window.location.href : "https://mistri.hardware",
}: SEOProps = {}) {
  useEffect(() => {
    // 1. Update Document Title
    const formattedTitle = title.includes("Mistri") ? title : `${title} | Mistri`;
    document.title = formattedTitle;

    // Helper to update or create meta tags
    const setMetaTag = (attr: "name" | "property", key: string, content: string) => {
      let tag = document.querySelector(`meta[${attr}="${key}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attr, key);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    // Standard meta tags
    setMetaTag("name", "description", description);

    // OpenGraph meta tags
    setMetaTag("property", "og:title", formattedTitle);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:image", image);
    setMetaTag("property", "og:url", url);
    setMetaTag("property", "og:type", "website");

    // Twitter card tags
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", formattedTitle);
    setMetaTag("name", "twitter:description", description);
    setMetaTag("name", "twitter:image", image);
  }, [title, description, image, url]);
}
