import dotenv from "dotenv";
import { withSentryConfig } from "@sentry/nextjs";
import createWithBundleAnalyzer from "@next/bundle-analyzer";
import { readFileSync } from "fs";
import { join } from "path";

dotenv.config();

const withBundleAnalyzer = createWithBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const packageJson = JSON.parse(
  readFileSync(join(process.cwd(), "package.json"), "utf8"),
);

const nextConfig = {
  env: {
    NEXT_PUBLIC_APP_VERSION: packageJson.version,
  },
  productionBrowserSourceMaps: true,
};

const wrappedConfig = withBundleAnalyzer(nextConfig);

export default withSentryConfig(wrappedConfig, {
  org: "nomadtech",
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  disableLogger: true,
  automaticVercelMonitors: true,
});
