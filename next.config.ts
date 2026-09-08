import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Every route in this app is linked with a trailing slash (matching the
  // current WordPress site's URL convention, which the eventual redirect
  // map in docs/dev-backlog.md #40 relies on to minimize slug changes).
  trailingSlash: true,
};

export default nextConfig;
