<script lang="js">
  import { LightSwitch } from "@skeletonlabs/skeleton";
  import { getTodos, addNewTodo, editTodo, completeTodo, deleteTodo, getCategories, addNewCategory, editCategory, deleteCategory, getTodoCount, clearCompletedTasks } from '$lib/index.js';
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  const taskCount = writable(0);

  let todos = [];
  let categories = [];
  let todoName = '';
  let todoCategoryId = null;
  let todoDueDate = '';

  let isEditing = false;
  let editingTodo = null;
  let editedName = '';
  let editedCategoryId = null;
  let editedDueDate = '';

  let newCategoryName = '';
  let isEditingCategory = false;
  let editingCategoryId = null;
  let editingCategoryName = '';

  onMount(() => {
    todos = getTodos();
    categories = getCategories();
    taskCount.set(getTodoCount());
  });

  function createTodo() {
    addNewTodo(todoName, parseInt(todoCategoryId, 10), new Date(todoDueDate));
    todoName = '';
    todoCategoryId = null;
    todoDueDate = '';
    todos = getTodos();
    taskCount.set(getTodoCount());
  }

  function startEditing(todo) {
    isEditing = true;
    editingTodo = todo;
    editedName = todo.name;
    editedCategoryId = todo.categoryId;
    editedDueDate = todo.dueDate ? todo.dueDate.toISOString().split('T')[0] : '';
  }

  function saveEdit() {
    if (editingTodo) {
      editTodo(editingTodo.id, editedName, parseInt(editedCategoryId, 10), new Date(editedDueDate));
      todos = getTodos();
      taskCount.set(getTodoCount());
      cancelEditing();
    }
  }

  function cancelEditing() {
    isEditing = false;
    editingTodo = null;
    editedName = '';
    editedCategoryId = null;
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

  function createCategory() {
    addNewCategory(newCategoryName);
    newCategoryName = '';
    categories = getCategories();
  }

  function startEditingCategory(category) {
    isEditingCategory = true;
    editingCategoryId = category.id;
    editingCategoryName = category.name;
  }

  function saveCategoryEdit() {
    if (editingCategoryId) {
      editCategory(editingCategoryId, editingCategoryName);
      categories = getCategories();
      cancelCategoryEditing();
    }
  }

  function cancelCategoryEditing() {
    isEditingCategory = false;
    editingCategoryId = null;
    editingCategoryName = '';
  }

  function removeCategory(id) {
    deleteCategory(id);
    categories = getCategories();
    todos = getTodos();
  }

  function clearCompleted() {
    clearCompletedTasks();
    todos = getTodos();
    taskCount.set(getTodoCount());
  }
</script>

<main class="container mx-auto p-4">
  <div class="flex items-center text-tertiary-500">
    <h1 class="text-5xl text-tertiary-500 font-bold mb-2">Task Ninja</h1>
    <img src="/ninja (1).svg" alt="Ninja Icon" class="inline-block ml-4 align-middle h-12 filter brightness-0 invert" />
    <LightSwitch />
  </div>
  
  <p class="mb-4 text-md italic pl-1">Master Your Tasks with Stealth and Precision!</p>
  <p class="mb-4 text-md pl-1">Total Pending Tasks: {$taskCount}</p>
  
  <div class="mt-8 mb-4">
    <h2 class="text-2xl text-tertiary-400 font-bold mb-2">Unleash Your Inner Task Ninja</h2>
    <input type="text" bind:value={todoName} placeholder="Todo name" class="input input-bordered text-slate-200 w-full mb-2">
    <select bind:value={todoCategoryId} class="input input-bordered text-slate-200 w-full mb-2">
      <option value="" disabled selected>Select a Category</option>
      {#each categories as category}
        <option value={category.id}>{category.name}</option>
      {/each}
    </select>
    <input type="date" bind:value={todoDueDate} class="input input-bordered text-slate-200 w-full mb-2">
    <button on:click={createTodo} class="btn btn-md variant-filled-tertiary">Add Todo</button>
  </div>

  {#if isEditing}
    <div class="mb-4 mt-4">
      <h2 class="text-2xl text-tertiary-200 font-bold mb-2">Edit Todo</h2>
      <input type="text" bind:value={editedName} placeholder="Todo name" class="input input-bordered w-full mb-2">
      <select bind:value={editedCategoryId} class="input input-bordered w-full mb-2">
        <option value="" disabled>Select a Category</option>
        {#each categories as category}
          <option value={category.id}>{category.name}</option>
        {/each}
      </select>
      <input type="date" bind:value={editedDueDate} class="input input-bordered w-full mb-2">
      <button on:click={saveEdit} class="btn btn-sm variant-soft-success mr-2">Save</button>
      <button on:click={cancelEditing} class="btn btn-sm variant-soft-error">Cancel</button>
    </div>
  {/if}

  <div>
    <h2 class="text-2xl text-tertiary-500 font-bold mb-2 mt-16">My Todo List</h2>
    <ul>
      {#each todos as todo}
        <li class="mb-8">
          <div class="flex justify-between items-center">
            <div class={todo.status === 'completed' ? 'todo-completed' : ''}>
              <h3 class="text-xl text-cyan-400">{todo.name}</h3>
              <p class="text-md">Due: {new Date(todo.dueDate).toDateString()}</p>
              <p class="text-md">Category: {categories.find(c => c.id === todo.categoryId)?.name || 'Uncategorized'}</p>
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

  <div>
    <button on:click={clearCompleted} class="btn btn-md variant-filled-error mt-4">Clear Completed Tasks</button>
  </div>

  <div>
    <h2 class="text-2xl text-tertiary-400 font-bold mb-2 mt-16">Categories</h2>
    <ul>
      {#each categories as category}
        <li class="flex justify-between items-center mb-2">
          {#if isEditingCategory && editingCategoryId === category.id}
            <input type="text" bind:value={editingCategoryName} class="input input-bordered w-full mb-2">
            <button on:click={saveCategoryEdit} class="btn btn-sm variant-soft-success mr-2">Save</button>
            <button on:click={cancelCategoryEditing} class="btn btn-sm variant-soft-error">Cancel</button>
          {:else}
            <span>{category.name}</span>
            <button on:click={() => startEditingCategory(category)} class="btn btn-sm variant-soft-warning mr-2">Edit</button>
            <button on:click={() => removeCategory(category.id)} class="btn btn-sm variant-soft-error">Delete</button>
          {/if}
        </li>
      {/each}
    </ul>
    
    <div class="mt-4">
      <input
        type="text"
        placeholder="New Category"
        bind:value={newCategoryName}
        class="input input-bordered w-full mb-2">
      
      <button on:click={createCategory} class="btn btn-md variant-filled-tertiary">Add Category</button>
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