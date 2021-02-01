require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
require('express-async-errors')

app.use(cors())
app.use(express.json())

const usersRouter = require('./controllers/users')
app.use('/api/users', usersRouter)

const loginRouter = require('./controllers/login')
app.use('/api/login', loginRouter)

const postsRouter = require('./controllers/posts')
app.use('/api/posts', postsRouter)

const commentsRouter = require('./controllers/comments')
app.use('/api/comments', commentsRouter)

const skillsRouter = require('./controllers/skills')
app.use('/api/skills', skillsRouter)

let url = process.env.MONGODB_URI
console.log('connecting to', url)
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

module.exports = app