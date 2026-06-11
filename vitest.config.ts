import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      testTimeout: 120000,
      environment: "jsdom",
      setupFiles: ["./src/test/setup/test-setup.ts"],
      globals: true,
    },
  }),
);
