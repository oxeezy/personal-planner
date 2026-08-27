// ============================================================
// DAILY PLANNER
// ============================================================


// ============================================================
// DOM ELEMENTS
// ============================================================

const scheduleForm =
    document.querySelector('#scheduleForm');

const startDateInput =
    document.querySelector('#startDate');

const endDateInput =
    document.querySelector('#endDate');

const titleInput =
    document.querySelector('#title');

const startTimeInput =
    document.querySelector('#startTime');

const endTimeInput =
    document.querySelector('#endTime');

const categoryInput =
    document.querySelector('#category');

const descriptionInput =
    document.querySelector('#description');

const recurrenceTypeInput =
    document.querySelector('#recurrenceType');

const recurrenceDaysInput =
    document.querySelector('#recurrenceDays');

const recurrenceEndDateInput =
    document.querySelector('#recurrenceEndDate');

const recurrenceEndDateGroup =
    document.querySelector('#recurrenceEndDateGroup');

const scheduleList =
    document.querySelector('#scheduleList');

const scheduleHeading =
    document.querySelector('#scheduleHeading');

const scheduleDescription =
    document.querySelector('#scheduleDescription');

const showAllSchedulesButton =
    document.querySelector('#showAllSchedules');

const formTitle =
    document.querySelector('#formTitle');

const submitButton =
    document.querySelector('#submitSchedule');

const cancelButton =
    document.querySelector('#cancelEdit');

const previousMonthButton =
    document.querySelector('#previousMonth');

const nextMonthButton =
    document.querySelector('#nextMonth');

const calendarMonth =
    document.querySelector('#calendarMonth');

const calendarDays =
    document.querySelector('#calendarDays');


// ============================================================
// STATE
// ============================================================

let currentMonth =
    new Date();

let scheduleID =
    null;

let allSchedules =
    [];

let currentFilter =
    'all';


// ============================================================
// DATE HELPERS
// ============================================================

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


function parseDate(
    dateString
) {

    if (!dateString) {
        return null;
    }

    return new Date(
        `${dateString}T00:00:00`
    );

}


function dateToString(
    date
) {

    if (!date) {
        return '';
    }

    return (
        date.getFullYear() +
        '-' +
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            '0'
        ) +
        '-' +
        String(
            date.getDate()
        ).padStart(
            2,
            '0'
        )
    );

}


function addDays(
    dateString,
    amount
) {

    const date =
        parseDate(
            dateString
        );

    if (!date) {
        return '';
    }

    date.setDate(
        date.getDate() + amount
    );

    return dateToString(
        date
    );

}


function formatDate(
    dateString
) {

    if (!dateString) {
        return '';
    }

    const date =
        parseDate(
            dateString
        );

    if (!date) {
        return '';
    }

    return date.toLocaleDateString(
        'en-US',
        {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        }
    );

}


function isPastDate(
    dateString
) {

    return (
        dateString <
        getTodayString()
    );

}


// ============================================================
// FORMAT TIME
// ============================================================

function formatTime(
    time
) {

    if (!time) {
        return '';
    }

    const parts =
        String(time).split(':');

    const hours =
        Number(
            parts[0]
        );

    const minutes =
        parts[1] || '00';

    if (
        Number.isNaN(
            hours
        )
    ) {

        return time;

    }

    const suffix =
        hours >= 12
            ? 'PM'
            : 'AM';

    const displayHour =
        hours % 12 || 12;

    return (
        `${String(displayHour).padStart(
            2,
            '0'
        )}:${minutes} ${suffix}`
    );

}


// ============================================================
// RECURRENCE UI
// ============================================================

function updateRecurrenceFields() {

    if (!recurrenceTypeInput) {
        return;
    }

    const type =
        recurrenceTypeInput.value;


    if (recurrenceDaysInput) {

        recurrenceDaysInput.style.display =
            type === 'weekly'
                ? 'block'
                : 'none';

    }


    if (recurrenceEndDateGroup) {

        recurrenceEndDateGroup.style.display =
            type === 'none'
                ? 'none'
                : 'block';

    }


    if (
        recurrenceEndDateInput &&
        startDateInput.value
    ) {

        recurrenceEndDateInput.min =
            startDateInput.value;

    }

}


