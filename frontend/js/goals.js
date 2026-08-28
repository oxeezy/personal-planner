const goalForm =
    document.querySelector('#goalForm');

const goalsList =
    document.querySelector('#goalsList');

const addGoalButton =
    document.querySelector('#addGoalButton');

const cancelGoalButton =
    document.querySelector('#cancelGoal');

const formTitle =
    document.querySelector('#formTitle');

const submitGoal =
    document.querySelector('#submitGoal');


let goalID = null;


// ======================================================
// SHOW ADD GOAL FORM
// ======================================================

addGoalButton.addEventListener('click', () => {

    resetGoalForm();

    document.querySelector(
        '#goalFormCard'
    ).scrollIntoView({
        behavior: 'smooth'
    });

});


// ======================================================
// LOAD GOALS
// ======================================================

function loadGoals() {

    fetch(
        'https://personal-planner-yk5w.onrender.com/api/goals',
        {
            method: 'GET',
            credentials: 'include'
        }
    )

    .then(response => {

        if (!response.ok) {

            throw new Error(
                'Failed to load goals'
            );

        }

        return response.json();

    })

    .then(goals => {

        console.log(
            'Goals:',
            goals
        );


        goalsList.innerHTML = '';


        if (goals.length === 0) {

            goalsList.innerHTML = `
                <div class="empty-state">
                    No goals yet.
                </div>
            `;

            return;

        }


        goals.forEach(goal => {

            renderGoal(goal);

        });

    })

    .catch(error => {

        console.error(error);


        goalsList.innerHTML = `
            <div class="empty-state">
                Unable to load goals.
            </div>
        `;

    });

}


// ======================================================
// RENDER GOAL
// ======================================================

