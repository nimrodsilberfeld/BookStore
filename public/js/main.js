const booksContainer = document.querySelector('#books')
//const url="http://localhost:3000"
let url = "https://nim-book-store.herokuapp.com"
// const allBookUrl = 'http://localhost:3000/books'
//const allBookUrl = 'http://localhost:3000/books'
const allBookUrl = "https://nim-book-store.herokuapp.com/books"
const addBook_button = document.getElementById('addBook_button')
const searchInput = document.querySelector('#search_input')
const closeButton = document.querySelector('.close')
const signUp_button = document.querySelector('#signUp_button')
const loginForm = document.querySelector('.modal-content')
const login_button = document.getElementById('login_button')
let error_message = document.querySelector('.error_message')
let welcomeCard = document.getElementById('welcome_card')
let welcomeMessage = document.getElementById('welcome')
const signUpForm = document.querySelector('.signUp_modal')
const nav_login_Button = document.getElementById('login_button')
const disconnect_button = document.getElementById('disconnect_button')
const shopping_cart_button = document.getElementById('shopping_cart_button')
const add_book_button_form = document.getElementById('add_book_button')
const update_book_button = document.getElementById('update_book_button')
let isAdminLogin = false
let IsuserLogin = false
let bookToUpateId = ''



searchInput.addEventListener('input', () => {
    renderBooks(allBookUrl, searchInput.value)
})

update_book_button.addEventListener('click', (e) => {
    e.preventDefault()

    let bookData = {
        bookName: document.querySelector('.edit_book_name_input').value,
        bookAuthor: document.querySelector('.edit_book_author_input').value,
        bookPrice: parseInt(document.querySelector('.edit_book_price_input').value),
        bookCover: document.querySelector('.edit_book_cover_input').value,
        bookInfo: document.querySelector('.edit_book_description_input').value,
        bookPublishYear: document.querySelector('.edit_book_publish_input').value
    }
    console.log(bookData)

    update_book(bookToUpateId, bookData).then((res) => {
        console.log(res)
        document.getElementById('id04').style.display = "none"
        renderBooks(allBookUrl)
    }).catch((err) => {
        console.log(err)
    })
})


addBook_button.addEventListener('click', () => {
    document.getElementById('id03').style.display = 'block'

})

add_book_button_form.addEventListener('click', (e) => {
    e.preventDefault()

    let bookData = {
        bookName: document.querySelector('.book_name_input').value,
        bookAuthor: document.querySelector('.book_author_input').value,
        bookPrice: parseInt(document.querySelector('.book_price_input').value),
        bookCover: document.querySelector('.book_cover_input').value,
        bookInfo: document.querySelector('.book_description_input').value,
        bookPublishYear: document.querySelector('.book_publish_input').value
    }
    //console.log(bookData.bookInfo.replace('"','\"'))
    add_book_to_store(bookData).then((res) => {
        console.log(res)
        document.getElementById('id03').style.display = 'none'
        renderBooks(allBookUrl)
    }).catch((err) => {
        console.log(err)
    })

})



shopping_cart_button.addEventListener('click', (e) => {
    e.preventDefault()
    // console.log(data)
    if (IsuserLogin || isAdminLogin) {
        location.href = url + "/cart.html"
    } else {
        document.getElementById('id01').style.display = 'block'
    }
})


//Click on disconnect
disconnect_button.addEventListener('click', () => {
    LogOutUser().then((res) => {
        console.log(res)
    }).catch((err) => {
        console.log(err)
    })
    addBook_button.style.display = "none"
    sessionStorage.clear()
    renderBooks(allBookUrl)
    error_message.style.display = "none"
    nav_login_Button.innerHTML = "Login"
    nav_login_Button.classList.remove("user_name")
    document.getElementById('down_arrow').style.display = "none"
    document.getElementById('dropdown').classList.remove('dropdown')
    isAdminLogin = false
    IsuserLogin = false
})

//Click on login button on nav bar
login_button.addEventListener('click', (e) => {
    e.preventDefault()
    if (!isAdminLogin && !IsuserLogin)
        document.getElementById('id01').style.display = 'block'
})

//close login modal and open sign up modal
signUp_button.addEventListener('click', (e) => {
    e.preventDefault()
    error_message.style.display = "none"
    document.getElementById('login_email_input').value = ""
    document.getElementById('login_password_input').value = ""
    document.getElementById('id01').style.display = 'none'
    document.getElementById('id02').style.display = 'block'

})

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
            renderBooks(allBookUrl)
            document.getElementById('id01').style.display = 'none'
            nav_login_Button.innerHTML = data.admin.name + "(admin)"
            nav_login_Button.classList.add("user_name")
            document.getElementById('down_arrow').style.display = "inline-block"
            document.getElementById('dropdown').classList.add('dropdown')
            welcomeCardFunc(data.admin.name)
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
                renderBooks(allBookUrl)
                document.getElementById('id01').style.display = 'none'
                nav_login_Button.innerHTML = data.user.name
                nav_login_Button.classList.add("user_name")
                document.getElementById('down_arrow').style.display = "inline-block"
                document.getElementById('dropdown').classList.add('dropdown')
                welcomeCardFunc(data.user.name)
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

