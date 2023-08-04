const router = require('express').Router();
const Task = require('../controller/taskController');
const Register = require('../controller/registerController');
const Login = require('../controller/loginController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Set the destination folder for uploaded files
const { Auth_ACCESS } = require('../middleware/auth');

// #Task
router.post('/tasks', Auth_ACCESS, upload.array('files'), Task.createTask);
router.get('/', Auth_ACCESS, Task.getTasks);
router.get('/tasks/', Auth_ACCESS, Task.getUserTasks);
router.get('/tasks/all', Auth_ACCESS, Task.getTasks);
// router.get("/tasks/:taskCategory", Task.getTasksByCategory);
router.patch('/tasks/:id', Auth_ACCESS, Task.updateTask);
router.delete('/tasks/:id', Auth_ACCESS, Task.deleteTask);
router.delete('/task/:id', Auth_ACCESS, Task.softDeleteTask);

// #User_Register
router.post('/register', Register.signUp);

// #User_Login
router.post('/login', Login.signIn);
router.get('/users', Login.getUsers);

module.exports = router;
