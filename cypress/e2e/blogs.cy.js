import { func } from "prop-types"

let blogs = [
  {
    title: "Coding is fun!",
    author: "Peppi",
    url: "www.yahoo.com",
    likes: 27,
    user: "652e799d11f33a1a62c5b571"
  },
  {
    title: "Fuzzy frontend",
    author: "Meow Meow fuzzyface",
    url: "www.google.com",
    likes: 16,
    user: "652e7d7349663d1febafcdd8"
  }
]

let user = {
  username: "Jimi",
  name: "Jimi",
  password: "secret"
}


describe('Blog app ', function() {
  beforeEach( function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.request('POST', 'http://localhost:3003/api/users/', user) 

    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function() {
    cy.contains('login')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('Jimi')
      cy.get('#password').type('secret')
      cy.get('#login-button').click()
      
      cy.contains('Jimi logged in')
    })
    
    it('fails with wrong credentials', function() {
      cy.get('#username').type('Jimi2')
      cy.get('#password').type('secret2')
      cy.get('#login-button').click()
      
      cy.contains('Wrong credentials')
      cy.get('html').should('not.contain', 'Jimi logged in')
    })

    describe('When logged in', function() {
      beforeEach( function() {
        cy.login({ username: 'Jimi', password: 'secret' })
        })

      it('A blog can be created', function() {
        cy.contains('Add new blog').click()
        
        cy.get('#title').type('Fuzzy frontend')
        cy.get('#author').type('Meow Meow fuzzyface')
        cy.get('#url').type('www.google.com')
        cy.get('#submit-button').click()

        cy.contains('a new blog Fuzzy frontend by Meow Meow fuzzyface added')
        cy.contains('Fuzzy frontend Meow Meow fuzzyface')
        cy.get('.blogItem')
      })
      
      describe('When site has blogs', function () {
        beforeEach( function() {
          cy.createBlog({
            title: 'Fuzzy frontend',
            author: 'Meow Meow fuzzyface',
            url: 'omat nettisivut'
          })
        })
      
        it('A blog can liked', function() {
          cy.get('.showBlog').click()
          cy.get('.likeCount').should('contain', '0')
          cy.get('.likeBlog').click()
          cy.get('.likeCount').should('contain', '1')
        })

        it('A blog can be removed', function() {
          cy.get('.showBlog').click()
          cy.get('.removeBlog').click()
          cy.get('html').should('contain', 'Deleted Fuzzy frontend by Meow Meow fuzzyface')
          cy.get('html').should('not.contain', 'Fuzzy frontend Meow Meow fuzzyface')
          cy.get('html').should('not.contain', '.blogitem')
        })

        it('Owner user can see remove button', function() {
          cy.get('.showBlog').click()
          cy.get('.removeBlog')
        })

        it('Other users cannot see remove button', function() {
          // login as other user
          cy.get('#logoutButton').click()
          cy.request('POST', 'http://localhost:3003/api/users/', { username: "TestUser", name: "Jimi", password: "secret" })
          .then(() => cy.login({ username: "TestUser", password: "secret" }))
          cy.get('.showBlog').click()
          cy.get('html').should('not.contain', '.removeBlog')
        })

        it('Blogs are sorted', function() {
          cy.createBlog({ title: 'Testing your application', author: 'Jimi Jukkala', url: 'omat nettisivut', likes:15 })
          cy.createBlog({ title: 'Javascript', author: 'Peppi', url: 'omat nettisivut', likes:20 })

          cy.get('.showBlog').click({ multiple: true })

          cy.get('.blogItem').eq(0).should('contain', 'Javascript Peppi')
          cy.get('.blogItem').eq(1).should('contain', 'Testing your application Jimi Jukkala')
          cy.get('.blogItem').eq(2).should('contain', 'Fuzzy frontend Meow Meow fuzzyface')

        })
      })
    })

  })
})