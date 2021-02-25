const formEl = document.getElementById("form");

const todoInputEl = document.getElementById("todoInput");
const todoListEl = document.getElementById("todoList");

formEl.addEventListener("submit", addTodo);

let isEditMode = false;
let editId = null;
let editEl = null;

function addTodo(e) {
  e.preventDefault();
  this.value = this.querySelector("#todoInput").value;
  this.id = new getRandomId().random;
  let todo = {
    value: this.value,
    id: this.id,
    isCompleted: false,
  };
  if (this.value && !isEditMode) {
    const el = new CreateElement(todo);
    todoListEl.prepend(el);
    new popup("Todo has been Added", "success");
  } else if (this.value && isEditMode) {
    editEl.querySelector("p").innerHTML = this.value;
    isEditMode = false;
    new popup("Todo has been Edited", "edited");
    this.buttonEl = this.querySelector("button");
    todoInputEl.placeholder = "Create a new Todo";

    changeButton(this.buttonEl, "Add Todo", `#0d6efd`, `#fff`);
  } else {
    new popup("Todo cannot be empty", "danger");
  }
  todoInputEl.value = "";
}

class getRandomId {
  constructor() {
    Object.defineProperty(this, "random", {
      get: function () {
        return Math.random().toString(16).slice(6, 12);
      },
    });
  }
}
// Element js

class CreateElement {
  constructor(todo) {
    this.value = todo.value;
    this.id = todo.id;
    this.isCompleted = todo.isCompleted;
    if (this.value) {
      let local = getLocal();
      local.unshift(todo);
      localStorage.setItem("Todo", JSON.stringify(local));
      return new SetupElement(this.id, this.value, this.isCompleted);
    }
  }
}

class SetupElement {
  constructor(idVal, value, isDone) {
    this.value = value;
    const attr = document.createAttribute("data-id");
    attr.value = idVal;
    const li = document.createElement("li");
    li.classList.add("list");
    // Left Element
    const liLeftEl = document.createElement("div");
    liLeftEl.classList.add("liLeft");
    const labelEl = document.createElement("label");
    const checkBoxEl = document.createElement("input");
    checkBoxEl.type = "checkbox";
    checkBoxEl.id = "isDone";
    checkBoxEl.checked = isDone;
    const attrCompleted = document.createAttribute("data-isCompleted");
    attrCompleted.value = isDone;
    li.setAttributeNode(attrCompleted);
    checkBoxEl.addEventListener("input", (e) => {
      this.workDone();
    });
    const checkBoxCont = document.createElement("div");
    checkBoxCont.classList.add("checkbox");
    const para = document.createElement("p");
    para.innerHTML = this.value;
    labelEl.appendChild(checkBoxEl);
    labelEl.appendChild(checkBoxCont);
    labelEl.appendChild(para);
    liLeftEl.appendChild(labelEl);
    li.appendChild(liLeftEl);
    // End of Left Element
    //
    // li Right
    const liRight = document.createElement("div");
    liRight.classList.add("liRight");
    const editBtn = document.createElement("button");
    editBtn.addEventListener("click", (e) => {
      this.EditEl();
    });
    editBtn.innerHTML = `<ion-icon name="create"></ion-icon>`;
    editBtn.classList.add("edit");
    const DelBtn = document.createElement("button");
    DelBtn.innerHTML = `<ion-icon name="trash"></ion-icon>`;
    //
    //
    //
    DelBtn.addEventListener("click", (e) => {
      this.deleteEl();
      new popup("Todo has been deleted", "danger");
    });
    //
    DelBtn.classList.add("delete");
    const moveBtn = document.createElement("button");
    moveBtn.innerHTML = `<ion-icon name="ellipsis-vertical"></ion-icon>`;
    moveBtn.classList.add("move");
    liRight.appendChild(editBtn);
    liRight.appendChild(DelBtn);
    liRight.appendChild(moveBtn);
    li.appendChild(liRight);

    li.setAttributeNode(attr);

    Object.defineProperty(this, "deleteEl", {
      value: function (e) {
        let element = li;
        element.remove();
        removeLocal(idVal);
      },
    });
    Object.defineProperty(this, "EditEl", {
      value: function (e) {
        isEditMode = true;
        editEl = li;
        todoInputEl.value = editEl.querySelector("p").textContent;
        todoInputEl.focus();
        const btnEl = document.getElementById("AddBtn");
        changeButton(btnEl, "Edit Todo", `#cfe2ff`, `#084298`);
        todoInputEl.placeholder = "Edit your Todo";
      },
    });
    Object.defineProperty(this, "workDone", {
      value: function () {
        if (checkBoxEl.checked) {
          li.dataset.iscompleted = true;
          isTodoDone(li.dataset.id, checkBoxEl.checked);
        } else {
          li.dataset.iscompleted = false;
          isTodoDone(li.dataset.id, checkBoxEl.checked);
        }
      },
    });

    return li;
  }
}
function getLocal() {
  return localStorage.getItem("Todo")
    ? JSON.parse(localStorage.getItem("Todo"))
    : [];
}

(function SetLocal() {
  let local = getLocal();
  return local.forEach((item) => {
    return todoList.appendChild(
      new SetupElement(item.id, item.value, item.isCompleted)
    );
  });
})();

function isTodoDone(id, value) {
  let local = getLocal();
  local = local.map((item) => {
    if (item.id === id) {
      item.isCompleted = value;
    }
    return item;
  });
  return localStorage.setItem("Todo", JSON.stringify(local));
}

function removeLocal(id) {
  let local = getLocal();
  local = local.filter((item) => {
    if (item.id !== id) {
      return item;
    }
  });
  return localStorage.setItem("Todo", JSON.stringify(local));
}
const clearAllEl = document.getElementById("clearAll");

class popup {
  constructor(value, action) {
    this.value = value;
    this.action = action;
    const alertEl = document.getElementById("alertEl");
    const popupCont = document.createElement("div");
    popupCont.innerHTML = this.value;
    popupCont.classList.add("popup", this.action);
    alertEl.appendChild(popupCont);

    popupCont.style.animation = `1s ease fadeEl`;

    popupCont.addEventListener("animationend", (e) => {
      popupCont.remove();
    });
  }
}

function changeButton(el, value, background, color) {
  el.innerHTML = value;
  el.style.backgroundColor = background;
  el.style.color = color;
}
