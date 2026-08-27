const plannerPreviewTasks =
    document.querySelector('#plannerPreviewTasks');

const todayTasks =
    document.querySelector('#todayTasks');

const upcomingTasks =
    document.querySelector('#upcomingTasks');

const welcomeTitle =
    document.querySelector('.topbar h1');

const currentDate =
    document.querySelector('#currentDate');

const jobPreviewApplications =
    document.querySelector('#jobPreviewApplications');

const dailyPreview =
    document.querySelector('#dailyPreview');

const currentGoal =
    document.querySelector('#currentGoal');

const goalProgress =
    document.querySelector('#goalProgress');

const goalProgressBar =
    document.querySelector('#goalProgressBar');


// ============================================================
// DASHBOARD MODULES
// ============================================================

const dashboardPlanner =
    document.querySelector('#dashboardPlanner');

const dashboardJobTracker =
    document.querySelector('#dashboardJobTracker');

const dashboardDailyPlanner =
    document.querySelector('#dashboardDailyPlanner');

const dashboardGoals =
    document.querySelector('#dashboardGoals');


// ============================================================
// UPDATE DATE AND GREETING
// ============================================================

function updateDateAndGreeting() {

    const now =
        new Date();

    const hour =
        now.getHours();

    let greeting;


    if (hour < 12) {

        greeting =
            'Good morning!';

    } else if (hour < 18) {

        greeting =
            'Good afternoon!';

    } else {

        greeting =
            'Good evening!';

    }


    if (welcomeTitle) {

        welcomeTitle.textContent =
            greeting;

    }


    if (currentDate) {

        currentDate.textContent =
            now.toLocaleDateString(
                'en-US',
                {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                }
            );

    }

}


// ============================================================
// APPLY USER SETTINGS
// ============================================================

function applySettings(settings) {

    console.log(
        'Applying settings:',
        settings
    );


    // =========================================================
    // REMOVE OLD + NEW THEME CLASSES
    // =========================================================

    document.body.classList.remove(
        'theme-light',
        'theme-dark',
        'theme-ocean',
        'theme-forest',
        'theme-purple',
        'theme-midnight',

        'light-theme',
        'dark-theme'
    );


    // =========================================================
    // GET THEME
    // =========================================================

    const validThemes = [
        'light',
        'dark',
        'ocean',
        'forest',
        'purple',
        'midnight'
    ];


    const theme =
        validThemes.includes(settings.theme)
            ? settings.theme
            : 'light';


    // =========================================================
    // APPLY THEME
    // =========================================================

    const themeClass =
        `theme-${theme}`;


    document.body.classList.add(
        themeClass
    );


    console.log(
        'Theme applied:',
        themeClass
    );


    // =========================================================
    // RESET CUSTOM BACKGROUND
    // =========================================================

    document.body.classList.remove(
        'custom-background'
    );


    document.body.style.backgroundColor =
        '';

    document.body.style.backgroundImage =
        '';


    // =========================================================
    // BACKGROUND COLOR
    // =========================================================

    if (
        settings.background_type === 'color'
    ) {

        document.body.style.backgroundColor =
            settings.background_color ||
            '#f4f5f7';

    }


    // =========================================================
    // BACKGROUND IMAGE
    // =========================================================

    if (
        settings.background_type === 'image' &&
        settings.background_image
    ) {

        document.body.classList.add(
            'custom-background'
        );


        document.body.style.backgroundImage =
            `url("${settings.background_image}")`;

    }


    // =========================================================
    // MODULE VISIBILITY
    // =========================================================

    if (dashboardPlanner) {

        dashboardPlanner.style.display =
            Number(settings.show_planner) === 1
                ? ''
                : 'none';

    }


    if (dashboardJobTracker) {

        dashboardJobTracker.style.display =
            Number(settings.show_job_tracker) === 1
                ? ''
                : 'none';

    }


    if (dashboardDailyPlanner) {

        dashboardDailyPlanner.style.display =
            Number(settings.show_daily_planner) === 1
                ? ''
                : 'none';

    }


    if (dashboardGoals) {

        dashboardGoals.style.display =
            Number(settings.show_goals) === 1
                ? ''
                : 'none';

    }

}


// ============================================================
// LOAD SETTINGS
// ============================================================

