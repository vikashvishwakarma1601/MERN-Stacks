class Todo {
    constructor(todoId, title) {
        todoId++;
        this.id = todoId
        this.title = title
        this.completed = false
    }
}




// Creating Todo Service Class and Todo service Methods

class TodoService {
    constructor() {
        this.todos = []
        this.todoId = 0
    }

    createTodo(title) {
        if(window.localStorage.length!=0){this.todos = JSON.parse(window.localStorage.getItem('todos'))}
        const newTodo = new Todo(this.todoId, title)
        this.todos = this.todos.concat(newTodo)
        window.localStorage.setItem('todos', JSON.stringify(this.todos))
        this.todoId++
    }

    editTitle(Id, newTitle) {
        this.todos = JSON.parse(window.localStorage.getItem('todos'))
        this.todos = this.todos.map(todo => {
            if (todo.id == Id) {
                todo.title = newTitle
            }
            return todo
        })
        window.localStorage.setItem('todos', JSON.stringify(this.todos))
    }

    deleteTodo(Id) {
        this.todos = this.todos.filter(todo => todo.id != Id)
        window.localStorage.setItem('todos', JSON.stringify(this.todos))

    }
    completeTodo(Id) {
        this.todos = this.todos.map(todo => {
            if (todo.id == Id) {
                todo.completed = !todo.completed
            }
            return todo
        })
        window.localStorage.setItem('todos', JSON.stringify(this.todos))

    }

    clearCompleted() {
        this.todos = this.todos.filter(todo => todo.completed != true)
        window.localStorage.setItem('todos', JSON.stringify(this.todos))

    }

    completeAll() {
        let uncompleted = this.todos.every(todo => todo.completed)
        this.todos = this.todos.map(todo => {
            todo.completed = !uncompleted
            return todo
        })
        window.localStorage.setItem('todos', JSON.stringify(this.todos))
    }

    fetchTodo(flag) {
        if (flag == 'All') {
            // return this.todos
            let todos = JSON.parse(window.localStorage.getItem('todos'))
            return todos
        }
        if (flag == 'Active') {
            // return this.todos.filter(todo => !todo.completed)
            let todos = JSON.parse(window.localStorage.getItem('todos'))
            return todos.filter(todo=>!todo.completed)
        }
        if (flag == 'Completed') {
            // return this.todos.filter(todo => todo.completed)
            let todos = JSON.parse(window.localStorage.getItem('todos'))
            return todos.filter(todo=>todo.completed)
        }
    }
}

// Creating TodoService Instance/Object
const todo = new TodoService()


if(window.localStorage.length!=0){
renderTodos('All') // rendering todos for first time if any todos is available in localStorage 
}
// Accessing Input Field
let inputData = document.querySelector('#todoText')

function completeAllAction() {
    todo.completeAll()
    renderTodos('All')
}


inputData.addEventListener('keyup', event => {
    let title = event.target.value
    if (event.key === 'Enter') {
        if (title) {
            todo.createTodo(title)
            event.target.value = "" // After todo added then input field will get blank
            renderTodos('All')
        }
    }
})

function makeItComplete(event, id) {
    todo.completeTodo(id)
    renderTodos('All')
}


function editTitle(id) {
    document.getElementById(id).setAttribute('contenteditable', '') // Setting the 'contenteditable' attribute to title tag
}

function takeNewTitle(event, id) {
    let newTitle = event.target.innerText
    todo.editTitle(id, newTitle)
    renderTodos('All')
}


function deleteTodo(event, id) {
    todo.deleteTodo(id)
    renderTodos('All')
}

let flag = document.querySelector('.actions')
flag.addEventListener('click', event => {
    event.stopPropagation() // this stop bubbling of this event to parent elements, preventing any parent handlers from being notified of the event
    let flagAction = event.target.innerText
    renderTodos(flagAction)
})


function clearCompleted(event) {
    todo.clearCompleted()
    renderTodos('All')
}

let completeAllBtn = document.querySelector('#completeAll')

function renderTodos(flag) {
        let todos = todo.fetchTodo(flag) // Fetching all todos by flag value
        let countUncompleted = todos.filter(todo => todo.completed != true) // Filtering  Uncompleted Todos
        const todoElements = todos.map(todo => {
            return `<li class="list-group-item">
                <div class="row">
                    <div class="todo-list-checkbox">
                        <input onchange="makeItComplete(event,${todo.id})" type="checkbox" ${todo.completed ? 'checked' : ''} />
                    </div>
                    <div class="todo-list-title" id=${todo.id} ondblclick = "editTitle(${todo.id})" onblur ="takeNewTitle(event,${todo.id})">${todo.title}</div>
                    <div class="todo-list-btn">
                        <button onclick="deleteTodo(event,${todo.id})" class="deleteBtn" >delete</button>
                    </div>
                </div>
        </li>`
        })
        document.querySelector('.checkbox').style.display = 'block'
        document.querySelector('#todo-list-container').innerHTML = todoElements.join(" ")
        if(todos.length===0)
        {
            document.querySelector('.checkbox').style.display = 'none'
            document.querySelector('#completeAll').checked = false
        }
        document.querySelector('.itemsCount').innerText = `${countUncompleted.length} items` // For showing how many uncompleted todos left
    
}
