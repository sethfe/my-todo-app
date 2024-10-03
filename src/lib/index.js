let todoIdCounter = 0;
let categoryIdCounter = 0;
const todos = [];
const categories = [];

class Todo {
  constructor(name, categoryId, dueDate) {
    this.id = ++todoIdCounter;
    this.name = name;
    this.status = 'pending';
    this.categoryId = categoryId;
    this.dueDate = dueDate;
  }
}

class Category {
  constructor(name) {
    this.id = ++categoryIdCounter;
    this.name = name;
  }
}

export function addNewTodo(name, categoryId, dueDate) {
  const newTodo = new Todo(name, categoryId, dueDate);
  todos.push(newTodo);
  return newTodo;
}

export function editTodo(id, newName, newCategoryId, newDueDate) {
  const todo = todos.find(todo => todo.id === id);
  if (todo) {
    todo.name = newName || todo.name;
    todo.categoryId = newCategoryId !== undefined ? newCategoryId : todo.categoryId;
    todo.dueDate = newDueDate || todo.dueDate;
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
    todos.splice(index, 1);
  }
}

export function deleteCategory(categoryId) {
  categories.splice(categories.findIndex(category => category.id === categoryId), 1);
  
  todos.forEach(todo => {
    if (todo.categoryId === categoryId) {
      todo.categoryId = null; // Or consider reassigning to a default category
    }
  });
}

export function clearCompletedTasks() {
  const completedTaskIds = todos.filter(todo => todo.status === 'completed').map(todo => todo.id);
  completedTaskIds.forEach(completeTaskId => {
    deleteTodo(completeTaskId);
  });
}

export function addNewCategory(name) {
  if (!categories.find(category => category.name === name)) {
    const newCategory = new Category(name);
    categories.push(newCategory);
    return newCategory;
  }
  return null;
}

export function editCategory(categoryId, newName) {
  const category = categories.find(cat => cat.id === categoryId);
  if (category) {
    category.name = newName;
  }
}

export const getTodos = (categoryId = null) => {
  return categoryId === null 
    ? todos 
    : todos.filter(todo => todo.categoryId === categoryId);
};

export const getCategories = () => [...categories];

export const getTodoCount = () => todos.filter(todo => todo.status !== 'completed').length;

// Example pre-defined categories
addNewCategory('Work');
addNewCategory('Personal');