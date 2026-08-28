// ============================================================
// JOB TRACKER
// ============================================================


// ============================================================
// DOM ELEMENTS
// ============================================================

const jobForm =
    document.querySelector('#jobForm');

const searchJob =
    document.querySelector('#searchJob');

const sortJobs =
    document.querySelector('#sortJobs');

const allJobs =
    document.querySelector('#allJobs');

const appliedJobs =
    document.querySelector('#appliedJobs');

const reviewJobs =
    document.querySelector('#reviewJobs');

const interviewJobs =
    document.querySelector('#interviewJobs');

const offerJobs =
    document.querySelector('#offerJobs');

const rejectedJobs =
    document.querySelector('#rejectedJobs');

const jobsContainer =
    document.querySelector('#jobs');

const formTitle =
    document.querySelector('.job-form-card h2');

const submitButton =
    document.querySelector('.create-button');

const cancelEdit =
    document.querySelector('#cancelEdit');


// ============================================================
// STATE
// ============================================================

let jobFilter =
    'all';

let jobID =
    null;


// ============================================================
// HELPERS
// ============================================================

function escapeHtml(
    value
) {

    return String(
        value ?? ''
    )

        .replace(
            /&/g,
            '&amp;'
        )

        .replace(
            /</g,
            '&lt;'
        )

        .replace(
            />/g,
            '&gt;'
        )

        .replace(
            /"/g,
            '&quot;'
        )

        .replace(
            /'/g,
            '&#039;'
        );

}


function formatDate(
    dateString
) {

    if (!dateString) {

        return '—';

    }


    const date =
        new Date(
            `${dateString}T00:00:00`
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return dateString;

    }


    return date.toLocaleDateString(
        'en-US',
        {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }
    );

}


function formatTime(
    timeString
) {

    if (!timeString) {

        return '—';

    }


    const parts =
        String(timeString)
            .split(':');


    if (
        parts.length < 2
    ) {

        return timeString;

    }


    let hour =
        Number(
            parts[0]
        );


    const minute =
        parts[1];


    const suffix =
        hour >= 12
            ? 'PM'
            : 'AM';


    hour =
        hour % 12 ||
        12;


    return `${hour}:${minute} ${suffix}`;

}


function getTodayString() {

    const today =
        new Date();


    return (
        today.getFullYear() +
        '-' +
        String(
            today.getMonth() + 1
        ).padStart(
            2,
            '0'
        ) +
        '-' +
        String(
            today.getDate()
        ).padStart(
            2,
            '0'
        )
    );

}


function daysBetween(
    firstDate,
    secondDate
) {

    const first =
        new Date(
            `${firstDate}T00:00:00`
        );


    const second =
        new Date(
            `${secondDate}T00:00:00`
        );


    return Math.round(
        (
            second - first
        ) /
        86400000
    );

}


// ============================================================
// FORM RESET
// ============================================================

function resetForm() {

    jobID =
        null;


    jobForm.reset();


    document.querySelector(
        '#status'
    ).value =
        'Applied';


    document.querySelector(
        '#priority'
    ).value =
        'medium';


    document.querySelector(
        '#followUpStatus'
    ).value =
        'Pending';


    formTitle.textContent =
        'Add Job Application';


    submitButton.textContent =
        'Add Application';


    cancelEdit.style.display =
        'none';

}


// ============================================================
// CREATE / UPDATE
// ============================================================

