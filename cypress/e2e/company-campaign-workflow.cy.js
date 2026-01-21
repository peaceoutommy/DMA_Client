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
 * Note: This test uses REAL API calls (not mocked) and database tasks
 * for admin operations since there's no admin UI endpoint.
 */

describe('Company & Campaign Approval Workflow', () => {
  // Test data - unique per test run to avoid conflicts
  const timestamp = Date.now();
  const testUser = {
    firstName: 'Tomas',
    lastName: 'Lopes',
    middleNames: 'Aleixo Pais Barroso',
    username: `tlopes_${timestamp}`,
    email: `tlopes@test.com_${timestamp}`,
    phoneNumber: '555-123-4567',
    address: '123 Test Street',
    password: 'Password1234',
    companyAccount: true,
  };

  const testCompany = {
    name: `Aureon_${timestamp}`,
    registrationNumber: `REG${timestamp}`,
    taxId: `TAX${timestamp}`,
  };

  const testCampaign = {
    name: `Clean Water Initiative_${timestamp}`,
    description: 'This is a test campaign created during E2E testing to validate the complete workflow from company creation to campaign submission.',
    fundGoal: '10000',
  };

  // Store IDs for cleanup
  let userId = null;
  let companyId = null;
  let campaignId = null;
  let authToken = null;

  // Cleanup after all tests
  after(() => {
    if (userId || companyId || campaignId) {
      cy.task('cleanupTestData', {
        userIds: userId ? [userId] : [],
        companyIds: companyId ? [companyId] : [],
        campaignIds: campaignId ? [campaignId] : [],
      });
    }
  });

  describe('Phase 1: User Registration', () => {
    it('should register a new company account user', () => {
      cy.visit('/authenticate');

      // Switch to Register tab (use data-test attribute for reliable selection)
      cy.get('[data-test="tab-register"]').click();

      // Select Company Account type
      cy.get('[data-test="account-type-company"]').click();

      // Fill registration form
      cy.get('#register-first-name').type(testUser.firstName);
      cy.get('#register-last-name').type(testUser.lastName);
      cy.get('#register-middle-names').type(testUser.middleNames);
      cy.get('#register-username').type(testUser.username);
      cy.get('#register-email').type(testUser.email);
      cy.get('#register-phone-number').type(testUser.phoneNumber);
      cy.get('#register-address').type(testUser.address);
      cy.get('#register-password').type(testUser.password);
      cy.get('#register-confirm').type(testUser.password);

      // Submit registration
      cy.get('button').contains('Create Account').click();

      // Should redirect to home after successful registration
      cy.url().should('eq', `${Cypress.config('baseUrl')}/`, { timeout: 15000 });

      // Store the token and user ID for later
      cy.window().then((win) => {
        authToken = win.localStorage.getItem('auth_token');
        expect(authToken).to.exist;
      });

      // Get user ID from database for cleanup
      cy.task('getUserByUsername', testUser.username).then((user) => {
        if (user) {
          userId = user.id;
        }
      });
    });
  });

  describe('Phase 2: Company Creation', () => {
    beforeEach(() => {
      // Ensure we're logged in
      if (authToken) {
        cy.setAuthToken(authToken);
      }
    });

    it('should navigate to company creation page', () => {
      cy.visit('/companies/create');
      cy.url().should('include', '/companies/create');
      cy.contains('Company Name').should('be.visible');
    });

    it('should create a company and redirect to not-approved page', () => {
      cy.visit('/companies/create');

      // Fill company form
      cy.get('#company-name').type(testCompany.name);
      cy.get('#company-registration').type(testCompany.registrationNumber);
      cy.get('#company-tax').type(testCompany.taxId);

      // Select company type (first available option)
      cy.get('#company-type').click();
      cy.get('[role="option"]').first().click();

      // Submit company creation
      cy.get('button').contains('Create Company').click();

      // Should redirect to not-approved page
      cy.url().should('include', '/not-approved', { timeout: 15000 });

      // Verify the not-approved page content
      cy.contains('Approval Pending').should('be.visible');
      cy.contains(`Hi ${testUser.firstName}`).should('be.visible');
    });
  });

  describe('Phase 3: Unapproved User Restrictions', () => {
    beforeEach(() => {
      if (authToken) {
        cy.setAuthToken(authToken);
      }
    });

    it('should show not-approved page when accessing restricted routes', () => {
      // Try to access campaign creation (protected route requiring companyActive)
      cy.visit('/campaigns/create');

      // Should be redirected to not-approved page
      cy.url().should('include', '/not-approved', { timeout: 10000 });
    });

    it('should display correct messaging on not-approved page', () => {
      cy.visit('/not-approved');

      cy.contains('Approval Pending').should('be.visible');
      cy.contains('Back to home').should('be.visible');
      cy.contains('Refresh status').should('be.visible');
    });

    it('should allow navigation back to home', () => {
      cy.visit('/not-approved');
      cy.contains('Back to home').click();
      cy.url().should('eq', `${Cypress.config('baseUrl')}/`);
    });
  });

  describe('Phase 4: Admin Company Approval (Database)', () => {
    it('should approve the company via database task', () => {
      // Get the user to find their company
      cy.task('getUserByUsername', testUser.username).then((user) => {
        expect(user).to.exist;
        userId = user.id;
        companyId = user.company_id;

        // Approve the company
        if (companyId) {
          cy.task('approveCompany', companyId).then((result) => {
            expect(result.success).to.be.true;
          });
        }

        // Also activate the user's company status
        cy.task('activateUserCompany', userId).then((result) => {
          expect(result.success).to.be.true;
        });
      });
    });
  });

  describe('Phase 5: Campaign Creation (After Approval)', () => {
    beforeEach(() => {
      // Need to re-login to get updated user data with companyActive = true 
      // (This is just for the sidemenu option to appear, i should get the value for this on the authMe endpoint instead)
      cy.apiLogin(testUser.username, testUser.password).then((response) => {
        authToken = response.token;
      });
    });

    it('should now be able to access campaign creation page', () => {
      cy.visit('/campaigns/create');

      // Should NOT be redirected to not-approved page
      cy.url().should('include', '/campaigns/create');
      cy.contains('Create New Campaign').should('be.visible');
    });

    it('should create a campaign successfully', () => {
      cy.visit('/campaigns/create');

      // Fill campaign form
      cy.get('#campaign-name').type(testCampaign.name);
      cy.get('#campaign-description').type(testCampaign.description);
      cy.get('#campaign-goal').type(testCampaign.fundGoal);

      // Submit campaign
      cy.get('button').contains('Create Campaign').click();

      // Should redirect to the campaign detail page
      cy.url().should('match', /\/campaigns\/\d+/, { timeout: 15000 });

      // Extract campaign ID from URL for cleanup
      cy.url().then((url) => {
        const match = url.match(/\/campaigns\/(\d+)/);
        if (match) {
          campaignId = parseInt(match[1], 10);
        }
      });

      // Verify campaign was created (campaign name should be visible on detail page)
      cy.contains(testCampaign.name).should('be.visible');
    });
  });

  describe('Phase 6: Admin Campaign Approval (Database)', () => {
    it('should approve the campaign via database task', () => {
      // Skip if campaign wasn't created
      if (!campaignId) {
        cy.log('No campaign ID found, skipping approval');
        return;
      }

      cy.task('approveCampaign', campaignId).then((result) => {
        expect(result.success).to.be.true;
      });
    });
  });

  describe('Phase 7: Verify Approved Campaign', () => {
    beforeEach(() => {
      if (authToken) {
        cy.setAuthToken(authToken);
      }
    });

    it('should display the approved campaign', () => {
      // Skip if campaign wasn't created
      if (!campaignId) {
        cy.log('No campaign ID found, skipping verification');
        return;
      }

      cy.visit(`/campaigns/${campaignId}`);
      cy.contains(testCampaign.name).should('be.visible');
    });
  });
});