function getRecurrenceDays() {

    if (
        !recurrenceTypeInput ||
        recurrenceTypeInput.value !== 'weekly'
    ) {

        return null;

    }


    if (!recurrenceDaysInput) {
        return null;
    }


    const checkedDays =
        recurrenceDaysInput.querySelectorAll(
            'input[type="checkbox"]:checked'
        );


    const days =
        Array.from(
            checkedDays
        ).map(
            checkbox =>
                checkbox.value
        );


    if (
        days.length === 0
    ) {

        return null;

    }


    return days.join(',');

}


function setRecurrenceDays(
    days
) {

    if (!recurrenceDaysInput) {
        return;
    }


    const checkboxes =
        recurrenceDaysInput.querySelectorAll(
            'input[type="checkbox"]'
        );


    checkboxes.forEach(
        checkbox => {

            checkbox.checked =
                false;

        }
    );


    if (!days) {
        return;
    }


    const selectedDays =
        String(days)
            .split(',')
            .map(
                day =>
                    day.trim()
            );


    checkboxes.forEach(
        checkbox => {

            if (
                selectedDays.includes(
                    checkbox.value
                )
            ) {

                checkbox.checked =
                    true;

            }

        }
    );

}


function resetRecurrenceFields() {

    if (recurrenceTypeInput) {

        recurrenceTypeInput.value =
            'none';

    }


    if (recurrenceDaysInput) {

        const checkboxes =
            recurrenceDaysInput.querySelectorAll(
                'input[type="checkbox"]'
            );


        checkboxes.forEach(
            checkbox => {

                checkbox.checked =
                    false;

            }
        );

    }


    if (recurrenceEndDateInput) {

        recurrenceEndDateInput.value =
            '';

    }


    updateRecurrenceFields();

}


// ============================================================
// RECURRENCE LOGIC
// ============================================================

function isRecurring(
    schedule
) {

    return (
        schedule &&
        schedule.recurrence_type &&
        schedule.recurrence_type !== 'none'
    );

}


function getRecurrenceEnd(
    schedule
) {

    if (
        schedule.recurrence_end_date
    ) {

        return schedule.recurrence_end_date;

    }

    return schedule.date;

}


/*
    Determines whether a recurring schedule occurs
    on the requested date.
*/
function occursOnDate(
    schedule,
    targetDate
) {

    if (
        !schedule ||
        !schedule.date ||
        !targetDate
    ) {

        return false;

    }


    // ========================================================
    // NORMAL SCHEDULE
    // ========================================================

    if (
        !isRecurring(
            schedule
        )
    ) {

        const endDate =
            schedule.end_date ||
            schedule.date;

        return (
            targetDate >= schedule.date &&
            targetDate <= endDate
        );

    }


    // ========================================================
    // RANGE
    // ========================================================

    if (
        targetDate < schedule.date
    ) {

        return false;

    }


    const recurrenceEnd =
        getRecurrenceEnd(
            schedule
        );


    if (
        targetDate > recurrenceEnd
    ) {

        return false;

    }


    const startDate =
        parseDate(
            schedule.date
        );

    const target =
        parseDate(
            targetDate
        );


    if (
        !startDate ||
        !target
    ) {

        return false;

    }


    const type =
        schedule.recurrence_type;


    // ========================================================
    // DAILY
    // ========================================================

    if (
        type === 'daily'
    ) {

        return true;

    }


    // ========================================================
    // WEEKLY
    // ========================================================

    if (
        type === 'weekly'
    ) {

        const weekday =
            target.getDay();


        const selectedDays =
            String(
                schedule.recurrence_days || ''
            )
            .split(',')
            .map(
                value =>
                    Number(
                        value.trim()
                    )
            )
            .filter(
                value =>
                    !Number.isNaN(
                        value
                    )
            );


        return selectedDays.includes(
            weekday
        );

    }


    // ========================================================
    // MONTHLY
    // ========================================================

    if (
        type === 'monthly'
    ) {

        return (
            target.getDate() ===
            startDate.getDate()
        );

    }


    return false;

}


