const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
const SECRET = "mysecretkey";

app.use(cors());
app.use(express.json());

// In-memory storage
let accounts = [];
let tasks = [];

// ================= SIGNUP =================
app.post("/api/register", (req, res) => {
    const { email, password } = req.body;

    const exists = accounts.find(u => u.email === email);
    if (exists) return res.send("Account already exists");

    accounts.push({ email, password });

    res.send("Account created successfully");
});

// ================= LOGIN (JWT) =================
app.post("/api/login", (req, res) => {
    const { email, password } = req.body;

    const user = accounts.find(u => u.email === email && u.password === password);

    if (!user) return res.send("Invalid credentials");

    const token = jwt.sign({ email }, SECRET);

    res.json({
        message: "Login successful",
        token
    });
});

// ================= AUTH MIDDLEWARE =================
function auth(req, res, next) {
    const token = req.headers.authorization;

    if (!token) return res.send("Access denied");

    try {
        const data = jwt.verify(token, SECRET);
        req.user = data;
        next();
    } catch {
        res.send("Invalid token");
    }
}

// ================= TASK ROUTES =================

// Add task
app.post("/api/add-task", auth, (req, res) => {
    const { task } = req.body;

    tasks.push({
        email: req.user.email,
        task
    });

    res.send("Task added");
});

// Get tasks
app.get("/api/tasks", auth, (req, res) => {
    const userTasks = tasks.filter(t => t.email === req.user.email);
    res.json(userTasks);
});

// Delete task
app.post("/api/delete-task", auth, (req, res) => {
    const { task } = req.body;

    tasks = tasks.filter(t => !(t.email === req.user.email && t.task === task));

    res.send("Task deleted");
});

// ================= TEST ROUTE =================
app.get("/", (req, res) => {
    res.send("Task Manager API is running 🚀");
});

// ================= SERVER =================
app.listen(5000, () => {
    console.log("Server running on port 5000");
});