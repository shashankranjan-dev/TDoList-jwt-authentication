const router = require("express").Router();
const User = require("../model/User");

// Create a new ToDo for a specific user
router.post("/users/:userId/todos", (req, res) => {
  const { userId } = req.params;
  const { title, description, date, time, completed } = req.body;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const newTodo = {
        title,
        description,
      };

      user.todo.push(newTodo);
      return user.save();
    })
    .then((user) => res.status(201).json(user.todo[user.todo.length - 1]))
    .catch((err) =>
      res.status(500).json({ error: "Failed to create ToDo", err: err })
    );
});

// Get all ToDos for a specific user
router.get("/users/:userId/todos/:pageNumber", (req, res) => {
  const { userId } = req.params;
  const { pageNumber } = req.params;
  const pageSize = 5;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const totaltodo = user.todo.length;
      console.log(totaltodo);
      const totalPages = parseInt(totaltodo / pageSize) + 1;
      console.log(totalPages);
      const currentPage = parseInt(pageNumber) || 1;
      console.log(currentPage);

      if (currentPage < 1 || currentPage > totalPages) {
        return res.status(400).json({ error: "Page not found" });
      }

      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = currentPage * pageSize;

      const todos = user.todo.slice(startIndex, endIndex);

      res.status(200).json({ totalPages, currentPage, todos });
    })
    .catch((err) =>
      res.status(500).json({ error: "Failed to retrieve ToDos", err: err })
    );
});

// Get a single ToDo for a specific user by ID
router.get("/users/:userId/todos/:todoId", (req, res) => {
  const { userId, todoId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const todo = user.todo.id(todoId);
      if (!todo) {
        return res.status(404).json({ error: "ToDo not found" });
      }

      res.json(todo);
    })
    .catch((err) =>
      res.status(500).json({ error: "Failed to retrieve ToDo", err: err })
    );
});

// Update a ToDo for a specific user by ID
router.put("/users/:userId/todos/:todoId", (req, res) => {
  const { userId, todoId } = req.params;
  const { title, description, date, time, completed } = req.body;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const todo = user.todo.id(todoId);
      if (!todo) {
        return res.status(404).json({ error: "ToDo not found" });
      }

      todo.title = title;
      todo.description = description;

      return user.save();
    })
    .then((user) => res.json(user.todo.id(todoId)))
    .catch((err) =>
      res.status(500).json({ error: "Failed to update ToDo", err: err })
    );
});

// Update the completed status of a ToDo for a specific user by ID
router.put("/users/:userId/todos/:todoId/complete", (req, res) => {
  const { userId, todoId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const todo = user.todo.id(todoId);
      if (!todo) {
        return res.status(404).json({ error: "ToDo not found" });
      }

      todo.completed = true;

      return user.save();
    })
    .then((user) => res.json(user.todo.id(todoId)))
    .catch((err) =>
      res.status(500).json({ error: "Failed to mark ToDo as completed" })
    );
});

// Delete a ToDo for a specific user by ID
router.delete("/users/:userId/todos/:todoId", (req, res) => {
  const { userId, todoId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const todo = user.todo.id(todoId);
      if (!todo) {
        return res.status(404).json({ error: "ToDo not found" });
      }

      todo.remove();
      return user.save();
    })
    .then(() => res.json({ message: "ToDo deleted successfully" }))
    .catch((err) =>
      res.status(500).json({ error: "Failed to delete ToDo", err: err })
    );
});

module.exports = router;
