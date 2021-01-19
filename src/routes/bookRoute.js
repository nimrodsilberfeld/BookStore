const express = require('express')
const Book = require('../models/bookModel')
const router = new express.Router()
//const auth = require('../middleware/auth')
const adminAuth = require('../middleware/adminAuth')

//Create new book
router.post('/book', adminAuth, async (req, res) => {
    try {
        const book = new Book(req.body)
        await book.save()
        // req.user.books = req.user.books.concat(book)
        // await req.user.save()
        res.status(201).send(book)
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})

//Get all books
router.get('/books', async (req, res) => {
    const books = await Book.find({})
    res.send(books)
})

//Delete book by id
router.delete('/books/:id', adminAuth, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
        if (!book) {
            return res.status(404).send("No book found")
        }
        await book.remove()
        res.send(book)
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})

//Update book by id
router.patch('/books/:id', adminAuth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['bookName', 'bookAuthor', 'bookPrice', 'bookCover', 'bookInfo', 'bookPublishYear']
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidUpdate) {
        return res.status(400).send({ error: "Invalid updates" })
    }
    try {
        const book = await Book.findById(req.params.id)
        if (!book) {
            return res.status(404).send("No Book found")
        }
        updates.forEach((update) => {
            book[update] = req.body[update]
        })
        await book.save()
        res.send(book)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

router.get('/book/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const book = await Book.findById(_id)
        if (!book) {
            return res.status(404).send("No book found")
        }
        res.send(book)
    } catch (e) {
        res.status(500).send(e)
    }

})



module.exports = router