function renderGoal(goal) {

    const goalElement =
        document.createElement('div');


    goalElement.classList.add(
        'goal-card'
    );


    goalElement.innerHTML = `

        <div class="goal-card-header">

            <div class="goal-title">

                <h3>
                    ${goal.title}
                </h3>


                ${
                    goal.description
                    ? `
                        <p>
                            ${goal.description}
                        </p>
                    `
                    : ''
                }

            </div>


            <span class="goal-category">
                ${goal.category}
            </span>

        </div>


        <!-- ==============================================
             PROGRESS
        =============================================== -->

        <div class="goal-progress-section">

            <div class="goal-progress-header">

                <span>
                    Progress
                </span>

                <strong class="goal-progress-value">
                    ${goal.progress || 0}%
                </strong>

            </div>


            <div class="progress-bar">

                <div
                    class="progress-fill"
                    style="width: ${goal.progress || 0}%"
                ></div>

            </div>

        </div>


        <!-- ==============================================
             META
        =============================================== -->

        <div class="goal-meta">

            <span>
                Deadline:
                ${goal.deadline || 'No deadline'}
            </span>


            <span>
                Status:
                ${goal.status}
            </span>

        </div>


        <!-- ==============================================
             MILESTONES
        =============================================== -->

        <div class="milestone-section">


            <div class="milestone-header">

                <h4>
                    Milestones
                </h4>


                <button
                    type="button"
                    class="add-milestone-button"
                >
                    + Add
                </button>

            </div>


            <div
                class="milestone-form"
                style="display: none;"
            >

                <input
                    type="text"
                    class="milestone-input"
                    placeholder="e.g. Learn Express"
                >


                <button
                    type="button"
                    class="save-milestone-button"
                >
                    Add
                </button>


                <button
                    type="button"
                    class="cancel-milestone-button"
                >
                    Cancel
                </button>

            </div>


            <div class="milestone-list">

                <div class="milestone-empty">
                    Loading milestones...
                </div>

            </div>

        </div>


        <!-- ==============================================
             GOAL ACTIONS
        =============================================== -->

        <div class="goal-actions">

            <button
                type="button"
                class="edit-goal"
            >
                Edit
            </button>


            <button
                type="button"
                class="delete-goal"
            >
                Delete
            </button>

        </div>

    `;


    goalsList.appendChild(
        goalElement
    );


    // ==================================================
    // EDIT GOAL
    // ==================================================

    const editButton =
        goalElement.querySelector(
            '.edit-goal'
        );


    editButton.addEventListener(
        'click',
        () => {

            goalID =
                goal.id;


            document.querySelector(
                '#goalTitle'
            ).value =
                goal.title;


            document.querySelector(
                '#goalDescription'
            ).value =
                goal.description || '';


            document.querySelector(
                '#goalCategory'
            ).value =
                goal.category;


            document.querySelector(
                '#goalDeadline'
            ).value =
                goal.deadline || '';


            document.querySelector(
                '#goalProgress'
            ).value =
                goal.progress || 0;


            document.querySelector(
                '#goalStatus'
            ).value =
                goal.status;


            formTitle.textContent =
                'Edit Goal';


            submitGoal.textContent =
                'Update Goal';


            cancelGoalButton.style.display =
                'inline-block';


            document.querySelector(
                '#goalFormCard'
            ).scrollIntoView({
                behavior: 'smooth'
            });

        }
    );


    // ==================================================
    // DELETE GOAL
    // ==================================================

    const deleteButton =
        goalElement.querySelector(
            '.delete-goal'
        );


    deleteButton.addEventListener(
        'click',
        () => {

            const confirmDelete =
                confirm(
                    `Are you sure you want to delete "${goal.title}"?`
                );


            if (!confirmDelete) {
                return;
            }


            fetch(
                `https://personal-planner-yk5w.onrender.com/api/goals/${goal.id}`,
                {
                    method: 'DELETE',
                    credentials: 'include'
                }
            )

            .then(response => {

                if (!response.ok) {

                    throw new Error(
                        'Goal deletion failed'
                    );

                }

                return response.text();

            })

            .then(result => {

                alert(result);

                loadGoals();

            })

            .catch(error => {

                console.error(error);

                alert(
                    'Unable to delete goal'
                );

            });

        }
    );


    // ==================================================
    // MILESTONE ELEMENTS
    // ==================================================

    const addMilestoneButton =
        goalElement.querySelector(
            '.add-milestone-button'
        );


    const milestoneForm =
        goalElement.querySelector(
            '.milestone-form'
        );


    const milestoneInput =
        goalElement.querySelector(
            '.milestone-input'
        );


    const saveMilestoneButton =
        goalElement.querySelector(
            '.save-milestone-button'
        );


    const cancelMilestoneButton =
        goalElement.querySelector(
            '.cancel-milestone-button'
        );


    // ==================================================
    // SHOW MILESTONE FORM
    // ==================================================

    addMilestoneButton.addEventListener(
        'click',
        () => {

            milestoneForm.style.display =
                'flex';

            milestoneInput.focus();

        }
    );


    // ==================================================
    // CANCEL MILESTONE
    // ==================================================

    cancelMilestoneButton.addEventListener(
        'click',
        () => {

            milestoneInput.value = '';

            milestoneForm.style.display =
                'none';

        }
    );


    // ==================================================
    // ADD MILESTONE
    // ==================================================

    saveMilestoneButton.addEventListener(
        'click',
        () => {

            const title =
                milestoneInput.value.trim();


            if (!title) {

                alert(
                    'Milestone title is required'
                );

                return;

            }


            fetch(
                `https://personal-planner-yk5w.onrender.com/api/goals/${goal.id}/milestones`,
                {
                    method: 'POST',

                    credentials: 'include',

                    headers: {
                        'Content-Type':
                            'application/json'
                    },

                    body: JSON.stringify({
                        title: title
                    })
                }
            )

            .then(response => {

                if (!response.ok) {

                    throw new Error(
                        'Milestone creation failed'
                    );

                }

                return response.text();

            })

            .then(result => {

                console.log(result);


                milestoneInput.value = '';

                milestoneForm.style.display =
                    'none';


                loadMilestones(
                    goal.id,
                    goalElement
                );

            })

            .catch(error => {

                console.error(error);

                alert(
                    'Unable to add milestone'
                );

            });

        }
    );


    // ==================================================
    // LOAD MILESTONES
    // ==================================================

    loadMilestones(
        goal.id,
        goalElement
    );

}


// ======================================================
// LOAD MILESTONES
// ======================================================

