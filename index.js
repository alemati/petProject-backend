require('dotenv').config()
const app = require('./app') 
const http = require('http')


const server = http.createServer(app)

// const PORT = config.PORT
const PORT = process.env.MONGODB_URI || 3005

// let PORT = process.env.PORT
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
