describe('template spec', () => {
    it('passes', () => {
    cy.visit('http://localhost:5050/login')
    cy.contains('Inicia sesión').should('be.visible')
    cy.get('#username').type('user1@example.com')
    cy.get('#password').type('password123')
    cy.get('#buttonlogin').click();
    cy.contains('Bienvenido, user1@example.com').should('be.visible')
    cy.contains('Dashboard de Productos').should('be.visible')
    cy.get('#buttonaddprod').click();
    cy.contains('Agregar Producto').should('be.visible')
    cy.get('#labeltitulo').type('producto de prueba 1')
    cy.get('#labelcontenido').type('Este es un producto de prueba para cypress, luego se ser añadido, sera modificado y luego eliminado')
    cy.get('#labelprecio').type('20.5')
    cy.get('#buttonOkAddProd').click();
    })
  })