import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/siteConfig";
import {
  getAllArchitectures,
  getAllArticles,
  getAllProjects,
} from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;

  const staticRoutes = [
    "",
    "/about",
    "/experience",
    "/projects",
    "/architecture",
    "/how-i-think",
    "/insights",
    "/contact",
  ].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const projects = getAllProjects().map((p) => ({
    url: `${base}/projects/${p.frontmatter.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const architectures = getAllArchitectures().map((a) => ({
    url: `${base}/architecture/${a.frontmatter.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const articles = getAllArticles().map((a) => ({
    url: `${base}/insights/${a.frontmatter.slug}`,
    lastModified: a.frontmatter.date,
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...projects, ...architectures, ...articles];
}
