describe('Pokedex', function () {
  it('front page can be opened', function () {
    console.log("Visiting website")
    cy.visit('http://localhost:5000')
    cy.contains('ivysaur')
    cy.contains('Pokémon and Pokémon character names are trademarks of Nintendo.')
  })
})