/*
    Creates a virtual occurrence object.

    The original database ID is preserved.
*/
function createOccurrence(
    schedule,
    occurrenceDate
) {

    return {

        ...schedule,

        occurrence_date:
            occurrenceDate,

        occurrence_start_date:
            occurrenceDate,

        occurrence_end_date:
            occurrenceDate

    };

}


// ============================================================
// GET SCHEDULES FOR DATE
// ============================================================

function getSchedulesForDate(
    dateString
) {

    return allSchedules
        .filter(
            schedule =>
                occursOnDate(
                    schedule,
                    dateString
                )
        )
        .map(
            schedule =>
                createOccurrence(
                    schedule,
                    dateString
                )
        );

}


// ============================================================
// GET ALL CALENDAR OCCURRENCES
// ============================================================

function getAllOccurrences(
    schedules
) {

    const occurrences =
        [];


    schedules.forEach(
        schedule => {

            // ==================================================
            // NORMAL SCHEDULE
            // ==================================================

            if (
                !isRecurring(
                    schedule
                )
            ) {

                occurrences.push(
                    createOccurrence(
                        schedule,
                        schedule.date
                    )
                );

                return;

            }


            // ==================================================
            // RECURRING SCHEDULE
            // ==================================================

            let currentDate =
                schedule.date;


            const recurrenceEnd =
                getRecurrenceEnd(
                    schedule
                );


            let safetyCounter =
                0;


            const maxOccurrences =
                2000;


            while (
                currentDate <= recurrenceEnd &&
                safetyCounter < maxOccurrences
            ) {

                if (
                    occursOnDate(
                        schedule,
                        currentDate
                    )
                ) {

                    occurrences.push(
                        createOccurrence(
                            schedule,
                            currentDate
                        )
                    );

                }


                currentDate =
                    addDays(
                        currentDate,
                        1
                    );


                safetyCounter++;

            }

        }
    );


    return occurrences;

}


// ============================================================
// SORT SCHEDULES
// ============================================================

function sortAllSchedules(
    schedules
) {

    return [...schedules].sort(
        (
            first,
            second
        ) => {

            const firstDate =
                first.occurrence_date ||
                first.date ||
                '';


            const secondDate =
                second.occurrence_date ||
                second.date ||
                '';


            const dateComparison =
                String(
                    firstDate
                ).localeCompare(
                    String(
                        secondDate
                    )
                );


            if (
                dateComparison !== 0
            ) {

                return dateComparison;

            }


            return String(
                first.start_time || ''
            ).localeCompare(
                String(
                    second.start_time || ''
                )
            );

        }
    );

}


// ============================================================
// DEFAULT DATE
// ============================================================

function setDefaultDate() {

    const today =
        getTodayString();


    startDateInput.value =
        today;


    endDateInput.value =
        today;


    startDateInput.min =
        today;


    endDateInput.min =
        today;


    if (recurrenceEndDateInput) {

        recurrenceEndDateInput.min =
            today;

    }

}


// ============================================================
// SELECTED DATE TEXT
// ============================================================

function updateSelectedDateText() {

    const selectedDateText =
        document.querySelector(
            '#selectedDateText'
        );


    if (!selectedDateText) {
        return;
    }


    if (
        startDateInput.value
    ) {

        selectedDateText.textContent =
            `Scheduling for ${formatDate(
                startDateInput.value
            )}`;

    } else {

        selectedDateText.textContent =
            'Create a schedule for the selected date.';

    }

}


// ============================================================
// CALENDAR
// ============================================================

