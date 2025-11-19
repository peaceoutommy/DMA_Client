describe('Login Form', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/authenticate');
  });

  describe('UI and Initial State', () => {
    it('should display all login form elements', () => {
      cy.contains('Welcome').should('be.visible');
      cy.contains('Sign in to your account or create a new one').should('be.visible');
      cy.contains('button', 'Login').should('be.visible');
      cy.get('[data-test=usernameOrEmail]').should('be.visible');
      cy.get('[data-test=loginPassword]').should('be.visible');
      cy.contains('button', 'Sign In').should('be.visible').and('not.be.disabled');
    });

    it('should have Login tab selected by default', () => {
      cy.contains('button', 'Login').should('have.attr', 'data-state', 'active');
    });

    it('should have correct input placeholders', () => {
      cy.get('[data-test=usernameOrEmail]').should('have.attr', 'placeholder', 'yourusername');
      cy.get('[data-test=loginPassword]').should('have.attr', 'placeholder', '•••••••••••');
    });

    it('should have password input type', () => {
      cy.get('[data-test=loginPassword]').should('have.attr', 'type', 'password');
    });
  });

  describe('Form Validation', () => {
    it('should show error when submitting empty form', () => {
      cy.contains('button', 'Sign In').click();
      
      cy.contains('Email or username is required').should('be.visible');
      cy.contains('Password is required').should('be.visible');
    });

    it('should show error when only email is filled', () => {
      cy.get('[data-test=usernameOrEmail]').type('testuser');
      cy.contains('button', 'Sign In').click();
      
      cy.contains('Password is required').should('be.visible');
      cy.contains('Email or username is required').should('not.exist');
    });

    it('should show error when only password is filled', () => {
      cy.get('[data-test=loginPassword]').type('Password123');
      cy.contains('button', 'Sign In').click();
      
      cy.contains('Email or username is required').should('be.visible');
      cy.contains('Password is required').should('not.exist');
    });

    it('should clear email error when user starts typing in email field', () => {
      cy.contains('button', 'Sign In').click();
      cy.contains('Email or username is required').should('be.visible');
      
      cy.get('[data-test=usernameOrEmail]').type('t');
      cy.contains('Email or username is required').should('not.exist');
    });

    it('should clear password error when user starts typing in password field', () => {
      cy.contains('button', 'Sign In').click();
      cy.contains('Password is required').should('be.visible');
      
      cy.get('[data-test=loginPassword]').type('p');
      cy.contains('Password is required').should('not.exist');
    });

    it('should show red border on invalid fields', () => {
      cy.contains('button', 'Sign In').click();
      
      cy.get('[data-test=usernameOrEmail]').should('have.class', 'border-red-500');
      cy.get('[data-test=loginPassword]').should('have.class', 'border-red-500');
    });

    it('should remove red border when field is corrected', () => {
      cy.contains('button', 'Sign In').click();
      cy.get('[data-test=usernameOrEmail]').should('have.class', 'border-red-500');
      
      cy.get('[data-test=usernameOrEmail]').type('testuser');
      cy.get('[data-test=usernameOrEmail]').should('not.have.class', 'border-red-500');
    });
  });

  describe('Successful Login', () => {
    it('should successfully log in with valid username', () => {
      cy.intercept('POST', '**/login', {
        statusCode: 200,
        body: { token: 'fake-jwt-token', user: { id: 1, username: 'peaceoutommy' } }
      }).as('loginRequest');

      cy.get('[data-test=usernameOrEmail]').type('peaceoutommy');
      cy.get('[data-test=loginPassword]').type('Password123');
      cy.contains('button', 'Sign In').click();

      cy.wait('@loginRequest');
      cy.url().should('eq', 'http://localhost:5173/');
    });

    it('should successfully log in with valid email', () => {
      cy.intercept('POST', '**/login', {
        statusCode: 200,
        body: { token: 'fake-jwt-token', user: { id: 1, email: 'test@example.com' } }
      }).as('loginRequest');

      cy.get('[data-test=usernameOrEmail]').type('test@example.com');
      cy.get('[data-test=loginPassword]').type('Password123');
      cy.contains('button', 'Sign In').click();

      cy.wait('@loginRequest');
      cy.url().should('eq', 'http://localhost:5173/');
    });
  });

  describe('Failed Login', () => {
    it('should show error message with invalid credentials', () => {
      cy.intercept('POST', '**/login', {
        statusCode: 401,
        body: { message: 'Invalid credentials' }
      }).as('loginRequest');

      cy.get('[data-test=usernameOrEmail]').type('wronguser');
      cy.get('[data-test=loginPassword]').type('wrongpass');
      cy.contains('button', 'Sign In').click();

      cy.wait('@loginRequest');
      cy.contains('Invalid credentials. Please try again.').should('be.visible');
      cy.get('[role="alert"]').should('be.visible'); // Alert component
    });

    it('should show error message on network failure', () => {
      cy.intercept('POST', '**/login', { forceNetworkError: true }).as('loginRequest');

      cy.get('[data-test=usernameOrEmail]').type('testuser');
      cy.get('[data-test=loginPassword]').type('Password123');
      cy.contains('button', 'Sign In').click();

      cy.wait('@loginRequest');
      cy.contains('Invalid credentials. Please try again.').should('be.visible');
    });

    it('should allow retry after failed login', () => {
      cy.intercept('POST', '**/login', {
        statusCode: 401,
        body: { message: 'Invalid credentials' }
      }).as('failedLogin');

      // First attempt - fail
      cy.get('[data-test=usernameOrEmail]').type('wronguser');
      cy.get('[data-test=loginPassword]').type('wrongpass');
      cy.contains('button', 'Sign In').click();
      cy.wait('@failedLogin');
      cy.contains('Invalid credentials. Please try again.').should('be.visible');

      // Second attempt - success
      cy.intercept('POST', '**/login', {
        statusCode: 200,
        body: { token: 'fake-jwt-token' }
      }).as('successLogin');

      cy.get('[data-test=usernameOrEmail]').clear().type('peaceoutommy');
      cy.get('[data-test=loginPassword]').clear().type('Password123');
      cy.contains('button', 'Sign In').click();
      
      cy.wait('@successLogin');
      cy.url().should('eq', 'http://localhost:5173/');
    });

    it('should not navigate away on failed login', () => {
      cy.intercept('POST', '**/login', {
        statusCode: 401,
        body: { message: 'Invalid credentials' }
      }).as('loginRequest');

      cy.get('[data-test=usernameOrEmail]').type('wronguser');
      cy.get('[data-test=loginPassword]').type('wrongpass');
      cy.contains('button', 'Sign In').click();

      cy.wait('@loginRequest');
      cy.url().should('include', '/authenticate');
    });
  });

  describe('Input Handling', () => {
    it('should accept typing in email/username field', () => {
      const testInput = 'testuser123';
      cy.get('[data-test=usernameOrEmail]').type(testInput);
      cy.get('[data-test=usernameOrEmail]').should('have.value', testInput);
    });

    it('should accept typing in password field', () => {
      const testPassword = 'TestPass123!';
      cy.get('[data-test=loginPassword]').type(testPassword);
      cy.get('[data-test=loginPassword]').should('have.value', testPassword);
    });

    it('should handle special characters in inputs', () => {
      cy.get('[data-test=usernameOrEmail]').type('user@example.com');
      cy.get('[data-test=loginPassword]').type('P@ssw0rd!#$%');
      
      cy.get('[data-test=usernameOrEmail]').should('have.value', 'user@example.com');
      cy.get('[data-test=loginPassword]').should('have.value', 'P@ssw0rd!#$%');
    });

    it('should handle spaces in inputs', () => {
      cy.get('[data-test=usernameOrEmail]').type('user name');
      cy.get('[data-test=usernameOrEmail]').should('have.value', 'user name');
    });

    it('should allow clearing and retyping', () => {
      cy.get('[data-test=usernameOrEmail]').type('firstinput');
      cy.get('[data-test=usernameOrEmail]').clear().type('secondinput');
      cy.get('[data-test=usernameOrEmail]').should('have.value', 'secondinput');
    });
  });

  describe('Footer Links', () => {
    it('should display Terms of Service and Privacy Policy links', () => {
      cy.contains('Terms of Service').should('be.visible');
      cy.contains('Privacy Policy').should('be.visible');
    });
  });
});