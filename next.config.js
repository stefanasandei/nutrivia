/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

import pwa from "next-pwa";

const withPWA = pwa({
  dest: "public",
  register: true,
  // disable: process.env.NODE_ENV === "development",
  disable: true, // fix netlify build for the moment
});

/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [
      { hostname: "utfs.io" },
      { hostname: "images.openfoodfacts.org" },
      { hostname: "images.openfoodfacts.net" },
    ],
  },
};

// @ts-expect-error it works
export default withPWA(config);
