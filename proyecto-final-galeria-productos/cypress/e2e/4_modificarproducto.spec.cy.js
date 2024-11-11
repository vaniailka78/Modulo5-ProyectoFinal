describe('template spec', () => {
    it('passes', () => {
    cy.visit('http://localhost:5050/login')
    cy.contains('Inicia sesión').should('be.visible')
    cy.get('#username').type('user1@example.com')
    cy.get('#password').type('password123')
    cy.get('#buttonlogin').click();
    cy.contains('Bienvenido, user1@example.com').should('be.visible')
    cy.contains('Dashboard de Productos').should('be.visible')
    cy.get('#buttonEditar').click();
    cy.contains('Editar Producto').should('be.visible')
    cy.get('#labeltitulo').type('producto modificado')
    cy.get('#labelcontenido').type('Este es un producto de prueba para cypress, luego se ser modificado sera eliminado')
    cy.get('#buttonOkAddProd').click();
    })
  })