/* -- App Definitions -- */

function getAllTodos() {
    // get data from API
    axios.get('/api/todos')
        .then(response => {
            // use data to render todos on page
            const todosContainer = document.querySelector('#todosContainer')
            // loop over each todo in the response and make an array of HTML strings
            const todosHtml = response.data.map(todo => {
                return `<li class="${todo.completed ? 'complete' : 'incomplete'}">   
                    ${todo.description} 
                    <button onclick="setCompleteStatus('${todo.id}', '${!todo.completed}')">
                        ${todo.completed ? '🧨' : '✅'}
                    </button>
                    <button onclick="editTodo('${todo.id}', '${todo.description}')">🖋EDIT</button>
                    <button onclick="deleteTodo('${todo.id}')">🗑DELETE</button>
                </li>`
            }).join('') // join the array with an empty string to make it one big string
            // set the innerHTML of the todosContainer to the HTML we just created
            todosContainer.innerHTML = todosHtml
        })
}

function setCompleteStatus(id, status) {
    axios.patch(`/api/todos/${id}`, {
        completed: status
    })
        .then(() => {
            getAllTodos();
        })
}

function addNewTodo(description) {
    // send POST request to API
    return axios.post('/api/todos', {
        description: description // set description in request body
    })
}

function deleteTodo(id) {
    axios.delete(`/api/todos/${id}`)
        .then(() => {
            getAllTodos();
        })
}

function editTodo(id, oldDescription) {
    const description = prompt("Change todo? ", `${oldDescription}`)
    console.log(description)
    return axios.patch(`/api/todos/${id}`, {
        description: description
    })
        .then(() => {
            getAllTodos();
        })
}

/* -- App Logic --*/

// fetch all todos on load
getAllTodos();

// select form on page
const todosForm = document.querySelector('#todosForm')
// add event listener
todosForm.addEventListener('submit', (e) => {
    // prevent page from refreshing
    e.preventDefault();
    // get description value from form field
    const description = todosForm.elements.description.value
    // do the thing
    addNewTodo(description)
        .then(() => {
            todosForm.reset()
            getAllTodos()
        })
})

