import type { MetadataRoute } from "next";
import { collections } from "@/lib/collections";
import { siteConfig } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/about",
    "/process",
    "/portfolio",
    "/measurements",
    "/book",
    "/testimonials",
    "/faq",
    "/contact",
  ];

  const collectionRoutes = collections.map((c) => `/portfolio/${c.slug}`);

  return [...staticRoutes, ...collectionRoutes].map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
  }));
}
