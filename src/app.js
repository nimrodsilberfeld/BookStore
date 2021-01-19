const express = require('express')
require('./db/mongoose')
const userRouter = require('./routes/userRoute')
const bookRouter = require('./routes/bookRoute')
const adminRouter = require('./routes/adminRoute')
const path = require('path')

const publicDirectoryPath = path.join(__dirname, '../public')

const app = express()

app.use(express.static(publicDirectoryPath))
app.use(express.json())
app.use(userRouter)
app.use(bookRouter)
app.use(adminRouter)
module.exports = app