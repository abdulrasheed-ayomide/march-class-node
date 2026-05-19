const todoapp = require("../models/todoapp");

// Controller function to add a new todo
const addTodo = async (req, res) => {
    try {
        const { text } = req.body;
        const newTodo = new todoapp({ text });
        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Controller function to get a single todo by ID
const getSingleTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await todoapp.findById(id);
        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        res.status(200).json(todo);

    } catch (error) {
       res.status(400).json({message: error.message});
    }
}

// Controller function to get all todos
const getAllTodos = async (req, res) => {
    try {
        const todos = await todoapp.find();
        res.status(200).json(todos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller function to edit todo
const editTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;
        const todo = await todoapp.findByIdAndUpdate(id, { text }, { new: true });

        if (!todo) {
            res.status(400).json({message: "Todo not found"})
        }
        res.status(201).json(todo)

    } catch (error) {
        res.status(400).json({message: error.message})
    }
}

// Conntroller function to delete todo
const deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await todoapp.findByIdAndDelete(id);
        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        res.status(200).json({ message: "Todo deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { addTodo, getSingleTodo, getAllTodos, editTodo, deleteTodo };