function renderCalendar() {

    calendarDays.innerHTML =
        '';


    const year =
        currentMonth.getFullYear();


    const month =
        currentMonth.getMonth();


    calendarMonth.textContent =
        currentMonth.toLocaleDateString(
            'en-US',
            {
                month: 'long',
                year: 'numeric'
            }
        );


    const firstDay =
        new Date(
            year,
            month,
            1
        ).getDay();


    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    // ========================================================
    // EMPTY CELLS
    // ========================================================

    for (
        let index = 0;
        index < firstDay;
        index++
    ) {

        const emptyDay =
            document.createElement(
                'div'
            );


        emptyDay.classList.add(
            'calendar-day',
            'empty'
        );


        calendarDays.appendChild(
            emptyDay
        );

    }


    // ========================================================
    // DAYS
    // ========================================================

    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const dateString =
            `${year}-${String(
                month + 1
            ).padStart(
                2,
                '0'
            )}-${String(
                day
            ).padStart(
                2,
                '0'
            )}`;


        const dayElement =
            document.createElement(
                'div'
            );


        dayElement.className =
            'calendar-day';


        // ====================================================
        // DAY NUMBER
        // ====================================================

        const dayNumber =
            document.createElement(
                'div'
            );


        dayNumber.className =
            'calendar-day-number';


        dayNumber.textContent =
            day;


        dayElement.appendChild(
            dayNumber
        );


        // ====================================================
        // TODAY
        // ====================================================

        if (
            dateString ===
            getTodayString()
        ) {

            dayElement.classList.add(
                'today'
            );

        }


        // ====================================================
        // SELECTED
        // ====================================================

        if (
            dateString ===
            startDateInput.value
        ) {

            dayElement.classList.add(
                'selected'
            );

        }


        // ====================================================
        // SCHEDULES
        // ====================================================

        const daySchedules =
            getSchedulesForDate(
                dateString
            );


        if (
            daySchedules.length > 0
        ) {

            const eventsContainer =
                document.createElement(
                    'div'
                );


            eventsContainer.className =
                'calendar-events';


            daySchedules
                .slice(
                    0,
                    3
                )
                .forEach(
                    schedule => {

                        const event =
                            document.createElement(
                                'div'
                            );


                        event.className =
                            'calendar-event';


                        event.title =
                            schedule.title;


                        const eventTitle =
                            document.createElement(
                                'span'
                            );


                        eventTitle.className =
                            'calendar-event-title';


                        eventTitle.textContent =
                            schedule.title;


                        const eventTime =
                            document.createElement(
                                'span'
                            );


                        eventTime.className =
                            'calendar-event-time';


                        eventTime.textContent =
                            formatTime(
                                schedule.start_time
                            );


                        event.appendChild(
                            eventTitle
                        );


                        event.appendChild(
                            eventTime
                        );


                        eventsContainer.appendChild(
                            event
                        );

                    }
                );


            if (
                daySchedules.length > 3
            ) {

                const more =
                    document.createElement(
                        'div'
                    );


                more.className =
                    'calendar-more';


                more.textContent =
                    `+${daySchedules.length - 3} more`;


                eventsContainer.appendChild(
                    more
                );

            }


            dayElement.appendChild(
                eventsContainer
            );

        }


        // ====================================================
        // CLICK DATE
        // ====================================================

        dayElement.addEventListener(
            'click',
            () => {

                if (
                    isPastDate(
                        dateString
                    )
                ) {

                    alert(
                        'You cannot create a new schedule for a past date.'
                    );


                    return;

                }


                startDateInput.value =
                    dateString;


                endDateInput.value =
                    dateString;


                endDateInput.min =
                    dateString;


                if (
                    recurrenceEndDateInput
                ) {

                    recurrenceEndDateInput.min =
                        dateString;

                }


                scheduleID =
                    null;


                formTitle.textContent =
                    'Add Schedule';


                submitButton.textContent =
                    'Add Schedule';


                cancelButton.style.display =
                    'none';


                titleInput.value =
                    '';

                startTimeInput.value =
                    '';

                endTimeInput.value =
                    '';

                categoryInput.value =
                    'other';

                descriptionInput.value =
                    '';


                resetRecurrenceFields();


                updateSelectedDateText();


                currentFilter =
                    'date';


                updateFilterButton();


                renderCalendar();

                renderFilteredSchedules();

            }
        );


        calendarDays.appendChild(
            dayElement
        );

    }

}


// ============================================================
// LOAD SCHEDULES
// ============================================================

async function loadSchedules() {

    try {

        const response =
            await fetch(
                'http://127.0.0.1:3000/api/daily-plans',
                {
                    method: 'GET',
                    credentials: 'include'
                }
            );


        if (!response.ok) {

            throw new Error(
                `Failed to load schedules: ${response.status}`
            );

        }


        const result =
            await response.json();


        if (
            !Array.isArray(
                result
            )
        ) {

            throw new Error(
                'Invalid schedule data returned by the server'
            );

        }


        allSchedules =
            result;


        console.log(
            'ALL SCHEDULES:',
            allSchedules
        );


        renderCalendar();

        renderFilteredSchedules();

    } catch (error) {

        console.error(
            'Load schedules error:',
            error
        );


        scheduleList.innerHTML = `

            <div class="empty-state">
                Unable to load schedules.
            </div>

        `;

    }

}


