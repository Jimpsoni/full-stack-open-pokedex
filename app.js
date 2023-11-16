const express = require('express')
const app = express()

// Heroku dynamically sets a port
const PORT = process.env.PORT || 5000

app.use(express.static('dist'))

app.get('/version', (req, res) => {
  res.send('0.2.4') // change this string to ensure a new version deployed
})

app.get('/health', (req, res) => {
  res.send('Making a new tag again')
})

app.listen(PORT, '0.0.0.0')
