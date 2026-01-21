/**
 * E2E Test: Company & Campaign Approval Workflow
 *
 * This test validates the complete flow:
 * 1. User creates a Company account
 * 2. User submits a Company creation request
 * 3. User is redirected to the "Not Approved" page
 * 4. User cannot access campaign creation (protected route)
 * 5. Admin approves the company (via database)
 * 6. User can now create a campaign
 * 7. Admin approves the campaign (via database)
 *
 * Note: Uses REAL API calls and database tasks for admin operations.
 */

describe('Company & Campaign Approval Workflow', () => {
  const timestamp = Date.now();

  // ============================================
  // Test Data
  // ============================================
  const testUser = {
    firstName: 'Tomas',
    lastName: 'Lopes',
    middleNames: 'Aleixo Pais Barroso',
    username: `tlopes_${timestamp}`,
    email: `tlopes_${timestamp}@test.com`,
    phoneNumber: `${timestamp}`,
    address: '123 Test Street',
    password: 'Password1234',
    companyAccount: true,
  };

  const testCompanyType = {
    name: 'Non-Profit',
    description: 'Non-Profit Organization',
    create_date: new Date(2026, 0, 21).toISOString().split('T')[0],
  };

  const testCompany = {
    name: `Aureon_${timestamp}`,
    registrationNumber: `REG${timestamp}`,
    taxId: `TAX${timestamp}`,
  };

  const testCampaign = {
    name: `Clean Water Initiative_${timestamp}`,
    description: 'Test campaign for E2E workflow validation.',
    fundGoal: '10000',
  };

  const campaignPermission = {
    name: 'Create campaign',
    description: 'Allows the user to create a donation campaign',
    create_date: new Date(2026, 0, 6).toISOString().split('T')[0],
    type: 1,
  };

  // ============================================
  // IDs for Cleanup
  // ============================================
  let userId = null;
  let companyTypeId = null;
  let companyId = null;
  let campaignId = null;
  let permissionId = null;

  // ============================================
  // Cleanup
  // ============================================
  before(() => {
    // Clean up any leftover data from previous failed test runs
    cy.task('cleanupByUsernamePattern', 'tlopes_%');
  });

  after(() => {
    cy.task('cleanupTestData', {
      userIds: userId ? [userId] : [],
      companyIds: companyId ? [companyId] : [],
      campaignIds: campaignId ? [campaignId] : [],
      companyTypeIds: companyTypeId ? [companyTypeId] : [],
      permissionIds: permissionId ? [permissionId] : [],
    });
  });

  // ============================================
  // Main Test
  // ============================================
  it('should complete the full company and campaign approval workflow', () => {
    // PHASE 1: User Registration
    cy.log('**PHASE 1: User Registration**');
    registerUser();

    // PHASE 2: Company Creation
    cy.log('**PHASE 2: Company Creation**');
    setupCompanyType();
    createCompany();

    // PHASE 3: Verify Unapproved Restrictions
    cy.log('**PHASE 3: Verify Unapproved Restrictions**');
    verifyUnapprovedRestrictions();

    // PHASE 4: Admin Approves Company
    cy.log('**PHASE 4: Admin Approves Company**');
    approveCompanyViaDb();

    // PHASE 5: Setup Permissions & Re-login
    cy.log('**PHASE 5: Setup Permissions & Re-login**');
    setupCampaignPermission();
    login();

    // PHASE 6: Campaign Creation
    cy.log('**PHASE 6: Campaign Creation**');
    createCampaign();

    // PHASE 7: Admin Approves Campaign
    cy.log('**PHASE 7: Admin Approves Campaign**');
    approveCampaignViaDb();

    // PHASE 8: Verify Campaign
    cy.log('**PHASE 8: Verify Approved Campaign**');
    verifyCampaign();

    cy.log('**WORKFLOW COMPLETE**');
  });

  // ============================================
  // Helper Functions
  // ============================================

  function registerUser() {
    cy.visit('/authenticate');
    cy.get('[data-test="tab-register"]').click();
    cy.get('[data-test="account-type-company"]').click();

    cy.get('#register-first-name').type(testUser.firstName);
    cy.get('#register-last-name').type(testUser.lastName);
    cy.get('#register-middle-names').type(testUser.middleNames);
    cy.get('#register-username').type(testUser.username);
    cy.get('#register-email').type(testUser.email);
    cy.get('#register-phone-number').type(testUser.phoneNumber);
    cy.get('#register-address').type(testUser.address);
    cy.get('#register-password').type(testUser.password);
    cy.get('#register-confirm').type(testUser.password);
    cy.get('[data-test="register-submit"]').click();

    cy.url().should('eq', `${Cypress.config('baseUrl')}/`, { timeout: 15000 });
    cy.window().its('localStorage.auth_token').should('exist');

    cy.task('getUserByUsername', testUser.username).then((user) => {
      if (user) userId = user.id;
    });
  }

  function setupCompanyType() {
    cy.task('createCompanyType', testCompanyType).then((id) => {
      companyTypeId = id;
    });
  }

  function createCompany() {
    cy.visit('/companies/create');
    cy.url().should('include', '/companies/create');

    cy.get('#company-name').type(testCompany.name);
    cy.get('#company-registration').type(testCompany.registrationNumber);
    cy.get('#company-tax').type(testCompany.taxId);
    cy.get('#company-type').click();
    cy.get('[role="option"]').first().click();

    cy.intercept('POST', '/api/companies').as('createCompany');
    cy.get('[data-test="company-submit"]').click();

    cy.wait('@createCompany').then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
      companyId = interception.response.body.id;
    });

    cy.url().should('include', '/not-approved', { timeout: 15000 });
    cy.contains('Approval Pending').should('be.visible');
    cy.contains(`Hi ${testUser.firstName}`).should('be.visible');
  }

  function verifyUnapprovedRestrictions() {
    cy.visit('/campaigns/create');
    cy.url().should('include', '/not-approved', { timeout: 10000 });
    cy.contains('Back to home').should('be.visible');
    cy.contains('Refresh status').should('be.visible');
  }

  function approveCompanyViaDb() {
    cy.then(() => {
      expect(companyId).to.not.be.null;
      cy.task('approveCompany', {
        companyId: companyId,
        message: 'Approved via E2E test',
        status: 'APPROVED'
      }).then((result) => {
        expect(result.success).to.be.true;
      });
    });
  }

  function setupCampaignPermission() {
    cy.then(() => {
      cy.task('createCampaignPermission', campaignPermission).then((permId) => {
        permissionId = permId;

        cy.task('query', `SELECT id FROM company_role WHERE company_id = ${companyId} AND name = 'Owner'`)
          .then((roles) => {
            const roleId = roles[0].id;
            cy.task('giveUserRolePermission', {
              companyRoleId: roleId,
              companyPermissionId: permissionId
            }).then((res) => {
              expect(res.success).to.be.true;
            });
          });
      });
    });
  }

  function login() {
    cy.window().then((win) => win.localStorage.removeItem('auth_token'));
    cy.visit('/authenticate');
    cy.get('[data-test="tab-login"]').click();
    cy.get('#login-email').type(testUser.username);
    cy.get('#login-password').type(testUser.password);
    cy.contains('button', 'Sign In').click();
    cy.url().should('eq', `${Cypress.config('baseUrl')}/`, { timeout: 15000 });
  }

  function createCampaign() {
    cy.visit('/campaigns/create');
    cy.url().should('include', '/campaigns/create');
    cy.contains('Create New Campaign').should('be.visible');

    // Basic Info
    cy.get('#campaign-name').type(testCampaign.name);
    cy.get('#campaign-description').type(testCampaign.description);
    cy.get('#campaign-goal').type(testCampaign.fundGoal);

    // Start Date
    cy.get('[data-test="campaign-start-date"]').click();
    cy.get('[role="grid"]').should('be.visible');
    cy.get('[role="gridcell"]:not([data-disabled="true"])').first().click();
    cy.get('[data-test="campaign-start-date"]').should('not.contain', 'Pick a date');

    // End Date
    cy.get('[data-test="campaign-end-date"]').click();
    cy.get('[role="grid"]').should('be.visible');
    cy.get('[role="gridcell"]:not([data-disabled="true"])').last().click();
    cy.get('[data-test="campaign-end-date"]').should('not.contain', 'Pick a date');

    // Image Upload
    cy.get('[data-test="campaign-image-upload"]').selectFile(
      'cypress/fixtures/test-image.jpg',
      { force: true }
    );
    cy.get('img[alt="Upload 1"]').should('be.visible');

    // Submit
    cy.get('[data-test="campaign-submit"]').click();
    cy.url().should('match', /\/campaigns\/\d+/, { timeout: 15000 });

    cy.url().then((url) => {
      const match = url.match(/\/campaigns\/(\d+)/);
      if (match) campaignId = parseInt(match[1], 10);
    });

    cy.contains(testCampaign.name).should('be.visible');
  }

  function approveCampaignViaDb() {
    cy.then(() => {
      if (campaignId) {
        cy.task('approveCampaign', campaignId).then((result) => {
          expect(result.success).to.be.true;
        });
      }
    });
  }

  function verifyCampaign() {
    cy.then(() => {
      if (campaignId) {
        cy.visit(`/campaigns/${campaignId}`);
        cy.contains(testCampaign.name).should('be.visible');
      }
    });
  }
});
