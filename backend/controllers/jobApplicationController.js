const JobApplication =
    require('../models/JobApplication');


// ================================================================
// VALIDATION HELPERS
// ================================================================

const allowedStatuses = [
    'Applied',
    'Under Review',
    'Interview',
    'Assessment',
    'Rejected',
    'Offer',
    'Withdrawn'
];


const allowedPriorities = [
    'low',
    'medium',
    'high'
];


const allowedFollowUpStatuses = [
    'Pending',
    'Completed',
    'Not Needed'
];


function validateJobData(
    body
) {

    const {
        company,
        position,
        applicationDate,
        status,
        priority
    } = body;


    if (
        !company ||
        !company.trim()
    ) {

        return 'Company is required';

    }


    if (
        !position ||
        !position.trim()
    ) {

        return 'Position is required';

    }


    if (!applicationDate) {

        return 'Application date is required';

    }


    if (
        !allowedStatuses.includes(
            status
        )
    ) {

        return 'Invalid status';

    }


    if (
        !allowedPriorities.includes(
            priority
        )
    ) {

        return 'Invalid priority';

    }


    return null;

}


// ================================================================
// CREATE JOB APPLICATION
// ================================================================

const createJobApplication = (
    req,
    res
) => {

    const userId =
        req.session.userId;


    const {
        company,
        position,
        applicationDate,
        status,
        priority,
        interviewDate,
        interviewTime,
        interviewNotes,
        jobUrl,
        notes,
        followUpDate,
        followUpStatus,
        followUpNotes
    } = req.body;


    const validationError =
        validateJobData(
            req.body
        );


    if (
        validationError
    ) {

        return res
            .status(400)
            .send(
                validationError
            );

    }


    const finalFollowUpStatus =
        followUpStatus &&
        allowedFollowUpStatuses.includes(
            followUpStatus
        )
            ? followUpStatus
            : 'Pending';


    JobApplication.create(

        userId,

        company.trim(),

        position.trim(),

        applicationDate,

        status,

        priority,

        interviewDate ||
            null,

        interviewTime ||
            null,

        interviewNotes ?
            interviewNotes.trim() :
            null,

        jobUrl ?
            jobUrl.trim() :
            null,

        notes ?
            notes.trim() :
            null,

        followUpDate ||
            null,

        finalFollowUpStatus,

        followUpNotes ?
            followUpNotes.trim() :
            null,

        (
            error,
            result
        ) => {

            if (error) {

                console.log(
                    'Job application creation error:',
                    error
                );

                return res
                    .status(500)
                    .send(
                        'Job application creation failed'
                    );

            }


            res.send(
                'Job application added successfully!'
            );

        }
    );

};


// ================================================================
// GET JOB APPLICATIONS
// ================================================================

const getJobApplications = (
    req,
    res
) => {

    const userId =
        req.session.userId;


    JobApplication.getByUser(

        userId,

        (
            error,
            result
        ) => {

            if (error) {

                console.log(
                    'Get jobs error:',
                    error
                );

                return res
                    .status(500)
                    .send(
                        'Something went wrong'
                    );

            }


            res.json(
                result
            );

        }
    );

};


// ================================================================
// UPDATE JOB APPLICATION
// ================================================================

const updateJobApplication = (
    req,
    res
) => {

    const userId =
        req.session.userId;


    const jobId =
        req.params.id;


    const {
        company,
        position,
        applicationDate,
        status,
        priority,
        interviewDate,
        interviewTime,
        interviewNotes,
        jobUrl,
        notes,
        followUpDate,
        followUpStatus,
        followUpNotes
    } = req.body;


    const validationError =
        validateJobData(
            req.body
        );


    if (
        validationError
    ) {

        return res
            .status(400)
            .send(
                validationError
            );

    }


    const finalFollowUpStatus =
        followUpStatus &&
        allowedFollowUpStatuses.includes(
            followUpStatus
        )
            ? followUpStatus
            : 'Pending';


    JobApplication.update(

        jobId,

        userId,

        company.trim(),

        position.trim(),

        applicationDate,

        status,

        priority,

        interviewDate ||
            null,

        interviewTime ||
            null,

        interviewNotes ?
            interviewNotes.trim() :
            null,

        jobUrl ?
            jobUrl.trim() :
            null,

        notes ?
            notes.trim() :
            null,

        followUpDate ||
            null,

        finalFollowUpStatus,

        followUpNotes ?
            followUpNotes.trim() :
            null,

        (
            error,
            result
        ) => {

            if (error) {

                console.log(
                    'Job application update error:',
                    error
                );

                return res
                    .status(500)
                    .send(
                        'Job application update failed'
                    );

            }


            if (
                result.affectedRows === 0
            ) {

                return res
                    .status(404)
                    .send(
                        'Job application not found'
                    );

            }


            res.send(
                'Job application updated successfully!'
            );

        }
    );

};


// ================================================================
// DELETE JOB APPLICATION
// ================================================================

const deleteJobApplication = (
    req,
    res
) => {

    const userId =
        req.session.userId;


    const jobId =
        req.params.id;


    JobApplication.delete(

        jobId,

        userId,

        (
            error,
            result
        ) => {

            if (error) {

                console.log(
                    'Job application deletion error:',
                    error
                );

                return res
                    .status(500)
                    .send(
                        'Job application deletion failed'
                    );

            }


            if (
                result.affectedRows === 0
            ) {

                return res
                    .status(404)
                    .send(
                        'Job application not found'
                    );

            }


            res.send(
                'Job application deleted successfully!'
            );

        }
    );

};


module.exports = {

    createJobApplication,

    getJobApplications,

    updateJobApplication,

    deleteJobApplication

};