jobForm.addEventListener(
    'submit',
    async event => {

        event.preventDefault();


        const company =
            document.querySelector(
                '#company'
            ).value.trim();


        const position =
            document.querySelector(
                '#position'
            ).value.trim();


        const applicationDate =
            document.querySelector(
                '#applicationDate'
            ).value;


        const status =
            document.querySelector(
                '#status'
            ).value;


        const priority =
            document.querySelector(
                '#priority'
            ).value;


        const interviewDate =
            document.querySelector(
                '#interviewDate'
            ).value;


        const interviewTime =
            document.querySelector(
                '#interviewTime'
            ).value;


        const interviewNotes =
            document.querySelector(
                '#interviewNotes'
            ).value.trim();


        const jobUrl =
            document.querySelector(
                '#jobUrl'
            ).value.trim();


        const notes =
            document.querySelector(
                '#notes'
            ).value.trim();


        const followUpDate =
            document.querySelector(
                '#followUpDate'
            ).value;


        const followUpStatus =
            document.querySelector(
                '#followUpStatus'
            ).value;


        const followUpNotes =
            document.querySelector(
                '#followUpNotes'
            ).value.trim();


        // ========================================================
        // VALIDATION
        // ========================================================

        if (!company) {

            alert(
                'Company cannot be empty.'
            );

            return;

        }


        if (!position) {

            alert(
                'Position cannot be empty.'
            );

            return;

        }


        if (!applicationDate) {

            alert(
                'Application date is required.'
            );

            return;

        }


        if (
            interviewTime &&
            !interviewDate
        ) {

            alert(
                'Please select an interview date when using an interview time.'
            );

            return;

        }


        if (
            interviewNotes &&
            !interviewDate
        ) {

            alert(
                'Please select an interview date when using interview notes.'
            );

            return;

        }


        if (
            followUpDate &&
            followUpDate < applicationDate
        ) {

            alert(
                'Follow-up date cannot be before the application date.'
            );

            return;

        }


        if (
            followUpStatus === 'Completed' &&
            !followUpDate
        ) {

            alert(
                'Please select a follow-up date before marking follow-up as completed.'
            );

            return;

        }


        const payload = {

            company,

            position,

            applicationDate,

            status,

            priority,

            interviewDate:
                interviewDate ||
                null,

            interviewTime:
                interviewTime ||
                null,

            interviewNotes:
                interviewNotes ||
                null,

            jobUrl:
                jobUrl ||
                null,

            notes:
                notes ||
                null,

            followUpDate:
                followUpDate ||
                null,

            followUpStatus,

            followUpNotes:
                followUpNotes ||
                null

        };


        const url =
            jobID
                ? `https://personal-planner-yk5w.onrender.com/api/jobs/${jobID}`
                : 'https://personal-planner-yk5w.onrender.com/api/jobs';


        const method =
            jobID
                ? 'PUT'
                : 'POST';


        try {

            const response =
                await fetch(
                    url,
                    {
                        method,

                        credentials:
                            'include',

                        headers: {

                            'Content-Type':
                                'application/json'

                        },

                        body:
                            JSON.stringify(
                                payload
                            )

                    }
                );


            const result =
                await response.text();


            if (!response.ok) {

                throw new Error(
                    result ||
                    'Unable to save job application.'
                );

            }


            alert(
                result
            );


            resetForm();


            await displayJobs();

        } catch (
            error
        ) {

            console.error(
                'Job save error:',
                error
            );


            alert(
                error.message
            );

        }

    }
);


// ============================================================
// DISPLAY JOB APPLICATIONS
// ============================================================

