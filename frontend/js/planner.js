//DISPLAY THE TASK =========================================================

const searchTask = document.querySelector('#searchTask');
const tasksContainer = document.querySelector('#tasks');
const totalTasks = document.querySelector('#totalTasks');
const pendingCount = document.querySelector('#pendingCount');
const completedCount = document.querySelector('#completedCount');
const overdueCount = document.querySelector('#overdueCount');
const todayCount = document.querySelector('#todayCount');
const upcomingCount = document.querySelector('#upcomingCount');
const cancelEdit = document.querySelector('#cancelEdit');
const sortTasks = document.querySelector('#sortTasks');
const priority = document.querySelector('#priority');
const todayCard = document.querySelector('#todayCard');
const upcomingCard = document.querySelector('#upcomingCard');
const overdueCard = document.querySelector('#overdueCard');
const totalCard = document.querySelector('#totalCard');
const pendingCard = document.querySelector('#pendingCard');
const completedCard = document.querySelector('#completedCard');
const formTitle = document.querySelector('.create-section h1');
const submitButton = document.querySelector('.create-button');
const logout = document.querySelector('#logout');

console.log('Logout element:', logout);

let taskID;
let taskFilter = "all";

searchTask.addEventListener('input', () => {
    displayTask();
})

sortTasks.addEventListener('change', () => {
    console.log(sortTasks.value);
    displayTask();

});