function loadMilestones(
    goalId,
    goalElement
) {

    fetch(
        `https://personal-planner-yk5w.onrender.com/api/goals/${goalId}/milestones`,
        {
            method: 'GET',
            credentials: 'include'
        }
    )

    .then(response => {

        if (!response.ok) {

            throw new Error(
                'Failed to load milestones'
            );

        }

        return response.json();

    })

    .then(milestones => {

        console.log(
            `Milestones for goal ${goalId}:`,
            milestones
        );


        const milestoneList =
            goalElement.querySelector(
                '.milestone-list'
            );


        milestoneList.innerHTML = '';


        // ==================================================
        // NO MILESTONES
        // ==================================================

        if (
            milestones.length === 0
        ) {

            milestoneList.innerHTML = `
                <div class="milestone-empty">
                    No milestones yet.
                </div>
            `;

            return;

        }


        // ==================================================
        // DISPLAY MILESTONES
        // ==================================================

        milestones.forEach(
            milestone => {

                const milestoneElement =
                    document.createElement('div');


                milestoneElement.classList.add(
                    'milestone-item'
                );


                milestoneElement.innerHTML = `

                    <div class="milestone-main">

                        <input
                            type="checkbox"
                            class="milestone-checkbox"
                            ${
                                milestone.completed == 1
                                ? 'checked'
                                : ''
                            }
                        >


                        <span class="milestone-title">

                            ${milestone.title}

                        </span>

                    </div>


                    <div class="milestone-actions">

                        <button
                            type="button"
                            class="edit-milestone"
                        >
                            Edit
                        </button>


                        <button
                            type="button"
                            class="delete-milestone"
                        >
                            Delete
                        </button>

                    </div>

                `;


                milestoneList.appendChild(
                    milestoneElement
                );


                // ==================================================
                // TOGGLE
                // ==================================================

                const checkbox =
                    milestoneElement.querySelector(
                        '.milestone-checkbox'
                    );


                checkbox.addEventListener(
                    'change',
                    () => {

                        toggleMilestone(
                            goalId,
                            milestone.id,
                            checkbox.checked,
                            goalElement
                        );

                    }
                );


                // ==================================================
                // EDIT MILESTONE
                // ==================================================

                const editMilestoneButton =
                    milestoneElement.querySelector(
                        '.edit-milestone'
                    );


                editMilestoneButton.addEventListener(
                    'click',
                    () => {

                        const newTitle =
                            prompt(
                                'Edit milestone:',
                                milestone.title
                            );


                        if (
                            newTitle === null
                        ) {

                            return;

                        }


                        const trimmedTitle =
                            newTitle.trim();


                        if (
                            trimmedTitle === ''
                        ) {

                            alert(
                                'Milestone title cannot be empty'
                            );

                            return;

                        }


                        fetch(
                            `https://personal-planner-yk5w.onrender.com/api/goals/${goalId}/milestones/${milestone.id}`,
                            {
                                method: 'PATCH',

                                credentials: 'include',

                                headers: {
                                    'Content-Type':
                                        'application/json'
                                },

                                body: JSON.stringify({
                                    title:
                                        trimmedTitle
                                })
                            }
                        )

                        .then(response => {

                            if (!response.ok) {

                                throw new Error(
                                    'Milestone update failed'
                                );

                            }

                            return response.text();

                        })

                        .then(result => {

                            console.log(result);

                            loadMilestones(
                                goalId,
                                goalElement
                            );

                        })

                        .catch(error => {

                            console.error(error);

                            alert(
                                'Unable to update milestone'
                            );

                        });

                    }
                );


                // ==================================================
                // DELETE MILESTONE
                // ==================================================

                const deleteMilestoneButton =
                    milestoneElement.querySelector(
                        '.delete-milestone'
                    );


                deleteMilestoneButton.addEventListener(
                    'click',
                    () => {

                        const confirmDelete =
                            confirm(
                                `Are you sure you want to delete "${milestone.title}"?`
                            );


                        if (
                            !confirmDelete
                        ) {

                            return;

                        }


                        fetch(
                            `https://personal-planner-yk5w.onrender.com/api/goals/${goalId}/milestones/${milestone.id}`,
                            {
                                method: 'DELETE',
                                credentials: 'include'
                            }
                        )

                        .then(response => {

                            if (!response.ok) {

                                throw new Error(
                                    'Milestone deletion failed'
                                );

                            }

                            return response.text();

                        })

                        .then(result => {

                            console.log(result);

                            loadMilestones(
                                goalId,
                                goalElement
                            );

                        })

                        .catch(error => {

                            console.error(error);

                            alert(
                                'Unable to delete milestone'
                            );

                        });

                    }
                );

            }
        );

    })

    .catch(error => {

        console.error(error);


        const milestoneList =
            goalElement.querySelector(
                '.milestone-list'
            );


        milestoneList.innerHTML = `
            <div class="milestone-empty">
                Unable to load milestones.
            </div>
        `;

    });

}


// ======================================================
// TOGGLE MILESTONE
// ======================================================

