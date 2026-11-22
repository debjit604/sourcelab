/* eslint-disable @typescript-eslint/no-require-imports */
const withSerwistInit = require("@serwist/next").default;

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  reactStrictMode: true,
  images: { unoptimized: true },
};

module.exports = withSerwist(nextConfig);
