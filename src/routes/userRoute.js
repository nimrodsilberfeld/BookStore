const express = require('express')
const User = require('../models/userModel')
const router = new express.Router()
const auth = require('../middleware/auth')
const Book = require('../models/bookModel')

//Create user
router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        console.log(e)
        res.status(400).send(e.message)
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})


//Login user
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send(e.message)
    }
})

//Logout user
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

//Logout all User session
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

//Add book to user books array
router.post('/users/addBook/:id', auth, async (req, res) => {
    try {
        // console.log(book.book)
        const book = await Book.findById(req.params.id)
        if (!book) {
            return res.status(404).send("no book found")
        }
        req.user.books = req.user.books.concat(book)
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})

//Get all user favorite books
router.get('/users/userBooks', auth, async (req, res) => {
    try {
        const books = await req.user.populate({
            path: 'books',
        }).execPopulate()

        res.status(200).send(books.books)
    } catch (e) {
        res.status(400).send(e)
    }
})

//remove user favorite book by id
router.post('/users/userBooks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        req.user.books = req.user.books.filter((book) => {
            return book != _id
        })
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})

//remove all user books
router.post('/users/removeBooks', auth, async (req, res) => {
    try {
        req.user.books = []
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)

    }

})




module.exports = router