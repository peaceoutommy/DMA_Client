import { defineConfig } from "cypress";
import mysql from 'mysql2/promise';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    setupNodeEvents(on, config) {
      // Database connection config from environment or defaults for CI
      const dbConfig = {
        host: config.env.DB_HOST || 'localhost',
        port: config.env.DB_PORT || 3306,
        user: config.env.DB_USER || 'root',
        password: config.env.DB_PASSWORD || '1234',
        database: config.env.DB_NAME || 'dma_test',
      };

      on('task', {
        /**
         * Execute a raw SQL query
         * @param {string} sql - SQL query to execute
         * @returns {Promise<any>} Query result
         */
        async query(sql) {
          const connection = await mysql.createConnection(dbConfig);
          try {
            const [rows] = await connection.execute(sql);
            return rows;
          } finally {
            await connection.end();
          }
        },

        /**
         * Approve a company by setting its active status
         * @param {number} companyId - The company ID to approve
         */
        async approveCompany(companyId) {
          const connection = await mysql.createConnection(dbConfig);
          try {
            await connection.execute(
              'UPDATE companies SET active = true WHERE id = ?',
              [companyId]
            );
            return { success: true, companyId };
          } finally {
            await connection.end();
          }
        },

        /**
         * Activate a user's company status
         * @param {number} userId - The user ID to activate
         */
        async activateUserCompany(userId) {
          const connection = await mysql.createConnection(dbConfig);
          try {
            await connection.execute(
              'UPDATE users SET company_active = true WHERE id = ?',
              [userId]
            );
            return { success: true, userId };
          } finally {
            await connection.end();
          }
        },

        /**
         * Set a user's role (e.g., make them an ADMIN)
         * @param {Object} params - { userId, role }
         */
        async setUserRole({ userId, role }) {
          const connection = await mysql.createConnection(dbConfig);
          try {
            await connection.execute(
              'UPDATE users SET role = ? WHERE id = ?',
              [role, userId]
            );
            return { success: true, userId, role };
          } finally {
            await connection.end();
          }
        },

        /**
         * Clean up test data by deleting users, companies, and campaigns created during tests
         * @param {Object} params - { userIds, companyIds, campaignIds }
         */
        async cleanupTestData({ userIds = [], companyIds = [], campaignIds = [] }) {
          const connection = await mysql.createConnection(dbConfig);
          try {
            // Delete campaigns first (foreign key constraints)
            if (campaignIds.length > 0) {
              await connection.execute(
                `DELETE FROM campaigns WHERE id IN (${campaignIds.map(() => '?').join(',')})`,
                campaignIds
              );
            }

            // Delete companies
            if (companyIds.length > 0) {
              await connection.execute(
                `DELETE FROM companies WHERE id IN (${companyIds.map(() => '?').join(',')})`,
                companyIds
              );
            }

            // Delete users
            if (userIds.length > 0) {
              await connection.execute(
                `DELETE FROM users WHERE id IN (${userIds.map(() => '?').join(',')})`,
                userIds
              );
            }

            return { success: true };
          } finally {
            await connection.end();
          }
        },

        /**
         * Get user by username
         * @param {string} username
         */
        async getUserByUsername(username) {
          const connection = await mysql.createConnection(dbConfig);
          try {
            const [rows] = await connection.execute(
              'SELECT * FROM users WHERE username = ?',
              [username]
            );
            return rows[0] || null;
          } finally {
            await connection.end();
          }
        },

        /**
         * Approve a campaign by updating its status
         * @param {number} campaignId
         */
        async approveCampaign(campaignId) {
          const connection = await mysql.createConnection(dbConfig);
          try {
            await connection.execute(
              "UPDATE campaigns SET status = 'ACTIVE' WHERE id = ?",
              [campaignId]
            );
            return { success: true, campaignId };
          } finally {
            await connection.end();
          }
        },
      });

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
