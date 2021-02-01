const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

usersRouter.get('/', async (req, res) => {
    const users = await User.find()
    res.json(users)
})

usersRouter.post('/', async (req, res) => {
    const body = req.body

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)
    const user = new User({
        username: body.username,
        name: body.name,
        url: body.url,
        passwordHash,
    })

    const savedUser = await user.save()

    res.json(savedUser)
})

usersRouter.get("/:id", async (request, response, next) => {
    const user = await User.findById(request.params.id)
    console.log(user)
    response.json(user.toJSON())
})



usersRouter.put("/:id", async (request, response, next) => {
    const body = request.body
    const updatedBlog = await User
        .findByIdAndUpdate(request.params.id, request.body, { new: true })
    response.json(updatedBlog.toJSON())
})


module.exports = usersRouter
