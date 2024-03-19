export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Nutrivia",
  description: "Description",
  mainNav: [
    {
      // a feed of food products
      title: "Home",
      href: "/",
    },
    {
      title: "Food baskets",
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
    {
      title: "Meal ideas",
      href: "/meal-planner",
    },
  ],
  mainNavMarketing: [
    {
      title: "Home",
      href: "/",
    },
    // {
    //   title: "About",
    //   href: "/about",
    // },
  ],
  links: {
    login: "/login",
    about: "/about",
    twitter: "https://twitter.com/todo",
    github: "https://github.com/stefanasandei/fiicode",
  },
};
