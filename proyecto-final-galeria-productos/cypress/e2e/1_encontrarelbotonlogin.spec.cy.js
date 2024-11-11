describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:5050/')
    cy.contains('La tienda on-line que lo tiene todo').should('be.visible')
    cy.get('[data-testid="LoginIcon"]').should('be.visible')
    cy.get('[data-testid="LoginIcon"]').click()
  })
})

// // ABSOLUTE


//  <html>
//   <body>
//     <div>
//       <ul>
//         <li>Elemento 1</li>
//         <li>Elemento 2</li>
//         <li id="objetivo">Elemento 3</li>
//       </ul>
//     </div>
//     <div>
//       <ul>
//         <li>Elemento 1</li>
//         <li>Elemento 2</li>
//         <li id="objetivo">Elemento 3</li>
//       </ul>
//     </div>
//   </body>
// </html>

// // Absoluta
// cy.get('html > body > div[1] > ul > li#objetivo')

// // Relativa
// cy.get('li#objetivo')
