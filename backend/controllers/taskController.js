const Task = require('../models/Task');



const createTask = (req, res) => {
    const {title, description, dueDate, priority} = req.body;

    Task.create(req.session.userId, title, description, dueDate, priority, (error, result) => {
        if(error){
            console.log(error)
            return res.status(500).send("Task creation failed")
        }

         res.send('Task created successfully!');
    })

};
//================================================================================
const getTasks = (req, res) => {
    const userId = req.session.userId;

    Task.getByUser(userId, (error, result) => {

        if(error){
            console.log(error)
            return res.status(500).send("Something went wrong")
        }

         res.send(result);
    })

};

//==================================================================================

const update = (req, res) => {
    const userId = req.session.userId;
    const {title, description, dueDate, priority} = req.body;

    Task.update(req.params.id, userId, title, description, dueDate, priority, (error, result) => {

        if(error){
            console.log(error)
            return res.status(500).send("Something went wrong")
        }

         res.send(result);
    })

};

//==================================================================================

const deleteTask = (req, res) => {
    const userId = req.session.userId;
    const taskId = req.params.id;

    Task.delete(taskId, userId, (error, result) => {

        if(error){
            console.log(error)
            return res.status(500).send("Something went wrong")
        }

         res.send(result);
    })

};

//==================================================================================

const complete = (req, res) => {
    const userId = req.session.userId;
    const taskId = req.params.id;

    Task.complete(taskId, userId, (error, result) => {

        if(error){
            console.log(error)
            return res.status(500).send("Something went wrong")
        }

         res.send(result);
    })

};

module.exports = {
    createTask,
    getTasks,
    update,
    deleteTask,
    complete
};