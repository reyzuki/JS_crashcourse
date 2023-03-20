// variables
const todoInput = document.querySelector('#todo-input')
const addBtn = document.querySelector('#add-btn')
const todoList = document.querySelector('ul')


let todoArray = new Set()
let user;

// function to add new todo item
const addTodo = () => {
    // number of todo items cannot exceed 5
    // if so, the user sees and alert
    if (todoArray.size != 5) {
        if (todoInput.value != '') {
            todoInput.parentElement.classList.remove('error')
            todoArray.add(todoInput.value)

            if (user) {
                let db = [...todoArray]
                let _db = (JSON.stringify(db))      // spreads the content of todoArray into db
                localStorage.setItem(user, _db)     // _db is the string form of db array
                setTodo(todoArray)

            } else {
                setTodo(todoArray)
            }

        } else {
            todoInput.parentElement.classList.add('error')
        }

        todoInput.value = ''

    } else {
        alert('you have five things to do')
    }
}

// event handlers
addBtn.addEventListener('click', addTodo)

todoInput.addEventListener('keypress', (e) => {
    if (e.key == 'Enter') addTodo()
})

// function to decide button actions
todoList.addEventListener('click', (e) => {

    let target = e.target
    let item = target.parentElement.parentElement   // this targets the li element itself
    let itemID = item.id

    if (target.innerText === 'Edit') {
        editTodo(item)

    } else if (target.innerText === 'Save') {
        updateTodo(item)

    } else if (target.innerText === 'Delete') {
        let delItem = item.querySelector('p').innerText

        if (user) {
            todoArray.delete(delItem)
            let db = [...todoArray]              // spreads the content of todoArray into db
            let _db = (JSON.stringify(db))       // _db is the string form of db array
            localStorage.setItem(user, _db)
            setTodo(todoArray)

        } else {
            todoArray.delete(delItem)
            setTodo(todoArray)
        }

    }
})

// text function to count todo items
const informText = () => {
    let infoMsg = document.querySelector('#info-msg')
    let listNo = todoList.querySelectorAll('li').length

    // *** my intentional use of ternary operator instead of if-else statements ***
    listNo < 1 ?
        infoMsg.innerText = 'Nothing to do'
        : listNo == 1 ?
            infoMsg.innerText = 'Just one thing to do!'
            : infoMsg.innerText = `You have ${listNo} things to do`
}

// set todo html
const setTodo = (arr) => {
    let htmlArr = '';

    // alternatively, a map function could be used
    for (el of arr) {
        let html =
            `<li id=${el}>
                <div class="todo">
                    <p>${el}</p>
                    <input type="text" class="hide"/>
                </div>
                <div class="btns">
                    <button> Edit </button>
                    <button class="save hide"> Save </button>
                    <button> Delete </button>
                </div>
            </li>`

        htmlArr += html
    }

    todoList.innerHTML = htmlArr
    informText()
}


// edit todo function
const editTodo = (target) => {
    let taskItem = target.querySelector('p')
    let newInput = target.querySelector('input[type=text]')
    let edBtn = target.querySelectorAll('button')[0]
    let saveBtn = target.querySelectorAll('button')[1]
    let delBtn = target.querySelectorAll('button')[2]

    newInput.value = taskItem.innerText     // pre-populate the input with the old text

    // switching classes to hide & to show appropriate elements
    newInput.classList.remove('hide')
    saveBtn.classList.remove('hide')

    newInput.classList.add('edit-mode')
    taskItem.classList.add('hide')
    edBtn.classList.add('hide')
    delBtn.classList.add('hide')

    saveBtn.addEventListener('click', () => updateTodo(target))

    newInput.addEventListener('keypress', (e) => {
        if (e.key == 'Enter') updateTodo(el)
    })
}


// update todo function
const updateTodo = (target) => {
    let taskItem = target.querySelector('p')
    let newInput = target.querySelector('input[type=text]')
    let edBtn = target.querySelectorAll('button')[0]
    let saveBtn = target.querySelectorAll('button')[1]
    let delBtn = target.querySelectorAll('button')[2]

    if (newInput.value !== taskItem.innerText) {
        if (user) {
            let newChild = createNode(newInput.value)
            let oldChild = taskItem.closest('li')

            todoList.replaceChild(newChild, oldChild)

            todoArray.delete(taskItem.innerText)    // removing the edited text from the todo array
            todoArray.add(newInput.value)           // adding the new text to todo array

            let db = [...todoArray]
            let _db = (JSON.stringify(db))
            localStorage.setItem(user, _db)

        } else {
            let newChild = createNode(newInput.value)
            let oldChild = taskItem.closest('li')

            todoList.replaceChild(newChild, oldChild)

            todoArray.delete(taskItem.innerText)
            todoArray.add(newInput.value)
        }

    } else {
        taskItem.innerText = newInput.value

    }

    // switching classes to hide & to show appropriate elements
    newInput.classList.remove('edit-mode')
    taskItem.classList.remove('hide')
    edBtn.classList.remove('hide')
    delBtn.classList.remove('hide')

    newInput.classList.add('hide')
    edBtn.classList.add('edit')
    delBtn.classList.add('delete')
    saveBtn.classList.add('hide')
}


// this functions creates an HTML node to replace the edited one
const createNode = (val) => {
    let nodeChild = document.createElement('li')
    nodeChild.setAttribute('id', val)

    let html = `<div class="todo">
                <p>${val}</p>
                <input type="text" class="hide"/>
            </div>
            <div class="btns">
                <button> Edit </button>
                <button class="save hide"> Save </button>
                <button> Delete </button>
            </div>`

    nodeChild.innerHTML = html

    return nodeChild
}


// sign in functions
const signIn = document.querySelector('.logo-wrap p')
const modal = document.querySelector('#modal')
const userNm = modal.querySelector('input')
const signBtn = modal.querySelector('button')
const disModal = modal.querySelector('span')


signIn.addEventListener('click', () => {
    modal.style.display = 'flex'
})

disModal.addEventListener('click', (e) => {
    modal.style.display = 'none'
})

modal.addEventListener('click', (e) => {
    e.target == modal ? modal.style.display = 'none' : null
})


// function to log in user and save todo list
signBtn.addEventListener('click', () => {
    user = userNm.value

    if (user == '') {
        userNm.classList.add('error')

    } else {
        userNm.classList.remove('error')
        signIn.innerText = user     // changing the 'Sign in' text to the username
        todoArray.clear()           // empty the array before another user signs in on the same device
        setTodo(todoArray)
        userNm.value = ''

        let db = [...todoArray]
        let _db = (JSON.stringify(db))
        let userData = localStorage.getItem(user)

        if (userData) {
            let _userData = JSON.parse(userData)
            todoArray = new Set(_userData)
            setTodo(todoArray)
            modal.style.display = 'none'
        } else {
            localStorage.setItem(user, _db)
            modal.style.display = 'none'
        }
    }
})