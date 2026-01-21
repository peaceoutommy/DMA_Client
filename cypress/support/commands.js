// ***********************************************
// Custom Cypress Commands for E2E Testing
// ***********************************************

const API_URL = Cypress.env('API_URL') || 'http://localhost:8080/api';

// ============================================
// Authentication Commands
// ============================================

/**
 * Register a new user via API
 * @param {Object} userData - User registration data
 * @param {boolean} userData.companyAccount - Whether this is a company account
 */
Cypress.Commands.add('apiRegister', (userData) => {
  const defaultData = {
    firstName: 'Test',
    lastName: 'User',
    middleNames: 'Middle',
    username: `testuser_${Date.now()}`,
    email: `test_${Date.now()}@example.com`,
    phoneNumber: '123-456-7890',
    address: '123 Test Street',
    password: 'TestPass123!',
    confirmPassword: 'TestPass123!',
    companyAccount: false,
  };

  const registrationData = { ...defaultData, ...userData };

  return cy.request({
    method: 'POST',
    url: `${API_URL}/auth/register`,
    body: registrationData,
  }).then((response) => {
    expect(response.status).to.eq(200);
    const body = response.body;
    if (body.token) {
      window.localStorage.setItem('auth_token', body.token);
    }
    return body;
  });
});

/**
 * Login via API and store token in the browser's localStorage
 * @param {string} username - Username or email
 * @param {string} password - Password
 */
Cypress.Commands.add('apiLogin', (username, password) => {
  return cy.request({
    method: 'POST',
    url: `${API_URL}/auth/login`,
    body: { username, password },
  }).then((response) => {
    expect(response.status).to.eq(200);
    const { token } = response.body;
    if (token) {
      return cy.window().then((win) => {
        win.localStorage.setItem('auth_token', token);
        return response.body;
      });
    }
    return response.body;
  });
});

/**
 * Login via UI
 * @param {string} username - Username or email
 * @param {string} password - Password
 */
Cypress.Commands.add('login', (username, password) => {
  cy.visit('/authenticate');
  cy.get('[data-test=usernameOrEmail]').type(username);
  cy.get('[data-test=loginPassword]').type(password);
  cy.get('button').contains('Sign In').click();
  cy.url().should('eq', `${Cypress.config('baseUrl')}/`);
});

/**
 * Set auth token directly in localStorage
 * @param {string} token - JWT token
 */
Cypress.Commands.add('setAuthToken', (token) => {
  cy.window().then((win) => {
    win.localStorage.setItem('auth_token', token);
  });
});

/**
 * Clear authentication state
 */
Cypress.Commands.add('logout', () => {
  cy.window().then((win) => {
    win.localStorage.removeItem('auth_token');
  });
});

// ============================================
// Company Commands
// ============================================

/**
 * Create a company via API
 * @param {string} token - Auth token
 * @param {Object} companyData - Company data
 */
Cypress.Commands.add('apiCreateCompany', (token, companyData) => {
  const defaultData = {
    name: `Test Company ${Date.now()}`,
    registrationNumber: `REG${Date.now()}`,
    taxId: `TAX${Date.now()}`,
    typeId: 1,
  };

  const data = { ...defaultData, ...companyData };

  return cy.request({
    method: 'POST',
    url: `${API_URL}/companies`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  }).then((response) => {
    return response.body;
  });
});

/**
 * Get company types via API
 */
Cypress.Commands.add('apiGetCompanyTypes', () => {
  return cy.request({
    method: 'GET',
    url: `${API_URL}/companies/types`,
  }).then((response) => {
    return response.body;
  });
});

// ============================================
// Campaign Commands
// ============================================

/**
 * Create a campaign via API
 * @param {string} token - Auth token
 * @param {Object} campaignData - Campaign data
 */
Cypress.Commands.add('apiCreateCampaign', (token, campaignData) => {
  return cy.request({
    method: 'POST',
    url: `${API_URL}/campaigns`,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: campaignData,
  }).then((response) => {
    return response.body;
  });
});

// ============================================
// UI Helper Commands
// ============================================

/**
 * Register a company account user via UI
 */
Cypress.Commands.add('registerCompanyAccountUI', (userData) => {
  cy.visit('/authenticate');

  // Click on Register tab
  cy.contains('Register').click();

  // Select Company Account
  cy.contains('Company Account').click();

  // Fill registration form
  cy.get('#register-first-name').type(userData.firstName);
  cy.get('#register-last-name').type(userData.lastName);
  cy.get('#register-middle-names').type(userData.middleNames);
  cy.get('#register-username').type(userData.username);
  cy.get('#register-email').type(userData.email);
  cy.get('#register-phone-number').type(userData.phoneNumber);
  cy.get('#register-address').type(userData.address);
  cy.get('#register-password').type(userData.password);
  cy.get('#register-confirm').type(userData.password);

  // Submit
  cy.get('button').contains('Create Account').click();

  // Wait for redirect to home
  cy.url().should('eq', `${Cypress.config('baseUrl')}/`, { timeout: 10000 });
});

/**
 * Create a company via UI
 */
Cypress.Commands.add('createCompanyUI', (companyData) => {
  cy.visit('/companies/create');

  cy.get('#company-name').type(companyData.name);
  cy.get('#company-registration').type(companyData.registrationNumber);
  cy.get('#company-tax').type(companyData.taxId);

  // Select company type
  cy.get('#company-type').click();
  cy.get('[role="option"]').first().click();

  // Submit
  cy.get('button').contains('Create Company').click();
});

/**
 * Create a campaign via UI
 */
Cypress.Commands.add('createCampaignUI', (campaignData) => {
  cy.visit('/campaigns/create');

  cy.get('#campaign-name').type(campaignData.name);
  cy.get('#campaign-description').type(campaignData.description);
  cy.get('#campaign-goal').type(campaignData.fundGoal);

  // Submit
  cy.get('button').contains('Create Campaign').click();
});
