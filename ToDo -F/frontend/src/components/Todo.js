import React, { useState } from "react";
import TodoForm from "./TodoForm";
import {
  RiCloseCircleLine,
  RiCheckboxCircleLine,
  RiArrowDownCircleLine,
} from "react-icons/ri";
import { TiEdit } from "react-icons/ti";

const Todo = ({
  todos,
  completeTodo,
  removeTodo,
  updateTodo,
  showDescription,
}) => {
  const [edit, setEdit] = useState({
    id: null,
    value: "",
  });

  const submitUpdate = (value) => {
    updateTodo(edit.id, value);
    setEdit({
      id: null,
      value: "",
    });
  };

  if (edit.id) {
    return <TodoForm edit={edit} onSubmit={submitUpdate} />;
  }

  return todos.map((todo) => (
    <div
      className={todo.isDone ? "todo-row complete" : "todo-row"}
      key={todo.id}
    >
      <div className="description">
        <div
          key={todo.id}
          onClick={() => completeTodo(todo.id)}
          className="todo"
        >
          {todo.title}
        </div>
        <div className="icons">
          <RiCheckboxCircleLine
            onClick={() => completeTodo(todo.id)}
            className="delete-icon"
          />
          <RiArrowDownCircleLine
            onClick={() => showDescription(todo.id)}
            className="delete-icon"
          />
          <RiCloseCircleLine
            onClick={() => removeTodo(todo.id)}
            className="delete-icon"
          />

          <TiEdit
            onClick={() =>
              setEdit({
                id: todo.id,
                value: todo.title,
                description: todo.description,
              })
            }
            className="edit-icon"
          />
        </div>
      </div>
      {todo.showDescription && (
        <>
          <div onClick={() => completeTodo(todo.id)} className="description">
            Description: {todo.description}
          </div>
          <br />
          <div onClick={() => completeTodo(todo.id)}>
            Creado {todo.created_at}
          </div>
          <div onClick={() => completeTodo(todo.id)}>
            Editado {todo.edited_at}
          </div>
        </>
      )}
    </div>
    // </div>
  ));
};

export default Todo;
