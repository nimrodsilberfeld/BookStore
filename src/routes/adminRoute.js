const express = require('express')
// const User = require('../models/userModel')
// const Book = require('../models/bookModel')
const Admin = require('../models/adminModel')
const router = new express.Router()
//const auth = require('../middleware/auth')
const adminAuth = require('../middleware/adminAuth')

//Create admin
router.post('/admins', async (req, res) => {
    const admin = new Admin(req.body)
    try {
        await admin.save()
        const token = await admin.generateAuthToken()
        res.status(201).send({ admin, token })
    } catch (e) {
        console.log(e)
        res.status(400).send(e.message)
    }
})


router.get('/admin/me', adminAuth, async (req, res) => {
    res.send(req.admin)
})


router.post('/admins/login', async (req, res) => {
    try {
        const admin = await Admin.findByCredentials(req.body.email, req.body.password)
        const token = await admin.generateAuthToken()
        res.send({ admin, token })
    } catch (e) {
        res.status(400).send(e.message)
    }
})



//Logout admin
router.post('/admins/logout', adminAuth, async (req, res) => {
    try {
        req.admin.tokens = req.admin.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.admin.save()
        res.send(req.admin)
    } catch (e) {
        res.status(500).send(e)
    }
})

//Logout all User session
router.post('/admins/logoutAll', adminAuth, async (req, res) => {
    try {
        req.admin.tokens = []
        await req.admin.save()
        res.send(req.admin)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router