/* ==========================================
   DOM ELEMENTS
========================================== */

const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const priority = document.getElementById("priority");

const addTask = document.getElementById("addTask");

const searchTask = document.getElementById("searchTask");

const taskList = document.getElementById("taskList");

const totalTask = document.getElementById("totalTask");
const pendingTask = document.getElementById("pendingTask");
const completedTask = document.getElementById("completedTask");

const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

const themeToggle = document.getElementById("themeToggle");

const filterButtons =
document.querySelectorAll(".filters button");


/* ==========================================
   APP STATE
========================================== */

let tasks = JSON.parse(
    localStorage.getItem("tasks")
) || [];

let currentFilter = "all";

let searchValue = "";


/* ==========================================
   SAVE TASKS
========================================== */

function saveTasks(){

    localStorage.setItem(

        "tasks",

        JSON.stringify(tasks)

    );

}


/* ==========================================
   FORMAT DATE
========================================== */

function formatDate(date){

    if(!date) return "No Due Date";


    return new Date(date)

    .toLocaleString(

        "en-US",

        {

            month:"short",

            day:"numeric",

            year:"numeric",

            hour:"numeric",

            minute:"2-digit"

        }

    );

}



/* ==========================================
   UPDATE STATS
========================================== */

function updateStats(){


    const total = tasks.length;


    const completed =

    tasks.filter(

        task=>task.completed

    ).length;



    const pending =

    total - completed;



    totalTask.textContent = total;


    completedTask.textContent = completed;


    pendingTask.textContent = pending;



}



/* ==========================================
   PROGRESS BAR
========================================== */

function updateProgress(){


    const completed =


    tasks.filter(

        task=>task.completed

    ).length;



    const percent =

    tasks.length

    ?

    (completed / tasks.length)*100

    :

    0;



    progressFill.style.width =


    `${percent}%`;



    progressText.textContent =


    `${Math.round(percent)}% Completed`;


}



/* ==========================================
   THEME
========================================== */

function loadTheme(){


const dark =


localStorage.getItem(

"darkMode"

);



if(dark==="true"){


document.body.classList

.add(

"dark"

);


themeToggle.textContent=

"☀️";


}



}



function toggleTheme(){


document.body.classList

.toggle(

"dark"

);



const isDark =


document.body.classList

.contains(

"dark"

);



themeToggle.textContent =


isDark

?

"☀️"

:

"🌙";



localStorage.setItem(

"darkMode",

isDark

);


}



/* ==========================================
   FILTER TASKS
========================================== */

function getFilteredTasks(){


let filtered = tasks;



if(

currentFilter ===

"completed"

){


filtered =

filtered.filter(

task=>task.completed

);


}



if(

currentFilter ===

"pending"

){


filtered =

filtered.filter(

task=>!task.completed

);


}



if(searchValue){


filtered =


filtered.filter(


task=>


task.text


.toLowerCase()


.includes(


searchValue


.toLowerCase()


)


);


}


return filtered;


}



/* ==========================================
   INITIALIZE
========================================== */

updateStats();

updateProgress();

loadTheme();
/* ==========================================
   RENDER TASKS
========================================== */

function renderTasks(){

    taskList.innerHTML = "";

    const filtered = getFilteredTasks();

    filtered.forEach((task,index)=>{

        const li = document.createElement("li");

        li.className = "task-card";

        if(task.completed){
            li.classList.add("completed");
        }


        const priorityClass =
        task.priority.toLowerCase();


        li.innerHTML = `

        <div class="task-info">

            <div class="task-top">

                <div class="task-title">

                    ${task.text}

                </div>


                <span class="priority ${priorityClass}">

                    ${task.priority}

                </span>

            </div>


            <div class="task-date">

                ${formatDate(task.date)}

            </div>

        </div>



        <div class="actions">


            <button class="complete-btn">

                <i class="fa-solid fa-check"></i>

            </button>


            <button class="edit-btn">

                <i class="fa-solid fa-pen"></i>

            </button>


            <button class="delete-btn">

                <i class="fa-solid fa-trash"></i>

            </button>



        </div>

        `;



/* ==========================================
   COMPLETE BUTTON
========================================== */


li.querySelector(

".complete-btn"

)

.onclick = ()=>{


task.completed =

!task.completed;


saveTasks();


updateStats();


updateProgress();


renderTasks();


};



/* ==========================================
   EDIT BUTTON
========================================== */


li.querySelector(

".edit-btn"

)

.onclick = ()=>{


const newText = prompt(

"Edit Task",

task.text

);


if(newText){


task.text =

newText;


saveTasks();


renderTasks();


}


};



/* ==========================================
   DELETE BUTTON
========================================== */


li.querySelector(

".delete-btn"

)

.onclick = ()=>{


tasks = tasks.filter(

t=>t!==task

);


saveTasks();


updateStats();


updateProgress();


renderTasks();


};



taskList.appendChild(

li

);


});


}



/* ==========================================
   ADD TASK
========================================== */


addTask.addEventListener(

"click",

()=>{


const text =

taskInput.value.trim();



if(text===""){


alert(

"Enter a task"

);


return;


}



tasks.push({


text:text,


date:taskDate.value,


priority:

priority.value,


completed:false


});



taskInput.value="";


taskDate.value="";


priority.value="Low";


saveTasks();


updateStats();


updateProgress();


renderTasks();



}

);




/* ==========================================
   SEARCH
========================================== */


searchTask.addEventListener(

"input",

()=>{


searchValue =


searchTask.value;



renderTasks();


}


);




/* ==========================================
   FILTERS
========================================== */


filterButtons.forEach(

btn=>{


btn.addEventListener(

"click",

()=>{


filterButtons.forEach(

b=>b.classList.remove(

"active"

)

);



btn.classList.add(

"active"

);



currentFilter =


btn.dataset.filter;



renderTasks();


}


);


}

);




/* ==========================================
   THEME BUTTON
========================================== */


themeToggle.addEventListener(

"click",

toggleTheme

);




/* ==========================================
   ENTER KEY
========================================== */


taskInput.addEventListener(

"keypress",

e=>{


if(

e.key==="Enter"

){

addTask.click();

}


}

);




/* ==========================================
   INITIAL LOAD
========================================== */


renderTasks();

updateStats();

updateProgress();

loadTheme();