// ============================================================
// FILTER BUTTON
// ============================================================

function updateFilterButton() {

    if (
        showAllSchedulesButton
    ) {

        showAllSchedulesButton.classList.toggle(
            'active',
            currentFilter === 'all'
        );

    }

}


// ============================================================
// RENDER FILTERED SCHEDULES
// ============================================================

function renderFilteredSchedules() {

    let schedules;


    // ========================================================
    // ALL SCHEDULES
    //
    // IMPORTANT:
    // Recurring schedules appear ONLY ONCE here.
    //
    // The calendar still expands them separately.
    // ========================================================

    if (
        currentFilter === 'all'
    ) {

        schedules =
            [...allSchedules];


        schedules =
            sortAllSchedules(
                schedules
            );


        scheduleHeading.textContent =
            'All Schedules';


        scheduleDescription.textContent =
            'Showing all of your schedules.';

    }


    // ========================================================
    // SELECTED DATE
    // ========================================================

    else {

        schedules =
            getSchedulesForDate(
                startDateInput.value
            );


        schedules =
            [...schedules].sort(
                (
                    first,
                    second
                ) => {

                    return String(
                        first.start_time || ''
                    ).localeCompare(
                        String(
                            second.start_time || ''
                        )
                    );

                }
            );


        scheduleHeading.textContent =
            formatDate(
                startDateInput.value
            );


        scheduleDescription.textContent =
            'Showing schedules for this date.';

    }


    renderScheduleList(
        schedules
    );

}


// ============================================================
// RENDER SCHEDULE LIST
// ============================================================

