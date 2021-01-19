const mongoose = require('mongoose')
const User = require('./userModel')

const bookSchema = new mongoose.Schema({
    bookName: {
        type: String
    },
    bookAuthor: {
        type: String,
        default: "unknown"
    },
    bookPrice: {
        type: Number,
        required: true
    },
    bookCover: {
        type: String,
        required: true
    },
    bookInfo: {
        type: String,
        default: "No info found about the book"
    },
    bookPublishYear: {
        type: String
    }
})

bookSchema.virtual('users', {
    ref: 'User',
    localField: '_id',
    foreignField: 'books'
})


bookSchema.pre('remove', async function (next) {

    const book = this
    await book.populate('users').execPopulate()
    const userWithTheBook = book.users //return an array of users who hold the book
    console.log(userWithTheBook)
    userWithTheBook.forEach(async (user) => {
        let index = user.books.indexOf(book._id)
        if (index != -1) {
            user.books.splice(index, 1)
        }
        await user.save()
        console.log(user.name + " books fater deleting :", user.books)
    })
    next()
})


const Book = mongoose.model('Book', bookSchema)
module.exports = Book