const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const postSchema = mongoose.Schema({
    content: {
        type: String,
        minLength: 3,
        maxLength: 200
    },
    likes: Number,
    date: {
        type: Date, default: Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
})

postSchema.plugin(uniqueValidator)

postSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Post', postSchema)