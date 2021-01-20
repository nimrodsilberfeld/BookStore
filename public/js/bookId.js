//let url = "http://localhost:3000"
let url="https://nim-book-store.herokuapp.com"
let bookId = sessionStorage.getItem("bookId")
let imageAndButton = document.querySelector('.imageAndButton')
const login_button = document.getElementById('login_button')
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
const loginForm = document.querySelector('.modal-content')
const shopping_cart_button = document.getElementById('shopping_cart_button')
let isAdminLogin = false
let IsuserLogin = false

login_button.addEventListener('click', (e) => {
    e.preventDefault()
    if (!sessionStorage.getItem('token'))
        document.getElementById('id01').style.display = 'block'
})

if (sessionStorage.getItem("name")) {
    nav_login_Button.innerHTML = sessionStorage.getItem("name")
    nav_login_Button.classList.add("user_name")
    document.getElementById('down_arrow').style.display = "inline-block"
    document.getElementById('dropdown').classList.add('dropdown')
}



shopping_cart_button.addEventListener('click', (e) => {
    e.preventDefault()
    // console.log(data)
    if (sessionStorage.getItem('token')) {
        location.href = url + "/cart.html"
    } else {
        document.getElementById('id01').style.display = 'block'
    }
})

disconnect_button.addEventListener('click', () => {
    sessionStorage.clear()
    nav_login_Button.innerHTML = "Login"
    nav_login_Button.classList.remove("user_name")
    document.getElementById('down_arrow').style.display = "none"
    document.getElementById('dropdown').classList.remove('dropdown')
    isAdminLogin = false
    IsuserLogin = false
    location.href = url
})


const Does_User_Have_The_Book = async (bookId) => {
    const data = sessionStorage.getItem('token')

    if (!data) {
        return false
    }
    const response = await fetch(url + "/users/me", {
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

    const response = await fetch(url + `/users/userBooks/${bookId}`, {
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
    const response = await fetch(url + `/users/addBook/${bookId}`, {
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

async function LoginUser(url = '', data = {}) {

    const response = await fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return response.json()
}

//sending login form Info
loginForm.addEventListener('submit', (e) => {
    isAdminLogin = false
    IsuserLogin = false
    e.preventDefault()
    let userData = {
        email: document.getElementById('login_email_input').value,
        password: document.getElementById('login_password_input').value
    }
    console.log(userData)

    LoginUser(url + '/admins/login', userData)
        .then(data => {
            isAdminLogin = true
            sessionStorage.setItem("token", data.token)
            sessionStorage.setItem("name", data.admin.name)
            addBook_button.style.display = "block"
            document.getElementById('id01').style.display = 'none'
            location.reload()
        })
        .catch((err) => {
            console.log(err)
            error_message.style.display = "block"
        })
    if (!isAdminLogin) {
        LoginUser(url + '/users/login', userData)
            .then(data => {
                sessionStorage.setItem("token", data.token)
                sessionStorage.setItem("name", data.user.name)
                IsuserLogin = true
                document.getElementById('id01').style.display = 'none'
                location.reload()
            })
            .catch((err) => {
                console.log(err)
                error_message.style.display = "block"
            })
    }
    //renderBooks(allBookUrl)
    document.getElementById('login_email_input').value = ""
    document.getElementById('login_password_input').value = ""
})



fetch(url + `/book/${bookId}`)
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