function loadSettings() {

    fetch(
        'http://127.0.0.1:3000/api/settings',
        {
            method: 'GET',
            credentials: 'include'
        }
    )

    .then(response => {

        if (!response.ok) {

            throw new Error(
                'Failed to load settings'
            );

        }

        return response.json();

    })

    .then(settings => {

        console.log(
            'Loaded dashboard settings:',
            settings
        );


        applySettings(
            settings
        );

    })

    .catch(error => {

        console.error(
            'Settings error:',
            error
        );

    });

}


// ============================================================
// LOAD TASKS
// ============================================================

function loadDashboard() {

    fetch(
        'http://127.0.0.1:3000/api/tasks',
        {
            method: 'GET',
            credentials: 'include'
        }
    )

    .then(response => {

        if (!response.ok) {

            throw new Error(
                'Failed to load tasks'
            );

        }

        return response.json();

    })

    .then(result => {

        console.log(
            'Tasks:',
            result
        );


        const todayCount =
            document.querySelector(
                '#todayCount'
            );

        const pendingCount =
            document.querySelector(
                '#pendingCount'
            );

        const completedCount =
            document.querySelector(
                '#completedCount'
            );

        const overdueCount =
            document.querySelector(
                '#overdueCount'
            );


        const completed =
            result.filter(
                task =>
                    task.completed == 1
            );


        const pending =
            result.filter(
                task =>
                    task.completed == 0
            );


        const overdue =
            pending.filter(
                task =>
                    new Date(task.due_date) <
                    new Date()
            );


        const today =
            pending.filter(
                task => {

                    const dueDate =
                        new Date(
                            task.due_date
                        );

                    const now =
                        new Date();


                    return (
                        dueDate.toDateString() ===
                        now.toDateString()
                    );

                }
            );


        if (todayCount) {

            todayCount.textContent =
                today.length;

        }


        if (pendingCount) {

            pendingCount.textContent =
                pending.length;

        }


        if (completedCount) {

            completedCount.textContent =
                completed.length;

        }


        if (overdueCount) {

            overdueCount.textContent =
                overdue.length;

        }


        const plannerTotal =
            document.querySelector(
                '#plannerTotal'
            );

        const plannerPending =
            document.querySelector(
                '#plannerPending'
            );

        const plannerOverdue =
            document.querySelector(
                '#plannerOverdue'
            );


        if (plannerTotal) {

            plannerTotal.textContent =
                result.length;

        }


        if (plannerPending) {

            plannerPending.textContent =
                pending.length;

        }


        if (plannerOverdue) {

            plannerOverdue.textContent =
                overdue.length;

        }


        // ==================================================
        // PLANNER PREVIEW
        // ==================================================

        if (plannerPreviewTasks) {

            plannerPreviewTasks.innerHTML =
                '';


            const previewTasks =
                [...pending]
                    .sort(
                        (a, b) =>
                            new Date(a.due_date) -
                            new Date(b.due_date)
                    )
                    .slice(
                        0,
                        3
                    );


            if (
                previewTasks.length === 0
            ) {

                plannerPreviewTasks.innerHTML = `
                    <div class="planner-empty">
                        No pending tasks
                    </div>
                `;

            } else {

                previewTasks.forEach(
                    task => {

                        const taskElement =
                            document.createElement(
                                'div'
                            );


                        taskElement.classList.add(
                            'planner-task'
                        );


                        taskElement.innerHTML = `

                            <div class="planner-task-info">

                                <div class="planner-task-title">
                                    ${task.title}
                                </div>

                                <div class="planner-task-due">
                                    Due: ${task.due_date}
                                </div>

                            </div>


                            <div class="planner-task-right">

                                <span
                                    class="planner-priority ${task.priority}"
                                >
                                    ${task.priority}
                                </span>

                            </div>

                        `;


                        plannerPreviewTasks.appendChild(
                            taskElement
                        );

                    }
                );

            }

        }


        // ==================================================
        // TODAY'S TASKS
        // ==================================================

        if (todayTasks) {

            todayTasks.innerHTML =
                '';


            if (
                today.length === 0
            ) {

                todayTasks.innerHTML = `
                    <div class="empty-state">
                        No tasks for today
                    </div>
                `;

            } else {

                today.forEach(
                    task => {

                        const taskElement =
                            document.createElement(
                                'div'
                            );


                        taskElement.classList.add(
                            'dashboard-task'
                        );


                        taskElement.innerHTML = `

                            <div class="dashboard-task-header">

                                <div>

                                    <h3>
                                        ${task.title}
                                    </h3>

                                    <p>
                                        Due: ${task.due_date}
                                    </p>

                                </div>


                                <span
                                    class="dashboard-priority ${task.priority}"
                                >
                                    ${task.priority}
                                </span>

                            </div>

                        `;


                        todayTasks.appendChild(
                            taskElement
                        );

                    }
                );

            }

        }


        // ==================================================
        // UPCOMING
        // ==================================================

        if (upcomingTasks) {

            const now =
                new Date();


            const upcoming =
                pending.filter(
                    task =>
                        new Date(task.due_date) >
                        now
                );


            upcomingTasks.innerHTML =
                '';


            if (
                upcoming.length === 0
            ) {

                upcomingTasks.innerHTML = `
                    <div class="empty-state">
                        No upcoming tasks
                    </div>
                `;

            } else {

                [...upcoming]
                    .sort(
                        (a, b) =>
                            new Date(a.due_date) -
                            new Date(b.due_date)
                    )
                    .slice(
                        0,
                        5
                    )
                    .forEach(
                        task => {

                            const taskElement =
                                document.createElement(
                                    'div'
                                );


                            taskElement.classList.add(
                                'upcoming-item'
                            );


                            taskElement.innerHTML = `

                                <div>

                                    <h3>
                                        ${task.title}
                                    </h3>

                                    <span>
                                        Priority:
                                        ${task.priority}
                                    </span>

                                </div>


                                <span>
                                    ${task.due_date}
                                </span>

                            `;


                            upcomingTasks.appendChild(
                                taskElement
                            );

                        }
                    );

            }

        }

    })

    .catch(error => {

        console.error(
            'Task error:',
            error
        );

    });

}


