const commentsRouter = require('express').Router()
const Post = require('../models/post')
const User = require('../models/user')
const Comment = require('../models/comment')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }
    return null
}

commentsRouter.get('/', async (req, res) => {
    const comments = await Comment.find()
    res.json(comments)
})

commentsRouter.post('/', async (request, response) => {
    const body = request.body

    const token = getTokenFrom(request)
    console.log('TokenFrom(request) is :', token)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)
    const post = await Post.findById(body.postId)

    const newComment = new Comment({
        content: body.content,
        date: body.date,
        likes: body.likes,
        user: user._id,
        post: post._id,
    })

    const savedComment = await newComment.save()
    
    user.comments = user.comments.concat(savedComment._id)
    await user.save()
    const finalComment = await Comment.findOne({ _id: savedComment._id })
    response.json(finalComment.toJSON())
})

commentsRouter.delete('/:id', async (req, res, next) => {
    const afterDelete = await Comment.findByIdAndDelete(req.params.id)
    res.status(204).end()
})


module.exports = commentsRouter