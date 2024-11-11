describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:5050/login')
    cy.contains('Inicia sesión').should('be.visible')
    cy.get('#username').type('user1@example.com')
    cy.get('#password').type('password123')
    cy.get('#buttonlogin').click();
    cy.contains('Bienvenido, user1@example.com').should('be.visible')
  })
})

