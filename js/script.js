'use strict';

class Todo {
  constructor(form, input, todoList, todoCompleted, todoContainer) {
    this.form = document.querySelector(form);
    this.input = document.querySelector(input);
    this.todoList = document.querySelector(todoList);
    this.todoCompleted = document.querySelector(todoCompleted);
    this.todoContainer = document.querySelector(todoContainer);
    this.todoData = new Map(JSON.parse(localStorage.getItem('todo')));
  }

  addToStorage() {
    localStorage.setItem('todo', JSON.stringify([...this.todoData]));
  }

  render() {
    this.todoList.textContent = '';
    this.todoCompleted.textContent = '';
    this.todoData.forEach(this.createItem, this);
    this.addToStorage();
  }


  createItem(todo) {
    const li = document.createElement('li');
    li.classList.add('todo-item');
    li.key = todo.key;
    li.insertAdjacentHTML('beforeend', `
        <span class="text-todo">${todo.value}</span>
        <div class="todo-buttons">
          <button class="todo-edit"></button>
          <button class="todo-remove"></button>
          <button class="todo-complete"></button>
        </div>
    `);

    if (todo.completed) {
      this.todoCompleted.append(li);
    } else {
      this.todoList.append(li);
    }

    this.input.value = '';
  }

  addTodo(e) {
    e.preventDefault();
    if (this.input.value.trim() === '') {
      this.input.placeholder = 'Введите текст!';
      this.input.classList.add('err');
    } else {
      this.input.placeholder = 'Какие планы?';
      this.input.classList.remove('err');
    }
    if (this.input.value.trim()) {
      const newTodo = {
        value: this.input.value,
        completed: false,
        key: this.generateKey(),
      };
      this.todoData.set(newTodo.key, newTodo);
      this.render();
    }
  }

  deleteItem(element) {
    this.todoData.delete(element.parentElement.key);
    this.render();
  }

  completedItem(element) {
    this.todoData.forEach(item => {
      if (item.key === element.parentElement.key) {
        item.completed = !item.completed;
      }
    });
    this.render();
  }

  editing(element) {
    
  }

  handler() {
    this.todoContainer.addEventListener('click', e => {
      const target = e.target;
      if (target.matches('.todo-complete')) {
        this.completedItem(target.parentElement);
      } else if (target.matches('.todo-remove')) {
        this.deleteItem(target.parentElement);
      } else if (target.matches('.todo-edit')) {
        this.editing(target.parentElement);
      }
    });
  }

  generateKey() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  init() {
    this.form.addEventListener('submit', this.addTodo.bind(this));
    this.handler();
    this.render();
  }
}

const toDo = new Todo('.todo-control', '.header-input', '.todo-list', '.todo-completed', '.todo-container');

toDo.init();
// toDo.handler();