function renderScheduleList(
    schedules
) {

    scheduleList.innerHTML =
        '';


    if (
        schedules.length === 0
    ) {

        scheduleList.innerHTML = `

            <div class="empty-state">

                ${
                    currentFilter === 'all'
                        ? 'No schedules yet.'
                        : `No schedules for ${formatDate(
                            startDateInput.value
                          )}.`
                }

            </div>

        `;


        return;

    }


    schedules.forEach(
        schedule => {

            const item =
                document.createElement(
                    'div'
                );


            item.className =
                'schedule-item';


            const occurrenceDate =
                schedule.occurrence_date ||
                schedule.date;


            const isRecurringSchedule =
                isRecurring(
                    schedule
                );


            const recurrenceText =
                isRecurringSchedule
                    ? `🔁 ${schedule.recurrence_type}`
                    : '';


            item.innerHTML = `

                <div class="schedule-main">

                    <div class="schedule-top">

                        <h3>
                            ${escapeHtml(
                                schedule.title || ''
                            )}
                        </h3>


                        <span class="schedule-category">

                            ${escapeHtml(
                                schedule.category ||
                                'other'
                            )}

                        </span>

                    </div>


                    ${
                        schedule.description

                            ? `

                                <p class="schedule-description">

                                    ${escapeHtml(
                                        schedule.description
                                    )}

                                </p>

                              `

                            : ''
                    }


                    <div class="schedule-meta">

                        <span class="schedule-time">

                            🕐

                            <strong>
                                ${formatTime(
                                    schedule.start_time
                                )}
                            </strong>

                            <span class="time-separator">
                                —
                            </span>

                            ${formatTime(
                                schedule.end_time
                            )}

                        </span>


                        ${
                            currentFilter === 'all'

                                ? `

                                    <span class="schedule-date">

                                        ${formatDate(
                                            occurrenceDate
                                        )}

                                    </span>

                                  `

                                : ''
                        }


                        ${
                            recurrenceText

                                ? `

                                    <span class="schedule-date">

                                        ${recurrenceText}

                                    </span>

                                  `

                                : ''
                        }

                    </div>

                </div>


                <div class="schedule-actions">

                    <button
                        type="button"
                        class="edit-schedule"
                    >
                        Edit
                    </button>


                    <button
                        type="button"
                        class="delete-schedule"
                    >
                        Delete
                    </button>

                </div>

            `;


            // ==================================================
            // EDIT
            // ==================================================

            const editButton =
                item.querySelector(
                    '.edit-schedule'
                );


            editButton.addEventListener(
                'click',
                () => {

                    scheduleID =
                        schedule.id;


                    startDateInput.value =
                        schedule.date;


                    endDateInput.value =
                        schedule.end_date ||
                        schedule.date;


                    titleInput.value =
                        schedule.title ||
                        '';


                    startTimeInput.value =
                        schedule.start_time ||
                        '';


                    endTimeInput.value =
                        schedule.end_time ||
                        '';


                    categoryInput.value =
                        schedule.category ||
                        'other';


                    descriptionInput.value =
                        schedule.description ||
                        '';


                    recurrenceTypeInput.value =
                        schedule.recurrence_type ||
                        'none';


                    setRecurrenceDays(
                        schedule.recurrence_days
                    );


                    if (
                        recurrenceEndDateInput
                    ) {

                        recurrenceEndDateInput.value =
                            schedule.recurrence_end_date ||
                            '';


                        recurrenceEndDateInput.min =
                            schedule.date;

                    }


                    updateRecurrenceFields();


                    formTitle.textContent =
                        'Edit Schedule';


                    submitButton.textContent =
                        'Update Schedule';


                    cancelButton.style.display =
                        'inline-block';


                    updateSelectedDateText();


                    currentFilter =
                        'date';


                    updateFilterButton();


                    renderCalendar();

                    renderFilteredSchedules();


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
                item.querySelector(
                    '.delete-schedule'
                );


            deleteButton.addEventListener(
                'click',
                async () => {

                    const confirmed =
                        confirm(
                            `Delete "${schedule.title}"?`
                        );


                    if (
                        !confirmed
                    ) {

                        return;

                    }


                    try {

                        const response =
                            await fetch(
                                `http://127.0.0.1:3000/api/daily-plans/${schedule.id}`,
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
                                'Delete failed'
                            );

                        }


                        await loadSchedules();

                    } catch (
                        error
                    ) {

                        console.error(
                            'Delete error:',
                            error
                        );


                        alert(
                            'Unable to delete schedule'
                        );

                    }

                }
            );


            scheduleList.appendChild(
                item
            );

        }
    );

}


// ============================================================
// ALL SCHEDULES BUTTON
// ============================================================

if (
    showAllSchedulesButton
) {

    showAllSchedulesButton.addEventListener(
        'click',
        () => {

            currentFilter =
                'all';


            updateFilterButton();


            renderFilteredSchedules();

        }
    );

}


// ============================================================
// RECURRENCE CHANGE
// ============================================================

if (
    recurrenceTypeInput
) {

    recurrenceTypeInput.addEventListener(
        'change',
        () => {

            updateRecurrenceFields();

        }
    );

}


// ============================================================
// SAVE / UPDATE
// ============================================================

scheduleForm.addEventListener(
    'submit',
    async event => {

        event.preventDefault();


        const date =
            startDateInput.value;


        const endDate =
            endDateInput.value;


        const title =
            titleInput.value.trim();


        const startTime =
            startTimeInput.value;


        const endTime =
            endTimeInput.value;


        const category =
            categoryInput.value;


        const description =
            descriptionInput.value.trim();


        const recurrenceType =
            recurrenceTypeInput
                ? recurrenceTypeInput.value
                : 'none';


        const recurrenceDays =
            getRecurrenceDays();


        const recurrenceEndDate =
            recurrenceEndDateInput
                ? recurrenceEndDateInput.value || null
                : null;


        // ==================================================
        // BASIC VALIDATION
        // ==================================================

        if (!date) {

            alert(
                'Start date is required.'
            );

            return;

        }


        if (!endDate) {

            alert(
                'End date is required.'
            );

            return;

        }


        if (
            endDate < date
        ) {

            alert(
                'End date cannot be before start date.'
            );

            return;

        }


        if (
            !scheduleID &&
            isPastDate(date)
        ) {

            alert(
                'You cannot create a schedule for a past date.'
            );

            return;

        }


        if (
            !scheduleID &&
            isPastDate(endDate)
        ) {

            alert(
                'The end date cannot be in the past.'
            );

            return;

        }


        if (!title) {

            alert(
                'Activity title is required.'
            );

            return;

        }


        if (!startTime) {

            alert(
                'Start time is required.'
            );

            return;

        }


        if (!endTime) {

            alert(
                'End time is required.'
            );

            return;

        }


        if (
            date === endDate &&
            endTime <= startTime
        ) {

            alert(
                'End time must be later than start time.'
            );

            return;

        }


        // ==================================================
        // RECURRENCE VALIDATION
        // ==================================================

        if (
            recurrenceType !== 'none' &&
            !recurrenceEndDate
        ) {

            alert(
                'Please select a recurrence end date.'
            );

            return;

        }


        if (
            recurrenceEndDate &&
            recurrenceEndDate < date
        ) {

            alert(
                'Recurrence end date cannot be before the start date.'
            );

            return;

        }


        if (
            recurrenceType === 'weekly' &&
            !recurrenceDays
        ) {

            alert(
                'Please select at least one day for weekly recurrence.'
            );

            return;

        }


        // ==================================================
        // REQUEST
        // ==================================================

        const url =
            scheduleID
                ? `http://127.0.0.1:3000/api/daily-plans/${scheduleID}`
                : 'http://127.0.0.1:3000/api/daily-plans';


        const method =
            scheduleID
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
                            JSON.stringify({

                                date:
                                    date,

                                endDate:
                                    endDate,

                                startTime:
                                    startTime,

                                endTime:
                                    endTime,

                                title:
                                    title,

                                description:
                                    description ||
                                    null,

                                category:
                                    category ||
                                    'other',

                                recurrenceType:
                                    recurrenceType,

                                recurrenceDays:
                                    recurrenceDays,

                                recurrenceEndDate:
                                    recurrenceEndDate

                            })
                    }
                );


            const result =
                await response.text();


            if (!response.ok) {

                throw new Error(
                    result ||
                    'Unable to save schedule.'
                );

            }


            alert(
                result
            );


            const savedDate =
                date;


            scheduleID =
                null;


            formTitle.textContent =
                'Add Schedule';


            submitButton.textContent =
                'Add Schedule';


            cancelButton.style.display =
                'none';


            scheduleForm.reset();


            startDateInput.value =
                savedDate;


            endDateInput.value =
                savedDate;


            resetRecurrenceFields();


            updateSelectedDateText();


            currentFilter =
                'date';


            updateFilterButton();


            await loadSchedules();

        } catch (
            error
        ) {

            console.error(
                'Save error:',
                error
            );


            alert(
                error.message ||
                'Unable to save schedule.'
            );

        }

    }
);