function welcomeCardFunc(name) {
    welcomeCard.style.display = 'block'
    welcomeMessage.innerHTML = `Welcome ${name}`
    error_message.style.display = "none"
    setTimeout(function () {
        welcomeCard.classList.add('animate-cloze')
        welcomeCard.style.display = "none"
        welcomeCard.classList.remove('animate-cloze')
    }, 2000)
}

//sending sign-up form Info
signUpForm.addEventListener('submit', (e) => {
    e.preventDefault()
    let newUserData = {
        name: document.querySelector('.sign_name_input').value,
        email: document.querySelector('.sign_email_input').value,
        password: document.querySelector('.sign_password_input').value
    }
    console.log("New user ", newUserData)
    postUser(url + '/users', newUserData)
        .then(data => {
            sessionStorage.setItem('token', data.token)
            sessionStorage.setItem("name", data.name)
            IsuserLogin = true
            renderBooks(allBookUrl)
            document.getElementById('id02').style.display = 'none'
            nav_login_Button.innerHTML = data.user.name
            nav_login_Button.classList.add("user_name")
            document.getElementById('down_arrow').style.display = "inline-block"
            document.getElementById('dropdown').classList.add('dropdown')
            welcomeCardFunc(data.user.name)
        })
        .catch((err) => {
            console.log("post user error: ", err)
            document.querySelector('.error_message_signUp').style.display = "block"
        })
})

//Closing forms
closeButton.addEventListener('click', () => {
    document.getElementById('id01').style.display = 'none'
    document.getElementById('id02').style.display = 'none'
})

