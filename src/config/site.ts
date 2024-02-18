export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Nutrivia",
  description: "Description",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
  ],
  mainNavMarketing: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "About",
      href: "/about",
    },
  ],
  links: {
    login: "/login",
    about: "/about",
    twitter: "https://twitter.com/todo",
    github: "https://github.com/stefanasandei/fiicode",
  },
};