function displayTask() {


    fetch('https://personal-planner-yk5w.onrender.com/api/tasks', {
        method: 'GET',
        credentials: 'include'
    })

    .then(response => response.json())

    .then(result => {

        console.log(result);

        totalTasks.textContent = result.length;

        const completed = result.filter(task => task.completed == 1);
        const pending = result.filter(task => task.completed == 0);
        const overdue = result.filter(task => {
            return task.completed == 0 && new Date(task.due_date) < new Date();
        });

        const today = result.filter(task => {

            const dueDate = new Date(task.due_date);
            const currentDate = new Date();

            return task.completed == 0 &&
                dueDate.toDateString() === currentDate.toDateString();

        });

        const upcoming = result.filter(task => {

            const dueDate = new Date(task.due_date);
            const currentDate = new Date();

            return task.completed == 0 &&
                dueDate > currentDate;

        });

        

        completedCount.textContent = completed.length;
        pendingCount.textContent = pending.length;
        overdueCount.textContent = overdue.length;
        todayCount.textContent = today.length;
        upcomingCount.textContent = upcoming.length;    

        tasksContainer.innerHTML = '';
        let filteredTasks = result;

        if (taskFilter == 'active'){
            filteredTasks = result.filter(task => task.completed == 0);
        }

        if (taskFilter == 'completed') {
            filteredTasks = result.filter(task => task.completed == 1);
        }

        if (taskFilter == 'today') {
            filteredTasks = result.filter(task => {

                const dueDate = new Date(task.due_date);
                const currentDate = new Date();

                return task.completed == 0 &&
                    dueDate.toDateString() === currentDate.toDateString();

            });
        }

        if (taskFilter == 'upcoming') {
            filteredTasks = result.filter(task => {

                const dueDate = new Date(task.due_date);
                const currentDate = new Date();

                return task.completed == 0 &&
                    dueDate > currentDate;

            });
        }

        if (taskFilter == 'overdue') {
            filteredTasks = result.filter(task => {

                return task.completed == 0 &&
                    new Date(task.due_date) < new Date();

            });
        }
            const searchValue = searchTask.value.toLowerCase();
        
         filteredTasks = filteredTasks.filter(task =>
            task.title.toLowerCase().includes(searchValue)
        );

        const sortValue = sortTasks.value;

        console.log(sortValue);     

        if (sortValue === 'dueSoonest') {
            filteredTasks.sort((a, b) => {
                return new Date(a.due_date) - new Date(b.due_date);
            });
        }

        if (sortValue === 'dueLatest') {
            filteredTasks.sort((a, b) => {
                return new Date(b.due_date) - new Date(a.due_date)
            });
        }

        if (sortValue === 'newest') {
            filteredTasks.sort((a, b) => {
                return new Date(b.created_at) - new Date(a.created_at);
            });
        }

        if (sortValue === 'oldest') {
            filteredTasks.sort((a, b) => {
                return new Date(a.created_at) - new Date(b.created_at);
            });
        }

        if (sortValue === 'priorityHigh') {
            const priorityOrder = {
                high: 3,
                medium: 2,
                low: 1
            };

            filteredTasks.sort((a, b) => {
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            });
        }

        if (sortValue === 'priorityLow') {
            const priorityOrder = {
                high: 3,
                medium: 2,
                low: 1
            };

            filteredTasks.sort((a, b) => {
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            });
        }

        filteredTasks.forEach(task => {
            const taskElement = document.createElement('div');
            let dueText = `Due: ${task.due_date}`;
            console.log(task.created_at);

            const isOverdue =
                task.completed == 0 &&
                new Date(task.due_date) < new Date();

            const isCompleted = task.completed == 1;

            if (task.completed == 0 && new Date(task.due_date) < new Date()) {
                dueText = `⚠ OVERDUE — Due: ${task.due_date}`;
            }
            
            taskElement.innerHTML = `
                 <div class="task-card ${isOverdue ? 'overdue' : ''} ${isCompleted ? 'completed' : ''}">

                <div class="task-header">
                    <h3>${task.title}</h3>
                    <span class="priority ${task.priority}">
                        ${task.priority}
                    </span>
                </div>

                <p class="task-description">
                    ${task.description}
                </p>

                <p class="task-due">
                    ${dueText}
                </p>

                ${
                    task.completed == 1
                    ? '<p class="completed-text">✓ Completed</p>'
                    : ''
                }

                <div class="task-actions">

                    <button class="editButton">
                        Edit
                    </button>

                    <button class="deleteButton">
                        Delete
                    </button>

                    ${
                        task.completed == 0
                        ? '<button class="completeButton">Complete</button>'
                        : ''
                    }

                </div>

            </div>
            `;



            
            const completeButton = taskElement.querySelector('.completeButton');

            if (completeButton) {

                completeButton.addEventListener('click', () => {

                    fetch(`https://personal-planner-yk5w.onrender.com/api/tasks/${task.id}/complete`, {
                        method: 'PUT',
                        credentials: 'include'
                    })

                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Something went wrong');
                        }

                        return response.text();
                    })

                    .then(result => {
                        displayTask();
                    })

                     .catch(error => {
                        console.log(error);
                    });

                });

            }

 //--------------------------------------------------------------------------------------------           
            
            const editButton = taskElement.querySelector('.editButton');

            editButton.addEventListener('click', () => {

                const title = document.querySelector('#title');
                const description = document.querySelector('#description');
                const dueDate = document.querySelector('#dueDate');

                taskID = task.id;

                title.value = task.title;
                description.value = task.description;
                dueDate.value = task.due_date;
                priority.value = task.priority;

                formTitle.textContent = 'Edit Task';
                submitButton.textContent = 'Update Task';

                cancelEdit.style.display = 'block';

            });

           
           



//--------------------------------------------------      

            const deleteButton = taskElement.querySelector('.deleteButton');
                deleteButton.addEventListener('click', () => {

                    const confirmDelete = confirm(
                        `Are you sure you want to delete "${task.title}"?`
                    );

                    if (!confirmDelete) {
                        return;
                    }

                    fetch(`https://personal-planner-yk5w.onrender.com/api/tasks/${task.id}`, {
                        method: 'DELETE', 
                        credentials: 'include'
                    })

                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Something went wrong');
                        }

                        return response.text();
                    })

                    .then(result => {
                        displayTask();
                    })

                    .catch(error => {
                        console.log(error);
                    });

                });



             tasksContainer.appendChild(taskElement);
        });

    });
}