// ============================================================
// LOAD JOBS
// ============================================================

function loadJobStats() {

    fetch(
        'http://127.0.0.1:3000/api/jobs',
        {
            method: 'GET',
            credentials: 'include'
        }
    )

    .then(response => {

        if (!response.ok) {

            throw new Error(
                'Failed to load job applications'
            );

        }

        return response.json();

    })

    .then(result => {

        const interviews =
            result.filter(
                job =>
                    job.status === 'Interview'
            );


        const offers =
            result.filter(
                job =>
                    job.status === 'Offer'
            );


        const applicationCount =
            document.querySelector(
                '#applicationCount'
            );

        const interviewCount =
            document.querySelector(
                '#interviewCount'
            );

        const offerCount =
            document.querySelector(
                '#offerCount'
            );


        if (applicationCount) {

            applicationCount.textContent =
                result.length;

        }


        if (interviewCount) {

            interviewCount.textContent =
                interviews.length;

        }


        if (offerCount) {

            offerCount.textContent =
                offers.length;

        }


        if (!jobPreviewApplications) {
            return;
        }


        jobPreviewApplications.innerHTML =
            '';


        const previewJobs =
            [...result]
                .sort(
                    (a, b) =>
                        new Date(
                            b.application_date
                        ) -
                        new Date(
                            a.application_date
                        )
                )
                .slice(
                    0,
                    3
                );


        if (
            previewJobs.length === 0
        ) {

            jobPreviewApplications.innerHTML = `
                <div class="job-preview-empty">
                    No job applications yet
                </div>
            `;

            return;

        }


        previewJobs.forEach(
            job => {

                const jobElement =
                    document.createElement(
                        'div'
                    );


                jobElement.classList.add(
                    'job-preview-item'
                );


                jobElement.innerHTML = `

                    <div class="job-preview-info">

                        <div class="job-preview-position">
                            ${job.position}
                        </div>

                        <div class="job-preview-company">
                            ${job.company}
                        </div>

                    </div>


                    <div class="job-preview-right">

                        <span class="job-preview-status">
                            ${job.status}
                        </span>

                    </div>

                `;


                jobPreviewApplications.appendChild(
                    jobElement
                );

            }
        );

    })

    .catch(error => {

        console.error(
            'Job error:',
            error
        );

    });

}


// ============================================================
// LOAD DAILY PLANNER
// ============================================================

