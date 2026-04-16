const express = require("express");
const app = express();

app.use(express.json());

let accounts = [];

// signup
app.post("/api/register", (req, res) => {
  const { email, password } = req.body;

  const exists = accounts.find(u => u.email === email);
  if (exists) return res.send("Account already exists, please login");

  accounts.push({ email, password });
  res.send("Account created successfully 🚀");
  console.log("New user registered:", email);
});

// login
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  const user = accounts.find(u => u.email === email && u.password === password);
  if (!user) return res.send("Incorrect email or password");

  res.send("User logged in successfully 🚀");
  console.log("User logged in:", email);
});

app.get("/", (req, res) => {
  res.send("Task Manager API is running🚀");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

