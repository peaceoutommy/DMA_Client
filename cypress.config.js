import { defineConfig } from "cypress";
import { createDbTasks } from './cypress/support/db.js';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    setupNodeEvents(on, config) {
      const dbTasks = createDbTasks(config);
      on('task', dbTasks);
      return config;
    },
    env: {
      API_URL: 'http://localhost:8080/api',
    },
    // Increase timeouts for CI environment
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 30000,
  },
});