async function displayJobs() {

    try {

        const response =
            await fetch(
                'https://personal-planner-yk5w.onrender.com/api/jobs',
                {
                    method: 'GET',
                    credentials: 'include'
                }
            );


        if (!response.ok) {

            throw new Error(
                'Failed to load job applications.'
            );

        }


        const result =
            await response.json();


        // ========================================================
        // STATISTICS
        // ========================================================

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


        const rejectedCount =
            document.querySelector(
                '#rejectedCount'
            );


        const interviews =
            result.filter(
                job =>
                    job.status ===
                    'Interview'
            );


        const offers =
            result.filter(
                job =>
                    job.status ===
                    'Offer'
            );


        const rejected =
            result.filter(
                job =>
                    job.status ===
                    'Rejected'
            );


        applicationCount.textContent =
            result.length;


        interviewCount.textContent =
            interviews.length;


        offerCount.textContent =
            offers.length;


        rejectedCount.textContent =
            rejected.length;


        // ========================================================
        // SEARCH
        // ========================================================

        const searchValue =
            searchJob.value
                .trim()
                .toLowerCase();


        let filteredJobs =
            [...result];


        // ========================================================
        // STATUS FILTER
        // ========================================================

        if (
            jobFilter ===
            'applied'
        ) {

            filteredJobs =
                result.filter(
                    job =>
                        job.status ===
                        'Applied'
                );

        }


        if (
            jobFilter ===
            'review'
        ) {

            filteredJobs =
                result.filter(
                    job =>
                        job.status ===
                        'Under Review'
                );

        }


        if (
            jobFilter ===
            'interview'
        ) {

            filteredJobs =
                result.filter(
                    job =>
                        job.status ===
                        'Interview'
                );

        }


        if (
            jobFilter ===
            'offer'
        ) {

            filteredJobs =
                result.filter(
                    job =>
                        job.status ===
                        'Offer'
                );

        }


        if (
            jobFilter ===
            'rejected'
        ) {

            filteredJobs =
                result.filter(
                    job =>
                        job.status ===
                        'Rejected'
                );

        }


        // ========================================================
        // SEARCH FILTER
        // ========================================================

        filteredJobs =
            filteredJobs.filter(
                job => {

                    const company =
                        String(
                            job.company ||
                            ''
                        )
                        .toLowerCase();


                    const position =
                        String(
                            job.position ||
                            ''
                        )
                        .toLowerCase();


                    return (
                        company.includes(
                            searchValue
                        ) ||
                        position.includes(
                            searchValue
                        )
                    );

                }
            );


        // ========================================================
        // SORT
        // ========================================================

        const sortValue =
            sortJobs.value;


        if (
            sortValue ===
            'newest'
        ) {

            filteredJobs.sort(
                (a, b) =>
                    new Date(
                        b.application_date
                    ) -
                    new Date(
                        a.application_date
                    )
            );

        }


        if (
            sortValue ===
            'oldest'
        ) {

            filteredJobs.sort(
                (a, b) =>
                    new Date(
                        a.application_date
                    ) -
                    new Date(
                        b.application_date
                    )
            );

        }


        if (
            sortValue ===
            'company'
        ) {

            filteredJobs.sort(
                (a, b) =>
                    String(
                        a.company
                    ).localeCompare(
                        String(
                            b.company
                        )
                    )
            );

        }


        if (
            sortValue ===
            'status'
        ) {

            filteredJobs.sort(
                (a, b) =>
                    String(
                        a.status
                    ).localeCompare(
                        String(
                            b.status
                        )
                    )
            );

        }


        if (
            sortValue ===
            'interview'
        ) {

            filteredJobs.sort(
                (a, b) => {

                    if (
                        !a.interview_date
                    ) {

                        return 1;

                    }


                    if (
                        !b.interview_date
                    ) {

                        return -1;

                    }


                    return (
                        new Date(
                            a.interview_date
                        ) -
                        new Date(
                            b.interview_date
                        )
                    );

                }
            );

        }


        if (
            sortValue ===
            'followup'
        ) {

            filteredJobs.sort(
                (a, b) => {

                    if (
                        !a.follow_up_date
                    ) {

                        return 1;

                    }


                    if (
                        !b.follow_up_date
                    ) {

                        return -1;

                    }


                    return (
                        new Date(
                            a.follow_up_date
                        ) -
                        new Date(
                            b.follow_up_date
                        )
                    );

                }
            );

        }


        // ========================================================
        // CLEAR
        // ========================================================

        jobsContainer.innerHTML =
            '';


        // ========================================================
        // EMPTY
        // ========================================================

        if (
            filteredJobs.length ===
            0
        ) {

            jobsContainer.innerHTML = `

                <div class="empty-state">

                    No matching job applications

                </div>

            `;


            return;

        }


        // ========================================================
        // DISPLAY
        // ========================================================

        filteredJobs.forEach(
            job => {

                const jobElement =
                    document.createElement(
                        'div'
                    );


                jobElement.classList.add(
                    'job-card'
                );


                // ==================================================
                // INTERVIEW SECTION
                // ==================================================

                let interviewHtml =
                    '';


                if (
                    job.interview_date
                ) {

                    interviewHtml = `

                        <div class="job-info-item">

                            <span>
                                Interview
                            </span>

                            <strong>
                                ${formatDate(
                                    job.interview_date
                                )}
                                ${
                                    job.interview_time
                                        ? ` at ${formatTime(
                                            job.interview_time
                                          )}`
                                        : ''
                                }
                            </strong>

                        </div>

                    `;

                }


                // ==================================================
                // FOLLOW-UP SECTION
                // ==================================================

                let followUpHtml =
                    '';


                if (
                    job.follow_up_date
                ) {

                    const today =
                        getTodayString();


                    let followUpLabel =
                        'Follow-up';


                    if (
                        job.follow_up_status ===
                        'Completed'
                    ) {

                        followUpLabel =
                            'Follow-up ✓';

                    }


                    if (
                        job.follow_up_status ===
                        'Pending' &&
                        job.follow_up_date < today
                    ) {

                        followUpLabel =
                            'Follow-up Overdue';

                    }


                    followUpHtml = `

                        <div class="job-info-item">

                            <span>
                                ${followUpLabel}
                            </span>

                            <strong>

                                ${formatDate(
                                    job.follow_up_date
                                )}

                                ${
                                    job.follow_up_status
                                        ? ` (${escapeHtml(
                                            job.follow_up_status
                                          )})`
                                        : ''
                                }

                            </strong>

                        </div>

                    `;

                }


                // ==================================================
                // JOB CARD
                // ==================================================

                jobElement.innerHTML = `

                    <div class="job-card-header">

                        <div class="job-card-title">

                            <h3>
                                ${escapeHtml(
                                    job.position
                                )}
                            </h3>

                            <p>
                                ${escapeHtml(
                                    job.company
                                )}
                            </p>

                        </div>


                        <div>

                            <span class="job-status">

                                ${escapeHtml(
                                    job.status
                                )}

                            </span>

                        </div>

                    </div>


                    <div class="job-card-info">


                        <div class="job-info-item">

                            <span>
                                Application Date
                            </span>

                            <strong>
                                ${formatDate(
                                    job.application_date
                                )}
                            </strong>

                        </div>


                        <div class="job-info-item">

                            <span>
                                Priority
                            </span>

                            <strong>
                                ${escapeHtml(
                                    job.priority
                                )}
                            </strong>

                        </div>


                        ${interviewHtml}


                        ${followUpHtml}

                    </div>


                    ${
                        job.interview_notes
                            ? `

                                <div
                                    class="job-card-notes"
                                    style="margin-top: 15px;"
                                >

                                    <strong>
                                        Interview Notes
                                    </strong>

                                    <p>
                                        ${escapeHtml(
                                            job.interview_notes
                                        )}
                                    </p>

                                </div>

                              `
                            : ''
                    }


                    ${
                        job.follow_up_notes
                            ? `

                                <div
                                    class="job-card-notes"
                                    style="margin-top: 15px;"
                                >

                                    <strong>
                                        Follow-up Notes
                                    </strong>

                                    <p>
                                        ${escapeHtml(
                                            job.follow_up_notes
                                        )}
                                    </p>

                                </div>

                              `
                            : ''
                    }


                    ${
                        job.notes
                            ? `

                                <p
                                    style="margin-top: 15px;"
                                >

                                    <strong>
                                        Notes:
                                    </strong>

                                    ${escapeHtml(
                                        job.notes
                                    )}

                                </p>

                              `
                            : ''
                    }


                    ${
                        job.job_url
                            ? `

                                <a
                                    href="${escapeHtml(
                                        job.job_url
                                    )}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style="
                                        display:inline-block;
                                        margin-top:12px;
                                    "
                                >
                                    View Job Posting →
                                </a>

                              `
                            : ''
                    }


                    <div class="job-actions">


                        <button
                            type="button"
                            class="edit-job"
                        >
                            Edit
                        </button>


                        <button
                            type="button"
                            class="delete-job"
                        >
                            Delete
                        </button>


                    </div>

                `;


                // ==================================================
                // EDIT
                // ==================================================

                const editButton =
                    jobElement.querySelector(
                        '.edit-job'
                    );


                editButton.addEventListener(
                    'click',
                    () => {

                        jobID =
                            job.id;


                        document.querySelector(
                            '#company'
                        ).value =
                            job.company ||
                            '';


                        document.querySelector(
                            '#position'
                        ).value =
                            job.position ||
                            '';


                        document.querySelector(
                            '#applicationDate'
                        ).value =
                            job.application_date ||
                            '';


                        document.querySelector(
                            '#status'
                        ).value =
                            job.status ||
                            'Applied';


                        document.querySelector(
                            '#priority'
                        ).value =
                            job.priority ||
                            'medium';


                        document.querySelector(
                            '#interviewDate'
                        ).value =
                            job.interview_date ||
                            '';


                        document.querySelector(
                            '#interviewTime'
                        ).value =
                            job.interview_time ||
                            '';


                        document.querySelector(
                            '#interviewNotes'
                        ).value =
                            job.interview_notes ||
                            '';


                        document.querySelector(
                            '#jobUrl'
                        ).value =
                            job.job_url ||
                            '';


                        document.querySelector(
                            '#notes'
                        ).value =
                            job.notes ||
                            '';


                        document.querySelector(
                            '#followUpDate'
                        ).value =
                            job.follow_up_date ||
                            '';


                        document.querySelector(
                            '#followUpStatus'
                        ).value =
                            job.follow_up_status ||
                            'Pending';


                        document.querySelector(
                            '#followUpNotes'
                        ).value =
                            job.follow_up_notes ||
                            '';


                        formTitle.textContent =
                            'Edit Job Application';


                        submitButton.textContent =
                            'Update Application';


                        cancelEdit.style.display =
                            'inline-block';


                        window.scrollTo({

                            top: 0,

                            behavior: 'smooth'

                        });

                    }
                );


                // ==================================================
                // DELETE
                // ==================================================

                const deleteButton =
                    jobElement.querySelector(
                        '.delete-job'
                    );


                deleteButton.addEventListener(
                    'click',
                    async () => {

                        const confirmed =
                            confirm(
                                `Are you sure you want to delete "${job.position}" at "${job.company}"?`
                            );


                        if (!confirmed) {

                            return;

                        }


                        try {

                            const response =
                                await fetch(
                                    `https://personal-planner-yk5w.onrender.com/api/jobs/${job.id}`,
                                    {
                                        method: 'DELETE',
                                        credentials: 'include'
                                    }
                                );


                            const result =
                                await response.text();


                            if (
                                !response.ok
                            ) {

                                throw new Error(
                                    result ||
                                    'Delete failed.'
                                );

                            }


                            alert(
                                result
                            );


                            await displayJobs();

                        } catch (
                            error
                        ) {

                            console.error(
                                'Delete error:',
                                error
                            );


                            alert(
                                error.message
                            );

                        }

                    }
                );


                jobsContainer.appendChild(
                    jobElement
                );

            }
        );


    } catch (
        error
    ) {

        console.error(
            'Display jobs error:',
            error
        );


        jobsContainer.innerHTML = `

            <div class="empty-state">

                Unable to load job applications

            </div>

        `;

    }

}


