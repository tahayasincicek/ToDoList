// 230229080_AhmetÇağlar 230229088_TahaYasinÇiçek
"use strict";

// Initialize an empty array to store tasks
let gorevListesi = [];

// Retrieve tasks from local storage if they exist
if (localStorage.getItem("gorevListesi") !== null) {
    gorevListesi = JSON.parse(localStorage.getItem("gorevListesi"));
}

// Variables to track whether we are editing a task and its ID
let editId;
let isEditTask = false;

// DOM element references for interaction
const taskInput = document.querySelector("#txtTaskName");
const btnClear = document.querySelector("#btnClear");
const filters = document.querySelectorAll(".filters span");

// Initial display of all tasks
displayTasks("all");

// Function to display tasks based on a filter (all, completed, pending)
function displayTasks(filter) {
    let ul = document.getElementById("task-list");
    ul.innerHTML = "";

    if (gorevListesi.length == 0) {
        ul.innerHTML = "<p class='p-3 m-0'>Your task list is empty.</p>";
    } else {
        for (let gorev of gorevListesi) {
            let completed = gorev.durum == "completed" ? "checked" : "";

            if (filter == gorev.durum || filter == "all") {
                let li = `
                    <li class="task list-group-item">
                        <div class="form-check">
                            <input type="checkbox" onclick="updateStatus(this)" id="${gorev.id}" class="form-check-input" ${completed}>
                            <label for="${gorev.id}" class="form-check-label ${completed}">${gorev.gorevAdi}</label>
                        </div>
                        <div class="dropdown">
                            <button class="btn btn-link dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="fa-solid fa-ellipsis"></i>
                            </button>
                            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                <li><a onclick="deleteTask(${gorev.id})" class="dropdown-item" href="#"><i class="fa-solid fa-trash-can"></i> Delete</a></li>
                                <li><a onclick='editTask(${gorev.id}, "${gorev.gorevAdi}")' class="dropdown-item" href="#"><i class="fa-solid fa-pen"></i> Edit</a></li>
                            </ul>
                        </div>
                    </li>
                `;
                ul.insertAdjacentHTML("beforeend", li);
            }
        }
    }
}

// Event listeners for adding tasks and enabling enter key for adding
document.querySelector("#btnAddNewTask").addEventListener("click", newTask);
document.querySelector("#btnAddNewTask").addEventListener("keypress", function (event) {
    if (event.key == "Enter") {
        document.getElementById("btnAddNewTask").click();
    }
});

// Event listeners for filter buttons
for (let span of filters) {
    span.addEventListener("click", function () {
        document.querySelector("span.active").classList.remove("active");
        span.classList.add("active");
        displayTasks(span.id);
    });
}

// Function to add a new task or update an existing one
function newTask(event) {
    if (taskInput.value == "") {
        alert("Please enter your task.");
    } else {
        if (!isEditTask) {
            // Add new task
            gorevListesi.push({ "id": gorevListesi.length + 1, "gorevAdi": taskInput.value, "durum": "pending" });
        } else {
            // Update existing task
            for (let gorev of gorevListesi) {
                if (gorev.id == editId) {
                    gorev.gorevAdi = taskInput.value;
                }
                isEditTask = false;
            }
        }
        taskInput.value = "";
        displayTasks(document.querySelector("span.active").id);
        localStorage.setItem("gorevListesi", JSON.stringify(gorevListesi));
    }
    event.preventDefault();
}

// Function to delete a task
function deleteTask(id) {
    let deletedId;

    for (let index in gorevListesi) {
        if (gorevListesi[index].id == id) {
            deletedId = index;
        }
    }

    gorevListesi.splice(deletedId, 1);
    displayTasks(document.querySelector("span.active").id);
    localStorage.setItem("gorevListesi", JSON.stringify(gorevListesi));
}

// Function to enable editing of a task
function editTask(taskId, taskName) {
    editId = taskId;
    isEditTask = true;
    taskInput.value = taskName;
    taskInput.focus();
    taskInput.classList.add("active");
    console.log("edit id:", editId);
    console.log("edit mode", isEditTask);
}

// Clear button functionality
btnClear.addEventListener("click", function () {
    gorevListesi.splice(0, gorevListesi.length);
    localStorage.setItem("gorevListesi", JSON.stringify(gorevListesi));
    displayTasks();
});

// Function to update the status of a task
function updateStatus(selectedTask) {
    let label = selectedTask.nextElementSibling;
    let durum = selectedTask.checked ? "completed" : "pending";
    label.classList.toggle("checked", selectedTask.checked);

    for (let gorev of gorevListesi) {
        if (gorev.id == selectedTask.id) {
            gorev.durum = durum;
        }
    }
    displayTasks(document.querySelector("span.active").id);
    localStorage.setItem("gorevListesi", JSON.stringify(gorevListesi));
}

// Utility functions to update date and time
function updateDate() {
    const today = new Date();
    document.getElementById("date").innerHTML = today.toDateString();
}

function time() {
    const now = new Date();
    let h = now.getHours();
    let m = now.getMinutes();
    let s = now.getSeconds();
    document.getElementById("hour").innerHTML = `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
    setTimeout(time, 500);
}

// Initialize date and time updates
updateDate();
time();