displayTask();

    cancelEdit.addEventListener('click', () => {

        taskID = undefined;

        cancelEdit.style.display = 'none';

        formTitle.textContent = 'Create Task';
        submitButton.textContent = 'Create Task';

        document.querySelector('#title').value = '';
        document.querySelector('#description').value = '';
        document.querySelector('#dueDate').value = '';

        priority.value = 'medium';

    });

    const allTasks = document.querySelector('#allTasks');
    const activeTasks = document.querySelector('#pendingTasks');
    const completedTasks = document.querySelector('#completedTasks');

    allTasks.addEventListener('click', () => {
    taskFilter = 'all';
    displayTask();
    });

    activeTasks.addEventListener('click', () => {
        taskFilter = 'active';
        displayTask();
    });

    completedTasks.addEventListener('click', () => {
        taskFilter = 'completed';
        displayTask();
    });

    todayCard.addEventListener('click', () => {
        taskFilter = 'today';
        displayTask();
    });

    upcomingCard.addEventListener('click', () => {
        taskFilter = 'upcoming';
        displayTask();
    });

    overdueCard.addEventListener('click', () => {
        taskFilter = 'overdue';
        displayTask();
    });

    totalCard.addEventListener('click', () => {
        taskFilter = 'all';
        displayTask();
    });

    pendingCard.addEventListener('click', () => {
        taskFilter = 'active';
        displayTask();
    });

    completedCard.addEventListener('click', () => {
        taskFilter = 'completed';
        displayTask();
    });

    
         
//===================================================================================

const taskForm = document.querySelector('#taskForm');

taskForm.addEventListener('submit', (event) => {

    event.preventDefault();

    const title = document.querySelector('#title').value;
    const description = document.querySelector('#description').value;
    const dueDate = document.querySelector('#dueDate').value;
    const taskPriority = priority.value;

    console.log(taskPriority);

    if (title.trim() === '') {
    alert('Title cannot be empty');
    return;
    }

    if (description.trim() === '') {
        alert('Description cannot be empty');
        return;
    }

    if (dueDate === '') {
        alert('Due date is required');
        return;
    }


    if (taskID) {
     fetch(`https://personal-planner-yk5w.onrender.com/api/tasks/${taskID}`, {
        method: 'PUT',
        credentials: 'include',

        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({
            title: title,
            description: description,
            dueDate: dueDate,
            priority: taskPriority
        })
    })

    .then(response => {
                if (!response.ok) {
                    throw new Error('Something went wrong');
                }

                return response.text();
            })
            .then(result => {
                console.log(result);
                alert(result);

                taskID = undefined;

                formTitle.textContent = 'Create Task';
                submitButton.textContent = 'Create Task';

                document.querySelector('#title').value = '';
                document.querySelector('#description').value = '';
                document.querySelector('#dueDate').value = '';

                cancelEdit.style.display = 'none';

                displayTask();
            })
            .catch(error => {
                console.log(error);
            });

    } else {
            fetch('https://personal-planner-yk5w.onrender.com/api/tasks', {
            method: 'POST',
            credentials: 'include',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                title: title,
                description: description,
                dueDate: dueDate,
                priority: taskPriority
            })
        })

        .then(response => {
                if (!response.ok) {
                    throw new Error('Something went wrong');
                }

                return response.text();
            })
            .then(result => {
                console.log(result);
                alert(result);
                taskID = undefined;
                displayTask();
                cancelEdit.style.display = 'none';
            })
            .catch(error => {
                console.log(error);
            });
    }

});

logout.addEventListener('click', () => {

    console.log('LOGOUT BUTTON CLICKED');

    fetch('https://personal-planner-yk5w.onrender.com/api/users/logout', {
        method: 'POST',
        credentials: 'include'
    })

    .then(response => {

        console.log('Logout response:', response.status);

        if (!response.ok) {
            throw new Error('Logout failed');
        }

        return response.text();

    })

    .then(result => {

        console.log('Logout result:', result);

        window.location.href = '/login.html';

    })

    .catch(error => {
        console.error('LOGOUT ERROR:', error);
    });

});