import { defineConfig } from "cypress";

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export default defineConfig({
  e2e: {
    baseUrl,
    setupNodeEvents(on, config) {
      // Plugins, tasks энд бичнэ
    },
    specPattern: "cypress/e2e/**/*.cy.{js,ts}", // тест файлуудын зам
    supportFile: "cypress/support/e2e.ts", // туслах функцууд
    viewportWidth: 1280,
    viewportHeight: 800,
    retries: 1, // алдаатай тестийг дахин ажиллуулах тоо
  },
});
