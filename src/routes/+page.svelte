<script lang="js">
  import { LightSwitch } from "@skeletonlabs/skeleton";
  import { getTodos, addNewTodo, editTodo, completeTodo, deleteTodo, getCategories, addNewCategory, getTodoCount, clearCompletedTasks } from '$lib/index.js';
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  const taskCount = writable(0);

  let todos = [];
  let categories = [];
  let todoName = '';
  let todoCategory = '';
  let todoDueDate = '';

  let isEditing = false;
  let editingTodo = null;
  let editedName = '';
  let editedCategory = '';
  let editedDueDate = '';

  onMount(() => {
    todos = getTodos();
    categories = getCategories();
    taskCount.set(getTodoCount());
  });

  function createTodo() {
    addNewTodo(todoName, todoCategory, new Date(todoDueDate));
    todoName = '';
    todoCategory = '';
    todoDueDate = '';
    todos = getTodos();
    taskCount.set(getTodoCount());
  }

  function startEditing(todo) {
    isEditing = true;
    editingTodo = todo;
    editedName = todo.name;
    editedCategory = todo.category;
    editedDueDate = todo.dueDate ? todo.dueDate.toISOString().split('T')[0] : '';
  }

  function saveEdit() {
    if (editingTodo) {
      editTodo(editingTodo.id, editedName, editedCategory, new Date(editedDueDate));
      todos = getTodos();
      taskCount.set(getTodoCount());
      cancelEditing();
    }
  }

  function cancelEditing() {
    isEditing = false;
    editingTodo = null;
    editedName = '';
    editedCategory = '';
    editedDueDate = '';
  }

  function completeTask(id) {
    completeTodo(id);
    todos = getTodos();
    taskCount.set(getTodoCount());
  }

  function removeTask(id) {
    deleteTodo(id);
    todos = getTodos();
    taskCount.set(getTodoCount());
  }

  function createCategory(categoryName) {
    addNewCategory(categoryName);
    categories = getCategories();
  }

  function clearCompleted() {
    clearCompletedTasks();
    todos = getTodos();
    taskCount.set(getTodoCount());
  }
</script>

<!-- HTML -->
<main class="container mx-auto p-4">
  <div class="flex justify-between items-center">
    <h1 class="text-5xl text-tertiary-500 font-bold mb-2">Task Ninja</h1>
    <LightSwitch />
  </div>
  <p class="mb-4 text-md italic pl-1">Master Your Tasks with Stealth and Precision!</p>
  
  <!-- Task Counter -->
  <p class="mb-4 text-md pl-1">Total Pending Tasks: {$taskCount}</p>
  
  <!-- Add Todo -->
  <div class="mt-8 mb-4">
    <h2 class="text-2xl text-tertiary-400 font-bold mb-2">Unleash Your Inner Task Ninja</h2>
    <input type="text" bind:value={todoName} placeholder="Todo name" class="input input-bordered text-slate-200 w-full mb-2">
    <input type="text" bind:value={todoCategory} placeholder="Category" class="input input-bordered text-slate-200 w-full mb-2">
    <input type="date" bind:value={todoDueDate} class="input input-bordered text-slate-200 w-full mb-2">
    <button on:click={createTodo} class="btn btn-md variant-filled-tertiary">Add Todo</button>
  </div>
  
  <!-- Edit Todo -->
  {#if isEditing}
    <div class="mb-4 mt-4">
      <h2 class="text-2xl text-tertiary-200 font-bold mb-2">Edit Todo</h2>
      <input type="text" bind:value={editedName} placeholder="Todo name" class="input input-bordered w-full mb-2">
      <input type="text" bind:value={editedCategory} placeholder="Category" class="input input-bordered w-full mb-2">
      <input type="date" bind:value={editedDueDate} class="input input-bordered w-full mb-2">
      <button on:click={saveEdit} class="btn btn-sm variant-soft-success mr-2">Save</button>
      <button on:click={cancelEditing} class="btn btn-sm variant-soft-error">Cancel</button>
    </div>
  {/if}

  <!-- Todo List -->
  <div>
    <h2 class="text-2xl text-tertiary-500 font-bold mb-2 mt-16">My Todo List</h2>
    <ul>
      {#each todos as todo}
        <li class="mb-8">
          <div class="flex justify-between items-center">
            <div class={todo.status === 'completed' ? 'todo-completed' : ''}>
              <h3 class="text-xl text-cyan-400">{todo.name}</h3>
              <p class="text-md">Due: {new Date(todo.dueDate).toDateString()}</p>
              <p class="text-md">Category: {todo.category}</p>
              <p class="text-md">
                Status: 
                <span class={todo.status === 'completed' ? 'status-completed' : 'status-pending'}>
                  {todo.status}
                </span>
              </p>
            </div>
            <div>
              <button on:click={() => startEditing(todo)} class="btn btn-sm variant-soft-warning mr-2">Edit</button>
               <button on:click={() => completeTask(todo.id)} class="btn btn-sm variant-soft-success mr-2">Complete</button>
              <button on:click={() => removeTask(todo.id)} class="btn btn-sm variant-soft-error">Remove</button>
            </div>
          </div>
        </li>
      {/each}
    </ul>
  </div>

  <!-- Clear Completed Tasks Button -->
  <div>
    <button on:click={clearCompleted} class="btn btn-md variant-filled-error mt-4">Clear Completed Tasks</button>
  </div>

  <!-- Categories -->
  <div>
    <h2 class="text-2xl text-tertiary-400 font-bold mb-2 mt-16">Categories</h2>
    <ul>
      {#each categories as category}
        <li>{category}</li>
      {/each}
    </ul>
    
    <div class="mt-4">
      <input
        type="text"
        placeholder="New Category"
        bind:value={todoCategory}
        class="input input-bordered w-full mb-2">
      
      <button on:click={() => createCategory(todoCategory)} class="btn btn-md variant-filled-tertiary">Add Category</button>
    </div>
  </div>
</main>

<style>
  .container {
    max-width: 800px;
  }
  
  .status-pending {
    color: green;
  }
  
  .status-completed {
    color: red;
  }
  
  .todo-completed {
    color: gray;
  }
</style>