function toggleMilestone(
    goalId,
    milestoneId,
    completed,
    goalElement
) {

    // ==================================================
    // UPDATE MILESTONE
    // ==================================================

    fetch(
        `https://personal-planner-yk5w.onrender.com/api/goals/${goalId}/milestones/${milestoneId}`,
        {
            method: 'PUT',

            credentials: 'include',

            headers: {
                'Content-Type':
                    'application/json'
            },

            body: JSON.stringify({

                completed:
                    completed

            })
        }
    )

    .then(response => {

        if (!response.ok) {

            throw new Error(
                'Milestone update failed'
            );

        }

        return response.text();

    })

    .then(result => {

        console.log(result);


        // ==================================================
        // GET UPDATED MILESTONES
        // ==================================================

        return fetch(
            `https://personal-planner-yk5w.onrender.com/api/goals/${goalId}/milestones`,
            {
                method: 'GET',
                credentials: 'include'
            }
        );

    })

    .then(response => {

        if (!response.ok) {

            throw new Error(
                'Failed to reload milestones'
            );

        }

        return response.json();

    })

    .then(milestones => {

        // ==================================================
        // CALCULATE PROGRESS
        // ==================================================

        const total =
            milestones.length;


        const completedCount =
            milestones.filter(
                milestone =>
                    milestone.completed == 1
            ).length;


        let progress = 0;


        if (
            total > 0
        ) {

            progress =
                Math.round(
                    (
                        completedCount /
                        total
                    ) * 100
                );

        }


        console.log(
            `Progress: ${completedCount}/${total} = ${progress}%`
        );


        // ==================================================
        // UPDATE GOAL PROGRESS
        // ==================================================

        return fetch(
            `https://personal-planner-yk5w.onrender.com/api/goals/${goalId}/progress`,
            {
                method: 'PUT',

                credentials: 'include',

                headers: {
                    'Content-Type':
                        'application/json'
                },

                body: JSON.stringify({

                    progress:
                        progress

                })

            }
        );

    })

    .then(response => {

        if (!response.ok) {

            throw new Error(
                'Goal progress update failed'
            );

        }

        return response.text();

    })

    .then(result => {

        console.log(result);


        // ==================================================
        // RELOAD GOALS
        // ==================================================

        loadGoals();

    })

    .catch(error => {

        console.error(error);

        alert(
            'Unable to update milestone'
        );

    });

}


// ======================================================
// CREATE / UPDATE GOAL
// ======================================================

goalForm.addEventListener(
    'submit',
    event => {

        event.preventDefault();


        const title =
            document.querySelector(
                '#goalTitle'
            ).value.trim();


        const description =
            document.querySelector(
                '#goalDescription'
            ).value.trim();


        const category =
            document.querySelector(
                '#goalCategory'
            ).value;


        const deadline =
            document.querySelector(
                '#goalDeadline'
            ).value;


        const progress =
            Number(
                document.querySelector(
                    '#goalProgress'
                ).value
            );


        const status =
            document.querySelector(
                '#goalStatus'
            ).value;


        // ==================================================
        // VALIDATION
        // ==================================================

        if (
            title === ''
        ) {

            alert(
                'Goal title is required'
            );

            return;

        }


        if (
            progress < 0 ||
            progress > 100
        ) {

            alert(
                'Progress must be between 0 and 100'
            );

            return;

        }


        // ==================================================
        // DETERMINE REQUEST
        // ==================================================

        let url =
            'https://personal-planner-yk5w.onrender.com/api/goals';

        let method =
            'POST';


        if (
            goalID
        ) {

            url =
                `https://personal-planner-yk5w.onrender.com/api/goals/${goalID}`;

            method =
                'PUT';

        }


        // ==================================================
        // SAVE GOAL
        // ==================================================

        fetch(
            url,
            {

                method:
                    method,

                credentials:
                    'include',

                headers: {

                    'Content-Type':
                        'application/json'

                },

                body: JSON.stringify({

                    title:
                        title,

                    description:
                        description || null,

                    category:
                        category,

                    deadline:
                        deadline || null,

                    progress:
                        progress,

                    status:
                        status

                })

            }
        )

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    goalID
                        ? 'Goal update failed'
                        : 'Goal creation failed'
                );

            }

            return response.text();

        })

        .then(result => {

            alert(result);

            resetGoalForm();

            loadGoals();

        })

        .catch(error => {

            console.error(error);

            alert(
                'Unable to save goal'
            );

        });

    }
);


// ======================================================
// RESET GOAL FORM
// ======================================================

function resetGoalForm() {

    goalID = null;

    goalForm.reset();


    document.querySelector(
        '#goalProgress'
    ).value = 0;


    document.querySelector(
        '#goalCategory'
    ).value =
        'learning';


    document.querySelector(
        '#goalStatus'
    ).value =
        'active';


    formTitle.textContent =
        'Add Goal';


    submitGoal.textContent =
        'Add Goal';


    cancelGoalButton.style.display =
        'none';

}


// ======================================================
// CANCEL GOAL EDIT
// ======================================================

cancelGoalButton.addEventListener(
    'click',
    () => {

        resetGoalForm();

    }
);


// ======================================================
// INITIAL LOAD
// ======================================================

loadGoals();