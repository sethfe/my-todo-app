// In-Memory data model for my-todo-app
let todoIdCounter = 0;
const todos = [];
const categories = new Set();

class Todo {
  constructor(name, category, dueDate) {
    this.id = ++todoIdCounter;
    this.name = name;
    this.status = 'pending'; // default status
    this.category = category;
    this.dueDate = dueDate;

    if (category) {
      categories.add(category);
    }
  }
}

export function addNewTodo(name, category, dueDate) {
  const newTodo = new Todo(name, category, dueDate);
  todos.push(newTodo);
  return newTodo;
}

export function editTodo(id, newName, newCategory, newDueDate) {
  const todo = todos.find(todo => todo.id === id);
  if (todo) {
    todo.name = newName ? newName : todo.name;
    todo.category = newCategory ? newCategory : todo.category;
    todo.dueDate = newDueDate ? newDueDate : todo.dueDate;
  }
}

export function editStatus(id, newStatus) {
  const todo = todos.find(todo => todo.id === id);
  if (todo) {
    todo.status = newStatus;
  }
}

export function completeTodo(id) {
  editStatus(id, 'completed');
}

export function deleteTodo(id) {
  const index = todos.findIndex(todo => todo.id === id);
  if (index !== -1) {
    const category = todos[index].category;
    todos.splice(index, 1);
    if (todos.filter(todo => todo.category == category).length == 0) {
      categories.delete(category);
    }
  }
}

export function deleteCategory(category) {
  categories.delete(category);
  todos.forEach(todo => {
    if (todo.category === category) {
      todo.category = null;
    }
  });
}

export function addNewCategory(category) {
  categories.add(category);
}

export const getTodos = () => todos;

export const getCategories = () => Array.from(categories);