const express = require('express');
const routes = express.Router();
const Todo = require('../models/Todo');
const authMiddleware = require('../middleware/authentication');

routes.get('/', authMiddleware, async (req, res) => {
  try {
    const todos = await Todo.find({
      user: req.user._id,
    });
    res.status(201).json(todos);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

routes.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updatedtodo = req.body;
    const todoId = req.params.id;
    const todo = await Todo.findOne({ _id: todoId, user: req.user._id });
    if (!todo) {
      return res.status(401).json({ message: `There is no todo!` });
    }
    if (updatedtodo.text) {
      todo.text = updatedtodo.text;
    }
    if (updatedtodo.done !== undefined) {
      todo.done = updatedtodo.done;
    }
    const lastTodo = await todo.save();
    res.json(lastTodo);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

routes.delete('/:id', authMiddleware, async (req, res) => {
  const todoId = req.params.id;

  try {
    const todo = await Todo.findOne({ _id: todoId, user: req.user._id });
    if (!todo) {
      return res.status(401).json({ message: `There is no todo!` });
    }
    await todo.remove();
    res.status(204).end();
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

routes.post('/', authMiddleware, async (req, res) => {
  try {
    const newTodo = new Todo({
      text: req.body.text,
      done: false,
      user: req.user._id,
    });
    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

module.exports = routes;
