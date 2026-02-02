// To-do list application code

const addButton = document.getElementById('add');
const inputField = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

let todos = JSON.parse(localStorage.getItem('todos')) || [];

const renderTodos = () => {
    todoList.innerHTML = '';
    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.textContent = todo.text;
        li.className = todo.completed ? 'completed' : '';

        const completeButton = document.createElement('button');
        completeButton.textContent = todo.completed ? 'Undo' : 'Complete';
        completeButton.onclick = () => {
            todos[index].completed = !todos[index].completed;
            updateLocalStorage();
            renderTodos();
        };

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => {
            todos.splice(index, 1);
            updateLocalStorage();
            renderTodos();
        };

        li.appendChild(completeButton);
        li.appendChild(deleteButton);
        todoList.appendChild(li);
    });
};

const updateLocalStorage = () => {
    localStorage.setItem('todos', JSON.stringify(todos));
};

addButton.onclick = () => {
    const text = inputField.value.trim();
    if (text) {
        todos.push({ text, completed: false });
        inputField.value = '';
        updateLocalStorage();
        renderTodos();
    }
};

renderTodos();