// ============================================================
// CANCEL EDIT
// ============================================================

cancelEdit.addEventListener(
    'click',
    () => {

        resetForm();

    }
);


// ============================================================
// INITIAL LOAD
// ============================================================

displayJobs();


// ============================================================
// SEARCH
// ============================================================

searchJob.addEventListener(
    'input',
    () => {

        displayJobs();

    }
);


// ============================================================
// SORT
// ============================================================

sortJobs.addEventListener(
    'change',
    () => {

        displayJobs();

    }
);


// ============================================================
// FILTERS
// ============================================================

allJobs.addEventListener(
    'click',
    () => {

        jobFilter =
            'all';

        displayJobs();

    }
);


appliedJobs.addEventListener(
    'click',
    () => {

        jobFilter =
            'applied';

        displayJobs();

    }
);


reviewJobs.addEventListener(
    'click',
    () => {

        jobFilter =
            'review';

        displayJobs();

    }
);


interviewJobs.addEventListener(
    'click',
    () => {

        jobFilter =
            'interview';

        displayJobs();

    }
);


offerJobs.addEventListener(
    'click',
    () => {

        jobFilter =
            'offer';

        displayJobs();

    }
);


rejectedJobs.addEventListener(
    'click',
    () => {

        jobFilter =
            'rejected';

        displayJobs();

    }
);