class Todo{
    constructor(todoId,title)
    {
        todoId++;
        this.id = todoId
        this.title = title
        this.completed = false
    }
}




// Creating Todo Service Class and Todo service Methods

class TodoService
{
    constructor()
    {
        this.todos = []
        this.todoId = 0
    }

    createTodo(title)
    {
        const newTodo = new Todo(this.todoId,title)
        this.todos = this.todos.concat(newTodo)
        this.todoId++
    }
    deleteTodo(Id)
    {
        this.todos = this.todos.filter(todo => todo.id!=Id)
    }
    completeTodo(Id)
    {
        this.todos = this.todos.map(todo =>{
            if(todo.id == Id)
            {
                todo.completed = true
            }
            return todo
        })
    }

    clearCompleted()
    {
        this.todos = this.todos.filter(todo => todo.completed != true)
    }

    completeAll()
    {
        let uncompleted = this.todos.every(todo => todo.completed)
        this.todos = this.todos.map(todo =>{
            todo.completed = !uncompleted
            return todo
        })
    }

    fetchTodo(flag)
    {
        if(flag=='All')
        {
            // return this.todos.map(todo =>{
            //     console.log(todo)
            // })
            return this.todos
        }
        if(flag=='Active')
        {
            // console.log(this.todos.filter(todo => !todo.completed))
            return this.todos.filter(todo => !todo.completed)
        }
        if(flag=='Completed')
        {
            // console.log(this.todos.filter(todo => todo.completed))
            return this.todos.filter(todo => todo.completed)
        }
    }
}

// Creating TodoService Instance/Object
const todo = new TodoService()


let inputData = document.querySelector('#todoText')

function completeAllAction()
{
    todo.completeAll()
    renderTodos('All')
}


inputData.addEventListener('keyup',event=>{
    let title = event.target.value
    if(event.key === 'Enter')
    {
        if(title)
        {
            todo.createTodo(title)
            event.target.value = ""
            renderTodos('All')
        }
    }
})

function makeItComplete(event,id)
{
    todo.completeTodo(id)
    renderTodos('All')
}

function deleteTodo(event,id)
{
    todo.deleteTodo(id)
    renderTodos('All')
}

let flag = document.querySelector('.actions')
flag.addEventListener('click',event=>{
    event.stopPropagation()
    let flagAction = event.target.innerText
    renderTodos(flagAction)
})


function clearCompleted(event)
{
    todo.clearCompleted()
    renderTodos('All')
}


function renderTodos(flag)
{
    let todos = todo.fetchTodo(flag)
    let countUncompleted = todos.filter(todo=>todo.completed !=true)
    const todoElements =  todos.map(todo=>{
        return `<li class="list-group-item">
            <div class="row">
                <div class="todo-list-checkbox">
                    <input onchange="makeItComplete(event,${todo.id})" type="checkbox" ${todo.completed ? 'checked' : ''} />
                </div>
                <div class="todo-list-title">${todo.title}</div>
                <div class="todo-list-btn">
                    <button onclick="deleteTodo(event,${todo.id})" class="deleteBtn" >delete</button>
                </div>
                </div>
        </li>`
    })
    document.querySelector('#todo-list-container').innerHTML = todoElements.join(" ")
    document.querySelector('.itemsCount').innerText = `${countUncompleted.length} items`
}
