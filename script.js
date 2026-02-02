// script.js

// Functionality for adding a task
function addTask(task) {
    const tasks = getTasks();
    tasks.push({
        id: Date.now(), // unique id for the task
        content: task,
        completed: false
    });
    saveTasks(tasks);
}

// Functionality for editing a task
function editTask(id, newContent) {
    let tasks = getTasks();
    tasks = tasks.map(task => {
        return task.id === id ? {...task, content: newContent} : task;
    });
    saveTasks(tasks);
}

// Functionality for deleting a task
function deleteTask(id) {
    const tasks = getTasks().filter(task => task.id !== id);
    saveTasks(tasks);
}

// Functionality for completing a task
function completeTask(id) {
    let tasks = getTasks();
    tasks = tasks.map(task => {
        return task.id === id ? {...task, completed: !task.completed} : task;
    });
    saveTasks(tasks);
}

// Functionality for getting tasks from localStorage
function getTasks() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

// Functionality for saving tasks to localStorage
function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Example usage
// addTask('Learn JavaScript');
// editTask(1626500725087, 'Learn JavaScript and Local Storage');
// completeTask(1626500725087);
// deleteTask(1626500725087);