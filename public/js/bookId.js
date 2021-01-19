let bookId = sessionStorage.getItem("bookId")
let imageAndButton = document.querySelector('.imageAndButton')
let OneBookInfo = document.querySelector('.OneBookInfo')
let OnebookDescription = document.querySelector('.OnebookDescription')
let OnebookPublish = document.querySelector('.OnebookPublish')
let bookName = document.querySelector('.OnebookName')
let bookAuthor = document.querySelector('.OnebookAuthor')
let bookPrice = document.querySelector('.OnebookPrice')
let bookCover = document.querySelector('.CoverImg')
let bookContainer = document.querySelector('#book')
let add_Button = document.getElementById('add_Button')
const nav_login_Button = document.getElementById('login_button')

if (sessionStorage.getItem("name")) {
    nav_login_Button.innerHTML = sessionStorage.getItem("name")
    nav_login_Button.classList.add("user_name")
    document.getElementById('down_arrow').style.display = "inline-block"
    document.getElementById('dropdown').classList.add('dropdown')
}

disconnect_button.addEventListener('click', () => {
    sessionStorage.clear()
    nav_login_Button.innerHTML = "Login"
    nav_login_Button.classList.remove("user_name")
    document.getElementById('down_arrow').style.display = "none"
    document.getElementById('dropdown').classList.remove('dropdown')
    isAdminLogin = false
    IsuserLogin = false
    location.href = "http://localhost:3000/"
})


const Does_User_Have_The_Book = async (bookId) => {
    const data = sessionStorage.getItem('token')

    if (!data) {
        return false
    }
    const response = await fetch('http://localhost:3000/users/me', {
        headers: { 'Authorization': sessionStorage.getItem('token') }
    })
        .then((res) => {
            if (res.ok) {
                return res.json()
            } else {
                throw new Error(res.status)
            }
        }).then((data) => {
            return data.books.includes(bookId)
        }).catch((err) => {
            console.log(err)
        })
    return response
}


const remove_book_from_user = async (bookId, button) => {

    const response = await fetch(`http://localhost:3000/users/userBooks/${bookId}`, {
        method: "POST",
        headers: { 'Authorization': sessionStorage.getItem('token') }
    })
        .then((res) => {
            if (res.ok) {
                if (button) {
                    button.textContent = "Add to cart!"
                }
                return res.json()
            } else {
                throw new Error(res.status)
            }
        }).catch((err) => {
            console.log(err)
        })
    return response

}


const addBookToUser = async (bookId, button) => {
    const response = await fetch(`http://localhost:3000/users/addBook/${bookId}`, {
        method: 'POST',
        headers: {
            'Authorization': sessionStorage.getItem('token')
        }
    })
        .then((res) => {
            if (res.ok) {
                button.textContent = "Remove from cart"
                return res.json()
            } else {
                throw new Error(res.status)
            }
        })
        .catch((err) => {
            throw err
        })
    return response

}



fetch(`http://localhost:3000/book/${bookId}`)
    .then((res) => {
        if (res.ok) {
            return res.json()
        } else {
            throw new Error(res.status)
        }
    })
    .then((book) => {
        console.log(book)
        //Book Image
        bookCover.src = book.bookCover
        imageAndButton.appendChild(bookCover)
        imageAndButton.appendChild(add_Button)

        //Book Header
        let textNode = document.createTextNode(book.bookName)
        bookName.appendChild(textNode)

        //Book Author
        let authorNode = document.createTextNode(book.bookAuthor)
        bookAuthor.appendChild(authorNode)

        //Book Description
        OnebookDescription.innerHTML = book.bookInfo

        //Book Publish
        OnebookPublish.innerHTML = "Published " + book.bookPublishYear

        //Book Price
        let PriceNode = document.createTextNode(book.bookPrice + "$")
        bookPrice.appendChild(PriceNode)

        OneBookInfo.appendChild(bookName)
        OneBookInfo.appendChild(bookAuthor)
        OneBookInfo.appendChild(OnebookDescription)
        OneBookInfo.appendChild(OnebookPublish)
        OneBookInfo.appendChild(bookPrice)
        Does_User_Have_The_Book(bookId).then((res) => {
            add_Button.textContent = res ? "Remove from cart" : "Add to cart!"
        }).catch((err) => {
            console.log(err)
            add_Button.textContent = 'Add to cart!'
        })

        add_Button.addEventListener('click', () => {
            if (add_Button.textContent == "Add to cart!") {
                addBookToUser(book._id, add_Button).then((response) => {
                    console.log("addBook func")
                }).catch((err) => {
                    console.log(err)
                    document.getElementById('id01').style.display = 'block'
                })
            } else {
                remove_book_from_user(book._id, add_Button).then((response) => {
                    console.log("book removed")
                }).catch((err) => {
                    console.log(err)
                })
            }
        })

    }).catch((err) => {
        console.log(err)
    })

