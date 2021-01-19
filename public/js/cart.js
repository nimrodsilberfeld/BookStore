const proceedOrder = document.getElementById('proceed_button')
const purchase_button = document.querySelector('.button-cta')
const paid_message = document.getElementById('paid')
const books_cart = document.querySelector('.books_cart')
const back_to_shopping_button = document.getElementById('back_to_shopping_button')
const close_button = document.querySelector('.close')
const nav_login_Button = document.getElementById('login_button')
const total = document.getElementById('total_Money')
let totalMoney = 0



const is_user_login = async () => {

    const response = await fetch('http://localhost:3000/users/me', {
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

is_user_login().then((data) => {
    if (data.error) {
        return
    }
    console.log(data)
    nav_login_Button.innerHTML = data.name
    nav_login_Button.classList.add("user_name")
    document.getElementById('down_arrow').style.display = "inline-block"
    document.getElementById('dropdown').classList.add('dropdown')
}).catch((err) => {
    console.log(err)
})

close_button.addEventListener('click', () => {
    document.querySelector('.checkout').style.display = 'none'
    document.querySelector('.checkout-background').style.display = 'none'

})

back_to_shopping_button.addEventListener('click', () => {
    location.href = "http://localhost:3000"
})

proceedOrder.addEventListener('click', () => {
    document.querySelector('.checkout-background').style.display = 'block'
    document.querySelector('.checkout').style.display = 'block'
})

purchase_button.addEventListener('click', () => {
    remove_all_user_books().then((res) => {
        console.log(res)
    }).catch((err) => {
        console.log(err)
    })
    document.querySelector('.checkout').style.display = 'none'
    total.innerHTML = "Total: 0$"
    paid_message.style.display = "block"
    setTimeout(() => {
        paid_message.classList.remove('animate')
        paid_message.classList.add('animate-cloze')
        document.querySelector('.checkout-background').style.display = 'none'
        setTimeout(() => {
            paid_message.style.display = 'none'
            paid_message.classList.remove('animate-cloze')
            paid_message.classList.add('animate')
        }, 1000);
    }, 2000)
    renderCartBooks()
})



const renderCartBooks = async (url) => {
    while (books_cart.children.length > 0) {
        books_cart.removeChild(books_cart.lastChild)
    }

    const response = await fetch(url, {
        method: "GET",
        headers: { 'Authorization': sessionStorage.getItem('token') }
    })
        .then((res) => {
            if (res.ok) {
                return res.json()
            } else {
                //throw new Error(res.status)
                return error = {
                    error: res.status
                }
            }
        })
        .then((booksObj) => {
            for (let book of booksObj) {
                console.log(book)

                const book_cart = document.createElement('div')
                book_cart.classList.add('book_cart')

                const book_img = document.createElement('img')
                book_img.classList.add('book_img')
                book_img.src = book.bookCover
                book_cart.appendChild(book_img)

                const book_info = document.createElement('div')
                book_info.classList.add('book_info')

                const book_header = document.createElement('h2')
                const header_text = document.createTextNode(book.bookName)
                book_header.appendChild(header_text)

                const book_author = document.createElement('h2')
                const author_text = document.createTextNode(book.bookAuthor)
                book_author.appendChild(author_text)

                book_info.appendChild(book_header)
                book_info.appendChild(book_author)
                book_cart.appendChild(book_info)

                const priceAndTrashDiv = document.createElement('div')
                priceAndTrashDiv.classList.add("priceAndTrash")

                const book_price = document.createElement('p')
                const price_text = document.createTextNode(book.bookPrice + "$")
                totalMoney += book.bookPrice
                book_price.appendChild(price_text)
                priceAndTrashDiv.appendChild(book_price)
                //book_cart.appendChild(book_price)

                const trash_img = document.createElement('img')

                trash_img.classList.add('trash')
                trash_img.src = './img/trash.png'
                trash_img.addEventListener("click", () => {
                    remove_book_from_user(book._id).then((res) => {
                        console.log(res)
                        totalMoney -= book.bookPrice
                        total.innerHTML = "Total: " + totalMoney + "$"
                        book_cart.classList.add('animate-cloze')
                        setTimeout(() => {
                            book_cart.style.display = 'none'
                        }, 1000)
                    }).catch((err) => {
                        console.log(err)
                    })
                })
                // book_cart.appendChild(trash_img)
                priceAndTrashDiv.appendChild(trash_img)
                book_cart.appendChild(priceAndTrashDiv)
                books_cart.appendChild(book_cart)

            }
            total.innerHTML = "Total: " + totalMoney + "$"
        })
    return response

}



const remove_book_from_user = async (bookId) => {

    const response = await fetch(`http://localhost:3000/users/userBooks/${bookId}`, {
        method: "POST",
        headers: { 'Authorization': sessionStorage.getItem('token') }
    })
        .then((res) => {
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

const remove_all_user_books = async () => {

    const response = await fetch('http://localhost:3000/users/removeBooks', {
        method: "POST",
        headers: { 'Authorization': sessionStorage.getItem('token') }
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

renderCartBooks('http://localhost:3000/users/userBooks')

