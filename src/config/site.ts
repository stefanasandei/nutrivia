export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Nutrivia",
  description: "Description",
  mainNav: [
    {
      title: "Home", // a feed of food products
      href: "/",
    },
    {
      title: "Your basket",
      href: "/basket",
    },
    {
      title: "Contribute",
      href: "/contribute",
    },
    {
      title: "Forum",
      href: "/forum",
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
