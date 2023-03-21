const newTodoInput = document.getElementById("newTodo");
const listGroup = document.querySelector(".list-group");
const itemsQuantityEl = document.getElementById("todos-counter");
const deleteCompleted = document.getElementById("delete-completed");
const statesBtns = document.querySelectorAll(".states button");
const hideWrapper = document.querySelector(".hide-wrapper");
const addNewTodoBtn = document.querySelector(".circle");

let itemsQuantity = 0;

// Adding new TODO
function addNewTodo() {
  const newTodo = newTodoInput.value;
  if (newTodo != "") {
    itemsQuantity++;
    if (itemsQuantity == 1) hideWrapper.classList.add("active");
    const newListGroupItem = document.createElement("li");
    newListGroupItem.className = "list-group-item";
    newListGroupItem.innerHTML = `
  <div class="checkbox-todo-wrapper">
              <input type="checkbox" class="checkbox" />
              <label for="checkbox" id="todo">${newTodo}</label>
            </div>
            <button class="delete-todo">
              <img src="images/icon-cross.svg" alt="Usuń zadanie" />
            </button>
  `;
    listGroup.appendChild(newListGroupItem);
    itemsQuantityEl.textContent = `Pozostałych zadań: ${itemsQuantity}`;
    newTodoInput.value = "";

    // Checkbox listener
    const checkbox = newListGroupItem.querySelector(".checkbox");
    let nthClick = 1;
    checkbox.addEventListener("click", () => {
      nthClick++;
      newListGroupItem.classList.toggle("completed");
      if (nthClick % 2 == 0) {
        itemsQuantity--;
        itemsQuantityEl.textContent = `Pozostałych zadań: ${itemsQuantity}`;
      } else {
        itemsQuantity++;
        itemsQuantityEl.textContent = `Pozostałych zadań: ${itemsQuantity}`;
      }
    });

    // Delete one TODO button listener
    const deleteTodoBtn = newListGroupItem.querySelector(".delete-todo");
    deleteTodoBtn.addEventListener("click", () => {
      deleteTodoBtn.parentNode.remove();
      itemsQuantity--;
      itemsQuantityEl.textContent = `Pozostałych zadań: ${itemsQuantity}`;
      if (itemsQuantity == 0) hideWrapper.classList.remove("active");
    });

    // drag & drop
    newListGroupItem.setAttribute("draggable", "true");
    newListGroupItem.addEventListener("dragstart", () => {
      newListGroupItem.classList.add("dragging");
    });
    newListGroupItem.addEventListener("dragend", () => {
      newListGroupItem.classList.remove("dragging");
    });
  } else return;
}

// drag & drop
listGroup.addEventListener("dragover", (e) => {
  e.preventDefault();
  const afterElement = getDraggableAfterElement(e.clientY);
  const draggable = listGroup.querySelector(".dragging");
  if (afterElement == null) listGroup.appendChild(draggable);
  else listGroup.insertBefore(draggable, afterElement);
});

function getDraggableAfterElement(y) {
  const elementsWithoutDraggable = [
    ...listGroup.querySelectorAll("li:not(.dragging)"),
  ];
  return elementsWithoutDraggable.reduce(
    (afterCursor, element) => {
      const box = element.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      // cursor after element
      if (offset < 0 && offset > afterCursor.offset)
        return {
          offset: offset,
          element: element,
        };
      else {
        return afterCursor;
      }
    },
    {
      offset: Number.NEGATIVE_INFINITY,
    }
  ).element;
}

// new TODO listeners
addNewTodoBtn.addEventListener("click", addNewTodo);
newTodoInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addNewTodo();
});

// Filter TODOS
function filterTodos(e) {
  const todos = listGroup.childNodes;

  todos.forEach((todo) => {
    switch (e.target.textContent) {
      case "Aktywne":
        if (todo.classList.contains("completed")) todo.classList.add("hide");
        else todo.classList.remove("hide");
        break;
      case "Ukończone":
        if (!todo.classList.contains("completed")) todo.classList.add("hide");
        else todo.classList.remove("hide");
        break;
      case "Wszystko":
        todo.classList.remove("hide");
        break;
    }
  });
}

statesBtns.forEach((btn) =>
  btn.addEventListener("click", (e) => {
    statesBtns.forEach((btn) => btn.classList.remove("active"));
    e.target.classList.add("active");
    filterTodos(e);
  })
);

// Delete completed TODOS button
deleteCompleted.addEventListener("click", () => {
  const todos = listGroup.childNodes;

  for (let i = 0; i < todos.length; i++) {
    const todo = todos[i];
    if (todo.classList.contains("completed")) {
      todo.remove();
      i--;
    }
  }
  if (itemsQuantity == 0) hideWrapper.classList.remove("active");
});

//change theme
{
  const changeThemeBtn = document.querySelector(".change-theme-btn");
  const icon = changeThemeBtn.querySelector("img");
  let nthClick = 1;
  changeThemeBtn.addEventListener("click", () => {
    nthClick++;
    if (nthClick % 2 == 0) icon.src = "images/icon-moon.svg";
    else icon.src = "images/icon-sun.svg";
    document.body.classList.toggle("light");
  });
}
