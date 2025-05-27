const Api = 'http://localhost:3000/todos';

const todolist = document.getElementById('todo-list');
const todoForm =document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');


const Filterall = document.getElementById('All');
const FilterInComplete = document.getElementById('InComplete');
const FilterCompleted = document.getElementById('Completed');


let currentFilter ="All" 


// LOAD TODOS WITH FACTH API 

async function loadTodos() {
    
    let url = Api;
    if(currentFilter === "InComplete"){
        url+="?isCompleted=false"
    }

    else if(currentFilter === "Completed" ){
        url+= "?isCompleted=true";
    }

    try{
        const res = await fetch(url);
        const todos = await res.json();
        console.log(todos);
        rendarTodos(todos);
    } catch(error){
        todolist.innerHTML='<li class="text-red-600 text-3xl font-bold align-middle"> Failed to load the Todos.... </li>';



    }
    

}

// Render Todos in the Dom List

function rendarTodos(todos){
    todolist.innerHTML=""
    if(todos.length === 0 ){
        todolist.innerHTML =`<li class="text-gray-500">No Todos Found with the Current Filter</li>`;
        return;
    }
    todos.forEach((todo) => {
        // create li 
        const li = document.createElement("li");
        li.className = "flex items-center justify-center gap-3"
        // create checkbox
        const checkbox = document.createElement("input");
        checkbox.type ="checkbox"
        checkbox.checked = todo.isCompleted;
        checkbox.className ="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600";

        // add Event Listener is checkbox for toggling the is completed

        checkbox.addEventListener("change",()  =>{
            toggleIscompleted(todo.id,checkbox.checked);
        })
        

        // tittle

        const leftDiv = document.createElement("div");
        leftDiv.className="flex items-center gap-3";
        const tittle = document.createElement("span");
        tittle.textContent = todo.title;
        tittle.className= todo.isCompleted ? "line-through text-gray-400":"text-white";

        // delete button
        const delBtn =document.createElement("button");
        delBtn.textContent ="Delete Todo";
        delBtn.className ="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600";

        delBtn.addEventListener("click",() => {
            deleteTodo(todo.id);
        })
        leftDiv.appendChild(checkbox);
        leftDiv.appendChild(tittle);
        

        li.appendChild(leftDiv);
        li.appendChild(delBtn);

        todolist.appendChild(li)



    });
    
}

async function  toggleIscompleted(id,flag) {
    await fetch (`${Api}/${id}`,{
        method :"PATCH",
        body :JSON.stringify({isCompleted:flag}),
        headers:{
            "content-type":"application/json",
        },
    })
    await loadTodos();
}

async function deleteTodo(todoId) {

    await fetch(`${Api}/${todoId}`,{
        method:"DELETE",
    });
    await loadTodos();
    
}

todoForm.addEventListener("submit",async(event) =>{
    event.preventDefault();

    const title  = todoInput.value.trim();
    if (!title) return;

    await fetch(Api,{
        method: "POST",
        body: JSON.stringify({ title: title, isCompleted: false }),
        headers: {
            "Content-Type": "application/json"
          }

    });
    todoInput.value ="";
    await loadTodos();
});


Filterall.addEventListener("click",async() => {
    currentFilter="All";
    setActiveButton();
    await loadTodos();
})
FilterInComplete.addEventListener("click",async() =>{
    currentFilter="InComplete"
        setActiveButton();
        await loadTodos();
})
FilterCompleted.addEventListener("click",async() =>{
    currentFilter="Completed";
    setActiveButton();
     await loadTodos();
})


function setActiveButton () {
    Filterall.classList.toggle("bg-blue-500", currentFilter === "All");
    Filterall.classList.toggle("bg-gray-600", currentFilter !== "All");

    FilterCompleted.classList.toggle("bg-blue-500", currentFilter === "Completed");
    FilterCompleted.classList.toggle("bg-gray-600", currentFilter !== "Completed");

    FilterInComplete.classList.toggle("bg-blue-500", currentFilter === "InComplete");
    FilterInComplete.classList.toggle("bg-gray-600", currentFilter !== "InComplete");
}



setActiveButton();
loadTodos();