function loadDailyPlanner() {

    if (!dailyPreview) {
        return;
    }


    fetch(
        'http://127.0.0.1:3000/api/daily-plans',
        {
            method: 'GET',
            credentials: 'include'
        }
    )

    .then(response => {

        if (!response.ok) {

            throw new Error(
                'Failed to load daily planner'
            );

        }

        return response.json();

    })

    .then(result => {

        dailyPreview.innerHTML =
            '';


        const now =
            new Date();


        const todayString =
            now.getFullYear() +
            '-' +
            String(
                now.getMonth() + 1
            ).padStart(2, '0') +
            '-' +
            String(
                now.getDate()
            ).padStart(2, '0');


        const todaySchedules =
            result.filter(
                schedule => {

                    const startDate =
                        schedule.date;

                    const endDate =
                        schedule.end_date ||
                        schedule.date;


                    return (
                        todayString >= startDate &&
                        todayString <= endDate
                    );

                }
            );


        todaySchedules.sort(
            (a, b) =>
                a.start_time.localeCompare(
                    b.start_time
                )
        );


        if (
            todaySchedules.length === 0
        ) {

            dailyPreview.innerHTML = `
                <div class="empty-state">
                    No schedules for today
                </div>
            `;

            return;
        }


        todaySchedules
            .slice(
                0,
                4
            )
            .forEach(
                schedule => {

                    const element =
                        document.createElement(
                            'div'
                        );


                    element.classList.add(
                        'schedule-item'
                    );


                    element.innerHTML = `

                        <span class="schedule-time">
                            ${schedule.start_time}
                        </span>

                        <p class="schedule-title">
                            ${schedule.title}
                        </p>

                    `;


                    dailyPreview.appendChild(
                        element
                    );

                }
            );

    })

    .catch(error => {

        console.error(
            'Daily planner error:',
            error
        );

    });

}


// ============================================================
// LOAD GOALS
// ============================================================

function loadGoals() {

    if (
        !currentGoal ||
        !goalProgress ||
        !goalProgressBar
    ) {

        return;
    }


    const goalMilestones =
        document.querySelector(
            '#goalMilestones'
        );

    const goalDeadline =
        document.querySelector(
            '#goalDeadline'
        );


    fetch(
        'http://127.0.0.1:3000/api/goals',
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

        const activeGoals =
            goals.filter(
                goal =>
                    goal.status === 'active'
            );


        if (
            activeGoals.length === 0
        ) {

            currentGoal.textContent =
                'No active goal';

            goalProgress.textContent =
                '0%';

            goalProgressBar.style.width =
                '0%';


            if (goalMilestones) {

                goalMilestones.textContent =
                    'No milestones';

            }


            if (goalDeadline) {

                goalDeadline.textContent =
                    'No deadline';

            }

            return;
        }


        activeGoals.sort(
            (a, b) => {

                if (
                    !a.deadline &&
                    !b.deadline
                ) {

                    return 0;

                }

                if (!a.deadline) {
                    return 1;
                }

                if (!b.deadline) {
                    return -1;
                }

                return (
                    new Date(a.deadline) -
                    new Date(b.deadline)
                );

            }
        );


        const goal =
            activeGoals[0];


        const progress =
            Number(
                goal.progress
            ) || 0;


        currentGoal.textContent =
            goal.title;

        goalProgress.textContent =
            `${progress}%`;

        goalProgressBar.style.width =
            `${progress}%`;


        if (goalDeadline) {

            goalDeadline.textContent =
                goal.deadline ||
                'No deadline';

        }


        if (!goalMilestones) {
            return;
        }


        return fetch(
            `http://127.0.0.1:3000/api/goals/${goal.id}/milestones`,
            {
                method: 'GET',
                credentials: 'include'
            }
        );

    })

    .then(response => {

        if (!response) {
            return;
        }


        if (!response.ok) {

            throw new Error(
                'Failed to load milestones'
            );

        }


        return response.json();

    })

    .then(milestones => {

        if (
            !milestones ||
            !goalMilestones
        ) {

            return;

        }


        const completed =
            milestones.filter(
                milestone =>
                    milestone.completed == 1
            ).length;


        const total =
            milestones.length;


        if (
            total === 0
        ) {

            goalMilestones.textContent =
                'No milestones';

            return;

        }


        goalMilestones.textContent =
            `${completed} of ${total} milestones completed`;

    })

    .catch(error => {

        console.error(
            'Goal error:',
            error
        );

    });

}


// ============================================================
// INITIAL LOAD
// ============================================================

loadSettings();

loadDashboard();

loadJobStats();

loadDailyPlanner();

loadGoals();