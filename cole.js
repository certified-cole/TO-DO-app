/* SIMPLE TASK MANAGER - PLAIN JAVASCRIPT */

// Load saved tasks from localStorage or start empty
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const form = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const totalCount = document.getElementById("totalCount");
const completedCount = document.getElementById("completedCount");
const uncompletedCount = document.getElementById("uncompletedCount");
const searchBar = document.getElementById("searchBar");
const sortSelect = document.getElementById("sortSelect");

// Filter state: "all", "completed", "uncompleted"
let currentFilter = "all";

/* ADD TASK */
form.addEventListener("submit", function(e){
    e.preventDefault();

    const name = document.getElementById("taskName").value.trim();
    const date = document.getElementById("taskDate").value;
    const category = document.getElementById("taskCategory").value;

    if(name === ""){
        alert("Task name cannot be empty!");
        return;
    }

    tasks.push({
        id: Date.now(),
        name,
        date,
        category,
        completed: false
    });

    form.reset();
    saveAndRender();
});

/* RENDER TASKS */
function renderTasks(){
    taskList.innerHTML = "";

    // Filter by search
    let filtered = tasks.filter(t =>
        t.name.toLowerCase().includes(searchBar.value.toLowerCase())
    );

    // Sorting
    if(sortSelect.value === "name"){
        filtered.sort((a,b) => a.name.localeCompare(b.name));
    }
    if(sortSelect.value === "date"){
        filtered.sort((a,b) => new Date(a.date) - new Date(b.date));
    }

    // Apply filter buttons
    if(currentFilter === "completed"){
        filtered = filtered.filter(t => t.completed);
    }
    if(currentFilter === "uncompleted"){
        filtered = filtered.filter(t => !t.completed);
    }

    // Display tasks
    filtered.forEach(task => {
        const div = document.createElement("div");
        div.className = "task" + (task.completed ? " completed" : "");

        div.innerHTML = `
            <div class="left">
                <input type="checkbox" ${task.completed ? "checked":""}
                    onclick="toggleTask(${task.id})">
                <div>
                    <strong>${task.name}</strong>
                    <div style="font-size:12px; color:#555;">
                        ${task.category} • ${task.date || "No date"}
                    </div>
                </div>
            </div>
            <div class="task-actions">
                <button onclick="deleteTask(${task.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        taskList.appendChild(div);
    });

    updateStats();
}

/* TOGGLE COMPLETED */
function toggleTask(id){
    tasks = tasks.map(t =>
        t.id === id ? {...t, completed: !t.completed} : t
    );
    saveAndRender();
}

/* DELETE TASK */
function deleteTask(id){
    tasks = tasks.filter(t => t.id !== id);
    saveAndRender();
}

/* UPDATE STATS */
function updateStats(){
    totalCount.textContent = tasks.length;
    completedCount.textContent = tasks.filter(t => t.completed).length;
    uncompletedCount.textContent = tasks.filter(t => !t.completed).length;
}

/* SEARCH & SORT EVENTS */
searchBar.addEventListener("input", renderTasks);
sortSelect.addEventListener("change", renderTasks);

/* FILTER BUTTONS */
document.getElementById("filterAll").addEventListener("click", () => {
    currentFilter = "all";
    renderTasks();
});
document.getElementById("filterCompleted").addEventListener("click", () => {
    currentFilter = "completed";
    renderTasks();
});
document.getElementById("filterUncompleted").addEventListener("click", () => {
    currentFilter = "uncompleted";
    renderTasks();
});

/* SAVE TASKS & RENDER */
function saveAndRender(){
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
}

// Initial render
renderTasks();
