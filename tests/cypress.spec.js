describe('Dashboard Page', () => {
  beforeEach(() => {
    cy.visit('https://ray.run/login')
    cy.get('#username').type('admin')
    cy.get('#password').type('password123')
    cy.get('#login-button').click()
    cy.url().should('include', '/dashboard')
  })
  it('should display user profile', () => {
    cy.get('#profile-button').click()
    cy.contains('Admin User')
  })
  // Other tests...
})