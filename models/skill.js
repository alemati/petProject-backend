const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const skillSchema = mongoose.Schema({
    content: {
        type: String,
        minLength: 1,
        maxLength: 20
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
})

skillSchema.plugin(uniqueValidator)

skillSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Skill', skillSchema)