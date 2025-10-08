export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "IDMAWA - Aviation Academy",
  description: "Admission Document Management and Workflow Automation for an Aviation Academy",
  url:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://www.idmawa.edu.vn",
  links: { 
    github: "https://github.com/idmawa",
    twitter: "https://twitter.com/idmawa",
  },
};
