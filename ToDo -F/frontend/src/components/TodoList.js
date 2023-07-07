import React, { useState, useEffect } from "react";
import axios from "axios";
import TodoForm from "./TodoForm";
import Todo from "./Todo";

function TodoList() {
  const [todos, setTodos] = useState([]);

  //get
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api");
        setTodos(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  //

  // onSubmit
  const addTodo = (todo) => {
    if (!todo.title || /^\s*$/.test(todo.title)) {
      return;
    }
    axios
      .post("http://localhost:4000/api", todo)
      .then((response) => {
        // console.log("aqui");
        let newTodo = {
          id: response.data.toDo.id,
          title: response.data.toDo.title,
          description: response.data.toDo.description,
          isDone: false,
          showDescription: false,
          created_at: response.data.toDo.created_at,
          edited_at: response.data.toDo.edited_at,
        };
        // console.log(response.data);
        const newTodos = [...todos, newTodo];

        setTodos(newTodos);
        console.log(todos);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  //

  const showDescription = (todoId) => {
    let updatedTodos = todos.map((todo) => {
      if (todo.id === todoId) {
        todo.showDescription = !todo.showDescription;
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  const updateTodo = async (todoId, newValue) => {
    if (!newValue.title || /^\s*$/.test(newValue.title)) {
      return;
    }

    const todoData = {
      title: newValue.title,
      description: newValue.description,
    };

    try {
      const update = await axios.patch(
        `http://localhost:4000/api/${todoId}`,
        todoData
      );
      // console.log(update);

      const newData = todos.map((item) => {
        if (item.id === update.data.toDo.id) {
          return update.data.toDo;
        }
        return item;
      });
      setTodos(newData);
    } catch (error) {
      console.error(error);
    }
  };

  const removeTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/${id}`);
      const removedArr = todos.filter((todo) => todo.id !== id);
      setTodos(removedArr);
    } catch (error) {
      console.error(error);
    }
  };

  const completeTodo = async (id) => {
    try {
      const toDoEditFilter = todos.filter((todo) => todo.id === id);
      // console.log("edit", toDoEditFilter[0]);
      await axios.patch(`http://localhost:4000/api/${id}`, {
        isDone: !toDoEditFilter[0].isDone,
      });

      let updatedTodos = todos.map((todo) => {
        if (todo.id === id) {
          todo.isDone = !todo.isDone;
        }
        return todo;
      });
      setTodos(updatedTodos);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <h1>What's the Plan for Today?</h1>
      <TodoForm onSubmit={addTodo} />
      <Todo
        todos={todos}
        completeTodo={completeTodo}
        removeTodo={removeTodo}
        updateTodo={updateTodo}
        showDescription={showDescription}
      />
    </>
  );
}

export default TodoList;
