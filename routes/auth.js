const express = require("express");
const router = express.Router();

let users = [];

router.post("/signup", (req, res) => {
  const { email, password } = req.body;

  const exists = users.find(u => u.email === email);
  if (exists) return res.send("User already exists");

  users.push({ email, password });
  res.send("Signup success 🚀");
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email && u.password === password);

  if (!user) return res.send("Invalid credentials");

  res.send("Login success 🚀");
});

module.exports = router;
