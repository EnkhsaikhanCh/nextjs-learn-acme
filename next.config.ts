// next.config.js
const { withSentryConfig } = require("@sentry/nextjs");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_APP_VERSION: require("./package.json").version,
  },
  productionBrowserSourceMaps: true,
};

// Бүх config-уудыг wrapper дотор дарааллуулж нэгтгэнэ
const wrappedConfig = withBundleAnalyzer(nextConfig);

module.exports = withSentryConfig(wrappedConfig, {
  org: "nomadtech",
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  disableLogger: true,
  automaticVercelMonitors: true,
});
