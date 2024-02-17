export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Title",
  description:
    "Description",
  mainNav: [
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
    twitter: "https://twitter.com/todo",
    github: "https://github.com/stefanasandei/fiicode",
    docs: "todo",
  },
}
