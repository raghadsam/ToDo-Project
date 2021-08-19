const storage = window.localStorage;
const form = document.getElementById("submit");
const list = document.getElementById("list");
const defaulTxt = document.getElementById("defaultText");
const input = document.getElementById("input");
const taskDate = document.getElementById("date");
const priority = document.getElementById("priorities");

let allTasks = [];
if (localStorage.getItem("tasks") !== null) {
  allTasks = JSON.parse(localStorage.getItem("tasks"));
  generateDom();
}

//to_do object prototype
let to_do = {
  task: input.value,
  date: taskDate.value,
  priority: priority.value,
};

//Set the date of today
function getDate(sp) {
  today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth() + 1; //As January is 0.
  let yyyy = today.getFullYear();

  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;
  return mm + sp + dd + sp + yyyy;
}

let todayH1 = document.getElementById("todayDate");
let date = getDate("/");
todayH1.innerText += " " + date;

function generateDom() {
  if (allTasks.length === 0) {
    defaulTxt.style.display = "block";
  } else {
    defaulTxt.style.display = "none";
  }

  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }

  for (let i = 0; i < allTasks.length; i++) {
    let item = document.createElement("li");
    item.className = "list-group-item";
    item.innerHTML = `<div><input type="checkbox" class = "check form-check-input"><div><span class="title">${allTasks[i].task}</span><br>${allTasks[i].date}&nbsp; &nbsp; &nbsp; &nbsp;<span class="priority">${allTasks[i].priority}</span></div><button id="Delete">X</button></div>`;
    list.appendChild(item);
    let checkBox = item.children[0].children[0];
    let title = item.children[0].children[1].children[0];
    let deleteButton = item.children[0].children[2];

    checkBox.addEventListener("change", function (e) {
      if (checkBox.checked) {
        title.style.textDecoration = "line-through";
      } else {
        title.style.textDecoration = "none";
      }
    });

    deleteButton.addEventListener("click", function (e) {
      allTasks.splice(i, 1);
      generateDom();
      setLocalStorage();
    });

    let now = new Date(getDate("-"));
    let taskDate = new Date(allTasks[i].date);
    if (dateInPast(taskDate, now)) {
      item.style.backgroundColor = "#FFBDBD";
      item.style.borderRadius = "25px";
    }
  }
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  //make object of this task and add it to the list
  addTask();

  //refresh the DOM
  generateDom();
  setLocalStorage();

  //set the inputs value to none
  input.value = "";
  taskDate.value = "";
  priority.value = "Priority 1";
});

function setLocalStorage() {
  storage.setItem("tasks", JSON.stringify(allTasks));
}

function dateInPast(firstDate, secondDate) {
  if (firstDate.setHours(0, 0, 0, 0) <= secondDate.setHours(0, 0, 0, 0)) {
    return true;
  }
  return false;
}

function formatDate(date) {
  let dateArr = date.split("-");
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return (
    months[parseInt(dateArr[1]) - 1] + " " + dateArr[2] + ", " + dateArr[0]
  );
}

//function to add tasks to the list
function addTask(){
  let obj = { ...to_do };
  obj.task = input.value;
  obj.date = formatDate(taskDate.value);
  obj.priority = priority.value;
  allTasks.push(obj);
}