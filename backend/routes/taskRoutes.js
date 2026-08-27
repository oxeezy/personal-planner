const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');

router.post('/', auth, taskController.createTask);
router.get('/', auth, taskController.getTasks);
router.put('/:id', auth, taskController.update);
router.delete('/:id', auth, taskController.deleteTask);
router.put('/:id/complete', auth, taskController.complete);
module.exports = router;