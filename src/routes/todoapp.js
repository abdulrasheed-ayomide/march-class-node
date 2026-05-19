const express = require("express");
const { addTodo, getSingleTodo, getAllTodos, editTodo, deleteTodo } = require("../controller/todoapp");

const router = express.Router();

router.post("/", addTodo);
router.get("/:id", getSingleTodo);
router.get("/", getAllTodos);
router.put("/:id", editTodo);
router.delete("/:id", deleteTodo);

module.exports = router;