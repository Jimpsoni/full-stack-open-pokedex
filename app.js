const express = require('express')
const app = express()

// Heroku dynamically sets a port
const PORT = process.env.PORT || 5000

app.use(express.static('dist'))

app.get('/version', (req, res) => {
  res.send('0.0.1') // change this string to ensure a new version deployed
})

app.get('/health', (req, res) => {
  res.send('Making a new tag again')
})

app.listen(PORT, () => {
  /* eslint-disable no-console */
  console.log('server started on port 5000')
  /* eslint-enable no-console */
})
