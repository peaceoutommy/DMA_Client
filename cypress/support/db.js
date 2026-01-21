import mysql from 'mysql2/promise';

/**
 * Create database tasks for Cypress
 * @param {Object} config - Cypress config object
 * @returns {Object} Database tasks
 */
export function createDbTasks(config) {
  const dbConfig = {
    host: config.env.DB_HOST || 'localhost',
    port: config.env.DB_PORT || 3306,
    user: config.env.DB_USER || 'root',
    password: config.env.DB_PASSWORD || '1234',
    database: config.env.DB_NAME || 'dma_test',
  };

  /**
   * Helper to execute a query with a new connection
   */
  async function withConnection(queryFn) {
    const connection = await mysql.createConnection(dbConfig);
    try {
      return await queryFn(connection);
    } finally {
      await connection.end();
    }
  }

  /**
   * Helper to delete from a table with IN clause
   */
  async function deleteFromTable(connection, table, column, ids) {
    if (ids.length === 0) return;
    await connection.execute(
      `DELETE FROM ${table} WHERE ${column} IN (${ids.map(() => '?').join(',')})`,
      ids
    );
  }

  return {
    /**
     * Execute a raw SQL query
     */
    async query(sql) {
      return withConnection(async (connection) => {
        const [rows] = await connection.execute(sql);
        return rows;
      });
    },

    /**
     * Create a campaign permission
     */
    async createCampaignPermission({ name, description, create_date, type }) {
      return withConnection(async (connection) => {
        await connection.execute(
          'INSERT INTO company_permission (name, description, create_date, type) VALUES (?, ?, ?, ?)',
          [name, description, create_date, type]
        );
        const [rows] = await connection.execute('SELECT LAST_INSERT_ID() as id');
        return rows[0].id;
      });
    },

    /**
     * Give a user role a permission
     */
    async giveUserRolePermission({ companyRoleId, companyPermissionId }) {
      return withConnection(async (connection) => {
        await connection.execute(
          'INSERT INTO company_role_permission (company_role_id, company_permission_id) VALUES (?, ?)',
          [companyRoleId, companyPermissionId]
        );
        return { success: true, companyRoleId, companyPermissionId };
      });
    },

    /**
     * Create a new company type
     */
    async createCompanyType({ name, description, create_date }) {
      return withConnection(async (connection) => {
        await connection.execute(
          'INSERT INTO company_type (name, description, create_date) VALUES (?, ?, ?)',
          [name, description, create_date]
        );
        const [rows] = await connection.execute('SELECT LAST_INSERT_ID() as id');
        return rows[0].id;
      });
    },

    /**
     * Approve a company - updates both ticket and company status
     */
    async approveCompany({ companyId, message, status }) {
      return withConnection(async (connection) => {
        await connection.execute(
          'UPDATE ticket SET message = ?, status = ? WHERE entity_id = ? AND type = "COMPANY"',
          [message, status, companyId]
        );
        await connection.execute(
          'UPDATE company SET status = ? WHERE id = ?',
          [status, companyId]
        );
        return { success: true, companyId };
      });
    },

    /**
     * Set a user's role
     */
    async setUserRole({ userId, role }) {
      return withConnection(async (connection) => {
        await connection.execute(
          'UPDATE users SET role = ? WHERE id = ?',
          [role, userId]
        );
        return { success: true, userId, role };
      });
    },

    /**
     * Get user by username
     */
    async getUserByUsername(username) {
      return withConnection(async (connection) => {
        const [rows] = await connection.execute(
          'SELECT * FROM users WHERE username = ?',
          [username]
        );
        return rows[0] || null;
      });
    },

    /**
     * Approve a campaign by updating its status
     */
    async approveCampaign(campaignId) {
      return withConnection(async (connection) => {
        await connection.execute(
          "UPDATE campaign SET status = 'ACTIVE' WHERE id = ?",
          [campaignId]
        );
        return { success: true, campaignId };
      });
    },

    /**
     * Find and clean up all test data by username pattern.
     * Useful for cleaning up after failed tests.
     */
    async cleanupByUsernamePattern(usernamePattern) {
      return withConnection(async (connection) => {
        // Find users matching pattern
        const [users] = await connection.execute(
          'SELECT id, company_id FROM users WHERE username LIKE ?',
          [usernamePattern]
        );
        if (users.length === 0) return { success: true, cleaned: false };

        const userIds = users.map(u => u.id);
        const companyIds = users.map(u => u.company_id).filter(Boolean);

        // Find campaigns for these companies
        let campaignIds = [];
        if (companyIds.length > 0) {
          const [campaigns] = await connection.execute(
            `SELECT id FROM campaign WHERE company_id IN (${companyIds.map(() => '?').join(',')})`,
            companyIds
          );
          campaignIds = campaigns.map(c => c.id);
        }

        // Find company types used by these companies
        let companyTypeIds = [];
        if (companyIds.length > 0) {
          const [companies] = await connection.execute(
            `SELECT DISTINCT company_type_id FROM company WHERE id IN (${companyIds.map(() => '?').join(',')})`,
            companyIds
          );
          companyTypeIds = companies.map(c => c.company_type_id).filter(Boolean);
        }

        // Now clean up in order (reuse cleanup logic)
        // 1. Donations
        if (campaignIds.length > 0) {
          await connection.execute(
            `DELETE FROM donation WHERE campaign_id IN (${campaignIds.map(() => '?').join(',')})`,
            campaignIds
          );
        }

        // 2. Fund requests
        if (campaignIds.length > 0) {
          await connection.execute(
            `DELETE FROM fund_request WHERE campaign_id IN (${campaignIds.map(() => '?').join(',')})`,
            campaignIds
          );
        }

        // 3. App files for campaigns
        if (campaignIds.length > 0) {
          await connection.execute(
            `DELETE FROM app_file WHERE entity_type = 'CAMPAIGN' AND entity_id IN (${campaignIds.map(() => '?').join(',')})`,
            campaignIds
          );
        }

        // 4. Tickets for campaigns
        if (campaignIds.length > 0) {
          await connection.execute(
            `DELETE FROM ticket WHERE type = 'CAMPAIGN' AND entity_id IN (${campaignIds.map(() => '?').join(',')})`,
            campaignIds
          );
        }

        // 5. Campaigns
        if (campaignIds.length > 0) {
          await connection.execute(
            `DELETE FROM campaign WHERE id IN (${campaignIds.map(() => '?').join(',')})`,
            campaignIds
          );
        }

        // 6. Get company roles and nullify user references
        let companyRoleIds = [];
        if (companyIds.length > 0) {
          const [roles] = await connection.execute(
            `SELECT id FROM company_role WHERE company_id IN (${companyIds.map(() => '?').join(',')})`,
            companyIds
          );
          companyRoleIds = roles.map(r => r.id);

          await connection.execute(
            `UPDATE users SET company_role_id = NULL, company_id = NULL WHERE company_id IN (${companyIds.map(() => '?').join(',')})`,
            companyIds
          );
        }

        // 7. Company role permissions
        if (companyRoleIds.length > 0) {
          await connection.execute(
            `DELETE FROM company_role_permission WHERE company_role_id IN (${companyRoleIds.map(() => '?').join(',')})`,
            companyRoleIds
          );
        }

        // 8. Company roles
        if (companyIds.length > 0) {
          await connection.execute(
            `DELETE FROM company_role WHERE company_id IN (${companyIds.map(() => '?').join(',')})`,
            companyIds
          );
        }

        // 9. Tickets for companies
        if (companyIds.length > 0) {
          await connection.execute(
            `DELETE FROM ticket WHERE type = 'COMPANY' AND entity_id IN (${companyIds.map(() => '?').join(',')})`,
            companyIds
          );
        }

        // 10. App files for companies
        if (companyIds.length > 0) {
          await connection.execute(
            `DELETE FROM app_file WHERE entity_type = 'COMPANY' AND entity_id IN (${companyIds.map(() => '?').join(',')})`,
            companyIds
          );
        }

        // 11. Companies
        if (companyIds.length > 0) {
          await connection.execute(
            `DELETE FROM company WHERE id IN (${companyIds.map(() => '?').join(',')})`,
            companyIds
          );
        }

        // 12. Users
        if (userIds.length > 0) {
          await connection.execute(
            `DELETE FROM users WHERE id IN (${userIds.map(() => '?').join(',')})`,
            userIds
          );
        }

        // 13. Company permissions (clean up test permissions by name pattern)
        await connection.execute("DELETE FROM company_permission WHERE name = 'Create campaign'");

        // 14. Company types
        if (companyTypeIds.length > 0) {
          await connection.execute(
            `DELETE FROM company_type WHERE id IN (${companyTypeIds.map(() => '?').join(',')})`,
            companyTypeIds
          );
        }

        return { success: true, cleaned: true };
      });
    },

    /**
     * Clean up ALL test data
     */
    async cleanupTestData({
      userIds = [],
      companyIds = [],
      campaignIds = [],
      companyTypeIds = [],
      permissionIds = []
    }) {
      return withConnection(async (connection) => {
        // 1. Delete donations
        await deleteFromTable(connection, 'donation', 'campaign_id', campaignIds);

        // 2. Delete fund_requests
        await deleteFromTable(connection, 'fund_request', 'campaign_id', campaignIds);

        // 3. Delete app_file for campaigns
        if (campaignIds.length > 0) {
          await connection.execute(
            `DELETE FROM app_file WHERE entity_type = 'CAMPAIGN' AND entity_id IN (${campaignIds.map(() => '?').join(',')})`,
            campaignIds
          );
        }

        // 4. Delete tickets for campaigns
        if (campaignIds.length > 0) {
          await connection.execute(
            `DELETE FROM ticket WHERE type = 'CAMPAIGN' AND entity_id IN (${campaignIds.map(() => '?').join(',')})`,
            campaignIds
          );
        }

        // 5. Delete campaigns
        await deleteFromTable(connection, 'campaign', 'id', campaignIds);

        // 6. Get company_role IDs and nullify user FK references
        let companyRoleIds = [];
        if (companyIds.length > 0) {
          const [roles] = await connection.execute(
            `SELECT id FROM company_role WHERE company_id IN (${companyIds.map(() => '?').join(',')})`,
            companyIds
          );
          companyRoleIds = roles.map(r => r.id);

          await connection.execute(
            `UPDATE users SET company_role_id = NULL, company_id = NULL WHERE company_id IN (${companyIds.map(() => '?').join(',')})`,
            companyIds
          );
        }

        // 7. Delete company_role_permission
        await deleteFromTable(connection, 'company_role_permission', 'company_role_id', companyRoleIds);

        // 8. Delete company_role
        await deleteFromTable(connection, 'company_role', 'company_id', companyIds);

        // 9. Delete tickets for companies
        if (companyIds.length > 0) {
          await connection.execute(
            `DELETE FROM ticket WHERE type = 'COMPANY' AND entity_id IN (${companyIds.map(() => '?').join(',')})`,
            companyIds
          );
        }

        // 10. Delete app_file for companies
        if (companyIds.length > 0) {
          await connection.execute(
            `DELETE FROM app_file WHERE entity_type = 'COMPANY' AND entity_id IN (${companyIds.map(() => '?').join(',')})`,
            companyIds
          );
        }

        // 11. Delete companies
        await deleteFromTable(connection, 'company', 'id', companyIds);

        // 12. Delete users
        await deleteFromTable(connection, 'users', 'id', userIds);

        // 13. Delete company_permission
        await deleteFromTable(connection, 'company_permission', 'id', permissionIds);

        // 14. Delete company_type
        await deleteFromTable(connection, 'company_type', 'id', companyTypeIds);

        return { success: true };
      });
    },
  };
}