// ============================================================
// CANCEL EDIT
// ============================================================

if (
    cancelButton
) {

    cancelButton.addEventListener(
        'click',
        () => {

            const selectedDate =
                startDateInput.value;


            scheduleID =
                null;


            formTitle.textContent =
                'Add Schedule';


            submitButton.textContent =
                'Add Schedule';


            cancelButton.style.display =
                'none';


            scheduleForm.reset();


            startDateInput.value =
                selectedDate;


            endDateInput.value =
                selectedDate;


            resetRecurrenceFields();


            updateSelectedDateText();


            renderCalendar();

            renderFilteredSchedules();

        }
    );

}


// ============================================================
// MONTH NAVIGATION
// ============================================================

if (
    previousMonthButton
) {

    previousMonthButton.addEventListener(
        'click',
        () => {

            currentMonth.setMonth(
                currentMonth.getMonth() - 1
            );


            renderCalendar();

        }
    );

}


if (
    nextMonthButton
) {

    nextMonthButton.addEventListener(
        'click',
        () => {

            currentMonth.setMonth(
                currentMonth.getMonth() + 1
            );


            renderCalendar();

        }
    );

}


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHtml(
    value
) {

    return String(
        value
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


// ============================================================
// INITIALIZE
// ============================================================

setDefaultDate();

updateRecurrenceFields();

updateSelectedDateText();

renderCalendar();

loadSchedules();