const app = require('./app')

const port = process.env.PORT



app.listen(port, () => {
    console.log('Server run on port ', port)
})

// const User = require('./models/userModel')
// const Book = require('./models/bookModel')

const main = async () => {
    // const user = await User.findById('5ff779349aae5d6b4c509ba6')
    // await user.populate('books').execPopulate()
    // console.log(user.books)

    // const book=await Book.findById('5ff773308c444753a8c8c101')
    // await book.populate('users').execPopulate()
    // console.log(book.users)
}
//main()