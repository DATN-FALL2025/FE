export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "",
  description: "",
  url:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "http://localhost:3000",
  links: { github: "http://localhost:3000" },
};
