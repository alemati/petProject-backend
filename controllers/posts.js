const postsRouter = require('express').Router()
const Post = require('../models/post')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const Comment = require('../models/comment')

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }
    return null
}

postsRouter.get('/', async (req, res) => {
    const posts = await Post.find()
    res.json(posts)
})

postsRouter.post('/', async (request, response) => {
    const body = request.body

    const token = getTokenFrom(request)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)

    const newPost = new Post({
        content: body.content,
        date: body.date,
        likes: body.likes,
        user: user._id,
    })
    const savedPost = await newPost.save()
    
    user.posts = user.posts.concat(savedPost._id)
    await user.save()
    const finalPost = await Post.findOne({ _id: savedPost._id })
    response.json(finalPost.toJSON())
})

postsRouter.delete('/:id', async (req, res, next) => {
    const afrerCommentsDelete = await Comment.deleteMany({post: req.params.id})
    const afterPostDelete = await Post.findByIdAndDelete(req.params.id)
    res.status(204).end()
})


module.exports = postsRouter