async function postUser(url = '', data = {}) {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return response.json()
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

async function LogOutUser() {

    const response = await fetch(url + "/users/logout", {
        method: "POST",
        headers: {
            'Authorization': sessionStorage.getItem('token')
        }
    }).then((res) => {
        if (res.ok) {
            console.log("User logout")
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

const remove_book_from_store = async (bookId) => {
    const response = await fetch(url + `/books/${bookId}`, {
        method: "DELETE",
        headers: {
            'Authorization': sessionStorage.getItem('token'),
            'Content-Type': 'application/json'
        }
    }).then((res) => {
        if (res.ok) {
            return res.json()
        } else {
            throw new Error(res.status)
        }
    }).catch((err) => {
        console.log(err)
    })
    return response
}

const add_book_to_store = async (data = {}) => {

    const response = await fetch(url + '/book', {
        method: "POST",
        headers: {
            'Authorization': sessionStorage.getItem('token'),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then((res) => {
            if (res.ok) {
                return res.json()
            } else {
                throw new Error(res.status)
            }
        }).catch((err) => {
            return err
        })
    return response
}


const update_book = async (id, data = {}) => {

    const response = await fetch(url + `/books/${id}`, {
        method: "PATCH",
        headers: {
            'Authorization': sessionStorage.getItem('token'),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then((res) => {
            if (res.ok) {
                return res.json()
            } else {
                throw new Error(res.status)
            }
        }).catch((err) => {
            return err
        })
    return response
}


const Does_User_Have_The_Book = async (bookId) => {
    const data = sessionStorage.getItem('token')

    if (!data) {
        return false
    }
    const response = await fetch(url + '/users/me', {
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

const is_user_login = async (url = '') => {

    const response = await fetch(url, {
        headers: { 'Authorization': sessionStorage.getItem('token') }
    })
        .then((res) => {
            if (res.ok) {
                return res.json()
            } else {
                throw new Error(res.status)
            }
        }).catch((err) => {
            throw err
        })
    return response
}

const is_admin_login = async () => {
    const response = await fetch(url + '/admin/me', {
        headers: { 'Authorization': sessionStorage.getItem('token') }
    })
        .then((res) => {
            if (res.ok) {
                return res.json()
            } else {
                return error = {
                    error: res.status
                }
            }
        }).catch((err) => {
            return err
        })
    return response
}

is_user_login(url + '/users/me').then((data) => {
    isAdminLogin = false
    IsuserLogin = false

    sessionStorage.setItem("name", data.name)
    nav_login_Button.innerHTML = data.name
    nav_login_Button.classList.add("user_name")
    document.getElementById('down_arrow').style.display = "inline-block"
    document.getElementById('dropdown').classList.add('dropdown')
    IsuserLogin = true
    console.log("388 render books")
    renderBooks(allBookUrl)

}).catch((err) => {
    console.log("enter catch")
    console.log(err)
    is_admin_login().then((data) => {
        console.log("enter is admin login func")
        if (data.error) {
            console.log("is_admin_login data.error")
            renderBooks(allBookUrl)
            return
        }
        sessionStorage.setItem("name", data.name)
        addBook_button.style.display = "block"
        nav_login_Button.innerHTML = data.name + "(admin)"
        nav_login_Button.classList.add("user_name")
        document.getElementById('down_arrow').style.display = "inline-block"
        document.getElementById('dropdown').classList.add('dropdown')
        isAdminLogin = true
        renderBooks(allBookUrl)
    })
})

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


const renderBooks = (AllBooksUrl, search) => {

    while (booksContainer.children.length > 0) {
        booksContainer.removeChild(booksContainer.lastChild)
    }

    fetch(AllBooksUrl)
        .then((res) => {
            if (res.ok) {
                return res.json()
            } else {
                throw new Error(res.status)
            }
        })
        .then((booksObj) => {
            for (let book of booksObj) {
                if (search && (!book.bookName.toLowerCase().includes(search.toLowerCase()) && !book.bookAuthor.toLowerCase().includes(search.toLowerCase()))) {
                    continue;
                }
                const bookDiv = document.createElement('div')
                bookDiv.classList.add('book')

                const bookCoverDiv = document.createElement('div')
                bookCoverDiv.classList.add("bookCoverDiv")

                let img = document.createElement('img')
                img.classList.add('bookImg')
                img.src = book.bookCover
                img.addEventListener('click', () => {
                    console.log(book._id)
                    sessionStorage.setItem("bookId", book._id)
                    location.href = url + "/book.html"
                })
                // if (!isAdminLogin) {
                // }

                let paperRoll = document.createElement('img')
                paperRoll.classList.add("paper_roll")
                paperRoll.src = './img/rolled_paper.png'
                bookCoverDiv.appendChild(img)
                bookCoverDiv.appendChild(paperRoll)
                bookDiv.appendChild(bookCoverDiv)

                let div = document.createElement('div')
                div.classList.add("middle")
                let button = document.createElement('button')
                button.classList.add("text")
                button.textContent = 'Add to cart!'
                button.addEventListener('click', () => {
                    if (button.textContent == "Add to cart!") {
                        addBookToUser(book._id, button).then((response) => {
                            console.log("addBook func")
                        }).catch((err) => {
                            console.log(err)
                            document.getElementById('id01').style.display = 'block'
                        })
                    } else {
                        remove_book_from_user(book._id, button).then((response) => {
                            console.log("book removed")
                        }).catch((err) => {
                            console.log(err)
                        })
                    }
                })
                if (IsuserLogin) {
                    console.log("user Login!!")
                    Does_User_Have_The_Book(book._id).then((res) => {
                        button.textContent = res ? "Remove from cart" : "Add to cart!"
                    }).catch((err) => {
                        console.log(err)
                        button.textContent = 'Add to cart!'
                    })
                } else if (isAdminLogin) {
                    button.textContent = "Delete"
                    button.addEventListener('click', () => {
                        remove_book_from_store(book._id).then((res) => {
                            console.log(res)
                            renderBooks(allBookUrl)
                        }).catch((err) => {
                            console.log(err)
                        })
                        console.log("delete ", book.bookName)
                    })
                    let button2 = document.createElement('button')
                    button2.classList.add("text")
                    button2.textContent = "Edit"
                    button2.addEventListener('click', () => {
                        console.log("edit!")
                        document.querySelector('.edit_book_name_input').value = book.bookName
                        document.querySelector('.edit_book_author_input').value = book.bookAuthor
                        document.querySelector('.edit_book_price_input').value = book.bookPrice
                        document.querySelector('.edit_book_cover_input').value = book.bookCover
                        document.querySelector('.edit_book_description_input').value = book.bookInfo
                        document.querySelector('.edit_book_publish_input').value = book.bookPublishYear

                        document.getElementById('id04').style.display = "block"
                        bookToUpateId = book._id
                    })
                    div.appendChild(button2)
                    // div.style.display = "inline-flex"
                }
                div.appendChild(button)
                bookDiv.appendChild(div)

                let bookHeader = document.createElement('span')
                bookHeader.classList.add('bookName')
                let textNode = document.createTextNode(book.bookName.toUpperCase())
                bookHeader.appendChild(textNode)
                bookDiv.appendChild(bookHeader)

                let bookAuthor = document.createElement('span')
                bookAuthor.classList.add('bookAuthor')
                let textNodeAuthor = document.createTextNode(book.bookAuthor)
                bookAuthor.appendChild(textNodeAuthor)
                bookDiv.appendChild(bookAuthor)

                let bookPrice = document.createElement('p')
                bookPrice.classList.add('bookPrice')
                let priceNode = document.createTextNode(book.bookPrice + "$")
                bookPrice.appendChild(priceNode)
                bookDiv.appendChild(bookPrice)

                booksContainer.appendChild(bookDiv)

            }
            //document.querySelector(".boxLoading").style.display = "none"
        }).catch((err) => {
            console.log(err)
        })
}

// sessionStorage.setItem("token", "")
// sessionStorage.clear()
