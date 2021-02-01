const skillssRouter = require('express').Router()
const Post = require('../models/post')
const User = require('../models/user')
const Comment = require('../models/comment')
const Skill = require('../models/skill')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }
    return null
}

skillssRouter.get('/', async (req, res) => {
    const comments = await Skill.find()
    res.json(comments)
})

skillssRouter.post('/', async (request, response) => {
    const body = request.body

    const token = getTokenFrom(request)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)

    const newSkill = new Skill({
        content: body.content,
        likes: body.likes,
        user: user._id,
    })

    const savedSkill = await newSkill.save()
    
    user.skills = user.skills.concat(savedSkill._id)
    await user.save()
    response.json(savedSkill.toJSON())
})

skillssRouter.delete('/:id', async (req, res, next) => {
    const afterDelete = await Skill.findByIdAndDelete(req.params.id)
    res.status(204).end()
})

skillssRouter.put("/:id", async (request, response, next) => {
    const body = request.body
    const updatedBlog = await Skill
        .findByIdAndUpdate(request.params.id, request.body, { new: true })
    response.json(updatedBlog.toJSON())
})


module.exports = skillssRouter